import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for match end events
 */
export interface MatchEndLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  team1Score: number;
  team2Score: number;
}

/**
 * Atom that extracts match end events from the parsed log files
 */
export const matchEndExtractorAtom = createEventExtractorAtom<MatchEndLogEvent>('match_end'); 