"""
Ultimate Economy Analysis

Ultimates are the most powerful abilities in Overwatch. The coaching consensus:
"Teams consistently over-ult. Better ult economy correlates with higher win rates."

Key concepts:
- Ult economy: Managing when to use ultimates. Over-ulting (using more than
  needed to win a fight) leaves you vulnerable the next fight.
- Dry fight: A fight where a team uses zero ultimates — winning dry is optimal.
- Ult advantage: One team uses more ults than the other.
- Ult cycling: The pace at which a team charges and deploys ults across fights.

This module produces:
- Ult charge time distributions by hero and role (player-level)
- Ult hold time distributions by hero and role (player-level) — NEW
- Ults per fight, fight classification by ult state
- Win rate by ult differential (team-level)
- Hero ult effectiveness ranking
- Ult efficiency: team ults per fight won (team-level) — NEW
- Dry fight win rate benchmarks (team-level) — NEW
"""

from __future__ import annotations

from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Patch
from scipy import stats

from analysis.src.metrics import (
    distribution_by_group,
    percentile_benchmarks,
    ult_hold_time,
)
from analysis.src.preprocessing import HERO_ROLES, add_role_column
from analysis.src.visualization import (
    OW_COLORS,
    ROLE_COLORS,
    role_color,
    save_fig,
)

# Ults activated within this window before a fight starts count as "used in fight"
# (since ults often initiate fights)
BUFFER_BEFORE = 3.0

MIN_HERO_OBSERVATIONS = 20


def _compute_charge_times(ult_charged: pd.DataFrame) -> pd.DataFrame:
    """Compute ult charge intervals (time between consecutive charges per player)."""
    charged = ult_charged.sort_values(["MapDataId", "player_name", "match_time"]).copy()
    charged["prev_charge_time"] = charged.groupby(
        ["MapDataId", "player_name"]
    )["match_time"].shift(1)
    charged["charge_interval"] = charged["match_time"] - charged["prev_charge_time"]

    # Filter: 10s minimum (avoid artifacts), 300s maximum (exclude round breaks)
    ct = charged[
        charged["charge_interval"].notna()
        & (charged["charge_interval"] > 10)
        & (charged["charge_interval"] < 300)
    ].copy()
    ct = add_role_column(ct)
    return ct


