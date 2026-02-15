"""
Reusable metric calculations for Overwatch analysis.

Scalar functions operate on single values; _series variants are vectorized
for pandas DataFrames. Distribution helpers produce the standard percentile
shape used throughout the benchmark JSON output.
"""

from __future__ import annotations

import math
from typing import Any

import numpy as np
import pandas as pd


# ---------------------------------------------------------------------------
# Distribution helpers — standard shapes for benchmark JSON
# ---------------------------------------------------------------------------

_DEFAULT_PERCENTILES = [10, 25, 50, 75, 90]


def percentile_benchmarks(
    series: pd.Series,
    percentiles: list[int] = _DEFAULT_PERCENTILES,
) -> dict[str, Any]:
    """Compute percentile distribution for a numeric series.

    Returns {"p10": ..., "p25": ..., "p50": ..., "p75": ..., "p90": ..., "n": ...}
    """
    clean = series.dropna()
    if len(clean) == 0:
        return {f"p{p}": None for p in percentiles} | {"n": 0}
    result: dict[str, Any] = {}
    for p in percentiles:
        result[f"p{p}"] = round(float(np.percentile(clean, p)), 3)
    result["n"] = int(len(clean))
    return result


def percentile_rank(value: float, series: pd.Series) -> float:
    """Where a value falls in a distribution (0-100).

    Returns the percentage of values in the series that are <= value.
    Useful for telling a player "you're at the Xth percentile."
    """
    clean = series.dropna()
    if len(clean) == 0:
        return float("nan")
    return float(np.searchsorted(np.sort(clean), value) / len(clean) * 100)


def distribution_by_group(
    df: pd.DataFrame,
    value_col: str,
    group_col: str,
    percentiles: list[int] = _DEFAULT_PERCENTILES,
) -> dict[str, dict[str, Any]]:
    """Compute percentile_benchmarks for each group in a column.

    Returns {"GroupA": {"p10": ..., ...}, "GroupB": {"p10": ..., ...}, ...}
    """
    result = {}
    for group_val, group_df in df.groupby(group_col, observed=True):
        result[str(group_val)] = percentile_benchmarks(group_df[value_col], percentiles)
    return result


# ---------------------------------------------------------------------------
# Statistical helpers
# ---------------------------------------------------------------------------

def confidence_interval(p: float, n: int, z: float = 1.96) -> tuple[float, float]:
    """Binomial (Wald) confidence interval for a proportion.

    Returns (lower, upper) bounds. Useful for determining if a win rate
    is statistically distinguishable from 50%.
    """
    if n == 0:
        return (float("nan"), float("nan"))
    se = math.sqrt(p * (1 - p) / n)
    return (max(0.0, p - z * se), min(1.0, p + z * se))


def sample_size_table(
    p: float = 0.5,
    z: float = 1.96,
    margins: list[float] | None = None,
) -> dict[str, int]:
    """How many observations are needed for various margins of error.

    Returns {"±5%": 385, "±3%": 1068, ...} — useful for the "N more scrims
    to unlock" gating logic in the training path.
    """
    if margins is None:
        margins = [0.10, 0.07, 0.05, 0.03, 0.02]
    result = {}
    for m in margins:
        n_needed = math.ceil((z**2 * p * (1 - p)) / (m**2))
        result[f"±{int(m*100)}%"] = n_needed
    return result


# ---------------------------------------------------------------------------
# Core per-player metrics
# ---------------------------------------------------------------------------

def deaths_per_10(deaths: int | float, time_played_seconds: float) -> float:
    """Calculate deaths per 10 minutes from raw death count and playtime."""
    if time_played_seconds <= 0:
        return np.nan
    return deaths / (time_played_seconds / 600)


def deaths_per_10_series(deaths: pd.Series, time_played: pd.Series) -> pd.Series:
    """Vectorized deaths per 10 minutes."""
    return deaths / (time_played / 600)


def final_blow_ratio(final_blows: pd.Series, eliminations: pd.Series) -> pd.Series:
    """Final blow / elimination ratio (lethality metric)."""
    return final_blows / eliminations.replace(0, np.nan)


def per_10_series(stat: pd.Series, time_played: pd.Series) -> pd.Series:
    """Generic per-10-minutes rate for any counting stat."""
    return stat / (time_played / 600)


# ---------------------------------------------------------------------------
# Ultimate economy metrics
# ---------------------------------------------------------------------------

def ult_efficiency(ults_used: int, kills_during_ult: int) -> float:
    """Kills per ultimate used."""
    if ults_used == 0:
        return np.nan
    return kills_during_ult / ults_used


def ult_hold_time(
    ult_charged: pd.DataFrame,
    ult_start: pd.DataFrame,
) -> pd.DataFrame:
    """Compute time between ult charged and ult used for each player per match.

    Joins UltimateCharged → UltimateStart by player+match, pairing each charge
    with the next use. Returns a DataFrame with columns:
    MapDataId, player_name, player_hero, charge_time, use_time, hold_time
    """
    # Sort both by match + player + time
    charged = ult_charged.sort_values(["MapDataId", "player_name", "match_time"]).copy()
    starts = ult_start.sort_values(["MapDataId", "player_name", "match_time"]).copy()

    # Within each (match, player) group, pair the nth charge with the nth use
    charged["_seq"] = charged.groupby(["MapDataId", "player_name"]).cumcount()
    starts["_seq"] = starts.groupby(["MapDataId", "player_name"]).cumcount()

    merged = charged.merge(
        starts[["MapDataId", "player_name", "match_time", "_seq"]],
        on=["MapDataId", "player_name", "_seq"],
        suffixes=("_charged", "_used"),
        how="inner",
    )
    merged["hold_time"] = merged["match_time_used"] - merged["match_time_charged"]

    # Filter out negative hold times (data quality issues) and extreme outliers
    merged = merged[(merged["hold_time"] >= 0) & (merged["hold_time"] < 600)]

    result_cols = ["MapDataId", "player_name"]
    if "player_hero" in charged.columns:
        result_cols.append("player_hero")
    result_cols += ["match_time_charged", "match_time_used", "hold_time"]

    return merged[[c for c in result_cols if c in merged.columns]]


