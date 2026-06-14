"""
Feature engineering for fight outcome prediction.

Builds an intentional feature matrix from controllable strategic decisions only.
No player or team identity features — every feature represents something
a coach can instruct a team to change.

Feature groups:
1. Composition Strategy — comp archetype, matchup, role distribution
2. Ultimate Economy — ults available/used at fight boundaries
3. Fight Tempo — inter-fight gaps, fight sequence, engagement roles
4. Cascading Effects — lagged features from previous fight
"""

from __future__ import annotations

import time
from typing import Any

import numpy as np
import pandas as pd

from analysis.src.preprocessing import (
    HERO_ROLES,
    classify_composition,
)

# Buffer before fight_start to count ults used "in" the fight (ults often initiate)
ULT_BUFFER_BEFORE = 3.0

DEFENSIVE_SUPPORT_HEROES = {"Zenyatta", "Lucio", "Lifeweaver", "Brigitte"}


# ---------------------------------------------------------------------------
# 1. Fight-time Composition Tracking
# ---------------------------------------------------------------------------

def _compute_fight_compositions(
    fights: pd.DataFrame,
    hero_spawn: pd.DataFrame,
    hero_swap: pd.DataFrame,
    matches: pd.DataFrame,
) -> pd.DataFrame:
    """Determine active hero compositions at each fight's start time.

    Algorithm:
    1. Merge HeroSpawn + HeroSwap into a unified hero event timeline.
    2. Pre-index by MapDataId for O(1) match lookup.
    3. For each fight, find each player's most recent hero event
       before fight_start using groupby().last() on the filtered timeline.
    4. Group players by team, classify composition archetype.

    Returns DataFrame with columns:
        fight_id, team, heroes, archetype, n_tank, n_dps, n_support, n_players
    """
    cols = ["MapDataId", "match_time", "player_name", "player_team", "player_hero"]
    hero_events = pd.concat([
        hero_spawn[cols],
        hero_swap[cols],
    ], ignore_index=True)
    hero_events = hero_events.sort_values(
        ["MapDataId", "player_name", "match_time"]
    ).reset_index(drop=True)

    # Pre-index by match for fast lookup
    events_by_match = dict(list(hero_events.groupby("MapDataId", observed=True)))

    # Team lookup
    match_teams = matches[["MapDataId", "team_1_name", "team_2_name"]].drop_duplicates("MapDataId")
    team_lookup = match_teams.set_index("MapDataId")

    records = []
    for _, fight in fights.iterrows():
        map_id = fight["MapDataId"]
        t = fight["fight_start"]
        fight_id = fight["fight_id"]

        match_events = events_by_match.get(map_id)
        if match_events is None or len(match_events) == 0:
            continue

        # Most recent hero event per player before fight start
        before = match_events[match_events["match_time"] <= t]
        if len(before) == 0:
            continue
        active_heroes = before.groupby("player_name").last().reset_index()

        if map_id not in team_lookup.index:
            continue
        teams = team_lookup.loc[map_id]

        for team_col in ["team_1_name", "team_2_name"]:
            team_name = str(teams[team_col])
            team_df = active_heroes[active_heroes["player_team"].astype(str) == team_name]
            heroes = team_df["player_hero"].tolist()
            if not heroes:
                continue

            roles = [HERO_ROLES.get(str(h), "Unknown") for h in heroes]
            records.append({
                "fight_id": fight_id,
                "team": team_name,
                "heroes": heroes,
                "archetype": classify_composition([str(h) for h in heroes]),
                "n_tank": roles.count("Tank"),
                "n_dps": roles.count("DPS"),
                "n_support": roles.count("Support"),
                "n_players": len(heroes),
            })

    return pd.DataFrame(records)


# ---------------------------------------------------------------------------
# 2. Ult Availability Tracking
# ---------------------------------------------------------------------------

