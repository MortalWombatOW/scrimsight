/* eslint-disable @typescript-eslint/no-explicit-any */
import {Grid} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {useDataNodes} from '../../../hooks/useData';
import {AlaSQLNode} from '../../../WombatDataFramework/DataTypes';
import {LineHighlightPlot, LinePlot, MarkPlot} from '@mui/x-charts/LineChart';
import {getColorgorical} from '../../../lib/color';
import {formatTime} from '../../../lib/format';
import {ChartContainer} from '@mui/x-charts/ChartContainer';

import {ChartsXAxis} from '@mui/x-charts/ChartsXAxis';
import {ChartsYAxis} from '@mui/x-charts/ChartsYAxis';
import {ChartsAxisHighlight} from '@mui/x-charts/ChartsAxisHighlight';
import {ChartsTooltip} from '@mui/x-charts/ChartsTooltip';
import {useMapContext} from '../context/MapContext';
import {StatPieChart} from './StatPieChart';

const MapSummaryStats = () => {
  const {mapId, roundId, timeWindow} = useMapContext();
  const [startTime, endTime] = timeWindow || [0, 9999];
  const data = useDataNodes([
    new AlaSQLNode(
      'MapSummaryStats_team_stats' + mapId + '_' + roundId,
      `SELECT
        player_stat.playerTeam,
        match_start.team1Name,
        match_start.team2Name,
        SUM(player_stat.finalBlows) as finalBlows,
        SUM(player_stat.allDamageDealt) as allDamageDealt,
        SUM(player_stat.healingDealt) as healingDealt
      FROM ? AS player_stat
      JOIN ? AS match_start
      ON
        player_stat.mapId = match_start.mapId
      WHERE
        player_stat.mapId = ${mapId}
        ${
          roundId && roundId > 0
            ? `AND player_stat.roundNumber = ${roundId}`
            : ''
        }
      GROUP BY
        player_stat.playerTeam,
        match_start.team1Name,
        match_start.team2Name
      `,
      ['player_stat_object_store', 'match_start_object_store'],
    ),
    new AlaSQLNode(
      'MapSummaryStats__kills_by_time_' + mapId + '_' + roundId,
      `SELECT
        kill.matchTime,
        kill.attackerTeam,
        count(*) as kills
      FROM ? AS kill
      ${
        roundId && roundId > 0
          ? `
      JOIN ? AS round_start
      ON
        kill.mapId = round_start.mapId
      JOIN ? AS round_end
      ON
        kill.mapId = round_end.mapId
      `
          : ''
      }
      WHERE
        kill.mapId = ${mapId}
        ${
          roundId && roundId > 0
            ? `
        AND round_start.roundNumber = ${roundId}
        AND round_end.roundNumber = ${roundId}
        AND kill.matchTime >= round_start.matchTime
        AND kill.matchTime <= round_end.matchTime
        AND kill.matchTime >= ${startTime}
        AND kill.matchTime <= ${endTime}
        `
            : ''
        }
      GROUP BY
        kill.matchTime,
        kill.attackerTeam
      `,
      [
        'kill_object_store',
        'round_start_object_store',
        'round_end_object_store',
      ],
    ),
  ]);

  const team_map_stats =
    data['MapSummaryStats_team_stats' + mapId + '_' + roundId];

  const map_kills_by_time =
    data['MapSummaryStats__kills_by_time_' + mapId + '_' + roundId];

  // shared data
  const [team1, setTeam1] = useState<object | null>(null);
  const [team2, setTeam2] = useState<object | null>(null);

  // for pie chart
  const [pieKillsData, setPieKillsData] = useState<any>([]);
  const [pieDmgData, setPieDmgData] = useState<any>([]);
  const [pieHealingData, setPieHealingData] = useState<any>([]);

  // for time chart
  const [xAxisData, setXAxisData] = useState<number[]>([]);
  const [team1KillsByTimeData, setTeam1KillsByTimeData] = useState<number[]>(
    [],
  );
  const [team2KillsByTimeData, setTeam2KillsByTimeData] = useState<number[]>(
    [],
  );
  const [team1KillsByTimeDataCumulative, setTeam1KillsByTimeDataCumulative] =
    useState<number[]>([]);
  const [team2KillsByTimeDataCumulative, setTeam2KillsByTimeDataCumulative] =
    useState<number[]>([]);

  useEffect(() => {
    if (!team_map_stats || !map_kills_by_time) {
      console.log('no data');
      return;
    }

    console.log('team_map_stats', team_map_stats);

    console.log('map_kills_by_time', map_kills_by_time);

    const team1_ = team_map_stats.find(
      (team) => team.playerTeam === team_map_stats[0].team1Name,
    );
    const team2_ = team_map_stats.find(
      (team) => team.playerTeam === team_map_stats[0].team2Name,
    );

    setTeam1(team1_);
    setTeam2(team2_);

    const team1Color_ = getColorgorical(team1_.playerTeam);
    const team2Color_ = getColorgorical(team2_.playerTeam);

    setPieKillsData([
      {
        label: team1_.playerTeam,
        color: team1Color_,
        value: team1_.finalBlows,
      },
      {
        label: team2_.playerTeam,
        color: team2Color_,
        value: team2_.finalBlows,
      },
    ]);

    setPieDmgData([
      {
        label: team1_.playerTeam,
        color: team1Color_,
        value: team1_.allDamageDealt,
      },
      {
        label: team2_.playerTeam,
        color: team2Color_,
        value: team2_.allDamageDealt,
      },
    ]);

    setPieHealingData([
      {
        label: team1_.playerTeam,
        color: team1Color_,
        value: team1_.healingDealt,
      },
      {
        label: team2_.playerTeam,
        color: team2Color_,
        value: team2_.healingDealt,
      },
    ]);

    // get all kill events by team
    const team1Kills = map_kills_by_time.filter(
      (kill) => kill.attackerTeam === team1_.playerTeam,
    );
    const team2Kills = map_kills_by_time.filter(
      (kill) => kill.attackerTeam === team2_.playerTeam,
    );

    const startTime_ = Math.min(
      ...map_kills_by_time.map((kill) => kill.matchTime),
    );
    const endTime_ = Math.max(
      ...map_kills_by_time.map((kill) => kill.matchTime),
    );
    const xAxisData_ = Array.from(
      {length: endTime_ - startTime_ + 1},
      (_, i) => i + startTime_,
    );
    setXAxisData(xAxisData_);
    // console.log('xAxisData_', xAxisData_);
    // console.log('startTime_', startTime_);
    // console.log('endTime_', endTime_);

    const team1KillsByTimeData_ = xAxisData_.map((time) =>
      team1Kills
        .filter((kill) => kill.matchTime === time)
        .reduce((acc, kill) => acc + kill.kills, 0),
    );

    const team2KillsByTimeData_ = xAxisData_.map((time) =>
      team2Kills
        .filter((kill) => kill.matchTime === time)
        .reduce((acc, kill) => acc + kill.kills, 0),
    );
    setTeam1KillsByTimeData(team1KillsByTimeData_);
    setTeam2KillsByTimeData(team2KillsByTimeData_);

    const team1KillsByTimeDataCumulative_ = team1KillsByTimeData_.reduce(
      (acc, val, i) => {
        acc.push(val + (acc[i - 1] || 0));
        return acc;
      },
      [] as number[],
    );

    const team2KillsByTimeDataCumulative_ = team2KillsByTimeData_.reduce(
      (acc, val, i) => {
        acc.push(val + (acc[i - 1] || 0));
        return acc;
      },
      [] as number[],
    );

    setTeam1KillsByTimeDataCumulative(team1KillsByTimeDataCumulative_);
    setTeam2KillsByTimeDataCumulative(team2KillsByTimeDataCumulative_);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(team_map_stats), JSON.stringify(map_kills_by_time)]);

  console.log('team1KillsByTimeData', team1KillsByTimeDataCumulative);
  console.log('team2KillsByTimeData', team2KillsByTimeDataCumulative);
  console.log('xAxisData', xAxisData);

  return (
    <Grid
      container
      spacing={1}
      sx={{mb: '1em'}}
      alignItems={'center'}
      justifyContent={'center'}>
      <Grid item xs={4}>
        <StatPieChart data={pieKillsData} label="Kills" />
      </Grid>
      <Grid item xs={4}>
        <StatPieChart data={pieDmgData} label="Damage" />
      </Grid>
      <Grid item xs={4}>
        <StatPieChart data={pieHealingData} label="Healing" />
      </Grid>
      <Grid item xs={12}>
        <ChartContainer
          xAxis={[
            {
              data: xAxisData.map((time) => time),
              label: 'Match time (s)',
              valueFormatter: (d) => formatTime(d - startTime),
              min: startTime,
              max: endTime,
            },
          ]}
          yAxis={[
            {
              label: 'Kills',
              labelStyle: {
                angle: 0,
                textAnchor: 'end',
              },
            },
          ]}
          series={[
            {
              type: 'line',
              curve: 'stepAfter',
              data: team1KillsByTimeDataCumulative,
              showMark: ({index}) => team1KillsByTimeData[index] > 0,
              label: team1 == null ? '' : team1['playerTeam'],
              color:
                team1 == null ? 'white' : getColorgorical(team1['playerTeam']),
            },
            {
              type: 'line',
              curve: 'stepAfter',
              data: team2KillsByTimeDataCumulative,
              showMark: ({index}) => team2KillsByTimeData[index] > 0,
              label: team2 == null ? '' : team2['playerTeam'],
              color:
                team2 == null ? 'white' : getColorgorical(team2['playerTeam']),
            },
          ]}
          width={1200}
          height={200}
          margin={{top: 10, right: 20, bottom: 50, left: 60}}>
          <LinePlot />
          <MarkPlot />
          <LineHighlightPlot />
          <ChartsAxisHighlight x="line" />
          <ChartsTooltip trigger="axis" />
          {/* <ChartsReferenceLine
            x={300}
            label="Freezing"
            labelAlign="start"
            lineStyle={{stroke: '#128128', strokeDasharray: '3 3'}}
          /> */}
          <ChartsXAxis />
          <ChartsYAxis />
        </ChartContainer>
      </Grid>
    </Grid>
  );
};

export default MapSummaryStats;
