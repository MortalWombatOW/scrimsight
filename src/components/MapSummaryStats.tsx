import {Box, Grid, Typography} from '@mui/material';
import React from 'react';
import {useDataNodes} from '../hooks/useData';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {PieChart} from '@mui/x-charts/PieChart';
import {getColorgorical} from '../lib/color';
import {useDrawingArea} from '@mui/x-charts/hooks';

const MapSummaryStats = ({mapId}: {mapId: number}) => {
  const data = useDataNodes([
    new AlaSQLNode(
      'team_map_stats_' + mapId,
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
      GROUP BY
        player_stat.playerTeam,
        match_start.team1Name,
        match_start.team2Name
      `,
      ['player_stat_object_store', 'match_start_object_store'],
    ),
  ]);

  const team_map_stats = data['team_map_stats_' + mapId];

  if (!team_map_stats) {
    return <div>Loading...</div>;
  }

  console.log('team_map_stats', team_map_stats);

  const team1 = team_map_stats.find(
    (team) => team.playerTeam === team_map_stats[0].team1Name,
  );
  const team2 = team_map_stats.find(
    (team) => team.playerTeam === team_map_stats[0].team2Name,
  );
  const pieKillsData = [
    {
      name: team1.playerTeam,
      color: getColorgorical(team1.playerTeam),
      value: team1.finalBlows,
    },
    {
      name: team2.playerTeam,
      color: getColorgorical(team2.playerTeam),
      value: team2.finalBlows,
    },
  ];

  const pieDmgData = [
    {
      name: team1.playerTeam,
      color: getColorgorical(team1.playerTeam),
      value: team1.allDamageDealt,
    },
    {
      name: team2.playerTeam,
      color: getColorgorical(team2.playerTeam),
      value: team2.allDamageDealt,
    },
  ];

  const pieHealingData = [
    {
      name: team1.playerTeam,
      color: getColorgorical(team1.playerTeam),
      value: team1.healingDealt,
    },
    {
      name: team2.playerTeam,
      color: getColorgorical(team2.playerTeam),
      value: team2.healingDealt,
    },
  ];

  return (
    <Grid
      container
      spacing={5}
      sx={{mb: '1em'}}
      alignItems={'center'}
      justifyContent={'center'}>
      <Grid item xs={4}>
        <PieChart
          series={[
            {
              data: pieKillsData,
              arcLabel: (d) => `${d.value}`,
              innerRadius: 30,
              outerRadius: 60,
              paddingAngle: 2,
              cornerRadius: 5,
              startAngle: -120,
              endAngle: 120,
              cx: 100,
              cy: 100,
              highlightScope: {
                faded: `global`,
                highlighted: `item`,
              },
              faded: {innerRadius: 30, additionalRadius: -10},
            },
          ]}
          height={200}
          width={200}
        />
        <Typography variant="h6">Final Blows</Typography>
      </Grid>
      <Grid item xs={4}>
        <PieChart
          series={[
            {
              data: pieDmgData,
              arcLabel: (d) => `${d.value.toLocaleString()}`,
              innerRadius: 30,
              outerRadius: 60,
              paddingAngle: 2,
              cornerRadius: 5,
              startAngle: -120,
              endAngle: 120,
              cx: 100,
              cy: 100,
              highlightScope: {
                faded: `global`,
                highlighted: `item`,
              },
              faded: {innerRadius: 30, additionalRadius: -10},
            },
          ]}
          height={200}
          width={200}
        />
        <Typography variant="h6"> Damage Dealt</Typography>
      </Grid>
      <Grid item xs={4}>
        <PieChart
          series={[
            {
              data: pieHealingData,
              arcLabel: (d) => `${d.value.toLocaleString()}`,
              innerRadius: 30,
              outerRadius: 60,
              paddingAngle: 2,
              cornerRadius: 5,
              startAngle: -120,
              endAngle: 120,
              cx: 100,
              cy: 100,
              highlightScope: {
                faded: `global`,
                highlighted: `item`,
              },
              faded: {innerRadius: 30, additionalRadius: -10},
            },
          ]}
          height={200}
          width={200}
        />
        <Typography variant="h6">Healing</Typography>
      </Grid>
    </Grid>
  );
};

export default MapSummaryStats;
