import React, {useMemo} from 'react';
import {useResult} from '../../hooks/useQueries';
import {groupMapsByDate} from '../../lib/data/data';
import {OWMap} from '../../lib/data/types';
import MapRow from '../MapRow/MapRow';
import './MapsList.scss';

const MapsList = ({updateCount}: {updateCount: number}) => {
  const [results, tick] = useResult('maps');

  console.log(updateCount);

  // const groupedByTime = useMemo(() => {
  //   return groupMapsByDate();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tick]);

  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <div className="MapsList">
      <div className="MapsList-header">Maps</div>
      {/* {Object.entries(groupedByTime).map(([date, maps]) => (
        <div key={date}>
          <div className="MapsList-datedivider">{date}</div>
          {maps.map((map) => (
            <MapRow key={map.mapId} map={map} />
          ))}
        </div>
      ))} */}
    </div>
  );
};

export default MapsList;
