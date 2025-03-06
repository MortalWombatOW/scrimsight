import { Atom, atom } from 'jotai';
import { defensiveAssistExtractorAtom } from '../event_extractors/defensiveAssistExtractorAtom';
import { offensiveAssistExtractorAtom } from '../event_extractors/offensiveAssistExtractorAtom';
import { heroSpawnExtractorAtom } from '../event_extractors/heroSpawnExtractorAtom';
import { heroSwapExtractorAtom } from '../event_extractors/heroSwapExtractorAtom';
import { ability1UsedExtractorAtom } from '../event_extractors/ability1UsedExtractorAtom';
import { ability2UsedExtractorAtom } from '../event_extractors/ability2UsedExtractorAtom';

/**
 * Interface for combined player events
 */
export interface PlayerEvent {
  id: string;
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
export const playerEventsAtom: Atom<Promise<PlayerEvent[]>> = atom(async (get) => {
  const defensiveAssists = await get(defensiveAssistExtractorAtom);
  const offensiveAssists = await get(offensiveAssistExtractorAtom);
  const heroSpawns = await get(heroSpawnExtractorAtom);
  const heroSwaps = await get(heroSwapExtractorAtom);
  const ability1Used = await get(ability1UsedExtractorAtom);
  const ability2Used = await get(ability2UsedExtractorAtom);

  if (!defensiveAssists || !offensiveAssists || !heroSpawns || !heroSwaps || !ability1Used || !ability2Used) {
    return [];
  }

  const events: PlayerEvent[] = [
    ...defensiveAssists.map((e, i) => ({
      id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-defensiveAssist-${i}`,
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'defensiveAssist',
      playerHero: e.playerHero
    })),
    ...offensiveAssists.map((e, i) => ({
      id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-offensiveAssist-${i}`,
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'offensiveAssist',
      playerHero: e.playerHero
    })),
    ...heroSpawns.map((e, i) => ({
      id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-heroSpawn-${i}`,
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'heroSpawn',
      playerHero: e.playerHero
    })),
    ...heroSwaps.map((e, i) => ({
      id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-heroSwap-${i}`,
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'heroSwap',
      playerHero: e.playerHero
    })),
    ...ability1Used.map((e, i) => ({
      id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-ability1Used-${i}`,
      matchId: e.matchId,
      playerEventTime: e.matchTime,
      playerName: e.playerName,
      playerTeam: e.playerTeam,
      playerEventType: 'ability1Used',
      playerHero: e.playerHero
    })),
    ...ability2Used.map((e, i) => ({
      id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-ability2Used-${i}`,
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
