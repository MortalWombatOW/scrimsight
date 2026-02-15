"""
Hero Composition Analysis

Composition strategy — which heroes, which combos, which archetypes — is one of
the most coachable aspects of competitive Overwatch. Map geometry dictates comp
viability; hero synergies matter more than individual hero strength.

Key findings from the Parsertime analysis:
- Pick rate ≠ win rate: popular heroes often aren't the most effective.
- Dive/Brawl/Poke archetypes show measurable win-rate differences.
- Hero pair synergy varies significantly — coordinated picks outperform solo meta picks.
- Map-specific hero preferences are substantial and coachable.
- Hero swapping correlates with outcomes; same-role swaps dominate.

This module produces:
- Hero pick/win rates (top N heroes)
- Composition archetype win rates
- Hero synergy matrix (top 20 pairs)
- Map-hero pick/win rate heatmaps
- Hero swap frequency and patterns
- Composition matchup matrix
"""

from __future__ import annotations

from itertools import combinations
from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib.patches import Patch
from scipy import stats

from analysis.src.metrics import percentile_benchmarks
from analysis.src.preprocessing import (
    HERO_ROLES,
    COMP_SIGNATURES,
    add_role_column,
    classify_composition,
    filter_known_heroes,
)
from analysis.src.visualization import (
    OW_COLORS,
    ROLE_COLORS,
    save_fig,
)

MIN_GAMES_FOR_WR = 30
MIN_PAIR_OBS = 10
MIN_TIME_PLAYED = 60  # seconds — filter trivial hero appearances


# ---------------------------------------------------------------------------
# Data preparation
# ---------------------------------------------------------------------------

def _prepare_hero_picks(ctx) -> pd.DataFrame:
    """Build hero-level pick/win data from player_stats.

    Each row = one player-hero in one match. We keep only the 'primary' hero
    (most time played) per player per match to avoid double-counting.
    """
    ps = ctx.player_stats.copy()

    # Filter to meaningful playtime
    ps = ps[ps["hero_time_played"] >= MIN_TIME_PLAYED]

    # Keep primary hero per player per match (most time played)
    ps = ps.sort_values("hero_time_played", ascending=False)
    primary = ps.drop_duplicates(subset=["MapDataId", "player_name"], keep="first").copy()

    # Add match outcome
    match_winners = ctx.matches[["MapDataId", "winner"]].drop_duplicates("MapDataId")
    primary = primary.merge(match_winners, on="MapDataId", how="inner")
    primary["team_won"] = primary["player_team"].astype(str) == primary["winner"].astype(str)

    return primary


def _classify_team_comps(primary: pd.DataFrame) -> pd.DataFrame:
    """Classify each team's composition per match into an archetype."""
    team_heroes = primary.groupby(
        ["MapDataId", "player_team"], observed=True
    ).agg(
        heroes=("player_hero", list),
        team_won=("team_won", "first"),
    ).reset_index()

    team_heroes["archetype"] = team_heroes["heroes"].apply(classify_composition)
    return team_heroes


# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------

def _fig_hero_pick_win_rates(primary: pd.DataFrame, output_dir: str) -> pd.DataFrame:
    """Top heroes by pick rate + win rate. Returns hero_picks for reuse."""
    total_matches = primary["MapDataId"].nunique()

    hero_picks = primary.groupby("player_hero", observed=True).agg(
        matches_played=("MapDataId", "nunique"),
        wins=("team_won", "sum"),
        total=("team_won", "count"),
    ).reset_index()
    hero_picks["pick_rate"] = hero_picks["matches_played"] / total_matches * 100
    hero_picks["win_rate"] = hero_picks["wins"] / hero_picks["total"] * 100
    hero_picks["role"] = hero_picks["player_hero"].map(HERO_ROLES).fillna("Unknown")
    hero_picks = hero_picks.sort_values("pick_rate", ascending=False)

    fig, axes = plt.subplots(1, 2, figsize=(18, 8))

    # Pick rate (top 20)
    top20 = hero_picks.head(20)
    colors = [ROLE_COLORS.get(r, OW_COLORS["light_gray"]) for r in top20["role"]]
    axes[0].barh(top20["player_hero"].values[::-1], top20["pick_rate"].values[::-1],
                 color=colors[::-1], alpha=0.9)
    axes[0].set_xlabel("Pick Rate (%)")
    axes[0].set_title("Top 20 Heroes by Pick Rate")
    legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r) for r in ["Tank", "DPS", "Support"]]
    axes[0].legend(handles=legend_elements, loc="lower right")

    # Win rate (heroes with enough games)
    wr_heroes = hero_picks[hero_picks["total"] >= MIN_GAMES_FOR_WR].sort_values("win_rate")
    colors_wr = [ROLE_COLORS.get(r, OW_COLORS["light_gray"]) for r in wr_heroes["role"]]
    axes[1].barh(wr_heroes["player_hero"], wr_heroes["win_rate"], color=colors_wr, alpha=0.9)
    axes[1].axvline(50, color=OW_COLORS["gold"], linestyle="--", label="50% baseline")
    axes[1].set_xlabel("Win Rate (%)")
    axes[1].set_title(f"Hero Win Rates (min {MIN_GAMES_FOR_WR} games)")
    axes[1].legend(loc="lower right")

    plt.tight_layout()
    save_fig(fig, "03_hero_pick_win_rates", output_dir)

    return hero_picks


