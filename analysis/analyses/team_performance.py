"""
Team Performance Analysis

Individual skill matters, but team coordination, consistency, and improvement
over time separate good teams from great ones. This module quantifies team-level
performance using aggregated stats, fight outcomes, and longitudinal trends.

Key findings from the Parsertime analysis:
- Deaths/10 is the strongest single predictor of match outcomes.
- Teams that consistently secure first picks win significantly more fights.
- A simple logistic regression on 4 stats achieves ~65% match prediction accuracy.
- Teams with enough history show measurable improvement over time.
- Win rate distribution clusters around 40-60% — the dataset is balanced.

This module produces:
- Team win rate distribution and consistency (volatility)
- Performance predictor correlations (which stats predict winning)
- Winner vs loser distributions for top predictors
- Team improvement over time (rolling win rate)
- First pick rate vs fight win rate (team-level)
- Team fight win rate (TFWR) distributions
"""

from __future__ import annotations

from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy import stats

from analysis.src.metrics import (
    deaths_per_10_series,
    percentile_benchmarks,
)
from analysis.src.preprocessing import HERO_ROLES
from analysis.src.visualization import (
    OW_COLORS,
    ROLE_COLORS,
    save_fig,
)

MIN_TEAM_MATCHES = 10


# ---------------------------------------------------------------------------
# Data preparation
# ---------------------------------------------------------------------------

def _build_team_records(ctx) -> pd.DataFrame:
    """One row per team per match with outcome and score differential."""
    records = []
    scrims = ctx.scrims
    # Parse scrim dates if available
    if "date" in scrims.columns:
        scrims = scrims.copy()
        scrims["date_parsed"] = pd.to_datetime(scrims["date"], format="mixed", errors="coerce")
        date_map = dict(zip(scrims["id"].astype(str), scrims["date_parsed"]))
    else:
        date_map = {}

    for _, m in ctx.matches.iterrows():
        winner = str(m["winner"])
        if winner == "Draw":
            continue
        t1, t2 = str(m["team_1_name"]), str(m["team_2_name"])
        s1 = m.get("team_1_score", 0) or 0
        s2 = m.get("team_2_score", 0) or 0
        scrim_date = date_map.get(str(m.get("scrimId", "")))
        base = {"MapDataId": m["MapDataId"], "date": scrim_date}

        records.append({**base, "team": t1, "won": winner == t1,
                        "score_diff": s1 - s2})
        records.append({**base, "team": t2, "won": winner == t2,
                        "score_diff": s2 - s1})

    return pd.DataFrame(records)


def _build_team_match_stats(ctx) -> pd.DataFrame:
    """Aggregate PlayerStat to team-match level with per-10 rates."""
    ps = ctx.player_stats.copy()
    tms = ps.groupby(["MapDataId", "player_team"], observed=True).agg(
        total_elims=("eliminations", "sum"),
        total_fb=("final_blows", "sum"),
        total_deaths=("deaths", "sum"),
        total_damage=("hero_damage_dealt", "sum"),
        total_healing=("healing_dealt", "sum"),
        total_time=("hero_time_played", "sum"),
        ults_earned=("ultimates_earned", "sum"),
        ults_used=("ultimates_used", "sum"),
    ).reset_index()

    tms["d10"] = deaths_per_10_series(tms["total_deaths"], tms["total_time"])
    time_10 = tms["total_time"] / 600
    tms["damage_per_10"] = tms["total_damage"] / time_10.replace(0, np.nan)
    tms["healing_per_10"] = tms["total_healing"] / time_10.replace(0, np.nan)
    tms["fb_ratio"] = tms["total_fb"] / tms["total_elims"].replace(0, np.nan)

    # Merge win/loss
    outcomes = []
    for _, m in ctx.matches.iterrows():
        winner = str(m["winner"])
        outcomes.append({"MapDataId": m["MapDataId"],
                         "player_team": str(m["team_1_name"]),
                         "won": 1 if winner == str(m["team_1_name"]) else 0})
        outcomes.append({"MapDataId": m["MapDataId"],
                         "player_team": str(m["team_2_name"]),
                         "won": 1 if winner == str(m["team_2_name"]) else 0})
    outcomes_df = pd.DataFrame(outcomes)

    # Convert player_team to string for safe merge
    tms["player_team"] = tms["player_team"].astype(str)
    tms = tms.merge(outcomes_df, on=["MapDataId", "player_team"], how="inner")
    return tms.dropna(subset=["d10", "damage_per_10", "healing_per_10"])


