import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for ultimate end events
 */
export interface UltimateEndLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

/**
 * Atom that extracts ultimate end events from the parsed log files
 */
export const ultimateEndExtractorAtom = createEventExtractorAtom<UltimateEndLogEvent>('ultimate_end'); 