def _fig_archetype_win_rates(team_comps: pd.DataFrame, output_dir: str) -> None:
    arch_stats = team_comps.groupby("archetype").agg(
        total=("team_won", "count"),
        wins=("team_won", "sum"),
    ).reset_index()
    arch_stats["win_rate"] = arch_stats["wins"] / arch_stats["total"] * 100
    arch_stats = arch_stats.sort_values("win_rate")

    fig, ax = plt.subplots(figsize=(10, 6))
    colors = [OW_COLORS["orange"]] * len(arch_stats)
    bars = ax.barh(arch_stats["archetype"], arch_stats["win_rate"], color=colors, alpha=0.9,
                   edgecolor=OW_COLORS["dark_blue"])
    ax.axvline(50, color=OW_COLORS["gold"], linestyle="--", label="50% baseline")

    for bar, (_, row) in zip(bars, arch_stats.iterrows()):
        ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height() / 2,
                f"n={row['total']}", va="center", fontsize=10)

    ax.set_xlabel("Win Rate (%)")
    ax.set_title("Composition Archetype Win Rates")
    ax.legend()
    plt.tight_layout()
    save_fig(fig, "03_archetype_win_rates", output_dir)


def _fig_synergy_matrix(primary: pd.DataFrame, hero_picks: pd.DataFrame,
                        output_dir: str) -> pd.DataFrame:
    """Hero pair win rate heatmap. Returns pair_wr for benchmarks."""
    top_heroes = hero_picks.head(20)["player_hero"].tolist()
    top_primary = primary[primary["player_hero"].isin(top_heroes)].copy()

    team_heroes = top_primary.groupby(
        ["MapDataId", "player_team"], observed=True
    ).agg(
        heroes=("player_hero", list),
        team_won=("team_won", "first"),
    ).reset_index()

    # Generate pair records
    pair_records = []
    for _, row in team_heroes.iterrows():
        heroes = row["heroes"]
        if not isinstance(heroes, list) or len(heroes) < 2:
            continue
        heroes = sorted(set(heroes))
        won = row["team_won"]
        for h1, h2 in combinations(heroes, 2):
            pair_records.append({"hero_1": h1, "hero_2": h2, "won": won})

    if not pair_records:
        return pd.DataFrame()

    pairs_df = pd.DataFrame(pair_records)
    pair_wr = pairs_df.groupby(["hero_1", "hero_2"]).agg(
        total=("won", "count"), wins=("won", "sum"),
    ).reset_index()
    pair_wr["win_rate"] = pair_wr["wins"] / pair_wr["total"] * 100
    pair_wr = pair_wr[pair_wr["total"] >= MIN_PAIR_OBS]

    # Build matrix
    synergy_matrix = pd.DataFrame(index=top_heroes, columns=top_heroes, dtype=float)
    for _, row in pair_wr.iterrows():
        if row["hero_1"] in top_heroes and row["hero_2"] in top_heroes:
            synergy_matrix.loc[row["hero_1"], row["hero_2"]] = row["win_rate"]
            synergy_matrix.loc[row["hero_2"], row["hero_1"]] = row["win_rate"]

    # Fill diagonal with individual win rates
    for hero in top_heroes:
        hp = hero_picks[hero_picks["player_hero"] == hero]
        if not hp.empty:
            synergy_matrix.loc[hero, hero] = hp.iloc[0]["win_rate"]

    fig, ax = plt.subplots(figsize=(16, 14))
    mask = np.triu(np.ones_like(synergy_matrix, dtype=bool), k=1)
    sns.heatmap(
        synergy_matrix.astype(float), mask=mask,
        annot=True, fmt=".0f", cmap="RdYlGn", center=50,
        vmin=30, vmax=70, linewidths=0.5,
        linecolor=OW_COLORS["dark_blue"], ax=ax,
        cbar_kws={"label": "Win Rate (%)"},
    )
    ax.set_title("Hero Synergy Matrix: Pair Win Rates (Top 20 Heroes)", fontsize=14)
    plt.tight_layout()
    save_fig(fig, "03_hero_synergy_heatmap", output_dir)

    return pair_wr


