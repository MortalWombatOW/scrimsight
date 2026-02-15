"""
Analysis pipeline orchestrator.

Loads the Parsertime dataset once, runs shared preprocessing, then invokes
each analysis module in sequence. Each module produces benchmark distributions
and figures. The pipeline merges all benchmarks into a single JSON output.

Usage:
    python -m analysis
"""

from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd

from analysis.src.data_loader import load_csv
from analysis.src.fight_detection import detect_fights
from analysis.src.preprocessing import (
    add_role_column,
    determine_match_winner,
    enrich_kills_with_match_info,
    filter_known_heroes,
    cat_ne,
)
from analysis.src.visualization import setup_style

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT_DIR = Path(__file__).parent
OUTPUT_DIR = ROOT_DIR / "outputs"
FIGURES_DIR = OUTPUT_DIR / "figures"
BENCHMARKS_DIR = OUTPUT_DIR / "benchmarks"

# ---------------------------------------------------------------------------
# Column subsets — only load what we need from the heaviest tables.
# Keeping these explicit makes memory usage predictable.
# ---------------------------------------------------------------------------
_KILL_COLS = [
    "id", "MapDataId", "scrimId", "match_time",
    "attacker_name", "attacker_team", "attacker_hero",
    "victim_name", "victim_team", "victim_hero",
    "event_ability", "event_type", "is_critical_hit",
]

_PLAYER_STAT_COLS = [
    "MapDataId", "scrimId", "round_number", "match_time",
    "player_name", "player_team", "player_hero",
    "eliminations", "final_blows", "deaths", "hero_damage_dealt",
    "healing_dealt", "damage_taken", "damage_blocked",
    "defensive_assists", "offensive_assists",
    "ultimates_earned", "ultimates_used", "hero_time_played",
]

_ASSIST_COLS = [
    "id", "MapDataId", "scrimId", "match_time",
    "player_name", "player_team", "player_hero",
    "event_type",
]


# ---------------------------------------------------------------------------
# Unified category dtype for team/player name columns.
# Saves ~5-10x memory vs object dtype on large tables. We build a shared
# category set from the Scrim table (which lists all team and player names),
# then apply it to all tables so cross-column comparisons work.
# ---------------------------------------------------------------------------

def _unify_string_columns(dfs: dict[str, pd.DataFrame]) -> None:
    """Convert team/player name columns to category dtype in place.

    Uses the union of all values seen across tables for each column group,
    so that comparisons like attacker_team != victim_team work correctly.
    """
    # Collect all unique values for each name column across all tables
    team_cols = {"attacker_team", "victim_team", "player_team",
                 "team_1_name", "team_2_name", "resurrecter_team",
                 "capturing_team"}
    player_cols = {"attacker_name", "victim_name", "player_name",
                   "resurrecter_player", "resurrectee_player"}

    for col_group in [team_cols, player_cols]:
        all_values: set[str] = set()
        for df in dfs.values():
            for col in col_group:
                if col in df.columns and df[col].dtype == "object":
                    all_values.update(df[col].dropna().unique())
        if not all_values:
            continue
        # Include "Draw" for team columns — fight_detection and preprocessing
        # use it as a sentinel value for tied fights and drawn matches.
        if col_group is team_cols:
            all_values.add("Draw")
        cat_type = pd.CategoricalDtype(categories=sorted(all_values))
        for df in dfs.values():
            for col in col_group:
                if col in df.columns and df[col].dtype == "object":
                    df[col] = df[col].astype(cat_type)


# ---------------------------------------------------------------------------
# AnalysisContext — the shared preprocessed data bag
# ---------------------------------------------------------------------------

