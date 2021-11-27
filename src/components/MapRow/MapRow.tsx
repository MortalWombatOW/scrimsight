import {DamageIcon, TankIcon} from '../../components/Icon/Icon';
import React from 'react';
import {OWMap} from '../../lib/data/types';
import {SupportIcon} from './../Icon/Icon';

interface MapRowProps {
  map: OWMap;
}

const MapRow = (props: MapRowProps) => {
  const {map} = props;
  const {mapName: name, team1, team2, team1Name, team2Name, roles} = map;
  const imageSrc = `/public/assets/maps/${map.mapName
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll(`'`, '')}.jpg`;

  const tanks = Object.entries(roles)
    .filter(([player, role]) => role === 'tank')
    .map(([player, role]) => player);

  const dps = Object.entries(map.roles)
    .filter(([player, role]) => role === 'damage')
    .map(([player, role]) => player);

  const supports = Object.entries(map.roles)
    .filter(([player, role]) => role === 'support')
    .map(([player, role]) => player);

  const team1Tanks = tanks.filter((tank) => team1.includes(tank));
  const team2Tanks = tanks.filter((tank) => team2.includes(tank));
  const team1Dps = dps.filter((dps) => team1.includes(dps));
  const team2Dps = dps.filter((dps) => team2.includes(dps));
  const team1Supports = supports.filter((support) => team1.includes(support));
  const team2Supports = supports.filter((support) => team2.includes(support));

  return (
    <div className="MapRow">
      <div className="MapRow-image">
        <img src={imageSrc} alt={map.mapName} />
      </div>
      <div className="MapRow-name">{map.mapName}</div>
      <div className="MapRow-teams-col">
        <div className="MapRow-teams-row">{team1Name}</div>
        <div className="MapRow-teams-row">{team2Name}</div>
      </div>
      <div className="MapRow-teams-col">
        <div className="MapRow-teams-row">
          <div className="MapRow-player">
            <TankIcon />
            <span className="MapRow-playername">{team1Tanks[0]}</span>
          </div>
          <div className="MapRow-player">
            <TankIcon />
            <span className="MapRow-playername">{team1Tanks[1]}</span>
          </div>
        </div>
        <div className="MapRow-teams-row">
          <div className="MapRow-player MapRow-topmargin">
            <TankIcon />
            <span className="MapRow-playername">{team2Tanks[0]}</span>
          </div>
          <div className="MapRow-player">
            <TankIcon />
            <span className="MapRow-playername">{team2Tanks[1]}</span>
          </div>
        </div>
      </div>
      <div className="MapRow-teams-col">
        <div className="MapRow-teams-row">
          <div className="MapRow-player">
            <DamageIcon />
            <span className="MapRow-playername">{team1Dps[0]}</span>
          </div>
          <div className="MapRow-player">
            <DamageIcon />
            <span className="MapRow-playername">{team1Dps[1]}</span>
          </div>
        </div>
        <div className="MapRow-teams-row">
          <div className="MapRow-player MapRow-topmargin">
            <DamageIcon />
            <span className="MapRow-playername">{team2Dps[0]}</span>
          </div>
          <div className="MapRow-player">
            <DamageIcon />
            <span className="MapRow-playername">{team2Dps[1]}</span>
          </div>
        </div>
      </div>
      <div className="MapRow-teams-col">
        <div className="MapRow-teams-row">
          <div className="MapRow-player">
            <SupportIcon />
            <span className="MapRow-playername">{team1Supports[0]}</span>
          </div>
          <div className="MapRow-player">
            <SupportIcon />
            <span className="MapRow-playername">{team1Supports[1]}</span>
          </div>
        </div>
        <div className="MapRow-teams-row">
          <div className="MapRow-player MapRow-topmargin">
            <SupportIcon />
            <span className="MapRow-playername">{team2Supports[0]}</span>
          </div>
          <div className="MapRow-player">
            <SupportIcon />
            <span className="MapRow-playername">{team2Supports[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapRow;
