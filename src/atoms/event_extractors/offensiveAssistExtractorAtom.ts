import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for offensive assist events
 */
export interface OffensiveAssistLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

/**
 * Atom that extracts offensive assist events from the parsed log files
 */
export const offensiveAssistExtractorAtom = createEventExtractorAtom<OffensiveAssistLogEvent>('offensive_assist'); 