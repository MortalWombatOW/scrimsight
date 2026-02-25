"""
First Death / First Pick Analysis

The most important hypothesis in competitive OW analytics:
"The team that secures the first kill in a teamfight wins ~75-78% of the time."
(Cited from OWL Stats Lab, Winston's Lab, coaching literature.)

This is decisive because the first pick creates a 5v4 man-advantage that
compounds through the fight. The team with numbers advantage can take
more favourable trades from that point forward.

This module validates the claim and produces distributions for:
- First pick win rate (team-level)
- First death rate by role (player-level) — who dies first?
- Entry pick rate by role (player-level) — who gets the opening kill?
- First pick conversion rate (team-level) — per-team first pick → win rate
- Fight size effects, time-to-first-blood, ability breakdowns
"""

from __future__ import annotations

from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Patch

from analysis.src.metrics import (
    confidence_interval,
    first_pick_win_rate,
    percentile_benchmarks,
)
from analysis.src.preprocessing import HERO_ROLES
from analysis.src.visualization import (
    OW_COLORS,
    ROLE_COLORS,
    save_fig,
)

# Research benchmark from OWL Stats Lab / coaching literature
CLAIMED_FP_WIN_RATE = (0.75, 0.78)


def _add_role_columns(fights: pd.DataFrame) -> pd.DataFrame:
    """Add role columns for first killer and first victim."""
    f = fights.copy()
    f["first_kill_role"] = f["first_kill_hero"].map(HERO_ROLES).fillna("Unknown")
    f["first_death_role"] = f["first_kill_victim_hero"].map(HERO_ROLES).fillna("Unknown")
    return f


# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------

def _fig_fight_distributions(fights: pd.DataFrame, output_dir: str) -> None:
    """Fight size and duration histograms."""
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    axes[0].hist(fights["total_kills"], bins=range(3, int(fights["total_kills"].max()) + 2),
                 color=OW_COLORS["orange"], edgecolor=OW_COLORS["dark_blue"], alpha=0.9)
    axes[0].set_xlabel("Kills per Fight")
    axes[0].set_ylabel("Count")
    axes[0].set_title("Teamfight Size Distribution")
    axes[0].axvline(fights["total_kills"].mean(), color=OW_COLORS["red"], linestyle="--",
                    label=f'Mean: {fights["total_kills"].mean():.1f}')
    axes[0].legend()

    axes[1].hist(fights["fight_duration"], bins=50,
                 color=OW_COLORS["blue"], edgecolor=OW_COLORS["dark_blue"], alpha=0.9)
    axes[1].set_xlabel("Fight Duration (seconds)")
    axes[1].set_ylabel("Count")
    axes[1].set_title("Teamfight Duration Distribution")
    axes[1].axvline(fights["fight_duration"].median(), color=OW_COLORS["red"], linestyle="--",
                    label=f'Median: {fights["fight_duration"].median():.1f}s')
    axes[1].legend()

    plt.tight_layout()
    save_fig(fig, "01_fight_distributions", output_dir)


def _fig_first_pick_win_rate(result: dict, output_dir: str) -> None:
    """Bar chart: first pick wins vs loses."""
    fig, ax = plt.subplots(figsize=(8, 6))

    categories = ["First Pick\nWins Fight", "First Pick\nLoses Fight"]
    values = [result["rate"] * 100, (1 - result["rate"]) * 100]
    colors = [OW_COLORS["green"], OW_COLORS["red"]]

    bars = ax.bar(categories, values, color=colors, width=0.5,
                  edgecolor=OW_COLORS["dark_blue"])

    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
                f"{val:.1f}%", ha="center", fontsize=18, fontweight="bold",
                color=OW_COLORS["white"])

    ax.axhspan(75, 78, alpha=0.2, color=OW_COLORS["gold"], label="Claimed range (75-78%)")
    ax.axhline(result["rate"] * 100, color=OW_COLORS["orange"], linestyle="--",
               linewidth=2, label=f'Our finding: {result["rate"] * 100:.1f}%')

    ax.set_ylabel("Percentage of Fights")
    ax.set_title("First Pick Win Rate: Does the Opening Kill Decide the Fight?",
                 fontsize=14, fontweight="bold")
    ax.set_ylim(0, 100)
    ax.legend(loc="upper right")
    plt.tight_layout()
    save_fig(fig, "01_first_pick_win_rate", output_dir)


