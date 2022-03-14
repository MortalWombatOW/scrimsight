import {DamageIcon, TankIcon, SupportIcon} from 'components/Icon/Icon';
import React from 'react';
import {OWMap} from 'lib/data/types';
import {useNavigate} from 'react-router-dom';
import {getTeamInfoForMap, getMapImage} from 'lib/data/data';
interface MapRowProps {
  map: OWMap;
}

const MapRow = (props: MapRowProps) => {
  const navigate = useNavigate();
  const {map} = props;

  const timestampString = new Date(map.timestamp).toLocaleString();
  const {top, bottom} = getTeamInfoForMap(map);
  const imageSrc = getMapImage(map.mapName);
  return (
    <button className="MapRow" onClick={() => navigate(`/map/${map.mapId}`)}>
      <div className="MapRow-image">
        <img src={imageSrc} alt={map.mapName} />
      </div>
      <div className="MapRow-name">{map.mapName}</div>
      <div className="MapRow-teams-col">
        <div className="MapRow-timestamp">{timestampString}</div>
      </div>
      <div className="MapRow-teams-col">
        <div className="MapRow-teams-row">{top.name}</div>
        <div className="MapRow-teams-row">{bottom.name}</div>
      </div>
      <div className="MapRow-teams-col">
        <div className="MapRow-teams-row">
          <div className="MapRow-player">
            <TankIcon />
            <span className="MapRow-playername">{top.tanks[0]}</span>
          </div>
          <div className="MapRow-player">
            <TankIcon />
            <span className="MapRow-playername">{top.tanks[1]}</span>
          </div>
        </div>
        <div className="MapRow-teams-row">
          <div className="MapRow-player MapRow-topmargin">
            <TankIcon />
            <span className="MapRow-playername">{bottom.tanks[0]}</span>
          </div>
          <div className="MapRow-player">
            <TankIcon />
            <span className="MapRow-playername">{bottom.tanks[1]}</span>
          </div>
        </div>
      </div>
      <div className="MapRow-teams-col">
        <div className="MapRow-teams-row">
          <div className="MapRow-player">
            <DamageIcon />
            <span className="MapRow-playername">{top.dps[0]}</span>
          </div>
          <div className="MapRow-player">
            <DamageIcon />
            <span className="MapRow-playername">{top.dps[1]}</span>
          </div>
        </div>
        <div className="MapRow-teams-row">
          <div className="MapRow-player MapRow-topmargin">
            <DamageIcon />
            <span className="MapRow-playername">{bottom.dps[0]}</span>
          </div>
          <div className="MapRow-player">
            <DamageIcon />
            <span className="MapRow-playername">{bottom.dps[1]}</span>
          </div>
        </div>
      </div>
      <div className="MapRow-teams-col">
        <div className="MapRow-teams-row">
          <div className="MapRow-player">
            <SupportIcon />
            <span className="MapRow-playername">{top.supports[0]}</span>
          </div>
          <div className="MapRow-player">
            <SupportIcon />
            <span className="MapRow-playername">{top.supports[1]}</span>
          </div>
        </div>
        <div className="MapRow-teams-row">
          <div className="MapRow-player MapRow-topmargin">
            <SupportIcon />
            <span className="MapRow-playername">{bottom.supports[0]}</span>
          </div>
          <div className="MapRow-player">
            <SupportIcon />
            <span className="MapRow-playername">{bottom.supports[1]}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default MapRow;
