import { atom } from 'jotai';
import { defensiveAssistExtractorAtom } from './defensiveAssistExtractorAtom';
import { offensiveAssistExtractorAtom } from './offensiveAssistExtractorAtom';
import { heroSpawnExtractorAtom } from './heroSpawnExtractorAtom';
import { heroSwapExtractorAtom } from './heroSwapExtractorAtom';
import { ability1UsedExtractorAtom } from './ability1UsedExtractorAtom';
import { ability2UsedExtractorAtom } from './ability2UsedExtractorAtom';

/**
 * Interface for combined player events
 */
export interface PlayerEvent {
  matchId: string;
  playerEventTime: number;
  playerName: string;
  playerTeam: string;
  playerEventType: string;
  playerHero: string;
}

/**
 * Atom that combines various player events
 */
export const playerEventsAtom = atom(async (get) => {
  const defensiveAssists = await get(defensiveAssistExtractorAtom);
  const offensiveAssists = await get(offensiveAssistExtractorAtom);
  const heroSpawns = await get(heroSpawnExtractorAtom);
  const heroSwaps = await get(heroSwapExtractorAtom);
  const ability1Used = await get(ability1UsedExtractorAtom);
  const ability2Used = await get(ability2UsedExtractorAtom);

  if (!defensiveAssists || !offensiveAssists || !heroSpawns || !heroSwaps || !ability1Used || !ability2Used) {
    return null;
  }

  const events: PlayerEvent[] = [
    ...defensiveAssists.map(e => ({
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'defensiveAssist',
      playerHero: e.playerHero
    })),
    ...offensiveAssists.map(e => ({
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'offensiveAssist',
      playerHero: e.playerHero
    })),
    ...heroSpawns.map(e => ({
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'heroSpawn',
      playerHero: e.playerHero
    })),
    ...heroSwaps.map(e => ({
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'heroSwap',
      playerHero: e.playerHero
    })),
    ...ability1Used.map(e => ({
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'ability1Used',
      playerHero: e.playerHero
    })),
    ...ability2Used.map(e => ({
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'ability2Used',
      playerHero: e.playerHero
    }))
  ];

  return events.sort((a, b) => a.playerEventTime - b.playerEventTime);
}); 
