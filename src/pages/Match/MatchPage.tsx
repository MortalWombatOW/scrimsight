import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Card, CardContent, CardMedia, Container, Divider, Grid, Tab, Tabs, Typography, Box } from '@mui/material';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import MapTimeline from '../../components/MapTimeline/MapTimeline';
import { ChordDiagram } from '../../components/ChordDiagram/ChordDiagram';
import { mapNameToFileName } from '../../lib/string';
import { useAtom } from 'jotai';
import { matchStartExtractorAtom, matchEndExtractorAtom, matchDataAtom } from '../../atoms';

// Valid tab values for type safety
type MatchTab = 'timeline' | 'statistics' | 'interactions';
const VALID_TABS = new Set<MatchTab>(['timeline', 'statistics', 'interactions']);

export const MatchPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [tab, setTab] = useQueryParam('tab', withDefault(StringParam, 'timeline'));

  // Data fetching hooks
  const [matchStarts] = useAtom(matchStartExtractorAtom);
  const [matchEnds] = useAtom(matchEndExtractorAtom);
  const [matchData] = useAtom(matchDataAtom);

  const matchStart = matchStarts?.find((m: { matchId: string; mapName: string; mapType: string; team1Name: string; team2Name: string }) => m.matchId === matchId);
  const matchEnd = matchEnds?.find((m: { matchId: string; team1Score: number; team2Score: number }) => m.matchId === matchId);
  const match = matchData?.find((m: { matchId: string; fileName: string; fileModified: number }) => m.matchId === matchId);

  // Validate tab parameter
  useEffect(() => {
    if (tab && !VALID_TABS.has(tab as MatchTab)) {
      setTab('timeline');
    }
  }, [tab, setTab]);

  // Show loader while data is loading
  if (!matchStart || !matchEnd || !match) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Destructure data after loading check
  const { mapName, mapType, team1Name, team2Name } = matchStart;
  const { team1Score, team2Score } = matchEnd;
  const { fileName: name, fileModified } = match;

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

// Updated MatchHeader component
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
  <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
    <Grid container spacing={2}>
      {/* Image section: full width on xs, 4 columns on sm and up */}
      <Grid item xs={12} sm={4}>
        <CardMedia
          component="img"
          image={mapNameToFileName(mapName, false)}
          sx={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 1 }}
        />
      </Grid>
      {/* Content section */}
      <Grid item xs={12} sm={8}>
        <CardContent>
          <Typography variant="h5" component="div">
            {mapName} ({mapType})
          </Typography>
          <Divider sx={{ my: 2 }} />
          <ScoreRow team1Name={team1Name} team2Name={team2Name} team1Score={team1Score} team2Score={team2Score} />
          <Divider sx={{ my: 2 }} />
          <MetaRow fileModified={fileModified} name={name} />
        </CardContent>
      </Grid>
    </Grid>
  </Card>
);

// Subcomponent for score display
const ScoreRow = ({ team1Name, team2Name, team1Score, team2Score }: { team1Name: string; team2Name: string; team1Score: number; team2Score: number }) => (
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
const MetaRow = ({ fileModified, name }: { fileModified: number; name: string }) => (
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

// Updated TabNavigation component
const TabNavigation = ({ tab, setTab }: { tab: MatchTab; setTab: (value: string) => void }) => (
  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
    <Tabs
      value={tab}
      onChange={(_e, newValue) => setTab(newValue)}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      <Tab label="Timeline" value="timeline" />
      <Tab label="Statistics" value="statistics" />
      <Tab label="Interactions" value="interactions" />
    </Tabs>
  </Box>
);

// Updated TabContent for 'statistics' case
const TabContent = ({ tab, matchId }: { tab: MatchTab; matchId: string }) => {
  switch (tab) {
    case 'statistics':
      return (
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Match Statistics
          </Typography>
          <Typography variant="body1">
            Statistics visualization coming soon...
          </Typography>
        </Card>
      );
    case 'timeline':
      return <MapTimeline matchId={matchId} />;
    case 'interactions':
      return <ChordDiagram matchId={matchId} />;
    default:
      return null;
  }
};

export default MatchPage;

