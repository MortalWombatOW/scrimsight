import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for D.Va demech events
 */
export interface DvaDemechLogEvent {
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
 * Atom that extracts D.Va demech events from the parsed log files
 */
export const dvaDemechExtractorAtom = createEventExtractorAtom<DvaDemechLogEvent>('dva_demech'); 