import React, {useMemo} from 'react';
import {DataRow} from '~/lib/data/logging/spec';
import useQueries, {useQuery, useResult} from '../../hooks/useQueries';
import {groupMapsByDate} from '../../lib/data/data';
import MapRow from '../MapRow/MapRow';
import {Button, Typography} from '@mui/material';
import Uploader from '~/components/Uploader/Uploader';
import {QueryBuilder} from '~/lib/data/QueryBuilder';
import MapInfo from '~/components/MapInfo/MapInfo';

type MapsListProps = {
  onLoaded: () => void;
};

const MapsList = ({onLoaded}: MapsListProps) => {
  const [results, tick] = useQueries(
    [
      {
        name: 'all_maps',
        query: new QueryBuilder()
          .select([{table: 'maps', field: 'id'}])
          .from([
            {
              field: 'id',
              table: 'maps',
            },
          ])
          .groupBy([{table: 'maps', field: 'id'}])
          .orderBy([
            {
              value: {
                field: 'fileModified',
                table: 'maps',
              },
              order: 'desc',
            },
          ]),
      },
    ],
    [],
  );

  console.log('results:', results, tick);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const collapsed = selectedId !== null;
  if (!results['all_maps']) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <Typography variant="h1">Maps</Typography>
      <div style={{display: 'flex', gap: '8px'}}>
        <Uploader refreshCallback={() => {}} />
        <Button variant="contained" color="secondary">
          Search
        </Button>
      </div>
      <div
        style={{
          display: 'inline-block',
          
        }}>
        {results['all_maps']
          .filter((map, i) => selectedId === null || i === selectedId)
          .map((map, i) => (
            <div
              key={map['id']}>
              <MapRow
                key={map['id']}
                mapId={map['id']}
                size={i === selectedId ?'compact' : 'full'  }
                click={() => setSelectedId(i === selectedId ? null : i)}
              />
            </div>
          ))}
      </div>
      {selectedId !== null && (
        <MapInfo
          mapId={results['all_maps'][selectedId]['id']}
          selectedPlayerNames={[]}
          setSelectedPlayerNames={() => {}}
        />
      )}
    </div>
  );
};

export default MapsList;
