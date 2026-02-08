
import { useMemo } from 'react';
import { useMatches } from './useRepository';

export interface TrendDataPoint {
  date: string;
  timestamp: number;
  matchId: string;
  winRate: number; // Cumulative %
  matchKd: number;
  cumulativeKd: number;
  result: 'WIN' | 'LOSS' | 'DRAW';
  opponent: string;
}

export function useTrendData(targetTeamName?: string) {
  const matches = useMatches();

  const trendData = useMemo(() => {
    if (matches.length === 0) return { data: [], teamName: undefined };

    // 1. Determine target team if not provided
    let teamName = targetTeamName;
    if (!teamName) {
      const teamCounts = new Map<string, number>();
      matches.forEach(m => {
        teamCounts.set(m.metadata.team1Name, (teamCounts.get(m.metadata.team1Name) || 0) + 1);
        teamCounts.set(m.metadata.team2Name, (teamCounts.get(m.metadata.team2Name) || 0) + 1);
      });
      
      // Find team with max matches
      let maxCount = 0;
      for (const [team, count] of teamCounts.entries()) {
        if (count > maxCount) {
          maxCount = count;
          teamName = team;
        }
      }
    }

    if (!teamName) return { data: [], teamName: undefined };

    // 2. Sort matches by date
    const sortedMatches = [...matches].sort((a, b) => 
      new Date(a.metadata.dateString).getTime() - new Date(b.metadata.dateString).getTime()
    );

    let wins = 0;
    let totalGames = 0;
    
    let totalKills = 0;
    let totalDeaths = 0;

    const dataPoints: TrendDataPoint[] = [];

    for (const match of sortedMatches) {
      if (match.metadata.team1Name !== teamName && match.metadata.team2Name !== teamName) {
        continue;
      }

      totalGames++;
      const isTeam1 = match.metadata.team1Name === teamName;
      const winner = match.metadata.winner;
      
      let result: 'WIN' | 'LOSS' | 'DRAW' = 'DRAW';
      if (winner === teamName) {
        wins++;
        result = 'WIN';
      } else if (winner) {
        result = 'LOSS';
      }

      const opponent = isTeam1 ? match.metadata.team2Name : match.metadata.team1Name;

      // Calculate K/D for this match
      let matchKills = 0;
      let matchDeaths = 0;

      match.playerStats.rows.forEach(stat => {
        if (stat.playerTeam === teamName) {
          matchKills += stat.eliminations;
          matchDeaths += stat.deaths;
        }
      });

      const matchKd = matchDeaths === 0 ? matchKills : matchKills / matchDeaths;
      
      totalKills += matchKills;
      totalDeaths += matchDeaths;
      const cumulativeKd = totalDeaths === 0 ? totalKills : totalKills / totalDeaths;

      dataPoints.push({
        date: match.metadata.dateString,
        timestamp: new Date(match.metadata.dateString).getTime(),
        matchId: match.metadata.matchId,
        winRate: (wins / totalGames) * 100,
        matchKd,
        cumulativeKd,
        result,
        opponent
      });
    }

    return { data: dataPoints, teamName };
  }, [matches, targetTeamName]);

  return trendData;
}
