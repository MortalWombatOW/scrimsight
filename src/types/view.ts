/**
 * View Types
 * UI summary types used for displaying data in lists and overviews.
 */

import { OverwatchRole } from '@library';

// ============================================================================
// List Summary Types - Used for overview lists of players/teams
// ============================================================================

export interface PlayerListSummary {
  playerName: string;
  /** Primary team (most playtime) */
  teamName: string;
  /** Hero with most playtime */
  topHero: string;
  eliminations: number;
  deaths: number;
  /** Calculated as offensive + defensive assists */
  assists: number;
  /** Role with most playtime */
  role: OverwatchRole;
  /** Percentage of teamfights participated in where player got first kill */
  firstKillRate: number;
}

export interface TeamListSummary {
  teamName: string;
  playerCount: number;
  /** Calculated as wins / (wins + losses) */
  winRate: number;
  gamesPlayed: number;
  /** Win rate in teamfights where this team got the first kill */
  firstKillWinRate: number;
}

export interface ScrimListSummary {
  /** Unique ID derived from date and teams */
  scrimId: string;
  teamNames: string[];
  dateString: string;
  mapCount: number;
  /** e.g., "3-2-1" (W-L-D for team1) */
  score: string;
  /** Total duration in seconds */
  duration: number;
  /** List of map names played */
  maps: string[];
}

// Re-export OverwatchRole for convenience
export type { OverwatchRole };
