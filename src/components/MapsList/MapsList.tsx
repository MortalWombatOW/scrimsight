import React, {useMemo} from 'react';
import {DataRow} from '~/lib/data/logging/spec';
import {useQuery, useResult} from '../../hooks/useQueries';
import {groupMapsByDate} from '../../lib/data/data';
import MapRow from '../MapRow/MapRow';
import {Button, Typography} from '@mui/material';
import Uploader from '~/components/Uploader/Uploader';

type MapsListProps = {
  onLoaded: () => void;
};

const MapsList = ({onLoaded}: MapsListProps) => {
  const [results, tick] = useQuery<object>(
    {
      name: 'all_maps',
      query: {
        select: [
          {table: 'maps', field: 'id'},
          {table: 'maps', field: 'name'},
          {table: 'maps', field: 'fileModified'},
          {table: 'match_start', field: 'Map Name'},
          {table: 'match_start', field: 'Map Type'},
          {table: 'match_start', field: 'Team 1 Name'},
          {table: 'match_start', field: 'Team 2 Name'},
          {
            aggregation: 'array',
            value: {table: 'player_stat', field: 'Player Name'},
            as: 'Players',
          },
        ],
        from: [
          {
            field: 'id',
            table: 'maps',
          },
          {
            field: 'Map ID',
            table: 'match_start',
          },
          {
            field: 'Map ID',
            table: 'player_stat',
          },
        ],
        groupBy: [
          {table: 'maps', field: 'id'},
          {table: 'maps', field: 'name'},
          {table: 'maps', field: 'fileModified'},
          {table: 'match_start', field: 'Map Name'},
          {table: 'match_start', field: 'Map Type'},
          {table: 'match_start', field: 'Team 1 Name'},
          {table: 'match_start', field: 'Team 2 Name'},
        ],
        orderBy: [
          {
            value: {
              field: 'fileModified',
              table: 'maps',
            },
            order: 'desc',
          },
        ],
      },

      // `
      // SELECT
      //   maps.id,
      //   maps.name,
      //   maps.fileModified,
      //   match_start.[Map Name],
      //   match_start.[Map Type],
      //   match_start.[Team 1 Name],
      //   match_start.[Team 2 Name],
      //   ARRAY({
      //     [Player Name]:  player_stat.[Player Name],
      //     [Player Team]:  player_stat.[Player Team]
      //   }) as Players
      // FROM maps
      // join match_start on maps.id = match_start.[Map ID]
      // join player_stat on maps.id = player_stat.[Map ID]
      // group by
      //   maps.id,
      //   maps.name,
      //   maps.fileModified,
      //   match_start.[Map Name],
      //   match_start.[Map Type],
      //   match_start.[Team 1 Name],
      //   match_start.[Team 2 Name]
      // `,
      deps: [],
    },
    [],
  );

  console.log('results:', results, tick);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <Typography variant="h1">Maps</Typography>
      <div style={{display: 'flex', gap: '8px'}}>
        <Uploader refreshCallback={() => {}} />
        <Button variant='contained' color='secondary'>Search</Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        {results.map((map, i) => (
          <MapRow
            key={map['id']}
            map={map}
            size={i === selectedId ? 'full' : 'compact'}
            click={() => setSelectedId(i === selectedId ? null : i)}
          />
        ))}
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
