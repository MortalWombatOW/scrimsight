"""
Deaths Per 10 Minutes — The Universal Performance Benchmark

D/10 is one of the most commonly cited metrics in competitive Overwatch. The
coaching community benchmarks are roughly: <5.0 excellent, 5-6 good, 6-7.5
average, >8 poor. However, role-specific and hero-specific baselines are more
useful because Tanks naturally die more than Supports, and Wrecking Ball dies
more than Widowmaker.

Key findings from the Parsertime analysis:
- D/10 is the strongest individual predictor of match wins (confirmed by
  logistic regression in notebook 07).
- Winners consistently have lower D/10 than losers across all roles.
- Role-specific percentile benchmarks are essential — one-size-fits-all misses
  the Tank vs Support difference.
- Each death costs ~10-12 seconds of downtime (respawn + travel).

This module produces:
- Player-level D/10 distributions (overall, by role, by hero)
- Team-level D/10 distributions (avg D/10 per team per match)
- Winner vs loser gap analysis
- D/10 correlation with match win rate
- Benchmark zone figures
"""

from __future__ import annotations

from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib.patches import Patch
from scipy import stats

from analysis.src.metrics import (
    deaths_per_10_series,
    distribution_by_group,
    percentile_benchmarks,
)
from analysis.src.preprocessing import HERO_ROLES, add_role_column
from analysis.src.visualization import (
    OW_COLORS,
    ROLE_COLORS,
    role_color,
    save_fig,
)

# Community benchmarks — these are reference points, not our source of truth.
# The data-driven percentile benchmarks are more accurate.
COMMUNITY_BENCHMARKS = {
    "Excellent": 5.0,
    "Good": 6.0,
    "Average": 7.5,
    "Poor": 8.0,
}

# Minimum playtime (seconds) to include a player-hero observation.
# 60s filters out hero swaps and partial rounds.
MIN_PLAYTIME = 60

# Minimum observations for a hero to get its own baseline.
MIN_HERO_OBSERVATIONS = 30


def _prepare_data(ctx) -> pd.DataFrame:
    """Join player stats with match outcomes, compute D/10, filter outliers."""
    ps = ctx.player_stats.merge(
        ctx.matches[["MapDataId", "winner", "team_1_name", "team_2_name",
                      "map_name", "map_type"]],
        on="MapDataId",
        how="inner",
    )

    ps = ps[ps["hero_time_played"] >= MIN_PLAYTIME].copy()
    ps["d10"] = deaths_per_10_series(ps["deaths"], ps["hero_time_played"])
    ps["team_won"] = ps["player_team"] == ps["winner"]

    # Filter extreme outliers — likely data quality issues
    ps = ps[ps["d10"] < 30].copy()

    return ps


# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------

def _fig_distribution_with_benchmarks(ps: pd.DataFrame, output_dir: str) -> None:
    """Overall D/10 histogram with community benchmark zones."""
    fig, ax = plt.subplots(figsize=(14, 6))

    ax.hist(ps["d10"], bins=60, range=(0, 20), color=OW_COLORS["orange"],
            edgecolor=OW_COLORS["dark_blue"], alpha=0.8, density=True)

    # Benchmark zones
    ax.axvspan(0, 5.0, alpha=0.1, color=OW_COLORS["green"], label="Excellent (<5.0)")
    ax.axvspan(5.0, 6.0, alpha=0.1, color=OW_COLORS["teal"], label="Good (5-6)")
    ax.axvspan(6.0, 7.5, alpha=0.1, color=OW_COLORS["gold"], label="Average (6-7.5)")
    ax.axvspan(7.5, 20, alpha=0.1, color=OW_COLORS["red"], label="Poor (>7.5)")

    for val in COMMUNITY_BENCHMARKS.values():
        ax.axvline(val, color=OW_COLORS["white"], linestyle="--", alpha=0.5)

    median = ps["d10"].median()
    ax.axvline(median, color=OW_COLORS["red"], linestyle="-", linewidth=2,
               label=f"Median: {median:.2f}")

    ax.set_xlabel("Deaths Per 10 Minutes")
    ax.set_ylabel("Density")
    ax.set_title("Deaths Per 10 Minutes Distribution with Community Benchmarks")
    ax.set_xlim(0, 20)
    ax.legend(loc="upper right")
    plt.tight_layout()
    save_fig(fig, "04_d10_distribution_benchmarks", output_dir)


