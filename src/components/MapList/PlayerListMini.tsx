import {CardHeader, Avatar, Box} from '@mui/material';
import React from 'react';
import {useDataNodeOutput, useDataNodes} from '../../hooks/useData';
import {getColorgorical} from '../../lib/color';
import {ScrimPlayers} from '../../lib/data/NodeData';
import IconAndText from '../Common/IconAndText';
import {getIcon} from '../Common/RoleIcons';
import PlayerHeroPopover from './PlayerHeroPopover';
import PersonIcon from '@mui/icons-material/PersonOutline';
import {AlaSQLNode} from '../../WombatDataFramework/DataTypes';

const PlayerListMini = ({
  scrimId,
  mapId,
  showRole,
}: {
  scrimId: number;
  mapId: number;
  showRole: boolean;
}) => {
  // const data = useDataNodeOutput<ScrimPlayers>('scrim_players', {
  //   scrimId,
  //   mapId,
  // });

  const data = useDataNodes([
    new AlaSQLNode<ScrimPlayers>(
      'scrim_players' + scrimId + mapId,
      'Scrim Players',
      `
      SELECT 
        scrim_players_heroes_roles.scrimId,
        scrim_players_heroes_roles.mapId,
        scrim_players_heroes_roles.teamName,
        scrim_players_heroes_roles.teamNumber,
        scrim_players_heroes_roles.playerName,
        scrim_players_heroes_roles.role,
        scrim_players_heroes_roles.roleNumber,
        array({
          hero: scrim_players_heroes_roles.hero,
          finalBlows: scrim_players_heroes_roles.finalBlows,
          deaths: scrim_players_heroes_roles.deaths,
          damage: scrim_players_heroes_roles.damage,
          accuracy: scrim_players_heroes_roles.accuracy, 
          shotsFired: scrim_players_heroes_roles.shotsFired
        }) as heroes
      from ? as scrim_players_heroes_roles
      where scrim_players_heroes_roles.mapId = ${mapId}
      group by scrim_players_heroes_roles.scrimId,
      scrim_players_heroes_roles.mapId,
      scrim_players_heroes_roles.teamName,
      scrim_players_heroes_roles.playerName,
      scrim_players_heroes_roles.role,
      scrim_players_heroes_roles.roleNumber
      order by
      scrim_players_heroes_roles.teamNumber,
      scrim_players_heroes_roles.roleNumber
      `,
      ['scrim_players_heroes_roles'],
      [
        'scrimId',
        'mapId',
        'teamName',
        'teamNumber',
        'playerName',
        'role',
        'roleNumber',
        'heroes',
      ],
    ),
  ] as AlaSQLNode<ScrimPlayers>[])[`scrim_players${scrimId}${mapId}`];

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  console.log('data2', data);

  const uniquePlayers = data.reduce((acc, cur) => {
    const existingPlayer = acc.find(
      (e) =>
        e.playerName === cur.playerName &&
        e.teamName === cur.teamName &&
        e.role === cur.role,
    );
    if (existingPlayer) {
      existingPlayer.heroes.push(cur);
    } else {
      acc.push({
        playerName: cur.playerName,
        teamName: cur.teamName,
        teamNumber: cur.teamNumber,
        heroes: [cur],

        role: cur.role,
        roleNumber: cur.roleNumber,
      });
    }
    return acc;
  }, [] as {playerName: string; teamName: string; heroes: ScrimPlayers[]; role: string; roleNumber: number; teamNumber: number}[]);
  console.log('uniquePlayers', uniquePlayers);

  // sort by team one then team two, then by role
  const sortedPlayers = uniquePlayers.sort((a, b) => {
    if (a.teamNumber < b.teamNumber) {
      return -1;
    }
    if (a.teamNumber > b.teamNumber) {
      return 1;
    }
    if (a.roleNumber < b.roleNumber) {
      return -1;
    }
    if (a.roleNumber > b.roleNumber) {
      return 1;
    }
    return 0;
  });

  console.log('sortedPlayers', sortedPlayers);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      {data && data.length > 0 ? (
        data.map((player, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5em',
              marginTop: '0.5em',
            }}>
            {/* <AvatarGroup spacing={2} max={10}> */}
            {showRole && (
              <CardHeader
                sx={{
                  padding: '0',
                  mr: '1em',
                }}
                avatar={
                  <Avatar
                    alt={player.playerName}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: getColorgorical(player.teamName),
                    }}>
                    {getIcon(player.role)}
                  </Avatar>
                }
                title={player.playerName}
                titleTypographyProps={{
                  variant: 'h6',
                  sx: {
                    color: getColorgorical(player.teamName),
                    fontWeight: 'bold',
                  },
                }}
              />
            )}
            <Box
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
              }}>
              {player.heroes.map((hero, i) => (
                <PlayerHeroPopover
                  key={i}
                  playerName={player.playerName}
                  mapId={mapId}
                  hero={hero.hero}
                />
              ))}
            </Box>
            {/* </AvatarGroup> */}
          </div>
        ))
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          loading
        </div>
      )}
    </div>
  );
};

export default PlayerListMini;
