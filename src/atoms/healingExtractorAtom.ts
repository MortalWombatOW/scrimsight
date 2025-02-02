import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for healing events
 */
export interface HealingLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  healerTeam: string;
  healerName: string;
  healerHero: string;
  healeeTeam: string;
  healeeName: string;
  healeeHero: string;
  eventAbility: string;
  eventHealing: number;
  isHealthPack: boolean;
}

/**
 * Atom that extracts healing events from the parsed log files
 */
export const healingExtractorAtom = createEventExtractorAtom<HealingLogEvent>('healing'); 