def _fig_by_fight_size(fights: pd.DataFrame, output_dir: str) -> None:
    """First pick win rate by fight size (kills per fight)."""
    valid = fights[fights["winner"] != "Draw"].copy()
    valid["size_bin"] = pd.cut(valid["total_kills"],
                                bins=[2, 3, 5, 7, 10, 50],
                                labels=["3", "4-5", "6-7", "8-10", "10+"])

    size_rates = valid.groupby("size_bin", observed=True).agg(
        total=("first_pick_won", "count"),
        wins=("first_pick_won", "sum"),
    )
    size_rates["rate"] = size_rates["wins"] / size_rates["total"] * 100

    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(size_rates.index.astype(str), size_rates["rate"],
                  color=OW_COLORS["orange"], width=0.6, edgecolor=OW_COLORS["dark_blue"])

    for bar, (_, row) in zip(bars, size_rates.iterrows()):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
                f'{row["rate"]:.1f}%\n(n={row["total"]:,})', ha="center",
                fontsize=10, color=OW_COLORS["white"])

    ax.axhspan(75, 78, alpha=0.15, color=OW_COLORS["gold"])
    ax.set_xlabel("Kills per Fight")
    ax.set_ylabel("First Pick Win Rate (%)")
    ax.set_title("First Pick Win Rate by Fight Size")
    ax.set_ylim(50, 100)
    plt.tight_layout()
    save_fig(fig, "01_first_pick_by_fight_size", output_dir)


def _fig_role_pies(fights: pd.DataFrame, output_dir: str) -> None:
    """Pie charts: who gets the first kill vs who dies first, by role."""
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    pick_roles = fights["first_kill_role"].value_counts()
    colors_pick = [ROLE_COLORS.get(r, OW_COLORS["light_gray"]) for r in pick_roles.index]
    axes[0].pie(pick_roles.values, labels=pick_roles.index, colors=colors_pick,
                autopct="%1.1f%%", textprops={"color": OW_COLORS["white"]}, startangle=90)
    axes[0].set_title("Who Gets the First Kill?")

    death_roles = fights["first_death_role"].value_counts()
    colors_death = [ROLE_COLORS.get(r, OW_COLORS["light_gray"]) for r in death_roles.index]
    axes[1].pie(death_roles.values, labels=death_roles.index, colors=colors_death,
                autopct="%1.1f%%", textprops={"color": OW_COLORS["white"]}, startangle=90)
    axes[1].set_title("Who Dies First?")

    plt.tight_layout()
    save_fig(fig, "01_first_pick_death_roles", output_dir)


def _fig_hero_bars(fights: pd.DataFrame, output_dir: str) -> None:
    """Top heroes for securing first picks and suffering first deaths."""
    top_killers = fights["first_kill_hero"].value_counts().head(15)
    top_deaths = fights["first_kill_victim_hero"].value_counts().head(15)

    fig, axes = plt.subplots(1, 2, figsize=(16, 7))

    colors = [ROLE_COLORS.get(HERO_ROLES.get(str(h), "Unknown"), OW_COLORS["light_gray"])
              for h in top_killers.index]
    axes[0].barh(top_killers.index[::-1], top_killers.values[::-1], color=colors[::-1])
    axes[0].set_xlabel("First Picks Secured")
    axes[0].set_title("Top Heroes Securing Opening Kills")

    colors = [ROLE_COLORS.get(HERO_ROLES.get(str(h), "Unknown"), OW_COLORS["light_gray"])
              for h in top_deaths.index]
    axes[1].barh(top_deaths.index[::-1], top_deaths.values[::-1], color=colors[::-1])
    axes[1].set_xlabel("First Deaths Suffered")
    axes[1].set_title("Top Heroes Dying First")

    plt.tight_layout()
    save_fig(fig, "01_first_pick_death_heroes", output_dir)