def _fig_by_role(ps: pd.DataFrame, output_dir: str) -> None:
    """Per-role D/10 histograms."""
    fig, axes = plt.subplots(1, 3, figsize=(16, 5), sharey=True)

    for ax, role_name in zip(axes, ["Tank", "DPS", "Support"]):
        role_data = ps[ps["role"] == role_name]["d10"]

        ax.hist(role_data, bins=50, range=(0, 20), color=ROLE_COLORS[role_name],
                edgecolor=OW_COLORS["dark_blue"], alpha=0.8, density=True)

        for val in [5.0, 6.0, 7.5, 8.0]:
            ax.axvline(val, color=OW_COLORS["white"], linestyle="--", alpha=0.3)

        ax.axvline(role_data.median(), color=OW_COLORS["gold"], linestyle="-",
                   linewidth=2, label=f"Median: {role_data.median():.2f}")
        ax.axvline(role_data.mean(), color=OW_COLORS["red"], linestyle="--",
                   linewidth=1.5, label=f"Mean: {role_data.mean():.2f}")

        ax.set_xlabel("Deaths Per 10 Minutes")
        ax.set_title(f"{role_name} D/10 Distribution")
        ax.set_xlim(0, 20)
        ax.legend(fontsize=9)

    axes[0].set_ylabel("Density")
    plt.tight_layout()
    save_fig(fig, "04_d10_by_role", output_dir)


def _fig_role_boxplot(ps: pd.DataFrame, output_dir: str) -> None:
    """Side-by-side role box plots with benchmark lines."""
    fig, ax = plt.subplots(figsize=(10, 6))

    role_order = ["Tank", "DPS", "Support"]
    bp = ax.boxplot(
        [ps[ps["role"] == r]["d10"] for r in role_order],
        labels=role_order,
        patch_artist=True,
        showfliers=False,
        medianprops={"color": OW_COLORS["gold"], "linewidth": 2},
    )

    for patch, role_name in zip(bp["boxes"], role_order):
        patch.set_facecolor(ROLE_COLORS[role_name])
        patch.set_alpha(0.7)

    for val, label in [(5.0, "Excellent"), (6.0, "Good"), (7.5, "Average"), (8.0, "Poor")]:
        ax.axhline(val, color=OW_COLORS["light_gray"], linestyle="--", alpha=0.4)
        ax.text(3.4, val + 0.1, label, fontsize=9, color=OW_COLORS["light_gray"])

    ax.set_ylabel("Deaths Per 10 Minutes")
    ax.set_title("D/10 Distribution by Role")
    ax.set_ylim(0, 15)
    plt.tight_layout()
    save_fig(fig, "04_d10_role_boxplot", output_dir)


def _fig_winners_vs_losers_by_role(ps: pd.DataFrame, output_dir: str) -> None:
    """Bar chart comparing winner vs loser D/10 for each role."""
    fig, axes = plt.subplots(1, 3, figsize=(16, 5))

    for ax, role_name in zip(axes, ["Tank", "DPS", "Support"]):
        role_ps = ps[ps["role"] == role_name]
        w = role_ps[role_ps["team_won"]]["d10"]
        l = role_ps[~role_ps["team_won"]]["d10"]

        means = [w.mean(), l.mean()]
        sems = [w.sem(), l.sem()]

        bars = ax.bar(["Winners", "Losers"], means, yerr=sems, capsize=5,
                      color=[OW_COLORS["green"], OW_COLORS["red"]], width=0.5,
                      edgecolor=OW_COLORS["dark_blue"])

        for bar, val in zip(bars, means):
            ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.1,
                    f"{val:.2f}", ha="center", fontsize=12, fontweight="bold",
                    color=OW_COLORS["white"])

        ax.set_ylabel("Mean D/10")
        ax.set_title(f"{role_name}: D/10 Winners vs Losers")
        ax.set_ylim(0, max(means) * 1.3)

    plt.tight_layout()
    save_fig(fig, "04_d10_winners_vs_losers_by_role", output_dir)


