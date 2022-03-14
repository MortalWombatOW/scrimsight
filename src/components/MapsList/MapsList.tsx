import React, {useMemo} from 'react';
import useData from '../../hooks/useData';
import {OWMap} from '../../lib/data/types';
import MapRow from '../MapRow/MapRow';
import {groupMapsByDate} from '../../lib/data/data';
import './MapsList.scss';

const MapsList = () => {
  const [data, updates] = useData<OWMap>('map');

  const groupedByTime = useMemo(() => {
    return groupMapsByDate(data);
  }, [updates]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="MapsList">
      <div className="MapsList-header">Maps</div>
      {Object.entries(groupedByTime).map(([date, maps]) => (
        <div key={date}>
          <div className="MapsList-datedivider">{date}</div>
          {maps.map((map) => (
            <MapRow key={map.mapId} map={map} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MapsList;