def _join_ults_to_fights(
    fights: pd.DataFrame,
    ult_start: pd.DataFrame,
    matches: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Join ult_start events to fights based on time overlap, per-match.

    Processes each match independently to avoid the memory explosion of a
    global cross-join. An ult is "used in a fight" if activated within
    [fight_start - BUFFER, fight_end].

    Returns (fight_ults_summary, fight_ults_raw) where:
    - fight_ults_summary: one row per fight with team ult counts and winner/loser labels
    - fight_ults_raw: individual ult events tagged with their fight_id
    """
    # Add team info to fights
    f = fights.merge(
        matches[["MapDataId", "team_1_name", "team_2_name"]],
        on="MapDataId",
        how="left",
    )

    # Pre-index ult_start by MapDataId for fast per-match lookups
    ult_by_match = dict(list(ult_start.groupby("MapDataId", observed=True)))

    ult_tagged_chunks = []
    fight_records = []

    for map_id, fight_group in f.groupby("MapDataId", observed=True):
        match_ults = ult_by_match.get(map_id)
        if match_ults is None or len(match_ults) == 0:
            # No ults in this match — all fights are dry
            for _, fight in fight_group.iterrows():
                fight_records.append({
                    "fight_id": fight["fight_id"],
                    "winner": fight["winner"],
                    "team_1_name": fight["team_1_name"],
                    "team_2_name": fight["team_2_name"],
                    "team_1_ults": 0,
                    "team_2_ults": 0,
                    "total_ults": 0,
                })
            continue

        ult_times = match_ults["match_time"].values
        ult_teams = match_ults["player_team"].values
        ult_heroes = match_ults["player_hero"].values

        for _, fight in fight_group.iterrows():
            start = fight["fight_start"] - BUFFER_BEFORE
            end = fight["fight_end"]
            mask = (ult_times >= start) & (ult_times <= end)

            teams_in_fight = ult_teams[mask]
            heroes_in_fight = ult_heroes[mask]

            t1 = str(fight["team_1_name"])
            t2 = str(fight["team_2_name"])
            t1_count = int((teams_in_fight.astype(str) == t1).sum())
            t2_count = int((teams_in_fight.astype(str) == t2).sum())

            fight_records.append({
                "fight_id": fight["fight_id"],
                "winner": fight["winner"],
                "team_1_name": t1,
                "team_2_name": t2,
                "team_1_ults": t1_count,
                "team_2_ults": t2_count,
                "total_ults": t1_count + t2_count,
            })

            # Collect raw ult events for hero effectiveness analysis
            if mask.any():
                chunk = match_ults[mask].copy()
                chunk["fight_id"] = fight["fight_id"]
                ult_tagged_chunks.append(chunk)

    result = pd.DataFrame(fight_records)

    # Compute winner/loser ults
    is_t1_winner = result["winner"].astype(str) == result["team_1_name"]
    is_t2_winner = result["winner"].astype(str) == result["team_2_name"]
    result["winner_ults"] = np.where(is_t1_winner, result["team_1_ults"],
                                      np.where(is_t2_winner, result["team_2_ults"], np.nan))
    result["loser_ults"] = np.where(is_t1_winner, result["team_2_ults"],
                                     np.where(is_t2_winner, result["team_1_ults"], np.nan))

    fight_ults_raw = pd.concat(ult_tagged_chunks, ignore_index=True) if ult_tagged_chunks else pd.DataFrame()

    return result, fight_ults_raw


# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------

def _fig_charge_time_by_hero(ct: pd.DataFrame, output_dir: str) -> None:
    hero_charge = ct.groupby("player_hero")["charge_interval"].agg(["median", "mean", "count"])
    hero_charge = hero_charge[hero_charge["count"] >= MIN_HERO_OBSERVATIONS]
    hero_charge = hero_charge.sort_values("median")
    hero_charge = add_role_column(hero_charge.reset_index(), hero_col="player_hero")

    fig, ax = plt.subplots(figsize=(14, 10))
    colors = [role_color(r) for r in hero_charge["role"]]
    ax.barh(hero_charge["player_hero"], hero_charge["median"], color=colors, alpha=0.85)
    ax.set_xlabel("Median Ult Charge Time (seconds)")
    ax.set_title("Ultimate Charge Time by Hero")
    legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r) for r in ["Tank", "DPS", "Support"]]
    ax.legend(handles=legend_elements, loc="lower right")
    plt.tight_layout()
    save_fig(fig, "02_ult_charge_time_by_hero", output_dir)


def _fig_charge_time_by_role(ct: pd.DataFrame, output_dir: str) -> None:
    fig, axes = plt.subplots(1, 3, figsize=(16, 5), sharey=True)
    for ax, role_name in zip(axes, ["Tank", "DPS", "Support"]):
        role_data = ct[ct["role"] == role_name]["charge_interval"]
        ax.hist(role_data, bins=50, color=ROLE_COLORS[role_name], alpha=0.8,
                edgecolor=OW_COLORS["dark_blue"])
        ax.axvline(role_data.median(), color=OW_COLORS["gold"], linestyle="--",
                   label=f"Median: {role_data.median():.0f}s")
        ax.set_xlabel("Charge Time (seconds)")
        ax.set_title(f"{role_name} Ult Charge Distribution")
        ax.legend()
    axes[0].set_ylabel("Count")
    plt.tight_layout()
    save_fig(fig, "02_ult_charge_time_by_role", output_dir)


def _fig_ults_per_fight(fight_ults_df: pd.DataFrame, output_dir: str) -> None:
    fig, ax = plt.subplots(figsize=(12, 6))
    ult_counts = fight_ults_df["total_ults"].clip(upper=12)
    ax.hist(ult_counts, bins=range(0, 14), color=OW_COLORS["orange"],
            edgecolor=OW_COLORS["dark_blue"], alpha=0.9, align="left")
    ax.set_xlabel("Total Ultimates Used in Fight")
    ax.set_ylabel("Number of Fights")
    ax.set_title("How Many Ultimates Are Used Per Teamfight?")
    ax.axvline(fight_ults_df["total_ults"].mean(), color=OW_COLORS["red"], linestyle="--",
               label=f'Mean: {fight_ults_df["total_ults"].mean():.1f}')
    ax.set_xticks(range(0, 13))
    ax.legend()
    plt.tight_layout()
    save_fig(fig, "02_ults_per_fight_distribution", output_dir)


def _fig_win_rate_by_ult_diff(team_fights: pd.DataFrame, output_dir: str) -> None:
    diff_wr = team_fights.groupby("ult_diff").agg(
        total=("won", "count"), wins=("won", "sum"),
    )
    diff_wr["win_rate"] = diff_wr["wins"] / diff_wr["total"] * 100
    diff_wr = diff_wr[diff_wr["total"] >= 20]

    fig, ax = plt.subplots(figsize=(12, 6))
    colors = [OW_COLORS["green"] if d > 0 else OW_COLORS["red"] if d < 0
              else OW_COLORS["orange"] for d in diff_wr.index]
    ax.bar(diff_wr.index, diff_wr["win_rate"], color=colors, width=0.8,
           edgecolor=OW_COLORS["dark_blue"])
    ax.axhline(50, color=OW_COLORS["gold"], linestyle="--", alpha=0.7, label="50% baseline")
    ax.set_xlabel("Ult Differential (My Ults - Opponent Ults)")
    ax.set_ylabel("Fight Win Rate (%)")
    ax.set_title("Fight Win Rate by Ultimate Differential")
    ax.legend()
    for idx, row in diff_wr.iterrows():
        ax.text(idx, row["win_rate"] + 1.5, f'n={row["total"]:,}',
                ha="center", fontsize=8, color=OW_COLORS["light_gray"])
    plt.tight_layout()
    save_fig(fig, "02_win_rate_by_ult_diff", output_dir)


def _fig_hero_ult_effectiveness(fight_ults_raw: pd.DataFrame, fights: pd.DataFrame,
                                 output_dir: str) -> None:
    """Fight win rate when each hero uses their ult (vectorized)."""
    # Join ult events with fight winners via fight_id — no row-by-row loop
    ult_with_winner = fight_ults_raw.merge(
        fights[["fight_id", "winner"]],
        on="fight_id",
        how="inner",
    )
    ult_with_winner = ult_with_winner[ult_with_winner["winner"] != "Draw"]
    ult_with_winner["team_won"] = ult_with_winner["player_team"] == ult_with_winner["winner"]
    ult_with_winner = add_role_column(ult_with_winner, hero_col="player_hero")

    hero_ult_wr = ult_with_winner.groupby("player_hero").agg(
        uses=("team_won", "count"), wins=("team_won", "sum"), role=("role", "first"),
    )
    hero_ult_wr["win_rate"] = hero_ult_wr["wins"] / hero_ult_wr["uses"] * 100
    hero_ult_wr = hero_ult_wr[hero_ult_wr["uses"] >= MIN_HERO_OBSERVATIONS]
    hero_ult_wr = hero_ult_wr.sort_values("win_rate", ascending=True)

    fig, ax = plt.subplots(figsize=(14, 10))
    colors = [role_color(r) for r in hero_ult_wr["role"]]
    ax.barh(hero_ult_wr.index, hero_ult_wr["win_rate"], color=colors, alpha=0.85)
    ax.axvline(50, color=OW_COLORS["gold"], linestyle="--", alpha=0.7, label="50% baseline")
    ax.set_xlabel("Fight Win Rate When Ult Used (%)")
    ax.set_title("Hero Ultimate Effectiveness")
    legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r) for r in ["Tank", "DPS", "Support"]]
    ax.legend(handles=legend_elements, loc="lower right")
    plt.tight_layout()
    save_fig(fig, "02_hero_ult_effectiveness", output_dir)


# ---------------------------------------------------------------------------
# Benchmarks
# ---------------------------------------------------------------------------

def _compute_benchmarks(
    ct: pd.DataFrame,
    hold_df: pd.DataFrame,
    fight_ults_df: pd.DataFrame,
    team_fights: pd.DataFrame,
) -> dict[str, Any]:
    """Build ult economy benchmark entries."""

    # --- Charge time distributions ---
    charge_player_overall = percentile_benchmarks(ct["charge_interval"])
    charge_by_role = distribution_by_group(ct, "charge_interval", "role")
    charge_by_hero = {}
    for hero, grp in ct.groupby("player_hero", observed=True):
        if len(grp) >= MIN_HERO_OBSERVATIONS:
            charge_by_hero[str(hero)] = {
                "median": round(float(grp["charge_interval"].median()), 1),
                "n": int(len(grp)),
            }

    # --- Hold time distributions (NEW) ---
    hold_benchmarks: dict[str, Any] = {"overall": {"n": 0}}
    if len(hold_df) > 0:
        hold_df_with_role = add_role_column(hold_df.copy())
        hold_benchmarks = {
            "overall": percentile_benchmarks(hold_df["hold_time"]),
            "by_role": distribution_by_group(hold_df_with_role, "hold_time", "role"),
        }

    # --- Ult efficiency: winner ults per fight (team-level) ---
    valid = fight_ults_df[fight_ults_df["winner_ults"].notna()]
    winner_ults_dist = percentile_benchmarks(valid["winner_ults"])
    loser_ults_dist = percentile_benchmarks(valid["loser_ults"])

    # --- Dry fight win rate (team-level, NEW) ---
    # A "dry fight" from a team's perspective = they used 0 ults
    dry_fights = team_fights[team_fights["my_ults"] == 0]
    dry_wr = dry_fights["won"].mean() if len(dry_fights) > 0 else float("nan")

    # --- Win rate by ult differential ---
    diff_wr = team_fights.groupby("ult_diff").agg(
        total=("won", "count"), wins=("won", "sum"),
    )
    diff_wr["win_rate"] = diff_wr["wins"] / diff_wr["total"]
    diff_wr = diff_wr[diff_wr["total"] >= 20]
    wr_by_diff = {
        str(int(d)): {"win_rate": round(float(row["win_rate"]), 4), "n": int(row["total"])}
        for d, row in diff_wr.iterrows()
    }

    return {
        "ult_charge_time": {
            "description": "Time between consecutive ult charges (seconds) — faster charge = more ult opportunities",
            "player_distribution": {
                "overall": charge_player_overall,
                "by_role": charge_by_role,
                "by_hero": charge_by_hero,
            },
        },
        "ult_hold_time": {
            "description": "Time from ult charged to ult used (seconds) — shorter hold generally = better timing",
            "player_distribution": hold_benchmarks,
        },
        "ult_efficiency": {
            "description": "Ults used per fight by winners vs losers — efficient teams win with fewer ults",
            "winner_distribution": winner_ults_dist,
            "loser_distribution": loser_ults_dist,
            "mean_winner_ults": round(float(valid["winner_ults"].mean()), 2) if len(valid) > 0 else None,
            "mean_loser_ults": round(float(valid["loser_ults"].mean()), 2) if len(valid) > 0 else None,
        },
        "dry_fight_win_rate": {
            "description": "Win rate when a team uses zero ults — winning dry preserves resources for the next fight",
            "overall_rate": round(float(dry_wr), 4) if not np.isnan(dry_wr) else None,
            "total_dry_fights": int(len(dry_fights)),
        },
        "fight_win_rate_by_ult_differential": {
            "description": "Fight win rate based on ult differential (my_ults - opponent_ults)",
            "by_differential": wr_by_diff,
        },
    }


# ---------------------------------------------------------------------------
# Module entry point
# ---------------------------------------------------------------------------

def run(ctx) -> dict[str, Any]:
    """Run ultimate economy analysis."""
    # Charge times
    ct = _compute_charge_times(ctx.ult_charged)
    print(f"  Valid charge intervals: {len(ct):,}")
    print(f"  Median charge time: {ct['charge_interval'].median():.0f}s")

    # Hold times (NEW metric)
    hold_df = ult_hold_time(ctx.ult_charged, ctx.ult_start)
    print(f"  Ult hold time observations: {len(hold_df):,}")

    # Join ults to fights (vectorized)
    fight_ults_df, fight_ults_raw = _join_ults_to_fights(ctx.fights, ctx.ult_start, ctx.matches)
    print(f"  Fights with ult data: {len(fight_ults_df):,}")

    # Build per-team-per-fight records for ult differential analysis
    team_fight_records = []
    for _, row in fight_ults_df.iterrows():
        winner = row["winner"]
        if winner == "Draw" or pd.isna(row.get("team_1_name")):
            continue
        for team, opp, my_ults, opp_ults in [
            (row["team_1_name"], row["team_2_name"], row["team_1_ults"], row["team_2_ults"]),
            (row["team_2_name"], row["team_1_name"], row["team_2_ults"], row["team_1_ults"]),
        ]:
            team_fight_records.append({
                "fight_id": row["fight_id"],
                "team": team,
                "won": winner == team,
                "my_ults": my_ults,
                "opp_ults": opp_ults,
                "ult_diff": my_ults - opp_ults,
            })
    team_fights = pd.DataFrame(team_fight_records)

    # Figures
    _fig_charge_time_by_hero(ct, ctx.figures_dir)
    _fig_charge_time_by_role(ct, ctx.figures_dir)
    _fig_ults_per_fight(fight_ults_df, ctx.figures_dir)
    _fig_win_rate_by_ult_diff(team_fights, ctx.figures_dir)
    _fig_hero_ult_effectiveness(fight_ults_raw, ctx.fights, ctx.figures_dir)

    return _compute_benchmarks(ct, hold_df, fight_ults_df, team_fights)