def _fig_team_d10_win_rate(ps: pd.DataFrame, output_dir: str) -> None:
    """Team-average D/10 binned against match win rate."""
    team_d10 = ps.groupby(["MapDataId", "player_team"], observed=True).agg(
        team_d10=("d10", "mean"),
        team_won=("team_won", "first"),
    ).reset_index()

    team_d10["d10_bin"] = pd.cut(
        team_d10["team_d10"],
        bins=[0, 4, 5, 6, 7, 8, 10, 30],
        labels=["<4", "4-5", "5-6", "6-7", "7-8", "8-10", "10+"],
    )

    bin_wr = team_d10.groupby("d10_bin", observed=True).agg(
        total=("team_won", "count"),
        wins=("team_won", "sum"),
    )
    bin_wr["win_rate"] = bin_wr["wins"] / bin_wr["total"] * 100

    fig, ax = plt.subplots(figsize=(12, 6))
    colors = [
        OW_COLORS["green"] if wr > 55 else OW_COLORS["red"] if wr < 45
        else OW_COLORS["orange"]
        for wr in bin_wr["win_rate"]
    ]

    bars = ax.bar(bin_wr.index.astype(str), bin_wr["win_rate"], color=colors,
                  width=0.6, edgecolor=OW_COLORS["dark_blue"])

    for bar, (_, row) in zip(bars, bin_wr.iterrows()):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
                f'{row["win_rate"]:.1f}%\n(n={row["total"]:,})',
                ha="center", fontsize=9, color=OW_COLORS["white"])

    ax.axhline(50, color=OW_COLORS["gold"], linestyle="--", alpha=0.7, label="50% baseline")
    ax.set_xlabel("Team Average D/10")
    ax.set_ylabel("Match Win Rate (%)")
    ax.set_title("Match Win Rate by Team Average Deaths Per 10")
    ax.legend()
    ax.set_ylim(0, 100)
    plt.tight_layout()
    save_fig(fig, "04_team_d10_win_rate", output_dir)


def _fig_hero_baselines(ps: pd.DataFrame, output_dir: str) -> None:
    """Horizontal bar chart of hero-specific D/10 medians."""
    hero_d10 = ps.groupby("player_hero").agg(
        median_d10=("d10", "median"),
        mean_d10=("d10", "mean"),
        std_d10=("d10", "std"),
        count=("d10", "count"),
        role=("role", "first"),
    )
    hero_d10 = hero_d10[hero_d10["count"] >= MIN_HERO_OBSERVATIONS]
    hero_d10 = hero_d10.sort_values("median_d10")

    fig, ax = plt.subplots(figsize=(14, 10))
    colors = [role_color(r) for r in hero_d10["role"]]

    ax.barh(hero_d10.index, hero_d10["median_d10"], color=colors, alpha=0.85,
            xerr=hero_d10["std_d10"] * 0.5, capsize=2)

    for val, label in [(5.0, "Excellent"), (6.0, "Good"), (7.5, "Average"), (8.0, "Poor")]:
        ax.axvline(val, color=OW_COLORS["white"], linestyle="--", alpha=0.3)
        ax.text(val + 0.05, len(hero_d10) - 0.5, label, fontsize=8,
                color=OW_COLORS["light_gray"], rotation=90, va="top")

    ax.set_xlabel("Median Deaths Per 10 Minutes")
    ax.set_title("Hero D/10 Baselines (Median with Half-Std Error Bars)")
    legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r) for r in ["Tank", "DPS", "Support"]]
    ax.legend(handles=legend_elements, loc="lower right")
    plt.tight_layout()
    save_fig(fig, "04_hero_d10_baselines", output_dir)


def _fig_hero_d10_gap(ps: pd.DataFrame, output_dir: str) -> None:
    """Winner vs loser D/10 gap by hero — which heroes show the biggest gap?"""
    hero_outcome = ps.groupby(["player_hero", "team_won"]).agg(
        median_d10=("d10", "median"),
        count=("d10", "count"),
    ).reset_index()

    hero_wide = hero_outcome.pivot_table(
        index="player_hero", columns="team_won", values="median_d10",
    ).rename(columns={True: "winner_d10", False: "loser_d10"})
    hero_wide["d10_gap"] = hero_wide["loser_d10"] - hero_wide["winner_d10"]
    hero_wide = hero_wide.dropna()

    hero_counts = ps.groupby("player_hero").size()
    valid_heroes = hero_counts[hero_counts >= 50].index
    hero_wide = hero_wide[hero_wide.index.isin(valid_heroes)]
    hero_wide = hero_wide.sort_values("d10_gap", ascending=True)

    fig, ax = plt.subplots(figsize=(14, 10))
    roles = [HERO_ROLES.get(h, "Unknown") for h in hero_wide.index]
    colors = [role_color(r) for r in roles]

    ax.barh(hero_wide.index, hero_wide["d10_gap"], color=colors, alpha=0.85)
    ax.axvline(0, color=OW_COLORS["gold"], linestyle="-", alpha=0.7)
    ax.set_xlabel("D/10 Gap (Loser D/10 - Winner D/10)")
    ax.set_title("D/10 Gap Between Winners and Losers by Hero\n"
                 "(Positive = losers die more on this hero)")
    legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r) for r in ["Tank", "DPS", "Support"]]
    ax.legend(handles=legend_elements, loc="lower right")
    plt.tight_layout()
    save_fig(fig, "04_hero_d10_gap", output_dir)


