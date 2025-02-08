import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for hero spawn events
 */
export interface HeroSpawnLogEvent {
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
 * Atom that extracts hero spawn events from the parsed log files
 */
export const heroSpawnExtractorAtom = createEventExtractorAtom<HeroSpawnLogEvent>('hero_spawn'); 