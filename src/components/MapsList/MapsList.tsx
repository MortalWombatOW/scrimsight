import React, {useMemo} from 'react';
import { DataRow } from '~/lib/data/logging/spec';
import {useQuery, useResult} from '../../hooks/useQueries';
import {groupMapsByDate} from '../../lib/data/data';
import {Typography} from '../Common/Mui';
import MapRow from '../MapRow/MapRow';
import './MapsList.scss';

type MapsListProps = {
  height: number;
  onLoaded: () => void;
};

const MapsList = ({height, onLoaded}: MapsListProps) => {
  const [results, tick] = useQuery(
    {
      name: 'all_maps',
      query: `SELECT maps.id, match_start.[Map Name], match_start.[Map Type], match_start.[Team 1 Name], match_start.[Team 2 Name], ARRAY({[Player Name]:  player_stat.[Player Name], [Player Team]:  player_stat.[Player Team]}) as players FROM maps inner join match_start on maps.id = match_start.[Map ID] join player_stat on maps.id = player_stat.[Map ID] group by maps.id, match_start.[Map Name], match_start.[Map Type], match_start.[Team 1 Name], match_start.[Team 2 Name]`,
      deps: [],
    },
    [],
  )

  console.log('results:',
    results, tick);

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
        {/* {Object.entries(groupedByTime).map(([date, maps]) => (
          <div key={date}>
            <div className="MapsList-datedivider">{date}</div>
            {maps.map((map) => (
              <MapRow key={map.mapId} map={map} />
            ))}
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default MapsList;
