import pandas as pd
from io import StringIO
from scipy.cluster.vq import kmeans2



def parse_logfile(log):
    data = pd.read_csv(StringIO(bytes.fromhex(log[2:]).decode('utf-8')), sep=";", header=None)
    data.columns = ["time", "event_type", "player", "value1", "value2"]
    data["time"] = pd.to_datetime(data["time"].str.slice(start=1, stop=-2), infer_datetime_format=True)
    match_start = data["time"].min()
    data["time"] = data["time"].apply(lambda t: (t - match_start).total_seconds())
    return data

def dmg_cumsum(log):
    data = parse_logfile(log)

    damage_events = data.loc[data['event_type'] == 'damage_dealt'].copy()
    damage_events.rename(columns={"value1": "damage"}, inplace=True)
    damage_events.rename(columns={"value2": "victim"}, inplace=True)
    damage_events["damage"] = damage_events["damage"].apply(pd.to_numeric)

    return damage_events.groupby(['player', 'time']).sum().groupby(level=0).cumsum().reset_index().sort_values(by="time")#.ffill.pivot(index='time', columns='player').ffill()


def status_events(log):
    data = parse_logfile(log)
    player_status_events = data.loc[data['event_type'] == 'player_status'].copy()
    player_status_events.rename(columns={"value1": "hero"}, inplace=True)
    player_status_events.rename(columns={"value2": "position"}, inplace=True)
    player_status_events[['x', 'y', 'z']] = player_status_events["position"].str.split(',', expand=True)
    player_status_events.drop(columns=['position', 'hero', 'event_type'], inplace=True)
    player_status_events['x'] = player_status_events['x'].str.replace('(', '').apply(pd.to_numeric)
    player_status_events['y'] = player_status_events['y'].apply(pd.to_numeric)
    player_status_events['z'] = player_status_events['z'].str.replace(')', '').apply(pd.to_numeric)

    player_ids = player_status_events.loc[player_status_events['time'] == 0].drop('time', axis=1) \
                .apply(lambda evt: [evt['player'], str([evt['player'], str(evt['x']), str(evt['y']), str(evt['z'])])], axis=1, result_type='expand')
    player_ids.columns = ['player', 'id']
    # print(player_ids)
    player_status_events = player_status_events.merge(player_ids, how='left', on='player').groupby(['time', 'player']).first().reset_index()
    return player_status_events

def teams(log):
    data = parse_logfile(log)
    player_status_events = status_events(log)
    initial_positions = player_status_events.loc[player_status_events['time'] == 0]
    player_positions_at_start = initial_positions[['x', 'y', 'z']]
    centroid, label = kmeans2(player_positions_at_start, 2)
    team_1 = initial_positions[label == 0]['player'].values
    team_2 = initial_positions[label == 1]['player'].values

    team_map = {**{
        player: 'red' for player in initial_positions[label == 0]['player'].values
    },
    **{
        player: 'blue' for player in initial_positions[label == 1]['player'].values
    }}

    return team_map
