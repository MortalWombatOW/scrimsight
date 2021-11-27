import React, {useMemo} from 'react';
import Header from '../../components/Header/Header';
import useData from './../../hooks/useData';
import {OWMap} from '../../lib/data/types';
import MapRow from './../../components/MapRow/MapRow';
import {groupMapsByDate} from '../../lib/data/data';

const Maps = () => {
  const data = useData<OWMap>('map');

  const groupedByTime = useMemo(() => {
    if (!data) {
      return {};
    }
    return groupMapsByDate(data);
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Maps">
      <Header />
      <div className="Maps-container">
        {Object.entries(groupedByTime).map(([date, maps]) => (
          <div key={date}>
            <div className="Maps-datedivider">{date}</div>
            {maps.map((map) => (
              <MapRow key={map.mapId} map={map} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maps;
