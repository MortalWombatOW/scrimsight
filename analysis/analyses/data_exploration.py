"""
Data Exploration — Dataset Overview & Quality Checks

Diagnostic module that profiles the Parsertime dataset: table sizes, map
coverage, hero frequency, and data quality checks. Produces overview figures
but no benchmark metrics (those come from domain-specific modules).

Key facts about the dataset:
- ~1,900 scrims containing ~4,800 matches with ~373K kills
- 24 event tables totaling ~2M rows
- All 32+ OW2 heroes represented, with ~4% non-English hero names filtered
- Zero orphaned records (Kill → MatchStart, Scrim → Scrim)
"""

from __future__ import annotations

from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Patch

from analysis.src.preprocessing import HERO_ROLES
from analysis.src.visualization import (
    OW_COLORS,
    ROLE_COLORS,
    save_fig,
)


def _fig_dataset_overview(ctx, output_dir: str) -> None:
    """Summary stats: matches, kills, fights, players."""
    table_sizes = {
        "Kills (all)": len(ctx.kills),
        "Valid kills": len(ctx.valid_kills),
        "Player stats": len(ctx.player_stats),
        "Matches": len(ctx.matches),
        "Fights": len(ctx.fights),
        "Off assists": len(ctx.off_assists),
        "Def assists": len(ctx.def_assists),
        "Ult charged": len(ctx.ult_charged),
        "Ult start": len(ctx.ult_start),
        "Ult end": len(ctx.ult_end),
    }

    fig, ax = plt.subplots(figsize=(12, 6))
    names = list(table_sizes.keys())
    sizes = list(table_sizes.values())
    bars = ax.barh(names[::-1], sizes[::-1], color=OW_COLORS["orange"], alpha=0.9,
                   edgecolor=OW_COLORS["dark_blue"])
    ax.set_xscale("log")
    ax.set_xlabel("Row Count (log scale)")
    ax.set_title("Dataset Table Sizes")

    for bar, size in zip(bars, sizes[::-1]):
        ax.text(bar.get_width() * 1.1, bar.get_y() + bar.get_height() / 2,
                f"{size:,}", va="center", fontsize=9)

    plt.tight_layout()
    save_fig(fig, "00_dataset_overview", output_dir)


def _fig_map_coverage(ctx, output_dir: str) -> None:
    """Map type distribution and match counts per map."""
    matches = ctx.matches

    if "map_type" not in matches.columns or "map_name" not in matches.columns:
        return

    # Map type distribution
    fig, axes = plt.subplots(1, 2, figsize=(16, 7))

    type_counts = matches["map_type"].astype(str).value_counts()
    axes[0].bar(type_counts.index, type_counts.values, color=OW_COLORS["blue"],
                edgecolor=OW_COLORS["dark_blue"], alpha=0.9)
    axes[0].set_xlabel("Map Type")
    axes[0].set_ylabel("Matches")
    axes[0].set_title("Matches by Map Type")
    axes[0].tick_params(axis="x", rotation=45)

    # Per-map coverage
    map_counts = matches["map_name"].astype(str).value_counts()
    top_maps = map_counts.head(20)
    axes[1].barh(top_maps.index[::-1], top_maps.values[::-1],
                 color=OW_COLORS["orange"], alpha=0.9)
    axes[1].set_xlabel("Matches")
    axes[1].set_title("Top 20 Maps by Match Count")

    plt.tight_layout()
    save_fig(fig, "00_map_coverage", output_dir)


def _fig_hero_frequency(ctx, output_dir: str) -> None:
    """Hero kill/death frequency chart."""
    vk = ctx.valid_kills

    # Attacker hero frequency
    attacker_counts = vk["attacker_hero"].value_counts().head(20)
    victim_counts = vk["victim_hero"].value_counts().head(20)

    fig, axes = plt.subplots(1, 2, figsize=(16, 8))

    colors_a = [ROLE_COLORS.get(HERO_ROLES.get(str(h), "Unknown"), OW_COLORS["light_gray"])
                for h in attacker_counts.index]
    axes[0].barh(attacker_counts.index[::-1], attacker_counts.values[::-1],
                 color=colors_a[::-1], alpha=0.9)
    axes[0].set_xlabel("Kills")
    axes[0].set_title("Top 20 Heroes by Kill Count")

    colors_v = [ROLE_COLORS.get(HERO_ROLES.get(str(h), "Unknown"), OW_COLORS["light_gray"])
                for h in victim_counts.index]
    axes[1].barh(victim_counts.index[::-1], victim_counts.values[::-1],
                 color=colors_v[::-1], alpha=0.9)
    axes[1].set_xlabel("Deaths")
    axes[1].set_title("Top 20 Heroes by Death Count")

    legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r) for r in ["Tank", "DPS", "Support"]]
    axes[0].legend(handles=legend_elements, loc="lower right")

    plt.tight_layout()
    save_fig(fig, "00_hero_frequency", output_dir)


# ---------------------------------------------------------------------------
# Module entry point
# ---------------------------------------------------------------------------

def run(ctx) -> dict[str, Any]:
    """Run data exploration — diagnostic figures only, no benchmarks."""
    n_scrims = len(ctx.scrims)
    n_matches = len(ctx.matches)
    n_kills = len(ctx.valid_kills)
    n_players = ctx.player_stats["player_name"].nunique()

    print(f"  Scrims: {n_scrims:,}")
    print(f"  Matches: {n_matches:,}")
    print(f"  Valid kills: {n_kills:,}")
    print(f"  Unique players: {n_players:,}")

    _fig_dataset_overview(ctx, ctx.figures_dir)
    _fig_map_coverage(ctx, ctx.figures_dir)
    _fig_hero_frequency(ctx, ctx.figures_dir)

    return {}  # Diagnostic only — no benchmarks
