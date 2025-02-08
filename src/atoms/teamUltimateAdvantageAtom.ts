import { atom } from 'jotai';
import { ultimateAdvantageConfig } from '../lib/AdvantageTrackers';
import { processTeamAdvantageEvents, TimelineEvent } from '../lib/TeamAdvantageTracker';
import { matchStartExtractorAtom } from './event_extractors/matchStartExtractorAtom';
import { ultimateChargedExtractorAtom } from './event_extractors/ultimateChargedExtractorAtom';
import { ultimateEndExtractorAtom } from './event_extractors/ultimateEndExtractorAtom';
import { roundEndExtractorAtom } from './event_extractors/roundEndExtractorAtom';
import { roundStartExtractorAtom } from './event_extractors/roundStartExtractorAtom';

/**
 * Interface for team ultimate advantage events
 */
export interface TeamUltimateAdvantage {
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
 * Atom that tracks team ultimate advantage throughout matches
 */
export const teamUltimateAdvantageAtom = atom(async (get): Promise<TeamUltimateAdvantage[]> => {
  // Get all required events
  const ultimateChargedEvents = await get(ultimateChargedExtractorAtom);
  const ultimateEndEvents = await get(ultimateEndExtractorAtom);
  const roundEndEvents = await get(roundEndExtractorAtom);
  const roundStartEvents = await get(roundStartExtractorAtom);
  const matchStartEvents = await get(matchStartExtractorAtom);

  // Combine all events and convert to timeline events
  const events: TimelineEvent[] = [
    ...ultimateChargedEvents.map(e => toTimelineEvent(e, 'charged')),
    ...ultimateEndEvents.map(e => toTimelineEvent(e, 'end')),
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
  return processTeamAdvantageEvents(events, mapTeams, ultimateAdvantageConfig);
}); 
