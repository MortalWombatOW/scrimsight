
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
  // New metrics
  tfwr: number; // Teamfight win rate for this match (%)
  deathsPer10: number; // Team deaths per 10 min
  firstPickRate: number; // % of fights with team's first pick
  firstDeathRate: number; // % of fights where team died first
  cumulativeTfwr: number;
  cumulativeDeathsPer10: number;
  tfwrRolling5: number | null;
  deathsPer10Rolling5: number | null;
  totalFights: number;
  fightsWon: number;
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
    let cumulativeFightsWon = 0;
    let cumulativeTotalFights = 0;
    let cumulativeTeamDeaths = 0;
    let cumulativePlaytime = 0;

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

      // K/D and deaths/playtime for this match
      let matchKills = 0;
      let matchDeaths = 0;
      let matchPlaytime = 0;

      match.playerStats.rows.forEach(stat => {
        if (stat.playerTeam === teamName) {
          matchKills += stat.eliminations;
          matchDeaths += stat.deaths;
          matchPlaytime += stat.playtime;
        }
      });

      const matchKd = matchDeaths === 0 ? matchKills : matchKills / matchDeaths;

      totalKills += matchKills;
      totalDeaths += matchDeaths;
      const cumulativeKd = totalDeaths === 0 ? totalKills : totalKills / totalDeaths;

      // TFWR for this match
      const matchFights = match.teamfights.filter(f => f.winner !== null);
      const fightsWon = matchFights.filter(f => f.winner === teamName).length;
      const totalFightsInMatch = matchFights.length;
      const tfwr = totalFightsInMatch > 0 ? (fightsWon / totalFightsInMatch) * 100 : 0;

      cumulativeFightsWon += fightsWon;
      cumulativeTotalFights += totalFightsInMatch;

      // Deaths/10 for this match
      const deathsPer10 = matchPlaytime > 0 ? (matchDeaths / matchPlaytime) * 600 : 0;
      cumulativeTeamDeaths += matchDeaths;
      cumulativePlaytime += matchPlaytime;

      // First pick / first death rates
      let firstPicks = 0;
      let firstDeaths = 0;
      for (const fight of matchFights) {
        if (fight.firstPick?.team === teamName) firstPicks++;
        // First death: the victim of the first pick is the first death
        if (fight.firstPick && fight.firstPick.team !== teamName) firstDeaths++;
      }
      const firstPickRate = totalFightsInMatch > 0 ? (firstPicks / totalFightsInMatch) * 100 : 0;
      const firstDeathRate = totalFightsInMatch > 0 ? (firstDeaths / totalFightsInMatch) * 100 : 0;

      // Rolling 5-match averages
      const recentWindow = dataPoints.slice(-4); // Last 4 + current = 5
      const tfwrRolling5 = recentWindow.length >= 4
        ? (recentWindow.reduce((s, d) => s + d.tfwr, 0) + tfwr) / 5
        : null;
      const deathsPer10Rolling5 = recentWindow.length >= 4
        ? (recentWindow.reduce((s, d) => s + d.deathsPer10, 0) + deathsPer10) / 5
        : null;

      dataPoints.push({
        date: match.metadata.dateString,
        timestamp: new Date(match.metadata.dateString).getTime(),
        matchId: match.metadata.matchId,
        winRate: (wins / totalGames) * 100,
        matchKd,
        cumulativeKd,
        result,
        opponent,
        tfwr,
        deathsPer10,
        firstPickRate,
        firstDeathRate,
        cumulativeTfwr: cumulativeTotalFights > 0 ? (cumulativeFightsWon / cumulativeTotalFights) * 100 : 0,
        cumulativeDeathsPer10: cumulativePlaytime > 0 ? (cumulativeTeamDeaths / cumulativePlaytime) * 600 : 0,
        tfwrRolling5,
        deathsPer10Rolling5,
        totalFights: totalFightsInMatch,
        fightsWon,
      });
    }

    return { data: dataPoints, teamName };
  }, [matches, targetTeamName]);

  return trendData;
}
