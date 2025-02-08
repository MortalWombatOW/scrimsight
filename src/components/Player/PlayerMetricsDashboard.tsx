import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, LineChart, Line } from 'recharts';
import { Box, Typography, Paper, Grid, Tabs, Tab } from '@mui/material';
import { useAtomValue } from 'jotai';
import { 
  playerStatsByPlayerAtom,
  playerStatsByPlayerAndHeroAtom,
  playerStatsByPlayerAndRoleAtom,
  playerStatsByMatchIdAndPlayerNameAtom
} from '../../atoms/metrics/playerMetricsAtoms';
import { useState } from 'react';
import { StatCard } from '../Card/StatCard';

interface MetricSectionProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  colors: string[];
  chartType?: 'bar' | 'pie' | 'line';
}

const MetricSection = ({ title, data, colors, chartType = 'bar' }: MetricSectionProps) => (
  <Paper sx={{ p: 2, mb: 3 }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={chartType === 'line' ? 12 : 6}>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={colors[0]} />
              </BarChart>
            ) : chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={colors[1]}
                  label
                />
                <Tooltip />
              </PieChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke={colors[0]} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

export const PlayerMetricsDashboard = ({ playerName }: { playerName: string }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  
  const overallStats = useAtomValue(playerStatsByPlayerAtom);
  const heroStats = useAtomValue(playerStatsByPlayerAndHeroAtom);
  const roleStats = useAtomValue(playerStatsByPlayerAndRoleAtom);
  const matchStats = useAtomValue(playerStatsByMatchIdAndPlayerNameAtom);

  const playerOverallStats = overallStats.rows.find(stat => stat.playerName === playerName);
  const playerHeroStats = heroStats.rows.filter(stat => stat.playerName === playerName);
  const playerRoleStats = roleStats.rows.filter(stat => stat.playerName === playerName);
  const playerMatchStats = matchStats.rows.filter(stat => stat.playerName === playerName)
    .sort((a, b) => a.matchId.localeCompare(b.matchId));

  if (!playerOverallStats) {
    return <Typography>No data available for {playerName}</Typography>;
  }

  const overallMetrics = [
    { title: "Eliminations", value: playerOverallStats.eliminations },
    { title: "Deaths", value: playerOverallStats.deaths },
    { title: "Healing", value: playerOverallStats.healingDealt },
    { title: "Damage", value: playerOverallStats.heroDamageDealt },
  ];

  const heroData = playerHeroStats.map(stat => ({
    name: stat.playerHero,
    value: stat.eliminations
  }));

  const roleData = playerRoleStats.map(stat => ({
    name: stat.playerRole,
    value: stat.eliminations
  }));

  const matchHistoryData = playerMatchStats.map(stat => ({
    name: stat.matchId.slice(-8),
    value: stat.eliminations
  }));

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Performance Metrics</Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {overallMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              title={metric.title}
              value={metric.value.toString()}
              color={index % 2 === 0 ? 'primary.main' : 'secondary.main'}
            />
          </Grid>
        ))}
      </Grid>

      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="By Hero" />
        <Tab label="By Role" />
        <Tab label="Match History" />
      </Tabs>

      {selectedTab === 0 && (
        <MetricSection
          title="Performance by Hero"
          data={heroData}
          colors={['#8884d8', '#82ca9d']}
          chartType="bar"
        />
      )}

      {selectedTab === 1 && (
        <MetricSection
          title="Performance by Role"
          data={roleData}
          colors={['#8884d8', '#82ca9d']}
          chartType="pie"
        />
      )}

      {selectedTab === 2 && (
        <MetricSection
          title="Match History Trends"
          data={matchHistoryData}
          colors={['#8884d8', '#82ca9d']}
          chartType="line"
        />
      )}
    </Box>
  );
}; 