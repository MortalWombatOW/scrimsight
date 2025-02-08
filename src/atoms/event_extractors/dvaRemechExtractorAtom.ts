import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for D.Va remech events
 */
export interface DvaRemechLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  ultimateId: number;
}

/**
 * Atom that extracts D.Va remech events from the parsed log files
 */
export const dvaRemechExtractorAtom = createEventExtractorAtom<DvaRemechLogEvent>('dva_remech'); 