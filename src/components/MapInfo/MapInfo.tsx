import useData from 'hooks/useData';
import {OWMap, PlayerStatus} from 'lib/data/types';
import {
  getHeroesByPlayer,
  getHeroImage,
  getMostCommonHeroes,
  getTeamInfoForMap,
} from 'lib/data/data';
import React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import 'components/MapInfo/MapInfo.scss';
import {heroNameToNormalized, mapNameToFileName} from 'lib/string';
import Grid from '@mui/material/Grid';

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
      <div
        className="mapname"
        style={{
          backgroundImage: `url(${mapNameToFileName(map.mapName, false)})`,
        }}>
        <div className="txt">{map.mapName}</div>
      </div>
      <Grid container direction="row" alignItems="center">
        <InsertDriveFileIcon /> {map.fileName}
        <AccessTimeIcon
          style={{
            marginLeft: '1rem',
          }}
        />{' '}
        {new Date(map.timestamp).toLocaleString()}
      </Grid>
      <div className="team">
        <div className="team-name">{top.name}</div>
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
      <div className="versus">vs.</div>
      <div className="team">
        <div className="team-name">{bottom.name}</div>
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
