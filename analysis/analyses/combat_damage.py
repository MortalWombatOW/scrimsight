"""
Combat & Damage Analysis

Understanding *how* kills happen — which abilities, which roles, which timing —
reveals mechanical and teamwork patterns that raw K/D cannot.

Key findings from the Parsertime analysis:
- Primary fire accounts for the majority of kills — fundamentals > abilities.
- Teams with more assists (both offensive and defensive) win more.
- Final blow ratio varies significantly by hero and role.
- Kill timing shifts across match phases reflecting ult cycling and fight cadence.
- Crit rates on final blows reveal mechanical skill ceilings per hero.

This module produces:
- FB/Elim ratio distributions by role (player-level)
- Ability kill breakdown
- Assist correlation with winning (team-level)
- Kill timeline by phase
- Critical hit rates by hero
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
    final_blow_ratio,
    percentile_benchmarks,
)
from analysis.src.preprocessing import HERO_ROLES, add_role_column
from analysis.src.visualization import (
    OW_COLORS,
    ROLE_COLORS,
    role_color,
    save_fig,
)

MIN_RECORDS = 50
MIN_KILLS_FOR_CRIT = 200


def _prepare_combat_kills(ctx) -> pd.DataFrame:
    """Prepare enriched, inter-team combat kills with role columns."""
    ck = ctx.valid_kills.copy()
    ck = add_role_column(ck, hero_col="attacker_hero")
    ck = ck.rename(columns={"role": "attacker_role"})
    ck["victim_role"] = ck["victim_hero"].map(HERO_ROLES).fillna("Unknown")
    return ck


def _prepare_player_fb(ctx) -> pd.DataFrame:
    """Player-level FB ratio from player_stats."""
    ps = ctx.player_stats.copy()
    ps["fb_ratio"] = final_blow_ratio(ps["final_blows"], ps["eliminations"])
    ps = ps[ps["eliminations"] >= 3]  # avoid noisy ratios
    return ps


# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------

def _fig_top_abilities(ck: pd.DataFrame, output_dir: str) -> None:
    top = ck["event_ability"].value_counts().head(25)
    fig, ax = plt.subplots(figsize=(14, 9))
    ax.barh(top.index[::-1], top.values[::-1], color=OW_COLORS["orange"], alpha=0.9,
            edgecolor=OW_COLORS["dark_blue"])
    ax.set_xlabel("Total Kills")
    ax.set_title("Top 25 Most Lethal Abilities", fontsize=14, fontweight="bold")
    plt.tight_layout()
    save_fig(fig, "06_top_abilities", output_dir)


def _fig_abilities_by_role(ck: pd.DataFrame, output_dir: str) -> None:
    fig, axes = plt.subplots(1, 3, figsize=(18, 7))
    for ax, role in zip(axes, ["Tank", "DPS", "Support"]):
        role_kills = ck[ck["attacker_role"] == role]
        top = role_kills["event_ability"].value_counts().head(12)
        ax.barh(top.index[::-1], top.values[::-1], color=ROLE_COLORS[role], alpha=0.85)
        ax.set_xlabel("Kills")
        ax.set_title(f"{role} — Top Abilities")
    plt.tight_layout()
    save_fig(fig, "06_abilities_by_role", output_dir)


def _fig_assists_winners_vs_losers(ctx, output_dir: str) -> None:
    off_per_match = ctx.off_assists.groupby(["MapDataId", "player_team"], observed=True).size().reset_index(name="off_assists")
    def_per_match = ctx.def_assists.groupby(["MapDataId", "player_team"], observed=True).size().reset_index(name="def_assists")
    assists = off_per_match.merge(def_per_match, on=["MapDataId", "player_team"], how="outer")
    assists["off_assists"] = assists["off_assists"].fillna(0)
    assists["def_assists"] = assists["def_assists"].fillna(0)

    # Build team outcomes
    team_outcomes = []
    for _, m in ctx.matches.iterrows():
        team_outcomes.append({"MapDataId": m["MapDataId"], "player_team": m["team_1_name"],
                              "won": m["winner"] == m["team_1_name"]})
        team_outcomes.append({"MapDataId": m["MapDataId"], "player_team": m["team_2_name"],
                              "won": m["winner"] == m["team_2_name"]})
    team_out = pd.DataFrame(team_outcomes)
    combined = assists.merge(team_out, on=["MapDataId", "player_team"], how="inner")

    w = combined[combined["won"]]
    l = combined[~combined["won"]]

    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    for ax, col, title in [(axes[0], "off_assists", "Offensive Assists"),
                            (axes[1], "def_assists", "Defensive Assists")]:
        ax.hist(w[col], bins=40, alpha=0.7, color=OW_COLORS["green"],
                label=f'Winners (mean={w[col].mean():.0f})', density=True)
        ax.hist(l[col], bins=40, alpha=0.7, color=OW_COLORS["red"],
                label=f'Losers (mean={l[col].mean():.0f})', density=True)
        ax.set_xlabel(f"{title} per Match")
        ax.set_ylabel("Density")
        ax.set_title(f"{title}: Winners vs Losers")
        ax.legend()
    plt.tight_layout()
    save_fig(fig, "06_assists_winners_vs_losers", output_dir)


def _fig_fb_ratio(ps: pd.DataFrame, output_dir: str) -> None:
    hero_stats = ps.groupby("player_hero", observed=True).agg(
        total_elims=("eliminations", "sum"), total_fb=("final_blows", "sum"),
        records=("eliminations", "count"),
    ).reset_index()
    hero_stats["fb_ratio"] = hero_stats["total_fb"] / hero_stats["total_elims"].replace(0, np.nan)
    hero_stats["role"] = hero_stats["player_hero"].map(HERO_ROLES).fillna("Unknown")
    hero_stats = hero_stats[hero_stats["records"] >= MIN_RECORDS].sort_values("fb_ratio")

    fig, ax = plt.subplots(figsize=(14, 10))
    colors = [ROLE_COLORS.get(r, OW_COLORS["light_gray"]) for r in hero_stats["role"]]
    ax.barh(hero_stats["player_hero"], hero_stats["fb_ratio"], color=colors, alpha=0.9)
    ax.axvline(hero_stats["fb_ratio"].median(), color=OW_COLORS["gold"], linestyle="--",
               label=f'Median: {hero_stats["fb_ratio"].median():.2f}')
    ax.set_xlabel("Final Blow Ratio (FB / Elims)")
    ax.set_title("Final Blow Efficiency by Hero")
    legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r) for r in ["Tank", "DPS", "Support"]]
    ax.legend(handles=legend_elements, loc="lower right")
    plt.tight_layout()
    save_fig(fig, "06_final_blow_ratio", output_dir)


def _fig_fb_ratio_by_role(ps: pd.DataFrame, output_dir: str) -> None:
    fig, ax = plt.subplots(figsize=(10, 6))
    role_order = ["Tank", "DPS", "Support"]
    bp = ax.boxplot(
        [ps[ps["role"] == r]["fb_ratio"].dropna() for r in role_order],
        labels=role_order, patch_artist=True, showfliers=False, widths=0.5,
    )
    for patch, role in zip(bp["boxes"], role_order):
        patch.set_facecolor(ROLE_COLORS[role])
        patch.set_alpha(0.8)
    ax.set_ylabel("Final Blow Ratio")
    ax.set_title("Final Blow Ratio Distribution by Role")
    plt.tight_layout()
    save_fig(fig, "06_fb_ratio_by_role", output_dir)


def _fig_kill_timeline(ck: pd.DataFrame, output_dir: str) -> None:
    fig, axes = plt.subplots(2, 1, figsize=(14, 10))

    match_times = ck["match_time"].clip(upper=900)
    axes[0].hist(match_times, bins=90, color=OW_COLORS["orange"],
                 edgecolor=OW_COLORS["dark_blue"], alpha=0.9)
    axes[0].set_xlabel("Match Time (seconds)")
    axes[0].set_ylabel("Kills")
    axes[0].set_title("Kill Density Over Match Time")

    clipped = ck[ck["match_time"] <= 900].copy()
    clipped["time_bin"] = (clipped["match_time"] // 30) * 30
    for role in ["Tank", "DPS", "Support"]:
        timeline = clipped[clipped["attacker_role"] == role].groupby("time_bin").size()
        axes[1].plot(timeline.index, timeline.values, color=ROLE_COLORS[role], label=role, linewidth=2)
    axes[1].set_xlabel("Match Time (30s bins)")
    axes[1].set_ylabel("Kills per Window")
    axes[1].set_title("Kill Rate by Role Over Match Time")
    axes[1].legend()

    plt.tight_layout()
    save_fig(fig, "06_kill_timeline", output_dir)


def _fig_crit_rate(ck: pd.DataFrame, output_dir: str) -> None:
    if "is_critical_hit" not in ck.columns:
        return
    ck = ck.copy()
    ck["is_crit"] = ck["is_critical_hit"].map({"True": 1, "true": 1, True: 1}).fillna(0).astype(int)
    hero_crit = ck.groupby("attacker_hero", observed=True).agg(
        total=("is_crit", "count"), crits=("is_crit", "sum"),
    ).reset_index()
    hero_crit["crit_rate"] = hero_crit["crits"] / hero_crit["total"]
    hero_crit["role"] = hero_crit["attacker_hero"].map(HERO_ROLES)
    hero_crit = hero_crit[(hero_crit["total"] >= MIN_KILLS_FOR_CRIT) & (hero_crit["crits"] > 0)]
    hero_crit = hero_crit.sort_values("crit_rate")

    fig, ax = plt.subplots(figsize=(14, 8))
    colors = [ROLE_COLORS.get(r, OW_COLORS["light_gray"]) for r in hero_crit["role"]]
    ax.barh(hero_crit["attacker_hero"], hero_crit["crit_rate"] * 100, color=colors, alpha=0.9)
    ax.set_xlabel("Critical Hit Kill Rate (%)")
    ax.set_title("Critical Hit Rate on Final Blows by Hero")
    legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r) for r in ["Tank", "DPS", "Support"]]
    ax.legend(handles=legend_elements, loc="lower right")
    plt.tight_layout()
    save_fig(fig, "06_crit_rate_by_hero", output_dir)


# ---------------------------------------------------------------------------
# Benchmarks
# ---------------------------------------------------------------------------

def _compute_benchmarks(ps: pd.DataFrame, ck: pd.DataFrame) -> dict[str, Any]:
    # --- FB ratio distributions (player-level) ---
    fb_overall = percentile_benchmarks(ps["fb_ratio"])
    fb_by_role = distribution_by_group(ps, "fb_ratio", "role")

    # Hero-level FB ratio
    hero_fb = ps.groupby("player_hero", observed=True).agg(
        total_fb=("final_blows", "sum"), total_elims=("eliminations", "sum"),
        n=("fb_ratio", "count"),
    )
    hero_fb["fb_ratio"] = hero_fb["total_fb"] / hero_fb["total_elims"].replace(0, np.nan)
    fb_by_hero = {
        str(h): {"fb_ratio": round(float(row["fb_ratio"]), 3), "n": int(row["n"])}
        for h, row in hero_fb.iterrows() if row["n"] >= MIN_RECORDS
    }

    # --- Crit rate benchmarks ---
    crit_benchmarks: dict[str, Any] = {}
    if "is_critical_hit" in ck.columns:
        ck_c = ck.copy()
        ck_c["is_crit"] = ck_c["is_critical_hit"].map({"True": 1, "true": 1, True: 1}).fillna(0).astype(int)
        hero_crit = ck_c.groupby("attacker_hero", observed=True).agg(
            total=("is_crit", "count"), crits=("is_crit", "sum"),
        )
        hero_crit["crit_rate"] = hero_crit["crits"] / hero_crit["total"]
        crit_benchmarks = {
            str(h): {"crit_rate": round(float(row["crit_rate"]), 4), "n": int(row["total"])}
            for h, row in hero_crit.iterrows() if row["total"] >= MIN_KILLS_FOR_CRIT and row["crits"] > 0
        }

    return {
        "fb_elim_ratio": {
            "description": "Final blow / elimination ratio — measures kill-finishing ability",
            "player_distribution": {
                "overall": fb_overall,
                "by_role": fb_by_role,
                "by_hero": fb_by_hero,
            },
        },
        "crit_kill_rate": {
            "description": "Critical hit rate on final blows — reveals mechanical skill per hero",
            "by_hero": crit_benchmarks,
        },
    }


# ---------------------------------------------------------------------------
# Module entry point
# ---------------------------------------------------------------------------

def run(ctx) -> dict[str, Any]:
    """Run combat & damage analysis."""
    ck = _prepare_combat_kills(ctx)
    ps = _prepare_player_fb(ctx)

    print(f"  Combat kills: {len(ck):,}")
    print(f"  Player FB ratio observations: {len(ps):,}")

    _fig_top_abilities(ck, ctx.figures_dir)
    _fig_abilities_by_role(ck, ctx.figures_dir)
    _fig_assists_winners_vs_losers(ctx, ctx.figures_dir)
    _fig_fb_ratio(ctx.player_stats, ctx.figures_dir)
    _fig_fb_ratio_by_role(ps, ctx.figures_dir)
    _fig_kill_timeline(ck, ctx.figures_dir)
    _fig_crit_rate(ck, ctx.figures_dir)

    return _compute_benchmarks(ps, ck)