def _build_team_fight_stats(ctx) -> pd.DataFrame:
    """Per-team fight aggregates: first pick rate, first death rate, TFWR."""
    fights = ctx.fights
    # Identify active teams (enough matches)
    all_teams = set(fights["first_kill_team"].astype(str).unique()) | \
                set(fights["winner"].astype(str).unique())

    records = []
    for team in all_teams:
        if team in ("Draw", "nan", "None", ""):
            continue
        team_fights = fights[
            (fights["first_kill_team"].astype(str) == team) |
            (fights["first_kill_victim_team"].astype(str) == team) |
            (fights["winner"].astype(str) == team)
        ]
        # More precise: team participated if any of its players killed or died
        # Using fight winner/loser columns as proxy
        n = len(team_fights)
        if n < 10:
            continue
        first_picks = (team_fights["first_kill_team"].astype(str) == team).sum()
        first_deaths = (team_fights["first_kill_victim_team"].astype(str) == team).sum()
        wins = (team_fights["winner"].astype(str) == team).sum()

        records.append({
            "team": team,
            "total_fights": n,
            "first_pick_rate": first_picks / n,
            "first_death_rate": first_deaths / n,
            "fight_win_rate": wins / n,
        })

    return pd.DataFrame(records)


# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------

def _fig_win_rate_distribution(team_summary: pd.DataFrame, output_dir: str) -> None:
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    axes[0].hist(team_summary["win_rate"], bins=20, color=OW_COLORS["blue"],
                 edgecolor=OW_COLORS["dark_blue"], alpha=0.9)
    axes[0].axvline(0.5, color=OW_COLORS["red"], linestyle="--", linewidth=2, label="50% baseline")
    axes[0].axvline(team_summary["win_rate"].mean(), color=OW_COLORS["gold"], linestyle="--",
                    linewidth=2, label=f"Mean: {team_summary['win_rate'].mean():.1%}")
    axes[0].set_xlabel("Win Rate")
    axes[0].set_ylabel("Number of Teams")
    axes[0].set_title(f"Team Win Rate Distribution (n={len(team_summary)})")
    axes[0].legend()

    scatter = axes[1].scatter(team_summary["win_rate"], team_summary["score_diff_std"],
                              c=team_summary["matches"], cmap="YlOrRd", s=60, alpha=0.7,
                              edgecolors=OW_COLORS["dark_blue"], linewidths=0.5)
    axes[1].set_xlabel("Win Rate")
    axes[1].set_ylabel("Score Differential Std Dev (Volatility)")
    axes[1].set_title("Win Rate vs Performance Consistency")
    plt.colorbar(scatter, ax=axes[1], label="Matches Played")

    plt.tight_layout()
    save_fig(fig, "07_team_win_rates", output_dir)


def _fig_win_correlations(tms: pd.DataFrame, output_dir: str) -> dict:
    """Which stats correlate with winning? Returns correlation dict for benchmarks."""
    predictor_cols = ["d10", "damage_per_10", "healing_per_10", "fb_ratio",
                      "total_elims", "total_deaths", "ults_earned", "ults_used"]

    correlations = []
    for col in predictor_cols:
        valid = tms[[col, "won"]].dropna()
        if len(valid) < 10:
            continue
        r, p = stats.pointbiserialr(valid["won"], valid[col])
        correlations.append({"metric": col, "correlation": r, "p_value": p, "n": len(valid)})

    corr_df = pd.DataFrame(correlations).sort_values("correlation", key=abs, ascending=False)

    fig, ax = plt.subplots(figsize=(10, 6))
    colors = [OW_COLORS["green"] if c > 0 else OW_COLORS["red"] for c in corr_df["correlation"]]
    bars = ax.barh(corr_df["metric"], corr_df["correlation"], color=colors, alpha=0.85)

    for bar, (_, row) in zip(bars, corr_df.iterrows()):
        x_pos = bar.get_width() + (0.01 if bar.get_width() >= 0 else -0.01)
        ha = "left" if bar.get_width() >= 0 else "right"
        ax.text(x_pos, bar.get_y() + bar.get_height() / 2,
                f"r={row['correlation']:.3f}", va="center", ha=ha, fontsize=10)

    ax.axvline(0, color=OW_COLORS["light_gray"], linewidth=0.5)
    ax.set_xlabel("Point-Biserial Correlation with Winning")
    ax.set_title("Which Stats Predict Winning?", fontsize=14, fontweight="bold")
    plt.tight_layout()
    save_fig(fig, "07_win_correlations", output_dir)

    return {row["metric"]: round(float(row["correlation"]), 4)
            for _, row in corr_df.iterrows()}


