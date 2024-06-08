import React, {useEffect, useState} from 'react';
import {AlaSQLNode} from '../../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../../hooks/useData';

import useUUID from '../../../hooks/useUUID';
import usePlayerLives from '../../../hooks/data/usePlayerLives';
import {usePlayerContext} from '../context/PlayerContext';

type PlayerDescription = {
  name: string;
  teams: string[];
  timePlayed: number;
  heroes: {
    hero: string;
    timePlayed: number;
  }[];
  mapsPlayed: number[];
};

const usePlayerInfo = (): PlayerDescription | null => {
  const {playerName} = usePlayerContext();
  const uuid = useUUID();
  const data = useDataNodes([
    new AlaSQLNode(
      'usePlayerInfo_' + playerName + '_' + uuid,
      'Use Player Info',
      `SELECT
        player_stat.playerName,
        player_stat.playerTeam,
        player_stat.playerHero,
        player_stat.mapId
      FROM ? AS player_stat
      WHERE
        player_stat.playerName = '${playerName}'
      `,
      ['player_stat_object_store'],
      ['playerName', 'playerTeam', 'playerHero', 'mapId'],
    ),
  ]);

  console.log('usePlayerInfo', playerName, data);

  const playerData = data['usePlayerInfo_' + playerName + '_' + uuid];

  console.log('playerData', playerData);

  const playerLives = usePlayerLives()?.[playerName || ''];

  console.log('playerLives', playerLives);

  const [playerInfo, setPlayerInfo] = useState<PlayerDescription | null>(null);

  useEffect(() => {
    if (!playerData || !playerLives || !playerName) {
      return;
    }

    const teams: string[] = Array.from(
      new Set(playerData.map((p: {playerTeam: string}) => p.playerTeam)),
    );
    const heroNames = Array.from(
      new Set(playerData.map((p: {playerHero: string}) => p.playerHero)),
    );
    const maps: number[] = Array.from(
      new Set(playerData.map((p: {mapId: number}) => p.mapId)),
    );
    const timePlayed = playerLives.reduce(
      (acc: number, cur: any) => acc + cur.endTime - cur.startTime,
      0,
    );
    const heroes = heroNames.map((hero: string) => {
      const timePlayed = playerLives
        .filter((p: {playerHero: string}) => p.playerHero === hero)
        .reduce(
          (acc: number, cur: any) => acc + cur.endTime - cur.startTime,
          0,
        );

      return {
        hero,
        timePlayed,
      };
    });

    setPlayerInfo({
      name: playerName,
      teams,
      timePlayed,
      heroes,
      mapsPlayed: maps,
    });
  }, [JSON.stringify(playerData), JSON.stringify(playerLives)]);

  return playerInfo;
};

export default usePlayerInfo;
