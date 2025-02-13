import { useState } from 'react';
import { useAtom } from 'jotai';
import { Container, Typography, Box } from '@mui/material';
import { teamStatsAtom } from '../../atoms/teamStatsAtom';
import { TeamsSummaryStats } from './components/TeamsSummaryStats';
import { TeamsFilter, SortOption } from './components/TeamsFilter';
import { TeamsVisualization } from './components/TeamsVisualization';
import { TeamsList } from './components/TeamsList';

export const TeamsPage = () => {
  const [teamStats] = useAtom(teamStatsAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Calculate summary statistics
  const totalTeams = teamStats.length;
  const totalGames = teamStats.reduce((sum, team) => sum + team.gamesPlayed, 0);
  const totalWins = teamStats.reduce((sum, team) => sum + team.wins, 0);
  const totalPlayers = new Set(teamStats.flatMap(team => team.players)).size;

  // Filter and sort teams
  const filteredAndSortedTeams = teamStats
    .filter(team =>
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'wins':
          return b.wins - a.wins;
        case 'recent':
          return (b.mostRecentGameDate?.getTime() || 0) - (a.mostRecentGameDate?.getTime() || 0);
        case 'players':
          return b.players.length - a.players.length;
        default:
          return a.teamName.localeCompare(b.teamName);
      }
    });

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" gutterBottom>
          Teams
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Overview of all teams and their performance
        </Typography>
      </Box>

      <TeamsSummaryStats
        totalTeams={totalTeams}
        totalGames={totalGames}
        totalWins={totalWins}
        totalPlayers={totalPlayers}
      />

      <TeamsVisualization teams={teamStats} />

      <TeamsFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={(value) => setSortBy(value)}
      />

      <TeamsList teams={filteredAndSortedTeams} />
    </Container>
  );
};

