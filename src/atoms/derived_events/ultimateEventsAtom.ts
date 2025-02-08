import { atom } from 'jotai';
import { ultimateChargedExtractorAtom } from '../event_extractors/ultimateChargedExtractorAtom';
import { ultimateStartExtractorAtom } from '../event_extractors/ultimateStartExtractorAtom';
import { ultimateEndExtractorAtom } from '../event_extractors/ultimateEndExtractorAtom';

/**
 * Interface for combined ultimate events
 */
export interface UltimateEvent {
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  ultimateId: string;
  ultimateChargedTime: number;
  ultimateStartTime: number;
  ultimateEndTime: number;
  ultimateHoldTime: number;
}

/**
 * Atom that combines ultimate charged, start, and end events
 */
export const ultimateEventsAtom = atom(async (get): Promise<UltimateEvent[]> => {
  const chargedEvents = await get(ultimateChargedExtractorAtom);
  const startEvents = await get(ultimateStartExtractorAtom);
  const endEvents = await get(ultimateEndExtractorAtom);

  return chargedEvents.flatMap(charged => {
    // Find matching start and end events
    const start = startEvents.find(s => 
      s.matchId === charged.matchId && 
      s.playerName === charged.playerName && 
      s.playerTeam === charged.playerTeam &&
      s.playerHero === charged.playerHero && 
      s.ultimateId === charged.ultimateId &&
      s.matchTime >= charged.matchTime
    );

    if (!start) return [];

    const end = endEvents.find(e => 
      e.matchId === charged.matchId && 
      e.playerName === charged.playerName && 
      e.playerTeam === charged.playerTeam &&
      e.playerHero === charged.playerHero && 
      e.ultimateId === charged.ultimateId &&
      e.matchTime >= start.matchTime
    );

    if (!end) return [];

    return [{
      matchId: charged.matchId,
      playerName: charged.playerName,
      playerTeam: charged.playerTeam,
      playerHero: charged.playerHero,
      ultimateId: charged.ultimateId.toString(),
      ultimateChargedTime: charged.matchTime,
      ultimateStartTime: start.matchTime,
      ultimateEndTime: end.matchTime,
      ultimateHoldTime: start.matchTime - charged.matchTime
    }];
  });
}); 