def _compute_ult_availability(
    fights: pd.DataFrame,
    ult_charged: pd.DataFrame,
    ult_start: pd.DataFrame,
    matches: pd.DataFrame,
) -> pd.DataFrame:
    """Compute per-team ult availability at each fight's start time.

    Algorithm:
    1. Build per-player ult state timeline from charge (+1) and use (-1) events.
    2. Cumulative sum gives running ult count per player (clipped to 0-1).
    3. For each fight, look up each player's state at fight_start via
       groupby().last() on events before that time, then sum by team.
    4. Also counts ults used during the fight window for economy features.

    Returns DataFrame with columns:
        fight_id, team, ults_available, ults_used_in_fight
    """
    charge_cols = ["MapDataId", "match_time", "player_name", "player_team", "player_hero"]
    charges = ult_charged[charge_cols].copy()
    charges["delta"] = 1
    uses = ult_start[charge_cols].copy()
    uses["delta"] = -1

    ult_events = pd.concat([charges, uses], ignore_index=True)
    ult_events = ult_events.sort_values(
        ["MapDataId", "player_name", "match_time"]
    ).reset_index(drop=True)

    # Running ult state per player (0 or 1)
    ult_events["ult_available"] = (
        ult_events.groupby(["MapDataId", "player_name"])["delta"]
        .cumsum()
        .clip(0, 1)
    )
    
    # Map player hero to role for ult availability
    ult_events["player_role"] = ult_events["player_hero"].map(HERO_ROLES).fillna("Unknown")

    events_by_match = dict(list(ult_events.groupby("MapDataId", observed=True)))
    uses_by_match = dict(list(ult_start.groupby("MapDataId", observed=True)))

    match_teams = matches[["MapDataId", "team_1_name", "team_2_name"]].drop_duplicates("MapDataId")
    team_lookup = match_teams.set_index("MapDataId")

    records = []
    for _, fight in fights.iterrows():
        map_id = fight["MapDataId"]
        fight_id = fight["fight_id"]
        fight_start = fight["fight_start"]
        fight_end = fight["fight_end"]

        if map_id not in team_lookup.index:
            continue
        teams = team_lookup.loc[map_id]

        # Ult availability at fight start
        match_events = events_by_match.get(map_id)
        if match_events is not None and len(match_events) > 0:
            before = match_events[match_events["match_time"] <= fight_start]
            player_states = before.groupby("player_name").last() if len(before) > 0 else pd.DataFrame()
        else:
            player_states = pd.DataFrame()

        # Ults used during fight window
        match_uses = uses_by_match.get(map_id)
        if match_uses is not None:
            fight_uses = match_uses[
                (match_uses["match_time"] >= fight_start - ULT_BUFFER_BEFORE)
                & (match_uses["match_time"] <= fight_end)
            ]
        else:
            fight_uses = pd.DataFrame()

        for team_col in ["team_1_name", "team_2_name"]:
            team_name = str(teams[team_col])

            # Sum available ults for this team's players
            if len(player_states) > 0 and "player_team" in player_states.columns:
                team_players = player_states[
                    player_states["player_team"].astype(str) == team_name
                ]
                ults_avail = int(team_players["ult_available"].sum()) if len(team_players) > 0 else 0
                
                # Breakdown by role
                avail_players = team_players[team_players["ult_available"] > 0]
                roles_avail = avail_players["player_role"].tolist()
                tank_ults = roles_avail.count("Tank")
                dps_ults = roles_avail.count("DPS")
                supp_ults = roles_avail.count("Support")
                
                def_supp_ults = sum(1 for r, h in zip(roles_avail, avail_players["player_hero"]) if r == "Support" and h in DEFENSIVE_SUPPORT_HEROES)
                off_supp_ults = supp_ults - def_supp_ults
            else:
                ults_avail = 0
                tank_ults = 0
                dps_ults = 0
                supp_ults = 0
                def_supp_ults = 0
                off_supp_ults = 0

            # Count ults used in fight
            if len(fight_uses) > 0:
                team_fight_uses = fight_uses[fight_uses["player_team"].astype(str) == team_name]
                ults_used = int(len(team_fight_uses))
            else:
                ults_used = 0

            records.append({
                "fight_id": fight_id,
                "team": team_name,
                "ults_available": ults_avail,
                "tank_ults_available": tank_ults,
                "dps_ults_available": dps_ults,
                "support_ults_available": supp_ults,
                "defensive_support_ults_available": def_supp_ults,
                "offensive_support_ults_available": off_supp_ults,
                "ults_used_in_fight": ults_used,
            })

    return pd.DataFrame(records)


