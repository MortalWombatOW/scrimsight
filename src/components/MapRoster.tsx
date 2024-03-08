import React from 'react';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {useDataNodes} from '../hooks/useData';
import {getRoleFromHero, getRankForRole} from '../lib/data/data';
import {Grid, Paper, Typography} from '@mui/material';
import {getColorgorical} from '../lib/color';
import IconAndText from './Common/IconAndText';
import {getIcon} from './Common/RoleIcons';

const MapRoster = ({mapId}: {mapId: number}) => {
  const data = useDataNodes([
    new AlaSQLNode(
      'MapRoster_players_' + mapId,
      `SELECT
        player_stat.playerTeam,
        match_start.team1Name,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam as id,
        ARRAY(player_stat.playerHero) as playerHeroes
      FROM ? AS player_stat
      JOIN
      ? AS match_start
      ON
        player_stat.mapId = match_start.mapId
      WHERE
        player_stat.mapId = ${mapId}
      GROUP BY
        player_stat.playerTeam,
        match_start.team1Name,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam
      `,
      ['player_stat_object_store', 'match_start_object_store'],
    ),
  ]);

  const mapRosterRawData = data['MapRoster_players_' + mapId];

  console.log('mapRoster', mapRosterRawData);

  const [team1Roster, setTeam1Roster] = React.useState<object[]>([]);
  const [team2Roster, setTeam2Roster] = React.useState<object[]>([]);

  React.useEffect(() => {
    if (!mapRosterRawData) {
      return;
    }

    const rosterWithRoles = mapRosterRawData.map((player: object) => {
      const role = getRoleFromHero(player['playerHeroes'][0]);
      const roleRank = getRankForRole(role);

      return {
        playerTeam: player['playerTeam'],
        team1Name: player['team1Name'],
        playerName: player['playerName'],
        role,
        roleRank,
      };
    });

    rosterWithRoles.sort((a: any, b: any) => {
      return a.roleRank - b.roleRank;
    });

    const team1Roster = rosterWithRoles.filter(
      (player: any) => player.playerTeam === player.team1Name,
    );
    const team2Roster = rosterWithRoles.filter(
      (player: any) => player.playerTeam !== player.team1Name,
    );

    setTeam1Roster(team1Roster);
    setTeam2Roster(team2Roster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mapRosterRawData)]);

  console.log('team1Roster', team1Roster);
  console.log('team2Roster', team2Roster);

  return (
    <div style={{marginTop: '1em'}}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper
            sx={{
              padding: '1em',
              borderColor: getColorgorical(team1Roster[0]?.['playerTeam']),
            }}>
            <Typography
              variant="h3"
              sx={{color: getColorgorical(team1Roster[0]?.['playerTeam'])}}>
              {team1Roster[0]?.['playerTeam']}
            </Typography>
            <ul style={{listStyle: 'none'}}>
              {team1Roster.map((player: any) => {
                return (
                  <li key={player.playerName}>
                    <IconAndText
                      icon={
                        <span
                          style={{
                            color: getColorgorical(player.playerTeam),
                            paddingTop: 4,
                          }}>
                          {getIcon(player.role)}
                        </span>
                      }
                      text={player.playerName}
                    />
                  </li>
                );
              })}
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{
              padding: '1em',
              borderColor: getColorgorical(team2Roster[0]?.['playerTeam']),
            }}>
            <Typography
              variant="h3"
              sx={{color: getColorgorical(team2Roster[0]?.['playerTeam'])}}>
              {team2Roster[0]?.['playerTeam']}
            </Typography>
            <ul style={{listStyle: 'none'}}>
              {team2Roster.map((player: any) => {
                return (
                  <li key={player.playerName}>
                    <IconAndText
                      icon={
                        <span
                          style={{
                            color: getColorgorical(player.playerTeam),
                            paddingTop: 4,
                          }}>
                          {getIcon(player.role)}
                        </span>
                      }
                      text={player.playerName}
                    />
                  </li>
                );
              })}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default MapRoster;
