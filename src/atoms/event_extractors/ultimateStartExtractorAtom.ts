import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for ultimate start events
 */
export interface UltimateStartLogEvent {
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
 * Atom that extracts ultimate start events from the parsed log files
 */
export const ultimateStartExtractorAtom = createEventExtractorAtom<UltimateStartLogEvent>('ultimate_start'); 