# ---------------------------------------------------------------------------
# 3. Base Fight Records
# ---------------------------------------------------------------------------

def _build_base_fight_records(
    fights: pd.DataFrame,
    matches: pd.DataFrame,
) -> pd.DataFrame:
    """Build base records: one row per team per fight with target label.

    Skips drawn fights (ambiguous target).
    """
    match_info = matches[
        ["MapDataId", "team_1_name", "team_2_name", "map_type"]
    ].drop_duplicates("MapDataId")
    f = fights.merge(match_info, on="MapDataId", how="inner")

    records = []
    for _, fight in f.iterrows():
        winner = str(fight["winner"])
        if winner == "Draw":
            continue

        t1, t2 = str(fight["team_1_name"]), str(fight["team_2_name"])
        shared = {
            "fight_id": fight["fight_id"],
            "MapDataId": fight["MapDataId"],
            "map_type": str(fight["map_type"]) if pd.notna(fight.get("map_type")) else "Unknown",
            "fight_start": fight["fight_start"],
            "fight_end": fight["fight_end"],
            "fight_duration": fight["fight_duration"],
            "total_kills": fight["total_kills"],
            "first_kill_team": str(fight["first_kill_team"]),
            "first_kill_victim_team": str(fight["first_kill_victim_team"]),
            "first_kill_hero": str(fight["first_kill_hero"]),
            "first_kill_victim_hero": str(fight["first_kill_victim_hero"]),
            "first_kill_time": fight.get("first_kill_time", fight["fight_start"]),
        }
        for team, opp in [(t1, t2), (t2, t1)]:
            records.append({**shared, "team": team, "opp_team": opp, "won": int(winner == team)})

    return pd.DataFrame(records)


# ---------------------------------------------------------------------------
# 4. Join Features onto Base
# ---------------------------------------------------------------------------

def _join_composition_features(
    base: pd.DataFrame,
    compositions: pd.DataFrame,
) -> pd.DataFrame:
    """Add comp archetype, role distribution, matchup, and player advantage."""
    # Team's own composition
    team_comp = compositions[
        ["fight_id", "team", "archetype", "n_tank", "n_dps", "n_support", "n_players"]
    ].rename(columns={"archetype": "comp_archetype"})
    base = base.merge(team_comp, on=["fight_id", "team"], how="left")

    # Opponent composition
    opp_comp = compositions[
        ["fight_id", "team", "archetype", "n_players"]
    ].rename(columns={"archetype": "opp_comp_archetype", "team": "opp_team", "n_players": "opp_n_players"})
    base = base.merge(opp_comp, on=["fight_id", "opp_team"], how="left")

    # Derived
    base["comp_matchup"] = (
        base["comp_archetype"].fillna("Unknown") + "_vs_" + base["opp_comp_archetype"].fillna("Unknown")
    )
    base["player_advantage"] = base["n_players"].fillna(5) - base["opp_n_players"].fillna(5)

    return base


