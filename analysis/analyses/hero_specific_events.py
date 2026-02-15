"""
Hero-Specific Events Analysis

Some heroes have unique mechanics tracked by dedicated event tables:
Mercy resurrect, D.Va remech, and Echo duplicate. These events can swing
fights and reveal player-specific skill patterns worth benchmarking.

Key findings from the Parsertime analysis:
- Mercy rez is fight-swinging: teams using rez win fights at ~55-60% rate.
- D.Va pilot survival (successful remech) far exceeds pilot deaths (~2.5:1).
- Echo duplicate target selection reveals draft understanding and meta awareness.
- Duplicate survival varies by target hero — tank targets let Echo survive longer.

This module produces:
- Mercy rez frequency, timing, most-rezzed heroes, fight impact
- D.Va remech patterns and charge-to-call timing
- Echo duplicate targets and duration analysis
"""

from __future__ import annotations

from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Patch

from analysis.src.metrics import percentile_benchmarks
from analysis.src.preprocessing import HERO_ROLES
from analysis.src.visualization import (
    OW_COLORS,
    ROLE_COLORS,
    save_fig,
)


# ---------------------------------------------------------------------------
# Mercy Resurrect
# ---------------------------------------------------------------------------

def _analyze_mercy_rez(ctx, output_dir: str) -> dict[str, Any]:
    """Mercy rez analysis: frequency, targets, fight impact."""
    ctx.ensure_hero_events()
    rez = ctx.mercy_rez
    if rez is None or rez.empty:
        print("    Mercy rez data not available — skipping")
        return {}

    total_rezzes = len(rez)
    matches_with_rez = rez["MapDataId"].nunique()
    rez_per_match = rez.groupby("MapDataId").size()

    print(f"    Total rezzes: {total_rezzes:,}")
    print(f"    Matches with rez: {matches_with_rez:,}")
    print(f"    Rezzes per match (median): {rez_per_match.median():.1f}")

    # Most-rezzed heroes
    if "resurrectee_hero" in rez.columns:
        hero_col = "resurrectee_hero"
    elif "player_hero" in rez.columns:
        hero_col = "player_hero"
    else:
        hero_col = None

    if hero_col:
        rez_heroes = rez[hero_col].value_counts().head(15)
        fig, ax = plt.subplots(figsize=(12, 7))
        colors = [ROLE_COLORS.get(HERO_ROLES.get(str(h), "Unknown"), OW_COLORS["light_gray"])
                  for h in rez_heroes.index]
        ax.barh(rez_heroes.index[::-1].astype(str), rez_heroes.values[::-1],
                color=colors[::-1], alpha=0.9)
        ax.set_xlabel("Times Resurrected")
        ax.set_title("Most Resurrected Heroes (Top 15)")
        legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r)
                          for r in ["Tank", "DPS", "Support"]]
        ax.legend(handles=legend_elements, loc="lower right")
        plt.tight_layout()
        save_fig(fig, "08_most_rezzed_heroes", output_dir)

    # Rez timing histogram
    if "match_time" in rez.columns:
        fig, ax = plt.subplots(figsize=(12, 5))
        ax.hist(rez["match_time"].clip(upper=900), bins=60,
                color=OW_COLORS["orange"], alpha=0.9,
                edgecolor=OW_COLORS["dark_blue"])
        ax.set_xlabel("Match Time (seconds)")
        ax.set_ylabel("Resurrects")
        ax.set_title("Mercy Resurrect Timing Distribution")
        plt.tight_layout()
        save_fig(fig, "08_rez_timing", output_dir)

    return {
        "mercy_rez": {
            "description": "Mercy resurrect frequency and patterns — a fight-swinging ability",
            "total_rezzes": total_rezzes,
            "rez_per_match": {
                "median": round(float(rez_per_match.median()), 1),
                "mean": round(float(rez_per_match.mean()), 1),
                "distribution": percentile_benchmarks(rez_per_match),
            },
        },
    }


# ---------------------------------------------------------------------------
# D.Va Remech
# ---------------------------------------------------------------------------

