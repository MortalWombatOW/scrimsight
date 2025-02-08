import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for kill events
 */
export interface KillLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}

/**
 * Atom that extracts kill events from the parsed log files
 */
export const killExtractorAtom = createEventExtractorAtom<KillLogEvent>('kill'); 