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
    Detect teamfights from a kills dataframe.

    Groups kills by MapDataId (match), then clusters kills within
    `time_window` seconds of each other. Clusters with >= `min_deaths`
    kills are labeled as fights.

    Returns a DataFrame with one row per fight:
        - MapDataId, fight_id, fight_start, fight_end, fight_duration
        - total_kills, team_1_kills, team_2_kills
        - first_kill_team, first_kill_victim_team, first_kill_hero, first_kill_victim_hero
        - first_kill_ability
        - winner (team with more kills; ties = "Draw")
    """
    all_fights = []

    for map_id, group in kills.groupby("MapDataId"):
        group = group.sort_values("match_time").reset_index(drop=True)
        if len(group) < min_deaths:
            continue

        # Cluster kills: new cluster starts when gap > time_window
        times = group["match_time"].values
        cluster_ids = np.zeros(len(times), dtype=int)
        cluster_id = 0
        for i in range(1, len(times)):
            if times[i] - times[i - 1] > time_window:
                cluster_id += 1
            cluster_ids[i] = cluster_id

        group["_cluster"] = cluster_ids

        for cid, fight_kills in group.groupby("_cluster"):
            if len(fight_kills) < min_deaths:
                continue

            teams = fight_kills["attacker_team"].unique().tolist()
            victim_teams = fight_kills["victim_team"].unique().tolist()
            all_teams = list(set(teams + victim_teams))

            # Count kills by each team (as attacker)
            team_kill_counts = fight_kills["attacker_team"].value_counts()

            first_kill = fight_kills.iloc[0]

            # Determine fight winner: team with more kills
            if len(team_kill_counts) >= 2:
                t1, t2 = team_kill_counts.index[0], team_kill_counts.index[1]
                k1, k2 = team_kill_counts.iloc[0], team_kill_counts.iloc[1]
                if k1 > k2:
                    fight_winner = t1
                elif k2 > k1:
                    fight_winner = t2
                else:
                    fight_winner = "Draw"
            elif len(team_kill_counts) == 1:
                fight_winner = team_kill_counts.index[0]
            else:
                fight_winner = "Unknown"

            # Count deaths per team (as victim)
            team_death_counts = fight_kills["victim_team"].value_counts()

            all_fights.append({
                "MapDataId": map_id,
                "fight_id": f"{map_id}_{cid}",
                "fight_start": fight_kills["match_time"].min(),
                "fight_end": fight_kills["match_time"].max(),
                "fight_duration": fight_kills["match_time"].max() - fight_kills["match_time"].min(),
                "total_kills": len(fight_kills),
                "first_kill_team": first_kill["attacker_team"],
                "first_kill_victim_team": first_kill["victim_team"],
                "first_kill_hero": first_kill["attacker_hero"],
                "first_kill_victim_hero": first_kill["victim_hero"],
                "first_kill_ability": first_kill.get("event_ability", "Unknown"),
                "winner": fight_winner,
                "team_kill_counts": dict(team_kill_counts),
                "team_death_counts": dict(team_death_counts),
            })

    fights_df = pd.DataFrame(all_fights)
    if len(fights_df) == 0:
        return pd.DataFrame()

    # Add first-pick-wins flag
    fights_df["first_pick_won"] = fights_df["first_kill_team"] == fights_df["winner"]
    fights_df["first_pick_lost"] = (
        (fights_df["first_kill_victim_team"] != "Draw")
        & (fights_df["winner"] != "Draw")
        & (fights_df["first_kill_team"] != fights_df["winner"])
    )

    return fights_df


def get_fight_kills(kills: pd.DataFrame, fights: pd.DataFrame) -> pd.DataFrame:
    """
    Tag each kill with its fight_id (if it belongs to a detected fight).
    Returns a copy of kills with a 'fight_id' column added.
    """
    tagged = kills.copy()
    tagged["fight_id"] = None

    for _, fight in fights.iterrows():
        mask = (
            (tagged["MapDataId"] == fight["MapDataId"])
            & (tagged["match_time"] >= fight["fight_start"])
            & (tagged["match_time"] <= fight["fight_end"])
        )
        tagged.loc[mask, "fight_id"] = fight["fight_id"]

    return tagged
