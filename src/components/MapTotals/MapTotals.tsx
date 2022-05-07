/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {PlayerInteraction, OWMap, PlayerStatus} from 'lib/data/types';
import './MapTotals.scss';
import useData from 'hooks/useData';
import {
  getHeroesByPlayer,
  getInteractionStat,
  getMostCommonHeroes,
  getPlayersToTeam,
} from 'lib/data/data';
import StackedBarChart from 'components/Chart/StackedBarChart';
import {heroNameToNormalized} from '../../lib/string';

const MapTotals = ({mapId}) => {
  const [mapList, mapListUpdates] = useData<OWMap>('map', mapId);
  const [interactions, updates] = useData<PlayerInteraction>(
    'player_interaction',
    mapId,
  );
  const [statuses, statusUpdates] = useData<PlayerStatus>(
    'player_status',
    mapId,
  );

  if (!interactions || !mapList || !statuses) {
    return <div>Loading...</div>;
  }

  if (mapList.length === 0) {
    return <div>No maps found</div>;
  }

  const map = mapList[0];

  const totalDamage = getInteractionStat(
    interactions,
    'sum',
    'damage',
    'player',
  );
  const totalHealing = getInteractionStat(
    interactions,
    'sum',
    'healing',
    'player',
  );
  const playersToTeam = getPlayersToTeam(map);
  const playerHeroes = getHeroesByPlayer(statuses);
  const mostCommonHeroes = getMostCommonHeroes(playerHeroes);

  const players = Object.keys(playersToTeam);

  // const damageData = players.map((player) => {
  //   return {
  //     value: totalDamage[player],
  //     barGroup: playersToTeam[player],
  //     withinBarGroup: player,
  //     clazz: heroNameToNormalized(mostCommonHeroes[player]),
  //   };
  // });

  // const healingData = players.flatMap((player) => {
  //   if (!totalHealing[player]) {
  //     return [];
  //   }
  //   return [
  //     {
  //       value: totalHealing[player],
  //       barGroup: playersToTeam[player],
  //       withinBarGroup: player,
  //       clazz: heroNameToNormalized(mostCommonHeroes[player]),
  //     },
  //   ];
  // });

  // //sort data by primary group then highest value
  // damageData.sort((a, b) => {
  //   if (a.barGroup === b.barGroup) {
  //     return b.value - a.value;
  //   }
  //   return a.barGroup.localeCompare(b.barGroup);
  // });
  // healingData.sort((a, b) => {
  //   if (a.barGroup === b.barGroup) {
  //     return b.value - a.value;
  //   }
  //   return a.barGroup.localeCompare(b.barGroup);
  // });

  return (
    <div className="MapTotals">
      <div className="statistic">
        <div className="label">Total Damage</div>
        {/* <StackedBarChart data={damageData} width={700} barHeight={30} /> */}
      </div>
      <div className="statistic">
        <div className="label">Total Healing</div>
        {/* <StackedBarChart data={healingData} width={700} barHeight={30} /> */}
      </div>
    </div>
  );
};

export default MapTotals;
