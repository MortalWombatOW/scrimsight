import { atom } from 'jotai';
import { playerAliveAdvantageConfig } from '../lib/AdvantageTrackers';
import { processTeamAdvantageEvents, TimelineEvent } from '../lib/TeamAdvantageTracker';
import { matchStartExtractorAtom } from './matchStartExtractorAtom';
import { killExtractorAtom } from './killExtractorAtom';
import { heroSpawnExtractorAtom } from './heroSpawnExtractorAtom';
import { roundEndExtractorAtom } from './roundEndExtractorAtom';
import { roundStartExtractorAtom } from './roundStartExtractorAtom';

/**
 * Interface for team alive advantage events
 */
export interface TeamAliveAdvantage {
  matchId: string;
  matchTime: number;
  team1Name: string;
  team2Name: string;
  team1Count: number;
  team2Count: number;
  teamWithAdvantage: string;
  diff: number;
}

/**
 * Function to convert event to timeline event format
 */
function toTimelineEvent<T extends { matchId: string; matchTime: number }>(
  event: T,
  type: string
): TimelineEvent {
  return {
    ...event,
    type,
    [Symbol.iterator]: function* () {
      yield* Object.entries(this);
    },
  };
}

/**
 * Atom that tracks team alive advantage throughout matches
 */
export const teamAliveAdvantageAtom = atom(async (get): Promise<TeamAliveAdvantage[]> => {
  // Get all required events
  const killEvents = await get(killExtractorAtom);
  const heroSpawnEvents = await get(heroSpawnExtractorAtom);
  const roundEndEvents = await get(roundEndExtractorAtom);
  const roundStartEvents = await get(roundStartExtractorAtom);
  const matchStartEvents = await get(matchStartExtractorAtom);

  // Combine all events and convert to timeline events
  const events: TimelineEvent[] = [
    ...killEvents.map(e => toTimelineEvent(e, 'kill')),
    ...heroSpawnEvents.map(e => toTimelineEvent(e, 'spawn')),
    ...roundEndEvents.map(e => toTimelineEvent(e, 'round_end')),
    ...roundStartEvents.map(e => toTimelineEvent(e, 'round_start')),
  ];

  // Create map of match IDs to team names
  const mapTeams = new Map<string, { team1Name: string; team2Name: string }>(
    matchStartEvents.map(match => [
      match.matchId,
      { team1Name: match.team1Name, team2Name: match.team2Name }
    ])
  );

  // Process events to calculate advantage
  return processTeamAdvantageEvents(events, mapTeams, playerAliveAdvantageConfig);
}); 