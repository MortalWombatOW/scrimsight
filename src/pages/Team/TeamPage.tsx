import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { teamNamesAtom } from '../../atoms/teamNamesAtom';
import { teamStatsAtom } from '../../atoms/teamStatsAtom';
import { allPlayersForTeamAtom } from '../../atoms/allPlayersForTeamAtom';
import { matchDataAtom } from '../../atoms/matchDataAtom';
import { Box, Typography, List, ListItem, ListItemText, Divider, Card, CardContent, Grid } from '@mui/material';
import { MatchData } from '../../atoms/matchDataAtom';
import { TeamStats } from '../../atoms/teamStatsAtom';
import { TeamPlayers } from '../../atoms/allPlayersForTeamAtom';
import { StatCard } from '../../components/Card/StatCard';
export const TeamPage = () => {
  const { teamName } = useParams();
  const [teamNames] = useAtom(teamNamesAtom);
  const [teamStats] = useAtom(teamStatsAtom);
  const [players] = useAtom(allPlayersForTeamAtom);
  const [matches] = useAtom(matchDataAtom);

  const teamNameSafe = teamName || '';
  const teamRecord: TeamStats = teamStats.find((stat: TeamStats) => stat.teamName === teamNameSafe) || { teamName: '', gamesPlayed: 0, wins: 0, losses: 0, draws: 0, mostRecentGameDate: null, players: [] };
  const teamPlayers: TeamPlayers = players.find((team: TeamPlayers) => team.teamName === teamNameSafe) || { teamName: '', players: [] };
  const teamMatches = matches.filter((match: MatchData) =>
    match.team1Name === teamNameSafe || match.team2Name === teamNameSafe
  );

  const teamNameDisplay: string = String(teamNames[teamNameSafe as keyof typeof teamNames] || teamNameSafe);

  return (
    <Box p={3}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h1" sx={{ mb: 2 }}>{teamNameDisplay}</Typography>

          <Grid container spacing={2} sx={{ width: 'fit-content' }}>
            <Grid item xs={4}>
              <StatCard title="Wins" value={teamRecord.wins.toString()} color="success.light" />
            </Grid>
            <Grid item xs={4}>
              <StatCard title="Draws" value={teamRecord.draws.toString()} color="warning.light" />
            </Grid>
            <Grid item xs={4}>
              <StatCard title="Losses" value={teamRecord.losses.toString()} color="error.light" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5">Players</Typography>
          <List>
            {teamPlayers.players.map((playerName: string) => (
              <ListItem key={playerName}>
                <ListItemText primary={playerName} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Games Played</Typography>
          <List>
            {teamMatches.map((match: MatchData) => (
              <ListItem key={match.matchId}>
                <ListItemText primary={`${match.team1Name} vs ${match.team2Name} - ${match.dateString}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

