"""
Reusable metric calculations for Overwatch analysis.
"""

import pandas as pd
import numpy as np


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


def ult_efficiency(ults_used: int, kills_during_ult: int) -> float:
    """Kills per ultimate used."""
    if ults_used == 0:
        return np.nan
    return kills_during_ult / ults_used


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
    """
    Calculate overall first pick win rate across all fights.
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