# ---------------------------------------------------------------------------
# Fight-level metrics
# ---------------------------------------------------------------------------

def fight_win_rate(fights: pd.DataFrame, team: str) -> float:
    """Win rate for a specific team across detected fights."""
    team_fights = fights[
        (fights["first_kill_team"] == team) | (fights["first_kill_victim_team"] == team)
    ]
    if len(team_fights) == 0:
        return np.nan
    wins = (team_fights["winner"] == team).sum()
    return wins / len(team_fights)


def first_pick_win_rate(fights: pd.DataFrame) -> dict:
    """Overall first pick win rate across all fights.

    Returns dict with rate, total fights, wins after first pick, etc.
    """
    valid = fights[fights["winner"] != "Draw"]
    if len(valid) == 0:
        return {"rate": np.nan, "total": 0}

    first_pick_wins = valid["first_pick_won"].sum()
    return {
        "rate": first_pick_wins / len(valid),
        "total_fights": len(valid),
        "first_pick_wins": int(first_pick_wins),
        "first_pick_losses": int(len(valid) - first_pick_wins),
    }


def first_death_rate(
    fights: pd.DataFrame,
    kills: pd.DataFrame,
) -> pd.DataFrame:
    """Compute how often each player is the first to die in a teamfight.

    Returns DataFrame with: player_name, role, total_fights, first_deaths,
    first_death_rate (0-1).
    """
    from analysis.src.preprocessing import HERO_ROLES

    # The first kill in each fight is already encoded in the fights df
    # The victim of the first kill is the "first death"
    valid = fights[fights["winner"] != "Draw"].copy()
    if len(valid) == 0:
        return pd.DataFrame()

    # Count first deaths per player
    first_deaths = (
        valid.groupby("first_kill_victim_hero")
        .size()
        .reset_index(name="first_deaths")
        .rename(columns={"first_kill_victim_hero": "hero"})
    )
    first_deaths["role"] = first_deaths["hero"].map(HERO_ROLES).fillna("Unknown")

    return first_deaths


def entry_pick_rate(
    fights: pd.DataFrame,
) -> pd.DataFrame:
    """Compute how often each role/hero gets the opening kill in fights.

    Returns DataFrame with: hero, role, entry_picks, total_fights, entry_pick_rate.
    """
    from analysis.src.preprocessing import HERO_ROLES

    valid = fights[fights["winner"] != "Draw"].copy()
    if len(valid) == 0:
        return pd.DataFrame()

    total_fights = len(valid)

    entry_picks = (
        valid.groupby("first_kill_hero")
        .size()
        .reset_index(name="entry_picks")
        .rename(columns={"first_kill_hero": "hero"})
    )
    entry_picks["role"] = entry_picks["hero"].map(HERO_ROLES).fillna("Unknown")
    entry_picks["total_fights"] = total_fights
    entry_picks["entry_pick_rate"] = entry_picks["entry_picks"] / total_fights

    return entry_picks


def stagger_rate(
    kills: pd.DataFrame,
    fights: pd.DataFrame,
) -> pd.DataFrame:
    """Compute deaths outside of teamfight windows (stagger kills).

    A high stagger rate indicates poor regroup discipline — players dying
    between teamfights when they should be regrouping. Returns DataFrame
    with per-team stagger rates.
    """
    if len(fights) == 0 or len(kills) == 0:
        return pd.DataFrame()

    # Tag kills that fall within any fight window
    fight_ranges = fights[["MapDataId", "fight_start", "fight_end"]].copy()

    # For each kill, check if it's inside any fight in its match
    tagged = kills.merge(fight_ranges, on="MapDataId", how="left")
    in_fight = (
        (tagged["match_time"] >= tagged["fight_start"])
        & (tagged["match_time"] <= tagged["fight_end"])
    )
    tagged["in_fight"] = in_fight

    # A kill is a stagger if it's not inside any fight
    stagger_mask = ~tagged.groupby(tagged.index)["in_fight"].any()
    kills_with_stagger = kills.copy()
    kills_with_stagger["is_stagger"] = stagger_mask

    # Per-team stagger rate (deaths outside fights / total deaths)
    team_stats = (
        kills_with_stagger.groupby("victim_team", observed=True)
        .agg(total_deaths=("is_stagger", "size"), stagger_deaths=("is_stagger", "sum"))
        .reset_index()
    )
    team_stats["stagger_rate"] = team_stats["stagger_deaths"] / team_stats["total_deaths"]

    return team_stats


# ---------------------------------------------------------------------------
# Trend helpers
# ---------------------------------------------------------------------------

def rolling_metric(
    series: pd.Series,
    window: int = 3,
    min_periods: int = 1,
) -> pd.Series:
    """Rolling average for tracking metric trends over time."""
    return series.rolling(window=window, min_periods=min_periods).mean()