# ---------------------------------------------------------------------------
# Benchmarks
# ---------------------------------------------------------------------------

def _compute_benchmarks(ps: pd.DataFrame) -> dict[str, Any]:
    """Build the deaths_per_10 benchmark entry for training_path_benchmarks.json."""

    # --- Player-level distributions ---
    overall_player = percentile_benchmarks(ps["d10"])
    by_role_player = distribution_by_group(ps, "d10", "role")

    # Hero-specific baselines (median + n for each hero with enough data)
    hero_groups = ps.groupby("player_hero")["d10"]
    by_hero = {}
    for hero, group in hero_groups:
        if len(group) >= MIN_HERO_OBSERVATIONS:
            by_hero[str(hero)] = {
                "median": round(float(group.median()), 2),
                "mean": round(float(group.mean()), 2),
                "n": int(len(group)),
            }

    # --- Team-level distributions ---
    team_d10 = ps.groupby(["MapDataId", "player_team"], observed=True).agg(
        team_d10=("d10", "mean"),
        team_won=("team_won", "first"),
    ).reset_index()
    overall_team = percentile_benchmarks(team_d10["team_d10"])

    # --- Winner vs loser gap ---
    winners_d10 = ps[ps["team_won"]]["d10"]
    losers_d10 = ps[~ps["team_won"]]["d10"]
    stat, pval = stats.mannwhitneyu(winners_d10, losers_d10, alternative="less")
    effect_size = (losers_d10.mean() - winners_d10.mean()) / ps["d10"].std()

    winner_loser_gap = {
        "winner_mean": round(float(winners_d10.mean()), 3),
        "loser_mean": round(float(losers_d10.mean()), 3),
        "gap": round(float(losers_d10.mean() - winners_d10.mean()), 3),
        "cohens_d": round(float(effect_size), 3),
        "p_value": float(pval),
    }

    # --- Correlation: team D/10 bin → win rate ---
    team_d10["d10_bin"] = pd.cut(
        team_d10["team_d10"],
        bins=[0, 4, 5, 6, 7, 8, 10, 30],
        labels=["<4", "4-5", "5-6", "6-7", "7-8", "8-10", "10+"],
    )
    bin_wr = team_d10.groupby("d10_bin", observed=True).agg(
        total=("team_won", "count"),
        wins=("team_won", "sum"),
    )
    bin_wr["win_rate"] = (bin_wr["wins"] / bin_wr["total"] * 100).round(1)
    d10_win_rate_bins = {
        str(idx): {"win_rate": float(row["win_rate"]), "n": int(row["total"])}
        for idx, row in bin_wr.iterrows()
    }

    return {
        "deaths_per_10": {
            "description": "Deaths per 10 minutes — the strongest individual predictor of match wins",
            "player_distribution": {
                "overall": overall_player,
                "by_role": by_role_player,
                "by_hero": by_hero,
            },
            "team_distribution": {
                "overall": overall_team,
            },
            "winner_loser_gap": winner_loser_gap,
            "team_d10_win_rate_bins": d10_win_rate_bins,
            "community_benchmarks": COMMUNITY_BENCHMARKS,
        },
    }


# ---------------------------------------------------------------------------
# Module entry point
# ---------------------------------------------------------------------------

def run(ctx) -> dict[str, Any]:
    """Run the D/10 analysis: compute benchmarks and generate figures."""
    ps = _prepare_data(ctx)

    print(f"  Valid player-hero observations: {len(ps):,}")
    print(f"  Unique players: {ps['player_name'].nunique():,}")
    print(f"  Overall D/10 — mean: {ps['d10'].mean():.2f}, median: {ps['d10'].median():.2f}")

    # Generate all figures
    _fig_distribution_with_benchmarks(ps, ctx.figures_dir)
    _fig_by_role(ps, ctx.figures_dir)
    _fig_role_boxplot(ps, ctx.figures_dir)
    _fig_winners_vs_losers_by_role(ps, ctx.figures_dir)
    _fig_team_d10_win_rate(ps, ctx.figures_dir)
    _fig_hero_baselines(ps, ctx.figures_dir)
    _fig_hero_d10_gap(ps, ctx.figures_dir)

    # Compute and return benchmarks
    return _compute_benchmarks(ps)