@dataclass
class AnalysisContext:
    """Preprocessed data passed to all analysis modules.

    Heavy tables (kills, player_stats) are loaded with column pruning.
    Hero-specific and objective tables are loaded lazily on first access
    to avoid holding ~30MB in memory when only 2 modules need them.
    """

    # Core tables (always loaded)
    kills: pd.DataFrame
    valid_kills: pd.DataFrame
    player_stats: pd.DataFrame
    matches: pd.DataFrame
    fights: pd.DataFrame
    scrims: pd.DataFrame

    # Match structure
    round_start: pd.DataFrame
    round_end: pd.DataFrame

    # Ultimate events
    ult_charged: pd.DataFrame
    ult_start: pd.DataFrame
    ult_end: pd.DataFrame

    # Assist tables
    off_assists: pd.DataFrame
    def_assists: pd.DataFrame

    # Hero events (loaded lazily)
    hero_spawn: pd.DataFrame = field(default=None)
    hero_swap: pd.DataFrame = field(default=None)
    mercy_rez: pd.DataFrame = field(default=None)
    dva_remech: pd.DataFrame = field(default=None)
    remech_charged: pd.DataFrame = field(default=None)
    echo_dup_start: pd.DataFrame = field(default=None)
    echo_dup_end: pd.DataFrame = field(default=None)

    # Output paths
    figures_dir: str = str(FIGURES_DIR)
    benchmarks_dir: str = str(BENCHMARKS_DIR)

    # Lazy loading flag — set after hero events are loaded
    _hero_events_loaded: bool = field(default=False, repr=False)

    def ensure_hero_events(self) -> None:
        """Load hero-specific event tables on demand."""
        if self._hero_events_loaded:
            return
        self.hero_spawn = load_csv("HeroSpawn")
        self.hero_swap = load_csv("HeroSwap")
        self.mercy_rez = load_csv("MercyRez")
        self.dva_remech = load_csv("DvaRemech")
        self.remech_charged = load_csv("RemechCharged")
        self.echo_dup_start = load_csv("EchoDuplicateStart")
        self.echo_dup_end = load_csv("EchoDuplicateEnd")
        self._hero_events_loaded = True


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

def _build_context() -> AnalysisContext:
    """Load data, run shared preprocessing, build the AnalysisContext."""

    print("Loading CSV tables...")
    t0 = time.time()

    # Load with column pruning where beneficial
    kills = load_csv("Kill", usecols=_KILL_COLS)
    player_stats = load_csv("PlayerStat", usecols=_PLAYER_STAT_COLS)
    off_assists = load_csv("OffensiveAssist", usecols=_ASSIST_COLS)
    def_assists = load_csv("DefensiveAssist", usecols=_ASSIST_COLS)

    # Full load for smaller tables
    match_start = load_csv("MatchStart")
    match_end = load_csv("MatchEnd")
    round_start = load_csv("RoundStart")
    round_end = load_csv("RoundEnd")
    scrims = load_csv("Scrim")
    ult_charged = load_csv("UltimateCharged")
    ult_start = load_csv("UltimateStart")
    ult_end = load_csv("UltimateEnd")

    # Unify string columns to category dtype for memory savings
    all_dfs = {
        "kills": kills, "player_stats": player_stats,
        "off_assists": off_assists, "def_assists": def_assists,
        "match_start": match_start, "match_end": match_end,
        "round_start": round_start, "round_end": round_end,
        "scrims": scrims,
        "ult_charged": ult_charged, "ult_start": ult_start, "ult_end": ult_end,
    }
    _unify_string_columns(all_dfs)

    elapsed_load = time.time() - t0
    print(f"  Loaded in {elapsed_load:.1f}s")

    # --- Shared preprocessing ---
    print("Running shared preprocessing...")
    t1 = time.time()

    # Deduplicate match tables — some MapDataIds appear multiple times
    # (e.g. from reconnects or duplicate events). Keep the last occurrence
    # which has the final scores/state.
    match_start = match_start.drop_duplicates(subset="MapDataId", keep="last")
    match_end = match_end.drop_duplicates(subset="MapDataId", keep="last")

    # Match-level enrichment (map info + winner)
    matches = determine_match_winner(match_end, match_start)

    # Filter kills: inter-team, known heroes
    valid_kills = kills[
        cat_ne(kills["attacker_team"], kills["victim_team"])
    ].copy()
    valid_kills = filter_known_heroes(valid_kills, hero_cols=["attacker_hero", "victim_hero"])

    # Add roles to player_stats
    player_stats = add_role_column(player_stats, hero_col="player_hero")
    player_stats = filter_known_heroes(player_stats, hero_cols=["player_hero"])

    # Detect teamfights
    fights = detect_fights(valid_kills, time_window=15.0, min_deaths=3)

    # Enrich kills with match info (map, winner)
    valid_kills = enrich_kills_with_match_info(valid_kills, matches)

    elapsed_preprocess = time.time() - t1
    print(f"  Preprocessed in {elapsed_preprocess:.1f}s")

    # Summary stats
    n_matches = len(matches)
    n_kills = len(valid_kills)
    n_fights = len(fights)
    n_players = player_stats["player_name"].nunique()
    print(f"  Dataset: {n_matches} matches, {n_kills} valid kills, "
          f"{n_fights} fights, {n_players} unique players")

    return AnalysisContext(
        kills=kills,
        valid_kills=valid_kills,
        player_stats=player_stats,
        matches=matches,
        fights=fights,
        scrims=scrims,
        round_start=round_start,
        round_end=round_end,
        ult_charged=ult_charged,
        ult_start=ult_start,
        ult_end=ult_end,
        off_assists=off_assists,
        def_assists=def_assists,
    )


