import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Card, CardContent, CardMedia, Container, Divider, Grid, Tab, Tabs, Typography, Box } from '@mui/material';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import MapTimeline from '../../components/MapTimeline/MapTimeline';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import { mapNameToFileName } from '../../lib/string';
import { MatchStartLogEvent, MatchEndLogEvent } from '../../WombatDataFrameworkSchema';
import { useWombatData } from 'wombat-data-framework';

// Valid tab values for type safety
type MatchTab = 'timeline' | 'statistics' | 'interactions';
const VALID_TABS = new Set<MatchTab>(['timeline', 'statistics', 'interactions']);

export const MatchPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [tab, setTab] = useQueryParam('tab', withDefault(StringParam, 'timeline'));

  // Data fetching hooks
  const matchStart = useWombatData<MatchStartLogEvent>('match_start_object_store', { initialFilter: { matchId } });
  const matchEnd = useWombatData<MatchEndLogEvent>('match_end_object_store', { initialFilter: { matchId } });
  const matchMeta = useWombatData<{ name: string; fileModified: number }>('match_object_store', { initialFilter: { matchId } });

  // Validate tab parameter
  useEffect(() => {
    if (tab && !VALID_TABS.has(tab as MatchTab)) {
      setTab('timeline');
    }
  }, [tab, setTab]);

  // Show loader while data is loading
  if (!matchStart.data[0] || !matchEnd.data[0] || !matchMeta.data[0]) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Destructure data after loading check
  const { mapName, mapType, team1Name, team2Name } = matchStart.data[0];
  const { team1Score, team2Score } = matchEnd.data[0];
  const { name, fileModified } = matchMeta.data[0];

  return (
    <Container>
      <MatchHeader
        mapName={mapName}
        mapType={mapType}
        team1Name={team1Name}
        team2Name={team2Name}
        team1Score={team1Score}
        team2Score={team2Score}
        fileModified={fileModified}
        name={name}
      />

      <TabNavigation tab={tab as MatchTab} setTab={setTab} />

      <TabContent
        tab={tab as MatchTab}
        matchId={matchId!}
      />
    </Container>
  );
};

// Subcomponent for match header card
const MatchHeader = ({
  mapName,
  mapType,
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  fileModified,
  name
}: {
  mapName: string;
  mapType: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  fileModified: number;
  name: string;
}) => (
  <Card sx={{ width: '100%', minWidth: '500px', marginBottom: '1em' }}>
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <CardMedia component="img" image={mapNameToFileName(mapName, false)} sx={{ height: '100%' }} />
      </Grid>
      <Grid item xs={10}>
        <CardContent>
          <Typography variant="h6" component="div">
            {mapName} ({mapType})
          </Typography>
          <Divider sx={{ my: 1 }} />
          <ScoreRow
            team1Name={team1Name}
            team2Name={team2Name}
            team1Score={team1Score}
            team2Score={team2Score}
          />
          <Divider sx={{ my: 1 }} />
          <MetaRow fileModified={fileModified} name={name} />
        </CardContent>
      </Grid>
    </Grid>
  </Card>
);

// Subcomponent for score display
const ScoreRow = ({ team1Name, team2Name, team1Score, team2Score }: any) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography variant="body1">{team1Name}</Typography>
      <Typography variant="h6">{team1Score}</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body1" align="right">
        {team2Name}
      </Typography>
      <Typography variant="h6" align="right">
        {team2Score}
      </Typography>
    </Grid>
  </Grid>
);

// Subcomponent for metadata row
const MetaRow = ({ fileModified, name }: any) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography variant="body2" color="text.secondary">
        {new Date(fileModified).toLocaleString()}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2" color="text.secondary" align="right">
        {name}
      </Typography>
    </Grid>
  </Grid>
);

// Subcomponent for tab navigation
const TabNavigation = ({ tab, setTab }: { tab: MatchTab; setTab: (value: string) => void }) => (
  <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '1em' }}>
    <Tabs value={tab} onChange={(_e, value) => setTab(value)}>
      <Tab label="Timeline" value="timeline" />
      <Tab label="Statistics" value="statistics" />
      <Tab label="Interactions" value="interactions" />
    </Tabs>
  </Box>
);

// Subcomponent for tab content
const TabContent = ({ tab, matchId }: { tab: MatchTab; matchId: string }) => {
  switch (tab) {
    case 'statistics':
      return <div>Statistics</div>;
    case 'timeline':
      return <MapTimeline matchId={matchId} />;
    case 'interactions':
      return <ChordDiagram matchId={matchId} />;
    default:
      return null;
  }
};

