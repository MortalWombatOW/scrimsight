import { atom } from 'jotai';
import { ultimateCharged } from '@atoms';
import { ultimateStart } from '@atoms';
import { ultimateEnd } from '@atoms';

/**
 * Interface for combined ultimate events
 */
export interface UltimateEvent {
  id: string;
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
  const chargedEvents = await get(ultimateCharged.atom);
  const startEvents = await get(ultimateStart.atom);
  const endEvents = await get(ultimateEnd.atom);

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
      id: `${charged.matchId}-${charged.matchTime}-${charged.playerName}-${charged.playerHero}-ultimateCharged`,
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
