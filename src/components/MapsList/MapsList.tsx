import React, {useMemo} from 'react';
import {useResult} from '../../hooks/useQueries';
import {groupMapsByDate} from '../../lib/data/data';
import {OWMap} from '../../lib/data/types';
import {Typography} from '../Common/Mui';
import MapRow from '../MapRow/MapRow';
import './MapsList.scss';

type MapsListProps = {
  height: number;
  onLoaded: () => void;
};

const MapsList = ({height, onLoaded}: MapsListProps) => {
  const [results, tick] = useResult<OWMap>('map');

  const groupedByTime = useMemo(() => {
    return groupMapsByDate(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <div className="MapsList">
      <div className="MapsList-header">
        <Typography
          sx={{
            fontSize: '25px',
            fontWeight: 'bold',
          }}>
          Select a map
        </Typography>
      </div>
      <div
        style={{
          height: height - 58,
          overflowY: 'scroll',
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
        }}>
        {Object.entries(groupedByTime).map(([date, maps]) => (
          <div key={date}>
            <div className="MapsList-datedivider">{date}</div>
            {maps.map((map) => (
              <MapRow key={map.mapId} map={map} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapsList;