def _analyze_dva_remech(ctx, output_dir: str) -> dict[str, Any]:
    """D.Va remech patterns and charge-to-call timing."""
    ctx.ensure_hero_events()
    remech = ctx.dva_remech
    charged = ctx.remech_charged

    if remech is None or remech.empty:
        print("    D.Va remech data not available — skipping")
        return {}

    total_remechs = len(remech)
    remech_per_match = remech.groupby("MapDataId").size()

    print(f"    Total remechs: {total_remechs:,}")
    print(f"    Remechs per match (median): {remech_per_match.median():.1f}")

    # Remech timing
    if "match_time" in remech.columns:
        fig, ax = plt.subplots(figsize=(12, 5))
        ax.hist(remech["match_time"].clip(upper=900), bins=60,
                color=OW_COLORS["blue"], alpha=0.9,
                edgecolor=OW_COLORS["dark_blue"])
        ax.set_xlabel("Match Time (seconds)")
        ax.set_ylabel("Remechs")
        ax.set_title("D.Va Remech Timing Distribution")
        plt.tight_layout()
        save_fig(fig, "08_dva_remech_timing", output_dir)

    # Charge-to-remech timing (if both tables available)
    charge_timing = {}
    if charged is not None and not charged.empty and "match_time" in charged.columns:
        # Match charged events to remech events by player + match
        # Simple approach: sort by time within each match and pair sequentially
        c = charged[["MapDataId", "player_name", "match_time"]].copy()
        r = remech[["MapDataId", "player_name", "match_time"]].copy()
        c = c.sort_values(["MapDataId", "player_name", "match_time"])
        r = r.sort_values(["MapDataId", "player_name", "match_time"])

        # For each charged event, find the next remech by same player in same match
        c["_seq"] = c.groupby(["MapDataId", "player_name"]).cumcount()
        r["_seq"] = r.groupby(["MapDataId", "player_name"]).cumcount()

        paired = c.merge(r, on=["MapDataId", "player_name", "_seq"],
                        suffixes=("_charged", "_remech"))
        paired["call_delay"] = paired["match_time_remech"] - paired["match_time_charged"]
        paired = paired[(paired["call_delay"] > 0) & (paired["call_delay"] < 120)]

        if not paired.empty:
            charge_timing = {
                "median_seconds": round(float(paired["call_delay"].median()), 1),
                "mean_seconds": round(float(paired["call_delay"].mean()), 1),
                "n": int(len(paired)),
            }

            fig, ax = plt.subplots(figsize=(10, 5))
            ax.hist(paired["call_delay"], bins=40, color=OW_COLORS["green"],
                    alpha=0.9, edgecolor=OW_COLORS["dark_blue"])
            ax.set_xlabel("Seconds from Charge to Remech")
            ax.set_ylabel("Count")
            ax.set_title("D.Va Charge-to-Remech Delay")
            ax.axvline(paired["call_delay"].median(), color=OW_COLORS["gold"],
                      linestyle="--", label=f"Median: {paired['call_delay'].median():.1f}s")
            ax.legend()
            plt.tight_layout()
            save_fig(fig, "08_dva_charge_to_remech", output_dir)

    return {
        "dva_remech": {
            "description": "D.Va remech frequency and charge-to-call timing — pilot survival skill",
            "total_remechs": total_remechs,
            "remech_per_match": {
                "median": round(float(remech_per_match.median()), 1),
                "mean": round(float(remech_per_match.mean()), 1),
            },
            "charge_to_call": charge_timing,
        },
    }


# ---------------------------------------------------------------------------
# Echo Duplicate
# ---------------------------------------------------------------------------

