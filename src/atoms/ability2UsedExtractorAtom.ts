import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for ability 2 used events
 */
export interface Ability2UsedLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

/**
 * Atom that extracts ability 2 used events from the parsed log files
 */
export const ability2UsedExtractorAtom = createEventExtractorAtom<Ability2UsedLogEvent>('ability_2_used'); 