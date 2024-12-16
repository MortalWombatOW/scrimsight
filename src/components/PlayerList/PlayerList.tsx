import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useWombatData } from 'wombat-data-framework';
import './PlayerList.scss';

interface PlayerStats {
  playerName: string;
  matchCount: number;
  playerRole: string;
}

const PlayerRow = ({ playerName, matchCount, playerRole }: PlayerStats) => {
  return (
    <Card
      sx={{
        width: '200px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        border: '1px solid',
        borderColor: 'secondary.main',
      }}
      className="dashboard-item secondary">
      <CardContent
        sx={{
          flexGrow: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Typography variant="h5" align="center">
          {playerName}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          {playerRole}
        </Typography>
        <Typography variant="h4" align="center">
          {matchCount} matches
        </Typography>
      </CardContent>
    </Card>
  );
};

const PlayerList = () => {
  const playerStatData = useWombatData<{ playerName: string; playerRole: string; matchId: string }>('player_stat_expanded');

  // Process the data to count unique matches per player
  const playerStats = React.useMemo(() => {
    const playerMatches = new Map<string, Set<number>>();
    const playerRoles = new Map<string, string>();

    playerStatData.data.forEach((stat) => {
      if (!playerMatches.has(stat.playerName)) {
        playerMatches.set(stat.playerName, new Set());
        playerRoles.set(stat.playerName, stat.playerRole);
      }
      playerMatches.get(stat.playerName)?.add(stat.matchId);
    });

    const stats: PlayerStats[] = Array.from(playerMatches.entries()).map(([playerName, matches]) => ({
      playerName,
      matchCount: matches.size,
      playerRole: playerRoles.get(playerName) || 'unknown',
    }));

    // Sort by match count descending
    return stats.sort((a, b) => b.matchCount - a.matchCount);
  }, [playerStatData.data]);

  console.log('playerStats', playerStats);

  return (
    <>
      {playerStats.map((stats) => (
        <PlayerRow key={stats.playerName} {...stats} />
      ))}
    </>
  );
};

export default PlayerList;
