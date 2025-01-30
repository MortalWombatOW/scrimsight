import { useWombatData } from "wombat-data-framework";
import { mapNameToFileName } from "~/lib/string";
import { MatchData } from "~/WombatDataFrameworkSchema";
import { Box, Card, CardActionArea, Typography, Grid, Avatar, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const MatchRowSkeleton = () => (
  <Card sx={{ mb: 2, width: '100%' }}>
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rounded" width={60} height={60} />
            <Box>
              <Skeleton variant="text" width={100} height={24} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="text" width={120} height={28} />
          <Skeleton variant="text" width={180} height={20} />
        </Grid>
        <Grid item xs={2}>
          <Skeleton variant="text" width={60} height={32} />
        </Grid>
        <Grid item xs={3}>
          <Skeleton variant="text" width={120} height={28} />
          <Skeleton variant="text" width={180} height={20} />
        </Grid>
        <Grid item xs={1}>
          <Skeleton variant="text" width={60} height={20} />
        </Grid>
      </Grid>
    </Box>
  </Card>
);

const MatchInfo = ({ map, mode, imageUrl }: {
  map: string;
  mode: string;
  imageUrl: string;
}) => (
  <Grid item xs={2}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar src={imageUrl} variant="rounded" sx={{ width: 60, height: 60 }} />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {map}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {mode}
        </Typography>
      </Box>
    </Box>
  </Grid>
);

const TeamSection = ({ name, players }: {
  name: string;
  players: string[];
}) => (
  <>
    <Typography variant="h6" component="div">
      {name}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {players.length > 0 ? players.join(", ") : "No players"}
    </Typography>
  </>
);

const MatchRow = ({ matchId }: { matchId: string }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useWombatData<MatchData>('match_data', {
    initialFilter: { matchId }
  });

  const match = data[0];
  const imageUrl = mapNameToFileName(match?.map || '', false);

  console.log("MatchRow", { isLoading, match });
  if (isLoading || !match) {
    return <MatchRowSkeleton />;
  }

  const handleClick = () => navigate(`/matches/${matchId}`);

  return (
    <Card sx={{ mb: 2, width: '100%' }}>
      <CardActionArea onClick={handleClick}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <MatchInfo
              map={match.map}
              mode={match.mode}
              imageUrl={imageUrl}
            />

            <Grid item xs={4}>
              <TeamSection
                name={match.team1Name}
                score={match.team1Score}
                players={match.team1Players}
              />
            </Grid>

            <Grid item xs={2}>
              <Typography variant="h5" textAlign="center" fontWeight="bold">
                {match.team1Score} - {match.team2Score}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <TeamSection
                name={match.team2Name}
                score={match.team2Score}
                players={match.team2Players}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body2" color="text.secondary">
                {formatDistanceToNow(new Date(match.dateString), { addSuffix: true })}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export const MatchesList = () => {
  const { data, isLoading } = useWombatData<MatchData>('match_data', {
    initialSortColumn: 'fileModified',
    initialSortDirection: 'desc'
  });

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {isLoading ? (
        Array(3).fill(null).map((_, index) => <MatchRowSkeleton key={index} />)
      ) : (
        data.map((match) => (
          <MatchRow matchId={match.matchId} key={match.matchId} />
        ))
      )}
    </Box>
  );
};