def _fig_map_hero_rates(primary: pd.DataFrame, hero_picks: pd.DataFrame,
                        ctx, output_dir: str) -> None:
    """Heatmaps of hero pick/win rates by map."""
    match_maps = ctx.matches[["MapDataId", "map_name"]].drop_duplicates("MapDataId")
    pm = primary.merge(match_maps, on="MapDataId", how="inner")

    map_hero = pm.groupby(["map_name", "player_hero"], observed=True).agg(
        count=("MapDataId", "count"),
        wins=("team_won", "sum"),
    ).reset_index()
    map_hero["win_rate"] = map_hero["wins"] / map_hero["count"] * 100

    map_totals = pm.groupby("map_name", observed=True)["MapDataId"].nunique().reset_index()
    map_totals.columns = ["map_name", "total_games"]
    map_hero = map_hero.merge(map_totals, on="map_name")
    map_hero["pick_rate"] = map_hero["count"] / map_hero["total_games"] * 100

    top10_heroes = hero_picks.head(10)["player_hero"].tolist()
    top_maps = map_totals.nlargest(10, "total_games")["map_name"].tolist()

    # Pick rate heatmap
    pivot_pr = map_hero[
        map_hero["player_hero"].isin(top10_heroes) & map_hero["map_name"].isin(top_maps)
    ].pivot_table(index="map_name", columns="player_hero", values="pick_rate", fill_value=0)

    if not pivot_pr.empty:
        fig, ax = plt.subplots(figsize=(14, 8))
        sns.heatmap(pivot_pr, annot=True, fmt=".0f", cmap="YlOrRd",
                    linewidths=0.5, linecolor=OW_COLORS["dark_blue"], ax=ax,
                    cbar_kws={"label": "Pick Rate (%)"})
        ax.set_title("Hero Pick Rate by Map (Top 10 Heroes × Top 10 Maps)")
        plt.tight_layout()
        save_fig(fig, "03_map_hero_pick_rates", output_dir)

    # Win rate heatmap
    pivot_wr = map_hero[
        map_hero["player_hero"].isin(top10_heroes) &
        map_hero["map_name"].isin(top_maps) &
        (map_hero["count"] >= 5)
    ].pivot_table(index="map_name", columns="player_hero", values="win_rate", fill_value=np.nan)

    if not pivot_wr.empty:
        fig, ax = plt.subplots(figsize=(14, 8))
        sns.heatmap(pivot_wr, annot=True, fmt=".0f", cmap="RdYlGn", center=50,
                    vmin=30, vmax=70, linewidths=0.5,
                    linecolor=OW_COLORS["dark_blue"], ax=ax,
                    cbar_kws={"label": "Win Rate (%)"})
        ax.set_title("Hero Win Rate by Map (Top 10 Heroes × Top 10 Maps)")
        plt.tight_layout()
        save_fig(fig, "03_map_hero_win_rates", output_dir)


def _fig_swap_analysis(ctx, output_dir: str) -> None:
    """Hero swap frequency and role-swap matrix."""
    ctx.ensure_hero_events()
    swaps = ctx.hero_swap
    if swaps is None or swaps.empty:
        return

    match_winners = ctx.matches[["MapDataId", "winner"]].drop_duplicates("MapDataId")
    swaps = swaps.merge(match_winners, on="MapDataId", how="inner")
    swaps["team_won"] = swaps["player_team"].astype(str) == swaps["winner"].astype(str)

    # Team swap counts: winners vs losers
    team_swaps = swaps.groupby(["MapDataId", "player_team"], observed=True).size().reset_index(name="swaps")
    team_swaps = team_swaps.merge(match_winners, on="MapDataId", how="left")
    team_swaps["team_won"] = team_swaps["player_team"].astype(str) == team_swaps["winner"].astype(str)

    w_swaps = team_swaps[team_swaps["team_won"]]["swaps"]
    l_swaps = team_swaps[~team_swaps["team_won"]]["swaps"]

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.hist(w_swaps, bins=range(0, 30), alpha=0.6, color=OW_COLORS["green"],
            label=f"Winners (mean: {w_swaps.mean():.1f})", density=True)
    ax.hist(l_swaps, bins=range(0, 30), alpha=0.6, color=OW_COLORS["red"],
            label=f"Losers (mean: {l_swaps.mean():.1f})", density=True)
    ax.set_xlabel("Hero Swaps per Match")
    ax.set_ylabel("Density")
    ax.set_title("Hero Swap Frequency: Winners vs Losers")
    ax.legend()
    plt.tight_layout()
    save_fig(fig, "03_swap_frequency_win_loss", output_dir)

    # Role swap matrix
    swaps_with_role = add_role_column(swaps, hero_col="player_hero")
    swaps_with_role["prev_role"] = swaps_with_role["previous_hero"].map(HERO_ROLES).fillna("Unknown")

    role_swaps = swaps_with_role.groupby(["prev_role", "role"], observed=True).size().reset_index(name="count")
    role_pivot = role_swaps.pivot_table(index="prev_role", columns="role", values="count", fill_value=0)

    if not role_pivot.empty:
        fig, ax = plt.subplots(figsize=(8, 6))
        sns.heatmap(role_pivot.astype(int), annot=True, fmt="d", cmap="YlOrRd",
                    linewidths=0.5, linecolor=OW_COLORS["dark_blue"], ax=ax,
                    cbar_kws={"label": "Swap Count"})
        ax.set_title("Role Swap Matrix: From → To")
        ax.set_ylabel("Previous Role")
        ax.set_xlabel("New Role")
        plt.tight_layout()
        save_fig(fig, "03_role_swap_matrix", output_dir)


