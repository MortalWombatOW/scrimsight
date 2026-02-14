/**
 * Domain Types
 * Core domain models used throughout the application.
 */

import { Metric, OverwatchRole } from '@library';
import type { UltCycle } from '../domain/economy';
import {
  Ability1UsedLogEvent,
  Ability2UsedLogEvent,
  DamageLogEvent,
  DefensiveAssistLogEvent,
  DvaDemechLogEvent,
  DvaRemechLogEvent,
  HealingLogEvent,
  HeroSpawnLogEvent,
  HeroSwapLogEvent,
  KillLogEvent,
  MatchEndLogEvent,
  MatchStartLogEvent,
  MercyRezLogEvent,
  OffensiveAssistLogEvent,
  PlayerStatLogEvent,
  RoundEndLogEvent,
  RoundStartLogEvent,
  SetupCompleteLogEvent,
  UltimateChargedLogEvent,
  UltimateEndLogEvent,
  UltimateStartLogEvent,
} from './logs';

/** Events that can occur within a teamfight */
export type TeamfightEvent = KillLogEvent | UltimateStartLogEvent | MercyRezLogEvent;
import { PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys } from './stats';

// ============================================================================
// Match Events - Grouped events for a single match
// ============================================================================

export interface MatchEvents {
  ability1Used: Ability1UsedLogEvent[];
  ability2Used: Ability2UsedLogEvent[];
  damage: DamageLogEvent[];
  defensiveAssist: DefensiveAssistLogEvent[];
  dvaDemech: DvaDemechLogEvent[];
  dvaRemech: DvaRemechLogEvent[];
  healing: HealingLogEvent[];
  heroSpawn: HeroSpawnLogEvent[];
  heroSwap: HeroSwapLogEvent[];
  kills: KillLogEvent[];
  matchEnd: MatchEndLogEvent[];
  matchStart: MatchStartLogEvent[];
  mercyRez: MercyRezLogEvent[];
  offensiveAssist: OffensiveAssistLogEvent[];
  playerStat: PlayerStatLogEvent[];
  roundEnd: RoundEndLogEvent[];
  roundStart: RoundStartLogEvent[];
  setupComplete: SetupCompleteLogEvent[];
  ultimateCharged: UltimateChargedLogEvent[];
  ultimateEnd: UltimateEndLogEvent[];
  ultimateStart: UltimateStartLogEvent[];
}

// ============================================================================
// Match Metadata
// ============================================================================

export interface MatchMetadata {
  matchId: string;
  fileName: string;
  fileModified: number;
  dateString: string;
  timeString: string;
  map: string;
  mode: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  team1Players: string[];
  team2Players: string[];
  duration: number;
  roundWinners: ('team1' | 'team2' | 'draw')[];
  winner: string | null;
}

/** Backward compatibility alias */
export type MatchData = MatchMetadata;

// ============================================================================
// Teamfight Types
// ============================================================================

export interface Teamfight {
  fightId: string;
  matchId: string;
  startTime: number;
  endTime: number;
  duration: number;
  team1Name: string;
  team2Name: string;
  team1Kills: number;
  team2Kills: number;

  // Classification
  type: 'dry' | 'ult-invested' | 'all-in' | 'stagger';
  winner: string | null;

  // Win Condition Context
  firstPick: {
    player: string;
    team: string;
    hero: string;
    victim: string;
    time: number;
  } | null;

  // Economy Context
  team1UltsUsed: string[];
  team2UltsUsed: string[];

  // Events contained in this fight
  events: TeamfightEvent[];
}

// ============================================================================
// Timeline Types
// ============================================================================

export interface RoundTimes {
  matchId: string;
  roundNumber: number;
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
  roundDuration: number;
}

export interface MapTimes {
  matchId: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface PlayerStatusEntry {
  timestamp: number;
  team1Players: Set<string>;
  team2Players: Set<string>;
}

export type PlayerStatusTimeline = PlayerStatusEntry[];

// ============================================================================
// Ultimate Event Types
// ============================================================================

export interface UltimateEvent {
  id: string;
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  ultimateId: string;
  ultimateChargedTime: number;
  ultimateStartTime: number;
  ultimateEndTime: number;
  ultimateHoldTime: number;
}

// ============================================================================
// Scrim Types
// ============================================================================

export interface Scrim {
  dateString: string;
  team1Name: string;
  team2Name: string;
  team1Players: string[];
  team2Players: string[];
  team1Wins: number;
  team2Wins: number;
  draws: number;
  matchIds: string[];
  duration: number;
}

// ============================================================================
// Team Stats Types
// ============================================================================

export interface TeamStats {
  teamName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  mostRecentGameDate: Date | null;
  players: string[];
}

// ============================================================================
// Processed Match - The "Database Schema"
// ============================================================================

export interface ProcessedMatch {
  /** Core metadata */
  metadata: MatchMetadata;

  /** Raw events (grouped by type) */
  events: MatchEvents;

  /** Pre-calculated derived data */
  teamfights: Teamfight[];
  playerStats: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>;
  roundTimes: RoundTimes[];
  mapTimes: MapTimes;
  playerStatusTimeline: Map<string, PlayerStatusTimeline>;
  ultimateEvents: UltimateEvent[];
  ultCycles: UltCycle[];
}

// ============================================================================
// Repository State
// ============================================================================

export type RepositoryState = Record<string, ProcessedMatch>;

// Re-export library types for convenience
export type { Metric, OverwatchRole };
