import React from 'react';

import {useParams} from 'react-router-dom';
import {PlayerStatFormatted} from '../../lib/data/NodeData';
import Header from '../../components/Header/Header';
import {AlaSQLNode} from '../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../hooks/useData';
import MapPlayerTable from '../../components/MapPlayerTable';
import MapSummary from '../../components/MapSummary';
import {Container, Tab, Tabs} from '@mui/material';
import MapSummaryStats from '../../components/MapSummaryStats';
import MapTimeline from '../../components/MapTimeline';
import {
  NumberParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';

const MapPage = () => {
  const params = useParams<{mapId: string}>();
  const mapId: string = params.mapId!;

  const [round, setRound] = useQueryParam('round', withDefault(NumberParam, 0));
  // view - 'overview', 'players', 'timeline'
  const [view, setView] = useQueryParam(
    'view',
    withDefault(StringParam, 'overview'),
  );

  const data = useDataNodes([
    new AlaSQLNode<PlayerStatFormatted>(
      'MapPage_map_rounds_' + mapId,
      `SELECT
       array(round_start.roundNumber) as roundNumbers
      FROM ? AS round_start
      WHERE
        round_start.mapId = ${mapId}
       `,
      ['round_start_object_store'],
    ),
  ]);

  const roundsData = data['MapPage_map_rounds_' + mapId];

  if (roundsData === undefined) {
    return <div>Loading...</div>;
  }

  const rounds = roundsData[0].roundNumbers as number[];
  const multipleRounds = rounds.length > 1;

  return (
    <div style={{margin: '1em'}}>
      <Header filters={{}} setFilters={() => {}} />
      <Container maxWidth="xl">
        <MapSummary mapId={Number.parseInt(mapId, 10)} />

        <Tabs value={view} onChange={(event, newValue) => setView(newValue)}>
          <Tab label="Overview" value="overview" />
          <Tab label="Players" value="players" />
          <Tab label="Timeline" value="timeline" />
        </Tabs>
        <Tabs value={round} onChange={(event, newValue) => setRound(newValue)}>
          <Tab label="Whole Map" value={0} />
          {multipleRounds &&
            rounds.map((round) => (
              <Tab key={round} label={`Round ${round}`} value={round} />
            ))}
        </Tabs>
        {view === 'overview' && (
          <MapSummaryStats mapId={Number.parseInt(mapId, 10)} roundId={round} />
        )}
        {view === 'players' && (
          <MapPlayerTable mapId={Number.parseInt(mapId, 10)} roundId={round} />
        )}

        {view === 'timeline' && (
          <MapTimeline mapId={Number.parseInt(mapId, 10)} roundId={round} />
        )}
      </Container>
    </div>
  );
};

export default MapPage;