def _fig_comp_matchups(team_comps: pd.DataFrame, output_dir: str) -> None:
    """Archetype-vs-archetype matchup heatmap."""
    tc = team_comps[["MapDataId", "player_team", "archetype", "team_won"]].copy()

    matchups = tc.merge(tc, on="MapDataId", suffixes=("", "_opp"))
    matchups = matchups[matchups["player_team"].astype(str) != matchups["player_team_opp"].astype(str)]

    matchup_wr = matchups.groupby(["archetype", "archetype_opp"]).agg(
        total=("team_won", "count"), wins=("team_won", "sum"),
    ).reset_index()
    matchup_wr["win_rate"] = matchup_wr["wins"] / matchup_wr["total"] * 100

    pivot = matchup_wr.pivot_table(index="archetype", columns="archetype_opp", values="win_rate")

    if not pivot.empty:
        fig, ax = plt.subplots(figsize=(8, 6))
        sns.heatmap(pivot, annot=True, fmt=".1f", cmap="RdYlGn", center=50,
                    vmin=30, vmax=70, linewidths=1,
                    linecolor=OW_COLORS["dark_blue"], ax=ax,
                    cbar_kws={"label": "Win Rate (%)"})
        ax.set_title("Composition Matchup Win Rates (Row vs Column)")
        ax.set_ylabel("Your Comp")
        ax.set_xlabel("Opponent Comp")
        plt.tight_layout()
        save_fig(fig, "03_comp_matchup_matrix", output_dir)


# ---------------------------------------------------------------------------
# Benchmarks
# ---------------------------------------------------------------------------

def _compute_benchmarks(hero_picks: pd.DataFrame, team_comps: pd.DataFrame) -> dict[str, Any]:
    # Hero win rates (benchmarkable per hero)
    hero_wr = {}
    for _, row in hero_picks.iterrows():
        if row["total"] >= MIN_GAMES_FOR_WR:
            hero_wr[str(row["player_hero"])] = {
                "win_rate": round(float(row["win_rate"]), 1),
                "pick_rate": round(float(row["pick_rate"]), 1),
                "n": int(row["total"]),
            }

    # Archetype win rates
    arch_stats = team_comps.groupby("archetype").agg(
        total=("team_won", "count"), wins=("team_won", "sum"),
    ).reset_index()
    arch_stats["win_rate"] = arch_stats["wins"] / arch_stats["total"] * 100
    archetype_wr = {
        str(row["archetype"]): {
            "win_rate": round(float(row["win_rate"]), 1),
            "n": int(row["total"]),
        }
        for _, row in arch_stats.iterrows()
    }

    return {
        "hero_meta": {
            "description": "Hero pick rates and win rates — identifies which heroes are popular vs effective",
            "by_hero": hero_wr,
        },
        "composition_archetypes": {
            "description": "Composition archetype (Dive/Brawl/Poke/Mixed) win rates and matchup data",
            "archetype_win_rates": archetype_wr,
        },
    }


# ---------------------------------------------------------------------------
# Module entry point
# ---------------------------------------------------------------------------

def run(ctx) -> dict[str, Any]:
    """Run hero composition analysis."""
    primary = _prepare_hero_picks(ctx)
    team_comps = _classify_team_comps(primary)

    print(f"  Primary hero observations: {len(primary):,}")
    print(f"  Team compositions classified: {len(team_comps):,}")

    hero_picks = _fig_hero_pick_win_rates(primary, ctx.figures_dir)
    _fig_archetype_win_rates(team_comps, ctx.figures_dir)
    _fig_synergy_matrix(primary, hero_picks, ctx.figures_dir)
    _fig_map_hero_rates(primary, hero_picks, ctx, ctx.figures_dir)
    _fig_swap_analysis(ctx, ctx.figures_dir)
    _fig_comp_matchups(team_comps, ctx.figures_dir)

    return _compute_benchmarks(hero_picks, team_comps)
