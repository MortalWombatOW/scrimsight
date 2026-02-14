"""
Teamfight detection algorithm using kill clustering.

A teamfight is defined as a cluster of kills where consecutive kills
occur within a configurable time window (default 15s). A minimum number
of total deaths (default 3) is required to qualify as a fight rather
than a stray pick.
"""

import pandas as pd
import numpy as np


def detect_fights(
    kills: pd.DataFrame,
    time_window: float = 15.0,
    min_deaths: int = 3,
) -> pd.DataFrame:
    """
    Detect teamfights from a kills dataframe (fully vectorized).

    Groups kills by MapDataId (match), then clusters kills within
    `time_window` seconds of each other. Clusters with >= `min_deaths`
    kills are labeled as fights.

    Returns a DataFrame with one row per fight.
    """
    # Sort globally by match + time
    kills = kills.sort_values(["MapDataId", "match_time"]).reset_index(drop=True)

    map_ids = kills["MapDataId"].values
    times = kills["match_time"].values

    # Vectorized cluster assignment
    map_changed = np.empty(len(times), dtype=bool)
    map_changed[0] = True
    map_changed[1:] = map_ids[1:] != map_ids[:-1]

    time_gap = np.empty(len(times), dtype=bool)
    time_gap[0] = True
    time_gap[1:] = (times[1:] - times[:-1]) > time_window

    cluster_ids = np.cumsum(map_changed | time_gap)
    kills = kills.copy()
    kills["_cluster"] = cluster_ids

    # Filter to clusters with enough kills
    cluster_sizes = kills.groupby("_cluster").size()
    valid_clusters = cluster_sizes[cluster_sizes >= min_deaths].index
    fk = kills[kills["_cluster"].isin(valid_clusters)].copy()

    if len(fk) == 0:
        return pd.DataFrame()

    # First kill per cluster (already sorted by time)
    first_kills = fk.groupby("_cluster").first()

    # Aggregates per cluster
    agg = fk.groupby("_cluster").agg(
        MapDataId=("MapDataId", "first"),
        fight_start=("match_time", "min"),
        fight_end=("match_time", "max"),
        total_kills=("match_time", "size"),
    )
    agg["fight_duration"] = agg["fight_end"] - agg["fight_start"]

    # First kill info
    agg["first_kill_team"] = first_kills["attacker_team"]
    agg["first_kill_victim_team"] = first_kills["victim_team"]
    agg["first_kill_hero"] = first_kills["attacker_hero"]
    agg["first_kill_victim_hero"] = first_kills["victim_hero"]
    agg["first_kill_ability"] = first_kills["event_ability"] if "event_ability" in first_kills.columns else "Unknown"

    # Winner = team with the most kills in the fight
    # Build per-cluster team kill counts, then pick the max
    team_kills = fk.groupby(["_cluster", "attacker_team"]).size().reset_index(name="kills")
    # Rank teams within each cluster by kill count
    team_kills["rank"] = team_kills.groupby("_cluster")["kills"].rank(method="first", ascending=False)
    top1 = team_kills[team_kills["rank"] == 1].set_index("_cluster")
    top2 = team_kills[team_kills["rank"] == 2].set_index("_cluster")

    # If top two teams are tied, it's a draw
    agg["winner"] = top1["attacker_team"]
    if len(top2) > 0:
        tied = top2.index.intersection(top1.index)
        if len(tied) > 0:
            draws = tied[top1.loc[tied, "kills"].values == top2.loc[tied, "kills"].values]
            agg.loc[draws, "winner"] = "Draw"

    agg = agg.reset_index(drop=True)
    agg["fight_id"] = agg["MapDataId"].astype(str) + "_" + agg.index.astype(str)

    # Flags
    agg["first_pick_won"] = agg["first_kill_team"] == agg["winner"]
    agg["first_pick_lost"] = (
        (agg["first_kill_victim_team"] != "Draw")
        & (agg["winner"] != "Draw")
        & (agg["first_kill_team"] != agg["winner"])
    )

    return agg


def get_fight_kills(kills: pd.DataFrame, fights: pd.DataFrame) -> pd.DataFrame:
    """
    Tag each kill with its fight_id (if it belongs to a detected fight).
    Uses merge + time range filtering instead of row-by-row iteration.
    """
    tagged = kills.merge(
        fights[["MapDataId", "fight_id", "fight_start", "fight_end"]],
        on="MapDataId",
        how="inner",
    )
    mask = (tagged["match_time"] >= tagged["fight_start"]) & (tagged["match_time"] <= tagged["fight_end"])
    tagged = tagged[mask].drop(columns=["fight_start", "fight_end"])

    result = kills.merge(
        tagged[["id", "fight_id"]].drop_duplicates(subset="id"),
        on="id",
        how="left",
    )
    return result
