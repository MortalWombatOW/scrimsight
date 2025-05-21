import { createEventExtractorAtom } from '~/atoms/event_extractors/createEventExtractorAtom';

/**
 * Interface for mercy rez events
 */
export interface MercyRezLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  mercyTeam: string;
  mercyName: string;
  revivedTeam: string;
  revivedName: string;
  revivedHero: string;
  eventAbility: string;
}

/**
 * Atom that extracts mercy rez events from the parsed log files
 */
export const mercyRezExtractorAtom = createEventExtractorAtom<MercyRezLogEvent>('mercy_rez', {
  eventAbility: 'revivedHero',
  revivedHero: 'revivedName',
  revivedName: 'revivedTeam',
}); 