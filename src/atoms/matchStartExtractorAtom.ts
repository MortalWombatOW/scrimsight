import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for match start events
 */
export interface MatchStartLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  mapName: string;
  mapType: string;
  team1Name: string;
  team2Name: string;
}

/**
 * Atom that extracts match start events from the parsed log files
 */
export const matchStartExtractorAtom = createEventExtractorAtom<MatchStartLogEvent>('match_start'); 