def _join_ult_features(
    base: pd.DataFrame,
    ult_state: pd.DataFrame,
) -> pd.DataFrame:
    """Add ult availability, ult advantage, dry fight flag."""
    # Team ults
    base = base.merge(
        ult_state[["fight_id", "team", "ults_available", "tank_ults_available", "dps_ults_available", 
                   "support_ults_available", "defensive_support_ults_available", "offensive_support_ults_available", 
                   "ults_used_in_fight"]],
        on=["fight_id", "team"], how="left",
    )

    # Opponent ults
    opp_ults = ult_state.rename(columns={
        "ults_available": "opp_ults_available",
        "tank_ults_available": "opp_tank_ults_available",
        "dps_ults_available": "opp_dps_ults_available",
        "support_ults_available": "opp_support_ults_available",
        "defensive_support_ults_available": "opp_defensive_support_ults_available",
        "offensive_support_ults_available": "opp_offensive_support_ults_available",
        "ults_used_in_fight": "opp_ults_used_in_fight",
        "team": "opp_team",
    })
    base = base.merge(
        opp_ults[["fight_id", "opp_team", "opp_ults_available", "opp_tank_ults_available", 
                  "opp_dps_ults_available", "opp_support_ults_available", 
                  "opp_defensive_support_ults_available", "opp_offensive_support_ults_available", 
                  "opp_ults_used_in_fight"]],
        on=["fight_id", "opp_team"], how="left",
    )

    for col in [
        "ults_available", "opp_ults_available", 
        "tank_ults_available", "opp_tank_ults_available",
        "dps_ults_available", "opp_dps_ults_available",
        "support_ults_available", "opp_support_ults_available",
        "defensive_support_ults_available", "opp_defensive_support_ults_available",
        "offensive_support_ults_available", "opp_offensive_support_ults_available",
        "ults_used_in_fight", "opp_ults_used_in_fight"
    ]:
        base[col] = base[col].fillna(0).astype(int)

    base["ult_advantage"] = base["ults_available"] - base["opp_ults_available"]
    base["tank_ult_advantage"] = base["tank_ults_available"] - base["opp_tank_ults_available"]
    base["dps_ult_advantage"] = base["dps_ults_available"] - base["opp_dps_ults_available"]
    base["support_ult_advantage"] = base["support_ults_available"] - base["opp_support_ults_available"]
    base["defensive_support_ult_advantage"] = base["defensive_support_ults_available"] - base["opp_defensive_support_ults_available"]
    base["offensive_support_ult_advantage"] = base["offensive_support_ults_available"] - base["opp_offensive_support_ults_available"]
    
    base["is_dry_fight"] = (base["ults_used_in_fight"] == 0).astype(int)

    return base


# ---------------------------------------------------------------------------
# 5. Tempo Features
# ---------------------------------------------------------------------------

def _add_tempo_features(base: pd.DataFrame) -> pd.DataFrame:
    """Add fight tempo features: inter-fight gap, fight number, engagement roles."""
    base = base.sort_values(["MapDataId", "team", "fight_start"]).reset_index(drop=True)

    base["fight_number"] = base.groupby(["MapDataId", "team"]).cumcount() + 1

    prev_end = base.groupby(["MapDataId", "team"])["fight_end"].shift(1)
    base["time_since_last_fight"] = base["fight_start"] - prev_end
    
    # Time to first pick
    base["time_to_first_pick"] = (base["first_kill_time"] - base["fight_start"]).clip(lower=0.0).fillna(0.0)

    base["first_death_role"] = base["first_kill_victim_hero"].map(HERO_ROLES).fillna("Unknown")
    base["first_pick_role"] = base["first_kill_hero"].map(HERO_ROLES).fillna("Unknown")

    base["team_got_first_pick"] = (base["first_kill_team"] == base["team"]).astype(int)
    base["team_suffered_first_death"] = (base["first_kill_victim_team"] == base["team"]).astype(int)
    
    # Specific role picks
    base["got_first_pick_on_tank"] = (base["team_got_first_pick"] & (base["first_death_role"] == "Tank")).astype(int)
    base["got_first_pick_on_dps"] = (base["team_got_first_pick"] & (base["first_death_role"] == "DPS")).astype(int)
    base["got_first_pick_on_support"] = (base["team_got_first_pick"] & (base["first_death_role"] == "Support")).astype(int)
    
    base["suffered_first_death_on_tank"] = (base["team_suffered_first_death"] & (base["first_death_role"] == "Tank")).astype(int)
    base["suffered_first_death_on_dps"] = (base["team_suffered_first_death"] & (base["first_death_role"] == "DPS")).astype(int)
    base["suffered_first_death_on_support"] = (base["team_suffered_first_death"] & (base["first_death_role"] == "Support")).astype(int)

    return base


