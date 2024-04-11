import React from 'react';
import {useDataNode} from '../../hooks/useData';
import useWindowSize from '../../hooks/useWindowSize';
import ScrimOverview from './ScrimOverview';
import {Card, CardContent, Typography, Grid} from '@mui/material';
import {MapOverview} from '../../lib/data/NodeData';

const MapListCard = ({children}) => (
  <Card variant="outlined">
    <CardContent>{children}</CardContent>
  </Card>
);

const MapListHeader = ({maps}) => {
  const uniqueScrims = maps ? new Set(maps.map((e) => e.scrimId)).size : 0;
  const totalMaps = maps ? maps.length : 0;

  return (
    <>
      <Typography variant="h2" sx={{mb: '1em'}}>
        View scrims
      </Typography>
      <Typography variant="body1" sx={{mb: '1em'}}>
        Click on a map to see more details.
      </Typography>
      <Typography variant="h4" sx={{mb: '1em'}}>
        You've added {uniqueScrims} scrims and {totalMaps} maps.
      </Typography>
    </>
  );
};

const MapList = () => {
  const maps = useDataNode<MapOverview & {scrimId: number}>(
    'map_overview_with_scrim_id',
  );
  const {width} = useWindowSize();

  const mapOutput: (MapOverview & {scrimId: number})[] | undefined =
    maps.getOutput();

  const scrimMap: Map<number, any> = mapOutput
    ? mapOutput.reduce(
        (
          entryMap: Map<number, any>,
          e: {scrimId: number},
        ): Map<number, any> => {
          const scrimEntries = entryMap.get(e.scrimId) || [];
          return entryMap.set(e.scrimId, [...scrimEntries, e]);
        },
        new Map() as Map<number, any>,
      )
    : new Map<number, any>();

  return (
    <Grid container spacing={5}>
      {/* <Grid item>
        <MapListCard>
          <MapListHeader maps={mapOutput} />
        </MapListCard>
      </Grid> */}
      {mapOutput ? (
        Array.from(scrimMap.entries()).map(([scrimId, overviews]) => (
          <Grid item key={scrimId}>
            <ScrimOverview overviews={overviews} scrimId={scrimId} />
          </Grid>
        ))
      ) : (
        <div>No data</div>
      )}
    </Grid>
  );
};

export default MapList;