def _fig_fp_by_killer_role(fights: pd.DataFrame, output_dir: str) -> None:
    """First pick win rate segmented by role of the killer."""
    valid = fights[fights["winner"] != "Draw"]
    role_rates = valid.groupby("first_kill_role", observed=True).agg(
        total=("first_pick_won", "count"),
        wins=("first_pick_won", "sum"),
    )
    role_rates["rate"] = role_rates["wins"] / role_rates["total"] * 100
    role_rates = role_rates.sort_values("rate", ascending=True)

    fig, ax = plt.subplots(figsize=(10, 5))
    colors = [ROLE_COLORS.get(str(r), OW_COLORS["light_gray"]) for r in role_rates.index]
    bars = ax.barh(role_rates.index, role_rates["rate"], color=colors, height=0.5)

    for bar, (role, row) in zip(bars, role_rates.iterrows()):
        ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height() / 2,
                f'{row["rate"]:.1f}% (n={row["total"]:,})', va="center",
                fontsize=11, color=OW_COLORS["white"])

    ax.axvline(75, color=OW_COLORS["gold"], linestyle="--", alpha=0.5, label="75% reference")
    ax.set_xlabel("First Pick Win Rate (%)")
    ax.set_title("First Pick Win Rate by Role of the Opening Killer")
    ax.set_xlim(50, 100)
    ax.legend()
    plt.tight_layout()
    save_fig(fig, "01_first_pick_by_killer_role", output_dir)


def _fig_abilities(fights: pd.DataFrame, output_dir: str) -> None:
    """Top abilities securing first kills."""
    ability_counts = fights["first_kill_ability"].value_counts().head(20)

    fig, ax = plt.subplots(figsize=(12, 7))
    ax.barh(ability_counts.index[::-1], ability_counts.values[::-1],
            color=OW_COLORS["teal"], alpha=0.85)
    ax.set_xlabel("Count")
    ax.set_title("Top 20 Abilities Securing Opening Kills")
    plt.tight_layout()
    save_fig(fig, "01_first_kill_abilities", output_dir)


def _fig_time_to_first_blood(valid_kills: pd.DataFrame, output_dir: str) -> None:
    """Distribution of time to first blood in each match."""
    first_kills = valid_kills.sort_values("match_time").groupby("MapDataId").first()

    fig, ax = plt.subplots(figsize=(12, 5))
    ax.hist(first_kills["match_time"].clip(upper=120), bins=60,
            color=OW_COLORS["orange"], edgecolor=OW_COLORS["dark_blue"], alpha=0.9)
    ax.set_xlabel("Time to First Blood (seconds into match)")
    ax.set_ylabel("Count")
    ax.set_title("Distribution of Time to First Blood")
    median_t = first_kills["match_time"].median()
    ax.axvline(median_t, color=OW_COLORS["red"], linestyle="--",
               label=f"Median: {median_t:.0f}s")
    ax.legend()
    plt.tight_layout()
    save_fig(fig, "01_time_to_first_blood", output_dir)


# ---------------------------------------------------------------------------
# Benchmarks
# ---------------------------------------------------------------------------

