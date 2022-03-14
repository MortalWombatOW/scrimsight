import React from 'react';
import {PlayerInteraction, OWMap} from 'lib/data/types';
import './MapTotals.scss';
import useData from 'hooks/useData';
import {getTotalDamage, getTotalHealing} from 'lib/data/data';
import StackedBarChart from 'components/Chart/StackedBarChart';

const MapTotals = ({mapId}) => {
  const [mapList, mapListUpdates] = useData<OWMap>('map');
  const [interactions, updates] = useData<PlayerInteraction>(
    'player_interaction',
    mapId,
  );

  if (!interactions || !mapList) {
    return <div>Loading...</div>;
  }

  const map = mapList[0];

  const totalDamage = getTotalDamage(interactions);
  const totalHealing = getTotalHealing(interactions);

  console.log(totalHealing);

  const players = Object.keys(totalDamage);
  // sort players by highest damage
  //   players.sort((a, b) => totalDamage.values[b] - totalDamage.values[a]);
  const playersToTeam = players.reduce((acc, player) => {
    const team = map.team1.includes(player) ? map.team1Name : map.team2Name;
    acc[player] = team;
    return acc;
  }, {});

  //   console.log(playersToTeam);

  const damageData = players.map((player) => {
    return {
      value: totalDamage[player],
      primaryGroup: playersToTeam[player],
      secondaryGroup: player,
    };
  });

  const healingData = players.flatMap((player) => {
    if (!totalHealing[player]) {
      return [];
    }
    return [
      {
        value: totalHealing[player],
        primaryGroup: playersToTeam[player],
        secondaryGroup: player,
      },
    ];
  });

  //sort data by primary group then highest value
  damageData.sort((a, b) => {
    if (a.primaryGroup === b.primaryGroup) {
      return b.value - a.value;
    }
    return a.primaryGroup.localeCompare(b.primaryGroup);
  });
  healingData.sort((a, b) => {
    if (a.primaryGroup === b.primaryGroup) {
      return b.value - a.value;
    }
    return a.primaryGroup.localeCompare(b.primaryGroup);
  });

  return (
    <div className="MapTotals">
      <div className="statistic">
        <div className="label">Total Damage</div>
        <StackedBarChart data={damageData} width={700} barHeight={50} />
      </div>
      <div className="statistic">
        <div className="label">Total Healing</div>
        <StackedBarChart data={healingData} width={700} barHeight={50} />
      </div>
    </div>
  );
};

export default MapTotals;