# ---------------------------------------------------------------------------
# 6. Cascade Features (Fight N-1 → Fight N)
# ---------------------------------------------------------------------------

def _add_cascade_features(base: pd.DataFrame) -> pd.DataFrame:
    """Add fight-to-fight cascading features from the previous fight."""
    base = base.sort_values(["MapDataId", "team", "fight_start"]).reset_index(drop=True)
    grp = base.groupby(["MapDataId", "team"])

    # Lagged features from previous fight
    base["prev_fight_won"] = grp["won"].shift(1)
    base["prev_fight_ults_used"] = grp["ults_used_in_fight"].shift(1)
    base["prev_fight_opp_ults_used"] = grp["opp_ults_used_in_fight"].shift(1)
    base["prev_fight_duration"] = grp["fight_duration"].shift(1)

    # First fight flag
    base["is_first_fight"] = (grp.cumcount() == 0).astype(int)

    # Momentum: win/loss streak entering this fight
    def _compute_momentum(group: pd.DataFrame) -> pd.Series:
        streak = 0
        entering_momentum = []
        for won in group["won"].values:
            entering_momentum.append(streak)
            streak = (max(streak, 0) + 1) if won == 1 else (min(streak, 0) - 1)
        return pd.Series(entering_momentum, index=group.index)

    base["momentum"] = grp.apply(_compute_momentum).reset_index(level=[0, 1], drop=True)

    # Cumulative ult differential (entering this fight)
    fight_ult_diff = base["ults_used_in_fight"] - base["opp_ults_used_in_fight"]
    base["cumulative_ult_diff"] = grp.apply(
        lambda g: fight_ult_diff.loc[g.index].cumsum().shift(1).fillna(0)
    ).reset_index(level=[0, 1], drop=True)
    
    # Explicit hangover and snowball flags
    base["is_snowball_fight"] = ((base["prev_fight_won"] == 1) & (base["prev_fight_ults_used"] == 0)).astype(int)
    base["is_ult_hangover"] = ((base["prev_fight_ults_used"] >= 4)).astype(int)

    return base


# ---------------------------------------------------------------------------
# 7. Comp-Map Synergy (historical win rate)
# ---------------------------------------------------------------------------

def _add_comp_map_synergy(base: pd.DataFrame) -> pd.DataFrame:
    """Add historical win rate of comp archetype on this map type."""
    synergy = base.groupby(["comp_archetype", "map_type"]).agg(
        total=("won", "count"), wins=("won", "sum"),
    ).reset_index()
    synergy["comp_map_synergy"] = synergy["wins"] / synergy["total"]

    base = base.merge(
        synergy[["comp_archetype", "map_type", "comp_map_synergy"]],
        on=["comp_archetype", "map_type"], how="left",
    )
    base["comp_map_synergy"] = base["comp_map_synergy"].fillna(0.5)
    return base


# ---------------------------------------------------------------------------
# 8. Final Cleanup
# ---------------------------------------------------------------------------

# Columns to keep as model features (categorical will be encoded separately)
CATEGORICAL_FEATURES = [
    "comp_archetype", "opp_comp_archetype", "comp_matchup",
    "map_type", "first_death_role", "first_pick_role",
]

NUMERIC_FEATURES = [
    # Composition
    "n_tank", "n_dps", "n_support", "player_advantage", "comp_map_synergy",
    # Ult economy
    "ults_available", "opp_ults_available", "ult_advantage",
    "tank_ults_available", "dps_ults_available", "support_ults_available",
    "defensive_support_ults_available", "offensive_support_ults_available",
    "tank_ult_advantage", "dps_ult_advantage", "support_ult_advantage",
    "defensive_support_ult_advantage", "offensive_support_ult_advantage",
    "ults_used_in_fight", "is_dry_fight",
    # Tempo
    "time_since_last_fight", "fight_number", "time_to_first_pick",
    "team_got_first_pick", "team_suffered_first_death",
    "got_first_pick_on_tank", "got_first_pick_on_dps", "got_first_pick_on_support",
    "suffered_first_death_on_tank", "suffered_first_death_on_dps", "suffered_first_death_on_support",
    # Cascade
    "prev_fight_won", "prev_fight_ults_used", "prev_fight_opp_ults_used",
    "prev_fight_duration", "momentum", "cumulative_ult_diff", "is_first_fight",
    "is_snowball_fight", "is_ult_hangover",
]