def _compute_benchmarks(fights: pd.DataFrame, valid_kills: pd.DataFrame) -> dict[str, Any]:
    """Build benchmark entries for first pick, first death, and entry pick."""
    result = first_pick_win_rate(fights)
    fp_rate = result["rate"]
    ci_lo, ci_hi = confidence_interval(fp_rate, result["total_fights"])

    valid = fights[fights["winner"] != "Draw"].copy()

    # --- First pick win rate (team-level) ---
    # Per-team first pick conversion rates
    team_fp = valid.groupby("first_kill_team", observed=True).agg(
        total=("first_pick_won", "count"),
        wins=("first_pick_won", "sum"),
    )
    team_fp["conversion_rate"] = team_fp["wins"] / team_fp["total"]
    team_conversion_dist = percentile_benchmarks(team_fp["conversion_rate"])

    # By fight size
    valid["size_bin"] = pd.cut(valid["total_kills"],
                                bins=[2, 3, 5, 7, 10, 50],
                                labels=["3", "4-5", "6-7", "8-10", "10+"])
    size_rates = valid.groupby("size_bin", observed=True).agg(
        total=("first_pick_won", "count"),
        wins=("first_pick_won", "sum"),
    )
    size_rates["rate"] = size_rates["wins"] / size_rates["total"]
    by_fight_size = {
        str(k): {"rate": round(float(v), 4), "n": int(row["total"])}
        for k, (_, row) in zip(size_rates.index, size_rates.iterrows())
        for v in [row["rate"]]
    }

    # --- Entry pick rate by role (who gets the first kill) ---
    role_entry = valid.groupby("first_kill_role", observed=True).size()
    total_fights = len(valid)
    entry_by_role = {
        str(role): {"count": int(count), "rate": round(count / total_fights, 4)}
        for role, count in role_entry.items()
    }

    # --- First death rate by role (who dies first) ---
    role_death = valid.groupby("first_death_role", observed=True).size()
    death_by_role = {
        str(role): {"count": int(count), "rate": round(count / total_fights, 4)}
        for role, count in role_death.items()
    }

    # --- First pick win rate by killer role ---
    role_fp_wr = valid.groupby("first_kill_role", observed=True).agg(
        total=("first_pick_won", "count"),
        wins=("first_pick_won", "sum"),
    )
    role_fp_wr["rate"] = role_fp_wr["wins"] / role_fp_wr["total"]
    fp_wr_by_role = {
        str(role): {"rate": round(float(row["rate"]), 4), "n": int(row["total"])}
        for role, row in role_fp_wr.iterrows()
    }

    # --- Time to first blood ---
    first_kills = valid_kills.sort_values("match_time").groupby("MapDataId").first()
    ttfb = first_kills["match_time"]
    ttfb_benchmarks = percentile_benchmarks(ttfb)

    return {
        "first_pick_win_rate": {
            "description": "Team that secures the first kill wins this % of fights — the most decisive single event",
            "overall": {
                "rate": round(float(fp_rate), 4),
                "ci_95": [round(float(ci_lo), 4), round(float(ci_hi), 4)],
                "n": int(result["total_fights"]),
            },
            "research_benchmark": {"claimed_range": [0.75, 0.78]},
            "by_fight_size": by_fight_size,
            "fp_win_rate_by_killer_role": fp_wr_by_role,
            "team_distribution": {
                "overall": team_conversion_dist,
            },
        },
        "entry_pick_rate": {
            "description": "How often each role secures the opening kill in teamfights",
            "by_role": entry_by_role,
            "total_fights": total_fights,
        },
        "first_death_rate": {
            "description": "How often each role is the first to die in teamfights",
            "by_role": death_by_role,
            "total_fights": total_fights,
        },
        "time_to_first_blood": {
            "description": "Seconds into the match before the first kill occurs",
            "distribution": ttfb_benchmarks,
        },
    }


# ---------------------------------------------------------------------------
# Module entry point
# ---------------------------------------------------------------------------

def run(ctx) -> dict[str, Any]:
    """Run first pick/death analysis: compute benchmarks and generate figures."""
    fights = _add_role_columns(ctx.fights)

    result = first_pick_win_rate(fights)
    print(f"  Fights analyzed: {result['total_fights']:,}")
    print(f"  First pick win rate: {result['rate'] * 100:.1f}%")

    # Generate figures
    _fig_fight_distributions(fights, ctx.figures_dir)
    _fig_first_pick_win_rate(result, ctx.figures_dir)
    _fig_by_fight_size(fights, ctx.figures_dir)
    _fig_role_pies(fights, ctx.figures_dir)
    _fig_hero_bars(fights, ctx.figures_dir)
    _fig_fp_by_killer_role(fights, ctx.figures_dir)
    _fig_abilities(fights, ctx.figures_dir)
    _fig_time_to_first_blood(ctx.valid_kills, ctx.figures_dir)

    return _compute_benchmarks(fights, ctx.valid_kills)
