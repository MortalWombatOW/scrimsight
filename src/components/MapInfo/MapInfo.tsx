import useData from 'hooks/useData';
import {OWMap} from 'lib/data/types';
import {getTeamInfoForMap} from 'lib/data/data';
import React from 'react';
import {DamageIcon, SupportIcon, TankIcon} from 'components/Icon/Icon';
import 'components/MapInfo/MapInfo.scss';

const MapInfo = ({mapId}: {mapId: number}) => {
  const [mapList, mapUpdates] = useData<OWMap>('map', mapId);

  if (!mapList) {
    return <div>Loading...</div>;
  }

  const map: OWMap = mapList[0];

  const {top, bottom} = getTeamInfoForMap(map);

  return (
    <div className="MapInfo">
      <p>
        File: {map.fileName} Map Name: {map.mapName} Uploaded:{' '}
        {new Date(map.timestamp).toLocaleString()}
      </p>
      <p className="team">
        {top.name}: <TankIcon /> {top.tanks.join(', ')} <DamageIcon />{' '}
        {top.dps.join(', ')}
        <SupportIcon /> {top.supports.join(', ')}
      </p>
      <p className="team">
        {bottom.name}: <TankIcon /> {bottom.tanks.join(', ')} <DamageIcon />{' '}
        {bottom.dps.join(', ')}
        <SupportIcon /> {bottom.supports.join(', ')}
      </p>
    </div>
  );
};

export default MapInfo;
