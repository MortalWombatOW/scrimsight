import { atom } from 'jotai'; // Import atom
import { atomFamily } from 'jotai/utils';
import { Getter } from 'jotai'; // Import Getter type
import { matchData } from '@atoms';
import { MatchData } from '@atoms';

export interface MapModeStats {
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  winRate: number;
}

// Use atomFamily to create atoms based on teamId
export const teamMapTypeStatsAtom = atomFamily((teamId: string) =>
  atom(async (get: Getter): Promise<Record<string, MapModeStats>> => { // Add Getter type
    const allMatches: MatchData[] = await get(matchData.atom); // Add type for clarity

    const teamMatches = allMatches.filter(
      (match: MatchData) => match.team1Name === teamId || match.team2Name === teamId // Add type
    );

    const statsByMode: Record<string, Omit<MapModeStats, 'winRate'>> = {};

    for (const match of teamMatches) { // Type is inferred from teamMatches
      const mode = match.mode; // Use 'mode' as map type identifier
      if (!mode) continue; // Skip if mode is missing

      if (!statsByMode[mode]) {
        statsByMode[mode] = { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 };
      }

      const isTeam1 = match.team1Name === teamId;
      const teamScore = isTeam1 ? match.team1Score : match.team2Score;
      const opposingScore = isTeam1 ? match.team2Score : match.team1Score;

      statsByMode[mode].gamesPlayed += 1;
      if (teamScore > opposingScore) {
        statsByMode[mode].wins += 1;
      } else if (teamScore < opposingScore) {
        statsByMode[mode].losses += 1;
      } else {
        statsByMode[mode].draws += 1;
      }
    }

    // Calculate win rates
    const finalStats: Record<string, MapModeStats> = {};
    for (const mode in statsByMode) {
      const stats = statsByMode[mode];
      const winRate =
        stats.gamesPlayed > 0
          ? (stats.wins / (stats.gamesPlayed - stats.draws)) * 100 // Calculate win rate excluding draws
          : 0;
      finalStats[mode] = {
        ...stats,
        winRate: isNaN(winRate) ? 0 : winRate, // Handle potential NaN if gamesPlayed equals draws
      };
    }

    return finalStats;
  })
);
