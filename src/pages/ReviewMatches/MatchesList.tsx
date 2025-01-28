import { useWombatData } from "wombat-data-framework";
import { mapNameToFileName } from "~/lib/string";
import { MatchData } from "~/WombatDataFrameworkSchema";
import { Box, Card, CardActionArea, Typography, Grid, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatTime } from "~/lib/format";

const MatchRow = ({ matchId }: { matchId: string }) => {
  const navigate = useNavigate();
  const { map, mode, team1Name, team1Score, team2Name, team2Score, team1Players, team2Players, dateString } =
    useWombatData<MatchData>('match_data', { initialFilter: { matchId } }).data[0];
  const imageUrl = mapNameToFileName(map, false);

  const handleClick = () => {
    navigate(`/match/${matchId}`);
  };

  return (
    <Card sx={{ mb: 2, width: '100%' }}>
      <CardActionArea onClick={handleClick}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Map Image and Info */}
            <Grid item xs={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={imageUrl}
                  variant="rounded"
                  sx={{ width: 60, height: 60 }}
                />
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

            {/* Team 1 */}
            <Grid item xs={4}>
              <Typography variant="h6" component="div">
                {team1Name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {team1Players.join(", ")}
              </Typography>
            </Grid>

            {/* Score */}
            <Grid item xs={2}>
              <Typography variant="h5" textAlign="center" fontWeight="bold">
                {team1Score} - {team2Score}
              </Typography>
            </Grid>

            {/* Team 2 */}
            <Grid item xs={3}>
              <Typography variant="h6" component="div">
                {team2Name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {team2Players.join(", ")}
              </Typography>
            </Grid>

            {/* Date */}
            <Grid item xs={1}>
              <Typography variant="body2" color="text.secondary">
                {dateString}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardActionArea>
    </Card>
  );
};

const MatchesList = () => {
  const matchIds = useWombatData<MatchData>(
    'match_data',
    { initialSortColumn: 'fileModified', initialSortDirection: 'desc' }
  ).data.map((match) => match.matchId);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {matchIds.map((matchId) => (
        <MatchRow matchId={matchId} key={matchId} />
      ))}
    </Box>
  );
};

export default MatchesList;