def _fig_predictor_distributions(tms: pd.DataFrame, output_dir: str) -> None:
    top_metrics = ["d10", "total_elims", "damage_per_10", "healing_per_10"]
    fig, axes = plt.subplots(2, 2, figsize=(14, 12))

    for ax, metric in zip(axes.flatten(), top_metrics):
        winners = tms[tms["won"] == 1][metric].dropna()
        losers = tms[tms["won"] == 0][metric].dropna()

        ax.hist(winners, bins=40, alpha=0.6, color=OW_COLORS["green"],
                label=f"Winners (mean={winners.mean():.1f})", density=True)
        ax.hist(losers, bins=40, alpha=0.6, color=OW_COLORS["red"],
                label=f"Losers (mean={losers.mean():.1f})", density=True)
        ax.set_xlabel(metric)
        ax.set_ylabel("Density")
        ax.set_title(f"{metric}: Winners vs Losers")
        ax.legend()

    plt.suptitle("Distribution of Top Predictive Stats: Winners vs Losers",
                 fontsize=15, fontweight="bold", y=1.01)
    plt.tight_layout()
    save_fig(fig, "07_predictor_distributions", output_dir)


def _fig_improvement_over_time(team_df: pd.DataFrame, output_dir: str) -> None:
    """Rolling win rate for teams with longitudinal data."""
    team_time = team_df.dropna(subset=["date"]).copy()
    if team_time.empty:
        return
    team_time = team_time.sort_values(["team", "date"])

    team_spans = team_time.groupby("team").agg(
        matches=("won", "count"),
        first_match=("date", "min"),
        last_match=("date", "max"),
    )
    team_spans["span_days"] = (team_spans["last_match"] - team_spans["first_match"]).dt.days
    longitudinal = team_spans[(team_spans["matches"] >= 20) & (team_spans["span_days"] >= 14)]

    if longitudinal.empty:
        return

    top_teams = longitudinal.sort_values("matches", ascending=False).head(6).index.tolist()

    fig, axes = plt.subplots(2, 3, figsize=(18, 10))
    axes_flat = axes.flatten()

    for i, team in enumerate(top_teams[:6]):
        ax = axes_flat[i]
        tdata = team_time[team_time["team"] == team].sort_values("date").reset_index(drop=True)
        tdata["match_num"] = range(1, len(tdata) + 1)
        window = max(3, min(10, len(tdata) // 3))
        tdata["rolling_wr"] = tdata["won"].astype(float).rolling(window, min_periods=3).mean()

        ax.plot(tdata["match_num"], tdata["rolling_wr"], color=OW_COLORS["orange"], linewidth=2)
        ax.fill_between(tdata["match_num"], tdata["rolling_wr"], 0.5,
                        where=tdata["rolling_wr"] >= 0.5, alpha=0.2, color=OW_COLORS["green"])
        ax.fill_between(tdata["match_num"], tdata["rolling_wr"], 0.5,
                        where=tdata["rolling_wr"] < 0.5, alpha=0.2, color=OW_COLORS["red"])
        ax.axhline(0.5, color=OW_COLORS["light_gray"], linestyle="--", alpha=0.5)
        ax.set_ylim(0, 1)
        ax.set_xlabel("Match #")
        ax.set_ylabel("Win Rate")
        short = team[:12] + "..." if len(str(team)) > 12 else str(team)
        ax.set_title(f"{short} ({len(tdata)} matches)", fontsize=11)

    # Hide unused subplots
    for j in range(len(top_teams), 6):
        axes_flat[j].set_visible(False)

    plt.suptitle(f"Rolling Win Rate Over Time (window={window})",
                 fontsize=15, fontweight="bold", y=1.02)
    plt.tight_layout()
    save_fig(fig, "07_improvement_over_time", output_dir)


def _fig_first_pick_vs_fight_wr(fight_stats: pd.DataFrame, output_dir: str) -> None:
    if fight_stats.empty:
        return

    fig, ax = plt.subplots(figsize=(10, 8))
    scatter = ax.scatter(
        fight_stats["first_pick_rate"], fight_stats["fight_win_rate"],
        c=fight_stats["total_fights"], cmap="YlOrRd", s=80, alpha=0.8,
        edgecolors=OW_COLORS["dark_blue"], linewidths=0.5,
    )

    slope, intercept, r, p, se = stats.linregress(
        fight_stats["first_pick_rate"], fight_stats["fight_win_rate"],
    )
    x_line = np.linspace(fight_stats["first_pick_rate"].min(),
                         fight_stats["first_pick_rate"].max())
    ax.plot(x_line, slope * x_line + intercept, color=OW_COLORS["gold"],
            linestyle="--", label=f"r={r:.2f}, p={p:.2e}")

    ax.set_xlabel("First Pick Rate")
    ax.set_ylabel("Fight Win Rate")
    ax.set_title("First Pick Rate vs Fight Win Rate by Team", fontsize=14, fontweight="bold")
    plt.colorbar(scatter, label="Total Fights")
    ax.legend()
    plt.tight_layout()
    save_fig(fig, "07_first_pick_vs_fight_wr", output_dir)


# ---------------------------------------------------------------------------
# Benchmarks
# ---------------------------------------------------------------------------

def _compute_benchmarks(team_summary: pd.DataFrame, tms: pd.DataFrame,
                        fight_stats: pd.DataFrame,
                        correlations: dict) -> dict[str, Any]:
    # --- Team win rate distribution ---
    wr_dist = percentile_benchmarks(team_summary["win_rate"])

    # --- TFWR distribution ---
    tfwr_dist = {}
    if not fight_stats.empty:
        tfwr_dist = percentile_benchmarks(fight_stats["fight_win_rate"])

    # --- Team-level D/10 distribution ---
    team_d10 = tms.groupby("player_team", observed=True)["d10"].mean()
    team_d10_dist = percentile_benchmarks(team_d10)

    # --- First pick rate distribution ---
    fpr_dist = {}
    if not fight_stats.empty:
        fpr_dist = percentile_benchmarks(fight_stats["first_pick_rate"])

    # --- Winner vs loser stat gaps ---
    stat_gaps = {}
    for col in ["d10", "damage_per_10", "healing_per_10", "fb_ratio"]:
        w = tms[tms["won"] == 1][col].dropna()
        l = tms[tms["won"] == 0][col].dropna()
        if len(w) > 0 and len(l) > 0:
            stat_gaps[col] = {
                "winner_mean": round(float(w.mean()), 2),
                "loser_mean": round(float(l.mean()), 2),
                "gap": round(float(w.mean() - l.mean()), 2),
            }

    return {
        "team_fight_win_rate": {
            "description": "Teamfight win rate (TFWR) — the most direct measure of team coordination",
            "team_distribution": {
                "overall": tfwr_dist,
            },
        },
        "team_performance_predictors": {
            "description": "Which in-game stats predict winning — correlation strengths and winner/loser gaps",
            "correlations": correlations,
            "winner_vs_loser": stat_gaps,
            "team_d10_distribution": team_d10_dist,
        },
        "first_pick_rate_team": {
            "description": "Team-level first pick rate — how often a team secures the opening kill in fights",
            "team_distribution": {
                "overall": fpr_dist,
            },
        },
    }


# ---------------------------------------------------------------------------
# Module entry point
# ---------------------------------------------------------------------------

def run(ctx) -> dict[str, Any]:
    """Run team performance analysis."""
    team_df = _build_team_records(ctx)
    tms = _build_team_match_stats(ctx)
    fight_stats = _build_team_fight_stats(ctx)

    # Team summary for win rate distribution
    team_summary = team_df.groupby("team").agg(
        matches=("won", "count"),
        wins=("won", "sum"),
        avg_score_diff=("score_diff", "mean"),
        score_diff_std=("score_diff", "std"),
    ).reset_index()
    team_summary["win_rate"] = team_summary["wins"] / team_summary["matches"]
    active = team_summary[team_summary["matches"] >= MIN_TEAM_MATCHES]

    print(f"  Total teams: {len(team_summary):,}")
    print(f"  Teams with >= {MIN_TEAM_MATCHES} matches: {len(active):,}")
    print(f"  Team-match records: {len(tms):,}")
    print(f"  Teams with fight data: {len(fight_stats):,}")

    _fig_win_rate_distribution(active, ctx.figures_dir)
    correlations = _fig_win_correlations(tms, ctx.figures_dir)
    _fig_predictor_distributions(tms, ctx.figures_dir)
    _fig_improvement_over_time(team_df, ctx.figures_dir)
    _fig_first_pick_vs_fight_wr(fight_stats, ctx.figures_dir)

    return _compute_benchmarks(active, tms, fight_stats, correlations)
