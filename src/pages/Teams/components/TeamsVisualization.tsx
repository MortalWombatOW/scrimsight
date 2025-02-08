import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TeamStats } from '../../../atoms/teamStatsAtom';

interface TeamsVisualizationProps {
  teams: TeamStats[];
}

export const TeamsVisualization = ({ teams }: TeamsVisualizationProps) => {
  // Create data for wins distribution
  const winCounts = teams.reduce((acc, team) => {
    const wins = team.wins;
    acc[wins] = (acc[wins] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const data = Object.entries(winCounts)
    .map(([wins, count]) => ({
      wins: Number(wins),
      teams: count
    }))
    .sort((a, b) => a.wins - b.wins);

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Team Wins Distribution
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="wins" 
              label={{ value: 'Number of Wins', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Number of Teams', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [value, 'Teams']}
              labelFormatter={(label: number) => `${label} Wins`}
            />
            <Bar 
              dataKey="teams" 
              fill="#8884d8" 
              name="Teams"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}; 