import { atom } from 'jotai';
import { defensiveAssist, offensiveAssist, heroSpawn, heroSwap, ability1Used, ability2Used } from '@atoms';
import { DefensiveAssistType, OffensiveAssistType, HeroSpawnType, HeroSwapType, Ability1UsedType, Ability2UsedType } from '@atoms';

/**
 * Pure function that combines various player events
 */
export const playerEventsAtomFn = (
  defensiveAssists: DefensiveAssistType,
  offensiveAssists: OffensiveAssistType,
  heroSpawns: HeroSpawnType,
  heroSwaps: HeroSwapType,
  ability1UsedData: Ability1UsedType,
  ability2UsedData: Ability2UsedType
): any[] => {
  // Simple combination logic - convert to common format
  const events: any[] = [];
  
  // Add defensive assists
  defensiveAssists.forEach(event => {
    events.push({ ...event, eventType: 'defensiveAssist' });
  });
  
  // Add offensive assists
  offensiveAssists.forEach(event => {
    events.push({ ...event, eventType: 'offensiveAssist' });
  });
  
  // Add hero spawns
  heroSpawns.forEach(event => {
    events.push({ ...event, eventType: 'heroSpawn' });
  });
  
  // Add hero swaps
  heroSwaps.forEach(event => {
    events.push({ ...event, eventType: 'heroSwap' });
  });
  
  // Add ability usage
  ability1UsedData.forEach(event => {
    events.push({ ...event, eventType: 'ability1Used' });
  });
  
  ability2UsedData.forEach(event => {
    events.push({ ...event, eventType: 'ability2Used' });
  });
  
  // Sort by match time
  return events.sort((a, b) => a.matchTime - b.matchTime);
};

/**
 * Atom that combines various player events
 */
const playerEventsAtom = atom(async (get): Promise<any[]> => {
  // Get all the event data from extractor atoms
  const defensiveAssists = await get(defensiveAssist.atom);
  const offensiveAssists = await get(offensiveAssist.atom);
  const heroSpawns = await get(heroSpawn.atom);
  const heroSwaps = await get(heroSwap.atom);
  const ability1UsedData = await get(ability1Used.atom);
  const ability2UsedData = await get(ability2Used.atom);

  return playerEventsAtomFn(
    defensiveAssists,
    offensiveAssists,
    heroSpawns,
    heroSwaps,
    ability1UsedData,
    ability2UsedData
  );
});

export default playerEventsAtom;

