import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for defensive assist events
 */
export interface DefensiveAssistLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

/**
 * Atom that extracts defensive assist events from the parsed log files
 */
export const defensiveAssistExtractorAtom = createEventExtractorAtom<DefensiveAssistLogEvent>('defensive_assist'); 