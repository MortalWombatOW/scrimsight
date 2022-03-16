import useData from 'hooks/useData';
import {OWMap, PlayerStatus} from 'lib/data/types';
import {
  getHeroesByPlayer,
  getHeroImage,
  getMostCommonHeroes,
  getTeamInfoForMap,
} from 'lib/data/data';
import React from 'react';
import {DamageIcon, SupportIcon, TankIcon} from 'components/Icon/Icon';
import 'components/MapInfo/MapInfo.scss';
import {heroNameToNormalized} from 'lib/string';

const PlayerAndHero = ({player, hero}: {player: string; hero: string}) => {
  return (
    <div className={`player ${heroNameToNormalized(hero)}`}>
      <img src={getHeroImage(hero)} alt={hero} />
      <div className="name">{player}</div>
    </div>
  );
};

const MapInfo = ({mapId}: {mapId: number}) => {
  const [mapList] = useData<OWMap>('map', mapId);

  const [statuses] = useData<PlayerStatus>('player_status', mapId);

  if (!mapList || !statuses) {
    return <div>Loading...</div>;
  }

  const playerHeroes = getHeroesByPlayer(statuses);
  const mostCommonHeroes = getMostCommonHeroes(playerHeroes);

  const map: OWMap = mapList[0];

  const {top, bottom} = getTeamInfoForMap(map);

  return (
    <div className="MapInfo">
      <p>
        File: {map.fileName} Map Name: {map.mapName} Uploaded:{' '}
        {new Date(map.timestamp).toLocaleString()}
      </p>
      <div className="team">
        {top.tanks.map((player, index) => (
          <PlayerAndHero
            key={index}
            player={player}
            hero={mostCommonHeroes[player]}
          />
        ))}
        {top.dps.map((player, index) => (
          <PlayerAndHero
            key={index}
            player={player}
            hero={mostCommonHeroes[player]}
          />
        ))}
        {top.supports.map((player, index) => (
          <PlayerAndHero
            key={index}
            player={player}
            hero={mostCommonHeroes[player]}
          />
        ))}
      </div>
      <div className="team">
        {bottom.tanks.map((player, index) => (
          <PlayerAndHero
            key={index}
            player={player}
            hero={mostCommonHeroes[player]}
          />
        ))}
        {bottom.dps.map((player, index) => (
          <PlayerAndHero
            key={index}
            player={player}
            hero={mostCommonHeroes[player]}
          />
        ))}
        {bottom.supports.map((player, index) => (
          <PlayerAndHero
            key={index}
            player={player}
            hero={mostCommonHeroes[player]}
          />
        ))}
      </div>
    </div>
  );
};

export default MapInfo;
