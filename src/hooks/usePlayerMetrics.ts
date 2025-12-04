import { useMemo } from 'react';
import { format } from 'date-fns';
import { useMatches } from './useRepository';
import { formatStat } from '@library';
import { MatchMetadata, PlayerStats } from '../types';
import { useStatsWithDerived } from './useStats';

// ============================================================================
// Types
// ============================================================================

export interface PlayerSummary {
  playerName: string;
  teamName: string;
  topHero: string;
  eliminations: number;
  deaths: number;
  assists: number;
  role: string;
  kda: string;
}

export interface PerformanceTrend {
  date: string;
  kda: number;
  winRate: number;
  avgElims: number;
}

// ============================================================================
// usePlayerSummary Hook
// ============================================================================

/**
 * Computes aggregated player summary statistics from all matches.
 * Includes total eliminations, deaths, assists, top hero, role, and formatted KDA.
 */
export function usePlayerSummary(playerName: string | undefined): PlayerSummary | null {
  const processedMatches = useMatches();

  return useMemo(() => {
    if (!playerName) return null;

    const playerMap = new Map<string, {
      eliminations: number;
      deaths: number;
      assists: number;
      teamName: string;
      topHero: string;
      heroPlaytime: Map<string, number>;
      role: string;
    }>();

    for (const match of processedMatches) {
      for (const stat of match.playerStats.rows) {
        if (stat.playerName !== playerName) continue;

        if (!playerMap.has(stat.playerName)) {
          playerMap.set(stat.playerName, {
            eliminations: 0,
            deaths: 0,
            assists: 0,
            teamName: stat.playerTeam,
            topHero: stat.playerHero,
            heroPlaytime: new Map(),
            role: stat.playerRole,
          });
        }

        const playerData = playerMap.get(stat.playerName)!;
        playerData.eliminations += stat.eliminations;
        playerData.deaths += stat.deaths;
        playerData.assists += stat.defensiveAssists + stat.offensiveAssists;

        const currentPlaytime = playerData.heroPlaytime.get(stat.playerHero) || 0;
        playerData.heroPlaytime.set(stat.playerHero, currentPlaytime + stat.playtime);
      }
    }

    const data = playerMap.get(playerName);
    if (!data) return null;

    // Calculate top hero by playtime
    let topHero = '';
    let maxPlaytime = 0;
    data.heroPlaytime.forEach((playtime, hero) => {
      if (playtime > maxPlaytime) {
        maxPlaytime = playtime;
        topHero = hero;
      }
    });

    // Calculate and format KDA
    const kdaValue = data.deaths === 0
      ? data.eliminations + data.assists
      : (data.eliminations + data.assists) / data.deaths;
    const kda = formatStat('eliminations', kdaValue);

    return {
      playerName,
      teamName: data.teamName,
      topHero: topHero || data.topHero,
      eliminations: data.eliminations,
      deaths: data.deaths,
      assists: data.assists,
      role: data.role,
      kda,
    };
  }, [playerName, processedMatches]);
}

// ============================================================================
// usePlayerPerformanceTrends Hook
// ============================================================================

/** Match metadata type with optional playerStats for trend calculation */
type TrendMatchData = Pick<
  MatchMetadata,
  'fileModified' | 'team1Players' | 'team2Players' | 'team1Score' | 'team2Score'
> & {
  playerStats?: Record<string, { eliminations?: number; deaths?: number }>;
};

/**
 * Calculates daily performance trends (KDA, win rate, avg eliminations) for a player.
 * Groups matches by date and computes aggregate statistics for each day.
 */
export function usePlayerPerformanceTrends(
  playerName: string | undefined
): PerformanceTrend[] {
  const processedMatches = useMatches();

  return useMemo(() => {
    if (!playerName) return [];

    // Get match metadata for the player
    const matches = processedMatches.map(m => m.metadata);

    // Filter to player's matches
    const playerMatches = matches.filter(
      (match) =>
        match.team1Players.includes(playerName) ||
        match.team2Players.includes(playerName)
    );

    return calculatePerformanceTrends(playerMatches, playerName);
  }, [playerName, processedMatches]);
}

/**
 * Internal function to calculate performance trends from match data.
 * Separated for testability and reusability.
 */
function calculatePerformanceTrends(
  matches: TrendMatchData[],
  playerName: string
): PerformanceTrend[] {
  // Filter out any invalid matches first
  const validMatches = matches.filter(
    (match) =>
      match &&
      match.fileModified &&
      typeof match.fileModified === 'number'
  );

  // Group matches by date
  const matchesByDate = validMatches.reduce(
    (acc: Record<string, typeof validMatches>, match) => {
      try {
        const date = format(match.fileModified, 'MMM d');
        if (!acc[date]) acc[date] = [];
        acc[date].push(match);
      } catch {
        console.warn('Invalid date for match:', match);
      }
      return acc;
    },
    {}
  );

  // Calculate daily stats
  return Object.entries(matchesByDate)
    .map(([date, dailyMatches]) => {
      const stats = dailyMatches.reduce(
        (acc, match) => {
          const isTeam1 = match.team1Players.includes(playerName);
          const won =
            (isTeam1 && match.team1Score > match.team2Score) ||
            (!isTeam1 && match.team2Score > match.team1Score);

          return {
            wins: acc.wins + (won ? 1 : 0),
            total: acc.total + 1,
            elims:
              acc.elims +
              (match.playerStats?.[playerName]?.eliminations || 0),
            deaths:
              acc.deaths + (match.playerStats?.[playerName]?.deaths || 0),
          };
        },
        { wins: 0, total: 0, elims: 0, deaths: 0 }
      );

      return {
        date,
        kda: stats.deaths > 0 ? stats.elims / stats.deaths : stats.elims,
        winRate: (stats.wins / stats.total) * 100,
        avgElims: stats.elims / stats.total,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.date + ' 2024').getTime();
      const dateB = new Date(b.date + ' 2024').getTime();
      return dateA - dateB;
    });
}

// ============================================================================
// usePlayerHeroStats Hook
// ============================================================================

/**
 * Aggregates player stats by hero.
 * Sums up playtime, eliminations, deaths, etc. for the same hero across different matches/rounds.
 */
export function usePlayerHeroStats(playerName: string | undefined): PlayerStats[] {
  const stats = useStatsWithDerived({ playerName });

  return useMemo(() => {
    if (!stats || stats.length === 0) return [];

    const heroMap = new Map<string, PlayerStats>();

    for (const stat of stats) {
      const existing = heroMap.get(stat.playerHero);

      if (!existing) {
        heroMap.set(stat.playerHero, { ...stat });
      } else {
        // Aggregate numerical values
        const merged: PlayerStats = { ...existing };
        
        // Helper to sum values safely
        // We iterate over keys that are numbers in the stat object and sum them
        Object.keys(stat).forEach((key) => {
            const k = key as keyof PlayerStats;
            if (typeof stat[k] === 'number' && typeof existing[k] === 'number') {
                (merged as any)[k] = (existing[k] as number) + (stat[k] as number);
            }
        });

        heroMap.set(stat.playerHero, merged);
      }
    }

    return Array.from(heroMap.values());
  }, [stats]);
}
