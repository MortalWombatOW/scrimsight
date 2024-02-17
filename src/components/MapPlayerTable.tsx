/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {useDataNodes} from '../hooks/useData';

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
} from '@mui/material';
import {getHeroImage, getRankForRole, getRoleFromHero} from '../lib/data/data';
import IconAndText from './Common/IconAndText';
import {getIcon} from './Common/RoleIcons';
import {getColorFor, getColorgorical} from '../lib/color';
import {heroNameToNormalized} from '../lib/string';

function FormattedTableCell({children}: {children?: React.ReactNode}) {
  return (
    <TableCell
      sx={{
        borderLeft: 'none',
        borderRight: 'none',
      }}>
      {children}
    </TableCell>
  );
}

const MapPlayerTable = ({mapId, roundId}: {mapId: number; roundId: number}) => {
  const data = useDataNodes([
    new AlaSQLNode(
      'MapPlayerTable_stats_' + mapId + '_' + roundId,
      `SELECT
        player_stat.playerTeam,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam as id,
        ARRAY(player_stat.playerHero) as playerHeroes,
        SUM(player_stat.eliminations) as eliminations,
        SUM(player_stat.finalBlows) as finalBlows,
        SUM(player_stat.deaths) as deaths,
        SUM(player_stat.objectiveKills) as objectiveKills,
        SUM(player_stat.allDamageDealt) as allDamageDealt,
        SUM(player_stat.healingDealt) as healingDealt
      FROM ? AS player_stat
      WHERE
        player_stat.mapId = ${mapId}
        ${roundId > 0 ? `AND player_stat.roundNumber = ${roundId}` : ''}
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
      'MapPlayerTable_map_duration_' + mapId + '_' + roundId,
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
        ${roundId > 0 ? `AND round_start.roundNumber = ${roundId}` : ''}
      `,
      ['round_start_object_store', 'round_end_object_store'],
    ),
    new AlaSQLNode(
      'MapPlayerTable_team_order_' + mapId,
      `SELECT
        match_start.team1Name,
        match_start.team2Name
      FROM ? AS match_start
      WHERE
        match_start.mapId = ${mapId}
      `,
      ['match_start_object_store'],
    ),
  ]);

  const player_map_stats =
    data['MapPlayerTable_stats_' + mapId + '_' + roundId];
  const map_duration =
    data['MapPlayerTable_map_duration_' + mapId + '_' + roundId];
  const map_teams = data['MapPlayerTable_team_order_' + mapId];

  const [player_stats_timed, setPlayerStatsTimed] = React.useState<any[]>([]);

  useEffect(() => {
    if (!player_map_stats || !map_duration || !map_teams) {
      return;
    }

    // console.log('player_map_stats', player_map_stats);
    // console.log('map_duration', map_duration);

    const durationMins = map_duration[0].duration / 60;

    const player_stats_timed_ = player_map_stats.map((player: any) => {
      const role = getRoleFromHero(player.playerHeroes[0]);
      return {
        ...player,
        role: role,
        roleRank: getRankForRole(role),
        teamRank: player.playerTeam === map_teams[0].team1Name ? 1 : 2,
        eliminationsPerTen: (player.eliminations / durationMins) * 10,
        finalBlowsPerTen: (player.finalBlows / durationMins) * 10,
        deathsPerTen: (player.deaths / durationMins) * 10,
        objectiveKillsPerTen: (player.objectiveKills / durationMins) * 10,
        allDamageDealtPerTen: (player.allDamageDealt / durationMins) * 10,
        healingDealtPerTen: (player.healingDealt / durationMins) * 10,
      };
    });

    // sort by roleRank, then by team
    player_stats_timed_.sort((a: any, b: any) => {
      if (a.teamRank < b.teamRank) {
        return -1;
      }
      if (a.teamRank > b.teamRank) {
        return 1;
      }
      if (a.roleRank < b.roleRank) {
        return -1;
      }
      if (a.roleRank > b.roleRank) {
        return 1;
      }
      return 0;
    });

    setPlayerStatsTimed(player_stats_timed_);
  }, [
    JSON.stringify(player_map_stats),
    JSON.stringify(map_duration),
    JSON.stringify(map_teams),
  ]);

  return (
    <div>
      <TableContainer component={Paper} sx={{padding: '1em'}}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{fontWeight: 'bold'}}>
              <FormattedTableCell>Player</FormattedTableCell>
              <FormattedTableCell>Heroes</FormattedTableCell>
              <FormattedTableCell>K / D / A</FormattedTableCell>
              <FormattedTableCell>KDR</FormattedTableCell>
              <FormattedTableCell>Objective Kills</FormattedTableCell>
              <FormattedTableCell>Damage</FormattedTableCell>
              <FormattedTableCell>Healing</FormattedTableCell>
              <FormattedTableCell>Final Blows/10m</FormattedTableCell>
              <FormattedTableCell>Deaths/10m</FormattedTableCell>
              <FormattedTableCell>Elims/10m</FormattedTableCell>
              <FormattedTableCell>Objective Elims/10m</FormattedTableCell>
              <FormattedTableCell>Damage/10m</FormattedTableCell>
              <FormattedTableCell>Healing/10m</FormattedTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {player_stats_timed.map((player: any) => (
              <TableRow key={player.id}>
                <FormattedTableCell>
                  <IconAndText
                    icon={getIcon(player.role)}
                    text={player.playerName}
                    backgroundColor={getColorgorical(player.playerTeam)}
                    textBorder={true}
                  />
                </FormattedTableCell>
                <FormattedTableCell>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {Array.from(new Set(player.playerHeroes)).map(
                      (hero: string) => (
                        <li key={hero}>
                          <IconAndText
                            icon={
                              <Avatar
                                src={getHeroImage(hero, false)}
                                sx={{width: 24, height: 24}}
                              />
                            }
                            text={hero}
                            textBorder={true}
                            backgroundColor={getColorFor(
                              heroNameToNormalized(hero),
                            )}
                            // no padding on top, bottom, left, but not right
                            padding="0 0.5em 0 0"
                            borderRadius="12px"
                          />
                        </li>
                      ),
                    )}
                  </ul>
                </FormattedTableCell>
                <FormattedTableCell>
                  {player.finalBlows} / {player.deaths} / {player.eliminations}
                </FormattedTableCell>
                <FormattedTableCell>
                  {player.deaths === 0
                    ? '∞'
                    : (player.finalBlows / player.deaths).toFixed(2)}
                </FormattedTableCell>
                <FormattedTableCell>{player.objectiveKills}</FormattedTableCell>
                <FormattedTableCell>
                  {Math.floor(player.allDamageDealt).toLocaleString()}
                </FormattedTableCell>

                <FormattedTableCell>
                  {player.healingDealt > 0
                    ? Math.floor(player.healingDealt).toLocaleString()
                    : '-'}
                </FormattedTableCell>
                <FormattedTableCell>
                  {player.finalBlowsPerTen.toFixed(2)}
                </FormattedTableCell>
                <FormattedTableCell>
                  {player.deathsPerTen.toFixed(2)}
                </FormattedTableCell>
                <FormattedTableCell>
                  {player.eliminationsPerTen.toFixed(2)}
                </FormattedTableCell>
                <FormattedTableCell>
                  {player.objectiveKillsPerTen.toFixed(2)}
                </FormattedTableCell>

                <FormattedTableCell>
                  {Math.floor(player.allDamageDealtPerTen).toLocaleString()}
                </FormattedTableCell>
                <FormattedTableCell>
                  {player.healingDealtPerTen > 0
                    ? Math.floor(player.healingDealtPerTen).toLocaleString()
                    : '-'}
                </FormattedTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MapPlayerTable;
