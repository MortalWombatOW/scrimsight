import React, {useEffect, useMemo} from 'react';
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
  onMapSelected: (mapId: number | undefined) => void;
};

const MapsList = ({onLoaded, onMapSelected}: MapsListProps) => {
  const [{MapsList_allMaps: maps}, tick, loaded] = useQueries(
    [
      {
        name: 'MapsList_allMaps',
        query: `select \
          match_start.[Map ID] \
        from match_start`,
      },
    ],
    [],
  );

  console.log('results:', maps, tick);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  useEffect(() => {
    onMapSelected(selectedId === null ? undefined : maps[selectedId]['Map ID']);
  }, [selectedId]);

  if (!loaded) {
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
        {maps
          .filter((map, i) => selectedId === null || i === selectedId)
          .map((map, i) => (
            <div key={map['Map ID']}>
              <MapRow
                key={map['Map ID']}
                mapId={map['Map ID']}
                size={'compact'}
                click={() => setSelectedId(i === selectedId ? null : i)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MapsList;
