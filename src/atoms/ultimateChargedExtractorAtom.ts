import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for ultimate charged events
 */
export interface UltimateChargedLogEvent {
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
 * Atom that extracts ultimate charged events from the parsed log files
 */
export const ultimateChargedExtractorAtom = createEventExtractorAtom<UltimateChargedLogEvent>('ultimate_charged'); 