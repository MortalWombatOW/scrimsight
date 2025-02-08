import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for damage events
 */
export interface DamageLogEvent {
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
 * Atom that extracts damage events from the parsed log files
 */
export const damageExtractorAtom = createEventExtractorAtom<DamageLogEvent>('damage'); 