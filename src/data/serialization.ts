import { ProcessedMatch, PlayerStatusTimeline } from '../types';

// ============================================================================
// Stored Types — JSON-safe mirrors of domain types
// ============================================================================

export interface StoredPlayerStatusEntry {
  timestamp: number;
  team1Players: string[];
  team2Players: string[];
}

export type StoredPlayerStatusTimeline = StoredPlayerStatusEntry[];

export interface StoredMatch extends Omit<ProcessedMatch, 'playerStatusTimeline'> {
  playerStatusTimeline: Record<string, StoredPlayerStatusTimeline>;
  schemaVersion: number;
}

// ============================================================================
// Serialization — ProcessedMatch → StoredMatch
// ============================================================================

export function serializeMatch(match: ProcessedMatch): StoredMatch {
  const playerStatusTimeline: Record<string, StoredPlayerStatusTimeline> = {};

  for (const [key, entries] of match.playerStatusTimeline) {
    playerStatusTimeline[key] = entries.map((entry) => ({
      timestamp: entry.timestamp,
      team1Players: Array.from(entry.team1Players),
      team2Players: Array.from(entry.team2Players),
    }));
  }

  return {
    metadata: match.metadata,
    events: match.events,
    teamfights: match.teamfights,
    playerStats: match.playerStats,
    roundTimes: match.roundTimes,
    mapTimes: match.mapTimes,
    playerStatusTimeline,
    ultimateEvents: match.ultimateEvents,
    ultCycles: match.ultCycles,
    schemaVersion: 1,
  };
}

// ============================================================================
// Deserialization — StoredMatch → ProcessedMatch
// ============================================================================

export function deserializeMatch(stored: StoredMatch): ProcessedMatch {
  const playerStatusTimeline = new Map<string, PlayerStatusTimeline>();

  for (const [key, entries] of Object.entries(stored.playerStatusTimeline)) {
    playerStatusTimeline.set(
      key,
      entries.map((entry) => ({
        timestamp: entry.timestamp,
        team1Players: new Set(entry.team1Players),
        team2Players: new Set(entry.team2Players),
      })),
    );
  }

  return {
    metadata: stored.metadata,
    events: stored.events,
    teamfights: stored.teamfights,
    playerStats: stored.playerStats,
    roundTimes: stored.roundTimes,
    mapTimes: stored.mapTimes,
    playerStatusTimeline,
    ultimateEvents: stored.ultimateEvents,
    ultCycles: stored.ultCycles ?? [],
  };
}