METADATA_COLS = ["fight_id", "MapDataId", "team", "opp_team", "won"]


def _select_and_encode(base: pd.DataFrame) -> pd.DataFrame:
    """Select model features, one-hot encode categoricals, drop identity cols."""
    # One-hot encode categoricals
    encoded = pd.get_dummies(
        base[CATEGORICAL_FEATURES + NUMERIC_FEATURES + METADATA_COLS + ["fight_start"]],
        columns=CATEGORICAL_FEATURES,
        drop_first=False,
        dtype=int,
    )
    return encoded


# ---------------------------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------------------------

def build_fight_feature_matrix(ctx) -> tuple[pd.DataFrame, dict[str, float]]:
    """Build the complete feature matrix for fight outcome prediction.

    Returns:
        (feature_matrix, timing_info)

        feature_matrix: one row per team per fight, all features + target 'won'.
            Includes metadata cols (fight_id, MapDataId) for grouping/debugging.
        timing_info: dict of step_name → seconds elapsed.
    """
    timings: dict[str, float] = {}

    # Load hero events if not already loaded
    t0 = time.time()
    ctx.ensure_hero_events()
    timings["load_hero_events"] = time.time() - t0

    # Step 1: Fight-time compositions
    t0 = time.time()
    compositions = _compute_fight_compositions(
        ctx.fights, ctx.hero_spawn, ctx.hero_swap, ctx.matches,
    )
    timings["compositions"] = time.time() - t0
    print(f"  Compositions computed: {len(compositions)} team-fight records ({timings['compositions']:.1f}s)")

    # Step 2: Ult availability
    t0 = time.time()
    ult_state = _compute_ult_availability(
        ctx.fights, ctx.ult_charged, ctx.ult_start, ctx.matches,
    )
    timings["ult_availability"] = time.time() - t0
    print(f"  Ult availability computed: {len(ult_state)} records ({timings['ult_availability']:.1f}s)")

    # Step 3: Base fight records
    t0 = time.time()
    base = _build_base_fight_records(ctx.fights, ctx.matches)
    timings["base_records"] = time.time() - t0
    print(f"  Base fight records: {len(base)} rows ({timings['base_records']:.1f}s)")

    # Step 4: Join composition features
    t0 = time.time()
    base = _join_composition_features(base, compositions)
    timings["join_compositions"] = time.time() - t0

    # Step 5: Join ult features
    t0 = time.time()
    base = _join_ult_features(base, ult_state)
    timings["join_ults"] = time.time() - t0

    # Step 6: Tempo features
    t0 = time.time()
    base = _add_tempo_features(base)
    timings["tempo_features"] = time.time() - t0

    # Step 7: Cascade features
    t0 = time.time()
    base = _add_cascade_features(base)
    timings["cascade_features"] = time.time() - t0

    # Step 8: Comp-map synergy
    t0 = time.time()
    base = _add_comp_map_synergy(base)
    timings["comp_map_synergy"] = time.time() - t0

    # Step 9: Encode and select
    t0 = time.time()
    result = _select_and_encode(base)
    timings["encoding"] = time.time() - t0

    timings["total"] = sum(timings.values())
    print(f"  Feature matrix: {result.shape[0]} rows × {result.shape[1]} columns ({timings['total']:.1f}s total)")

    # Class balance check
    win_rate = result["won"].mean()
    print(f"  Class balance: {win_rate:.1%} wins (should be ~50%)")

    return result, timings
