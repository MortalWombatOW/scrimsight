"""
Loads and caches all Parsertime CSV tables with optimized dtypes.

The dataset follows a hierarchy: Scrim → Match (via MapDataId/scrimId) → Round → Events.
Most event tables share common columns (id, scrimId, event_type, match_time, MapDataId)
and are linked to matches via MapDataId.
"""

import os
from functools import lru_cache
from pathlib import Path

import pandas as pd

DATA_DIR = Path(__file__).parent.parent / "data"

# Columns that should be categorical for memory efficiency.
# Excludes attacker/victim team/name since they're cross-compared
# and pandas requires identical category sets for categorical comparisons.
CATEGORICAL_COLS = {
    "event_type", "player_team", "player_hero", "previous_hero",
    "attacker_hero", "victim_hero",
    "event_ability", "map_name", "map_type",
    "team_1_name", "team_2_name", "capturing_team",
    "hero_duplicated",
}


def _optimize_dtypes(df: pd.DataFrame) -> pd.DataFrame:
    """Convert string columns to category dtype where appropriate."""
    for col in df.columns:
        if col in CATEGORICAL_COLS and df[col].dtype == "object":
            df[col] = df[col].astype("category")
    return df


def load_csv(name: str, usecols: list[str] | None = None) -> pd.DataFrame:
    """Load a single CSV by table name (e.g., 'Kill', 'PlayerStat')."""
    path = DATA_DIR / f"{name}.csv"
    if not path.exists():
        raise FileNotFoundError(f"CSV not found: {path}")
    df = pd.read_csv(path, usecols=usecols)
    return _optimize_dtypes(df)


# Table names grouped by category
EVENT_TABLES = [
    "Kill", "DefensiveAssist", "OffensiveAssist",
    "UltimateCharged", "UltimateStart", "UltimateEnd",
    "HeroSpawn", "HeroSwap", "MercyRez",
    "DvaRemech", "RemechCharged",
    "EchoDuplicateStart", "EchoDuplicateEnd",
]

MATCH_TABLES = [
    "Scrim", "MatchStart", "MatchEnd",
    "RoundStart", "RoundEnd", "SetupComplete",
]

OBJECTIVE_TABLES = [
    "ObjectiveCaptured", "ObjectiveUpdated",
    "PayloadProgress", "PointProgress",
]

ALL_TABLES = EVENT_TABLES + MATCH_TABLES + OBJECTIVE_TABLES + ["PlayerStat"]


@lru_cache(maxsize=1)
def load_all() -> dict[str, pd.DataFrame]:
    """Load all 24 CSVs into a dict keyed by table name."""
    tables = {}
    for name in ALL_TABLES:
        tables[name] = load_csv(name)
    return tables


def load_kills() -> pd.DataFrame:
    return load_csv("Kill")


def load_player_stats() -> pd.DataFrame:
    return load_csv("PlayerStat")


def load_matches() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Load MatchStart and MatchEnd tables."""
    return load_csv("MatchStart"), load_csv("MatchEnd")


def load_ultimates() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Load UltimateCharged, UltimateStart, UltimateEnd."""
    return (
        load_csv("UltimateCharged"),
        load_csv("UltimateStart"),
        load_csv("UltimateEnd"),
    )


def load_rounds() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Load RoundStart and RoundEnd tables."""
    return load_csv("RoundStart"), load_csv("RoundEnd")
