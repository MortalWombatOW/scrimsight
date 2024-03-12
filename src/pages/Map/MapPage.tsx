import React, {useEffect} from 'react';

import {useParams} from 'react-router-dom';
import {PlayerStatFormatted} from '../../lib/data/NodeData';
import Header from '../../components/Header/Header';
import {AlaSQLNode} from '../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../hooks/useData';
import MapPlayerTable from '../../components/MapPlayerTable';
import MapSummary from '../../components/MapSummary';
import {Button, Container, Tab, Tabs} from '@mui/material';
import MapSummaryStats from '../../components/MapSummaryStats';
import MapTimeline from '../../components/MapTimeline';
import {
  NumberParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';
import useMapTimes from '../../hooks/data/useMapTimes';
import {TeamContext} from '../../context/TeamContext';
import {useMapContext} from '../../context/MapContext';

const MapPage = () => {
  const params = useParams<{mapId: string}>();
  const mapIdParam: string = params.mapId!;

  const {mapId, setMapId} = useMapContext();

  console.error('mapIdParam', mapIdParam);

  useEffect(() => {
    console.error('setting mapIdParam', mapIdParam);
    setMapId(Number.parseInt(mapIdParam, 10));
  }, [mapIdParam, setMapId]);

  const mapTimes = useMapTimes();

  // view - 'overview', 'players', 'timeline'
  const [view, setView] = useQueryParam(
    'view',
    withDefault(StringParam, 'overview'),
  );

  const [round, setRound] = useQueryParam('round', withDefault(NumberParam, 0));

  const [startTime, setStartTime] = useQueryParam(
    'startTime',
    withDefault(NumberParam, 0),
  );
  const [endTime, setEndTime] = useQueryParam(
    'endTime',
    withDefault(NumberParam, 9999),
  );

  useEffect(() => {
    if (mapTimes) {
      setStartTime(mapTimes[round].startTime);
      setEndTime(mapTimes[round].endTime);
    }
  }, [mapTimes, round]);

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
    new AlaSQLNode(
      'MapPage_map_teams_' + mapId,
      `SELECT
        team1Name,
        team2Name
      FROM ? AS match_start
      WHERE
        match_start.mapId = ${mapId}
      `,
      ['match_start_object_store'],
    ),
  ]);

  const roundsData = data['MapPage_map_rounds_' + mapId];
  const teamsData = data['MapPage_map_teams_' + mapId];

  const {setTeamNames} = React.useContext(TeamContext);

  useEffect(() => {
    console.error('teamsData', teamsData);
    if (teamsData === undefined) {
      return;
    }
    setTeamNames(teamsData[0].team1Name, teamsData[0].team2Name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(teamsData)]);

  if (roundsData === undefined) {
    return <div>Loading...</div>;
  }

  const rounds = roundsData[0].roundNumbers as number[];
  const multipleRounds = rounds.length > 1;

  return (
    <div style={{margin: '1em'}}>
      <Header />
      <Container maxWidth="xl">
        <MapSummary />

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
        {view === 'overview' && <MapSummaryStats />}
        {view === 'players' && <MapPlayerTable />}

        {view === 'timeline' && <MapTimeline />}
      </Container>
    </div>
  );
};

export default MapPage;
