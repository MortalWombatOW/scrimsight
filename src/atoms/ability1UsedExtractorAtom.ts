import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for ability 1 used events
 */
export interface Ability1UsedLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

/**
 * Atom that extracts ability 1 used events from the parsed log files
 */
export const ability1UsedExtractorAtom = createEventExtractorAtom<Ability1UsedLogEvent>('ability_1_used'); 