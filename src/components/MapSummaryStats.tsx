import {Box, Grid, Typography} from '@mui/material';
import React from 'react';
import {useDataNodes} from '../hooks/useData';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {PieChart, pieArcLabelClasses} from '@mui/x-charts/PieChart';
import {getColorgorical} from '../lib/color';
import {useDrawingArea} from '@mui/x-charts/hooks';

const StatPieChart = ({data, label}: {data: any; label: string}) => {
  return (
    <PieChart
      series={[
        {
          data,
          arcLabel: (d) => `${Math.floor(d.value).toLocaleString()}`,
          innerRadius: 30,
          outerRadius: 60,
          paddingAngle: 2,
          cornerRadius: 5,
          startAngle: -120,
          endAngle: 120,
          cx: 100,
          cy: 100,
          valueFormatter: (d) => d.value.toLocaleString(),
          highlightScope: {
            faded: `global`,
            highlighted: `item`,
          },
          faded: {
            innerRadius: 30,
            additionalRadius: -5,
          },
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'bold',
          textShadow:
            '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000',
        },
      }}
      slotProps={{legend: {hidden: true}}}
      height={200}
      width={200}>
      <text
        x={107}
        y={150}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 20,
          fill: 'white',
        }}>
        {label}
      </text>
    </PieChart>
  );
};

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
      label: team1.playerTeam,
      color: getColorgorical(team1.playerTeam),
      value: team1.finalBlows,
    },
    {
      label: team2.playerTeam,
      color: getColorgorical(team2.playerTeam),
      value: team2.finalBlows,
    },
  ];

  const pieDmgData = [
    {
      label: team1.playerTeam,
      color: getColorgorical(team1.playerTeam),
      value: team1.allDamageDealt,
    },
    {
      label: team2.playerTeam,
      color: getColorgorical(team2.playerTeam),
      value: team2.allDamageDealt,
    },
  ];

  const pieHealingData = [
    {
      label: team1.playerTeam,
      color: getColorgorical(team1.playerTeam),
      value: team1.healingDealt,
    },
    {
      label: team2.playerTeam,
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
        <StatPieChart data={pieKillsData} label="Kills" />
      </Grid>
      <Grid item xs={4}>
        <StatPieChart data={pieDmgData} label="Damage" />
      </Grid>
      <Grid item xs={4}>
        <StatPieChart data={pieHealingData} label="Healing" />
      </Grid>
    </Grid>
  );
};

export default MapSummaryStats;