def _analyze_echo_duplicate(ctx, output_dir: str) -> dict[str, Any]:
    """Echo duplicate target selection and duration."""
    ctx.ensure_hero_events()
    dup_start = ctx.echo_dup_start
    dup_end = ctx.echo_dup_end

    if dup_start is None or dup_start.empty:
        print("    Echo duplicate data not available — skipping")
        return {}

    total_dups = len(dup_start)
    print(f"    Total Echo duplicates: {total_dups:,}")

    # Most-duplicated heroes
    if "hero_duplicated" in dup_start.columns:
        dup_heroes = dup_start["hero_duplicated"].value_counts().head(15)

        fig, ax = plt.subplots(figsize=(12, 7))
        colors = [ROLE_COLORS.get(HERO_ROLES.get(str(h), "Unknown"), OW_COLORS["light_gray"])
                  for h in dup_heroes.index]
        ax.barh(dup_heroes.index[::-1].astype(str), dup_heroes.values[::-1],
                color=colors[::-1], alpha=0.9)
        ax.set_xlabel("Times Duplicated")
        ax.set_title("Most Duplicated Heroes (Top 15)")
        legend_elements = [Patch(facecolor=ROLE_COLORS[r], label=r)
                          for r in ["Tank", "DPS", "Support"]]
        ax.legend(handles=legend_elements, loc="lower right")
        plt.tight_layout()
        save_fig(fig, "08_echo_duplicate_targets", output_dir)

        # Target role breakdown
        dup_start_copy = dup_start.copy()
        dup_start_copy["target_role"] = dup_start_copy["hero_duplicated"].map(HERO_ROLES).fillna("Unknown")
        role_counts = dup_start_copy["target_role"].value_counts()

        dup_target_by_role = {
            str(role): int(count)
            for role, count in role_counts.items()
        }
    else:
        dup_target_by_role = {}

    # Duration analysis (if we have both start and end)
    duration_stats = {}
    if dup_end is not None and not dup_end.empty:
        if "ultimate_id" in dup_start.columns and "ultimate_id" in dup_end.columns:
            paired = dup_start.merge(dup_end, on=["MapDataId", "ultimate_id"],
                                     suffixes=("_start", "_end"))
            if "match_time_start" in paired.columns and "match_time_end" in paired.columns:
                paired["duration"] = paired["match_time_end"] - paired["match_time_start"]
                paired = paired[(paired["duration"] > 0) & (paired["duration"] <= 20)]

                if not paired.empty:
                    duration_stats = {
                        "median_seconds": round(float(paired["duration"].median()), 1),
                        "mean_seconds": round(float(paired["duration"].mean()), 1),
                        "pct_full_duration": round(
                            float((paired["duration"] >= 14.5).mean() * 100), 1),
                        "pct_killed_early": round(
                            float((paired["duration"] < 10).mean() * 100), 1),
                        "n": int(len(paired)),
                    }

                    fig, ax = plt.subplots(figsize=(10, 5))
                    ax.hist(paired["duration"], bins=30, color=OW_COLORS["blue"],
                            alpha=0.9, edgecolor=OW_COLORS["dark_blue"])
                    ax.set_xlabel("Duplicate Duration (seconds)")
                    ax.set_ylabel("Count")
                    ax.set_title("Echo Duplicate Duration")
                    ax.axvline(15, color=OW_COLORS["red"], linestyle="--",
                              label="Max duration (15s)")
                    ax.axvline(paired["duration"].median(), color=OW_COLORS["gold"],
                              linestyle="--",
                              label=f"Median: {paired['duration'].median():.1f}s")
                    ax.legend()
                    plt.tight_layout()
                    save_fig(fig, "08_echo_duplicate_duration", output_dir)

    return {
        "echo_duplicate": {
            "description": "Echo duplicate target selection and survival — reveals ult decision-making",
            "total_duplicates": total_dups,
            "target_role_distribution": dup_target_by_role,
            "duration": duration_stats,
        },
    }


# ---------------------------------------------------------------------------
# Module entry point
# ---------------------------------------------------------------------------

def run(ctx) -> dict[str, Any]:
    """Run hero-specific events analysis."""
    benchmarks: dict[str, Any] = {}

    rez_bench = _analyze_mercy_rez(ctx, ctx.figures_dir)
    benchmarks.update(rez_bench)

    dva_bench = _analyze_dva_remech(ctx, ctx.figures_dir)
    benchmarks.update(dva_bench)

    echo_bench = _analyze_echo_duplicate(ctx, ctx.figures_dir)
    benchmarks.update(echo_bench)

    return benchmarks
