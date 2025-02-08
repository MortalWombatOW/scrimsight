import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for hero swap events
 */
export interface HeroSwapLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  previousHero: string;
  heroTimePlayed: number;
}

/**
 * Atom that extracts hero swap events from the parsed log files
 */
export const heroSwapExtractorAtom = createEventExtractorAtom<HeroSwapLogEvent>('hero_swap'); 