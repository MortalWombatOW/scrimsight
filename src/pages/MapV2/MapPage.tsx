import React, {useState} from 'react';

import {useParams} from 'react-router-dom';
import {PlayerStatFormatted} from '../../lib/data/NodeData';
import Header from '../../components/Header/Header';
import LayoutContainer from '../../Layout/LayoutContainer';
import OverviewTimeline from '../../components/OverviewTimeline';
import DebugNodeGraph from '../../components/Debug/DebugNodeGraph';
import {AlaSQLNode} from '../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../hooks/useData';
import MapPlayerTable from '../../components/MapPlayerTable';
import MapSummary from '../../components/MapSummary';
import {Container, Tab, Tabs} from '@mui/material';
import MapSummaryStats from '../../components/MapSummaryStats';
import MapTimeline from '../../components/MapTimeline';

const MapPage = () => {
  const params = useParams<{mapId: string}>();
  const mapId: string = params.mapId!;
  const [selectedRound, setSelectedRound] = useState<number>(0);

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

        <Tabs
          value={selectedRound}
          onChange={(event, newValue) => setSelectedRound(newValue)}
          aria-label="basic tabs example">
          <Tab label="Whole Map" value={0} />
          {multipleRounds &&
            rounds.map((round) => (
              <Tab key={round} label={`Round ${round}`} value={round} />
            ))}
        </Tabs>
        <MapSummaryStats
          mapId={Number.parseInt(mapId, 10)}
          roundId={selectedRound}
        />

        <MapPlayerTable
          mapId={Number.parseInt(mapId, 10)}
          roundId={selectedRound}
        />

        <MapTimeline
          mapId={Number.parseInt(mapId, 10)}
          roundId={selectedRound}
        />
      </Container>
    </div>
  );
};

export default MapPage;