def _write_benchmarks(benchmarks: dict[str, Any]) -> None:
    """Write the merged benchmark dict to JSON."""
    os.makedirs(BENCHMARKS_DIR, exist_ok=True)
    output_path = BENCHMARKS_DIR / "training_path_benchmarks.json"

    # Add metadata
    output = {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "pipeline_version": "1.0.0",
        },
        "concepts": benchmarks,
    }

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2, default=str)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"\nWrote benchmarks to {output_path} ({size_kb:.1f} KB)")


def run() -> None:
    """Run the full analysis pipeline."""
    print("=" * 60)
    print("ScrimSight Analysis Pipeline")
    print("=" * 60)

    t_start = time.time()

    # Setup
    setup_style()
    os.makedirs(FIGURES_DIR, exist_ok=True)

    # Build shared context
    ctx = _build_context()

    # Run each analysis module, collecting benchmarks
    all_benchmarks: dict[str, Any] = {}

    # Import and run each analysis module
    # (imports are deferred so missing modules don't break the pipeline during development)
    modules = [
        ("data_exploration", "analysis.analyses.data_exploration"),
        ("deaths_per_10", "analysis.analyses.deaths_per_10"),
        ("first_death", "analysis.analyses.first_death"),
        ("ult_economy", "analysis.analyses.ult_economy"),
        ("combat_damage", "analysis.analyses.combat_damage"),
        ("hero_composition", "analysis.analyses.hero_composition"),
        ("team_performance", "analysis.analyses.team_performance"),
        ("map_analysis", "analysis.analyses.map_analysis"),
        ("hero_specific_events", "analysis.analyses.hero_specific_events"),
        ("synthesis", "analysis.analyses.synthesis"),
    ]

    for name, module_path in modules:
        try:
            import importlib
            mod = importlib.import_module(module_path)
        except ImportError:
            print(f"\n  [{name}] Module not yet implemented — skipping.")
            continue

        print(f"\n{'─' * 40}")
        print(f"Running: {name}")
        print(f"{'─' * 40}")

        t_mod = time.time()
        benchmarks = mod.run(ctx)
        elapsed = time.time() - t_mod

        if benchmarks:
            all_benchmarks.update(benchmarks)
            print(f"  → {len(benchmarks)} benchmark(s) in {elapsed:.1f}s")
        else:
            print(f"  → No benchmarks (diagnostic only) in {elapsed:.1f}s")

    # Write combined output
    _write_benchmarks(all_benchmarks)

    elapsed_total = time.time() - t_start
    print(f"\n{'=' * 60}")
    print(f"Pipeline complete in {elapsed_total:.1f}s")
    print(f"  Benchmarks: {len(all_benchmarks)} concepts")
    print(f"  Figures: {FIGURES_DIR}")
    print(f"{'=' * 60}")
