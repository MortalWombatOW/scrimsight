import React from 'react';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {useDataNodes} from '../hooks/useData';
import {DataGrid} from '@mui/x-data-grid';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

const MapPlayerTable = ({mapId}: {mapId: number}) => {
  const data = useDataNodes([
    new AlaSQLNode(
      'player_map_stats_' + mapId,
      `SELECT
        player_stat.playerTeam,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam as id,
        SUM(player_stat.eliminations) as eliminations,
        SUM(player_stat.finalBlows) as finalBlows,
        SUM(player_stat.deaths) as deaths,
        SUM(player_stat.allDamageDealt) as allDamageDealt,
        SUM(player_stat.healingDealt) as healingDealt,
        SUM(player_stat.heroTimePlayed) as heroTimePlayed
      FROM ? AS player_stat
      WHERE
        player_stat.mapId = ${mapId}
      GROUP BY
        player_stat.playerTeam,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam

      ORDER BY
        player_stat.playerTeam,
        player_stat.playerName
      `,
      ['player_stat_object_store'],
    ),
    new AlaSQLNode(
      'map_duration_' + mapId,
      `SELECT
        sum(round_end.matchTime - round_start.matchTime) as duration
      FROM
        ? AS round_start
        JOIN
        ? AS round_end
        ON
          round_start.mapId = round_end.mapId
          AND round_start.roundNumber = round_end.roundNumber
      WHERE
        round_start.mapId = ${mapId}
      `,
      ['round_start_object_store', 'round_end_object_store'],
    ),
  ]);

  const player_map_stats = data['player_map_stats_' + mapId];
  const map_duration = data['map_duration_' + mapId];

  if (!player_map_stats || !map_duration) {
    return <div>Loading...</div>;
  }

  console.log('player_map_stats', player_map_stats);
  console.log('map_duration', map_duration);

  const duration = map_duration[0].duration;

  const player_stats_timed = player_map_stats.map((player: any) => {
    return {
      ...player,
      eliminationsPerTen: (player.eliminations / duration) * 10,
      finalBlowsPerTen: (player.finalBlows / duration) * 10,
      deathsPerTen: (player.deaths / duration) * 10,
      allDamageDealtPerTen: (player.allDamageDealt / duration) * 10,
      healingDealtPerTen: (player.healingDealt / duration) * 10,
    };
  });

  return (
    <div>
      <TableContainer component={Paper} sx={{padding: '1em'}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Eliminations</TableCell>
              <TableCell>Final Blows</TableCell>
              <TableCell>Deaths</TableCell>
              <TableCell>All Damage Dealt</TableCell>
              <TableCell>Healing Dealt</TableCell>
              <TableCell>Eliminations/10</TableCell>
              <TableCell>Final Blows/10</TableCell>
              <TableCell>Deaths/10</TableCell>
              <TableCell>All Damage Dealt/10</TableCell>
              <TableCell>Healing Dealt/10</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {player_stats_timed.map((player: any) => (
              <TableRow key={player.id}>
                <TableCell>{player.playerName}</TableCell>
                <TableCell>{player.playerTeam}</TableCell>
                <TableCell>{player.eliminations}</TableCell>
                <TableCell>{player.finalBlows}</TableCell>
                <TableCell>{player.deaths}</TableCell>
                <TableCell>{player.allDamageDealt}</TableCell>
                <TableCell>{player.healingDealt}</TableCell>
                <TableCell>{player.eliminationsPerTen}</TableCell>
                <TableCell>{player.finalBlowsPerTen}</TableCell>
                <TableCell>{player.deathsPerTen}</TableCell>
                <TableCell>{player.allDamageDealtPerTen}</TableCell>
                <TableCell>{player.healingDealtPerTen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MapPlayerTable;
