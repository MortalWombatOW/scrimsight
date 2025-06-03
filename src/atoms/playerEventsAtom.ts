import { Getter } from 'jotai';
import {
  defensiveAssist,
  offensiveAssist,
  heroSpawn, // Assumes these are ScrimsightAtom wrappers from index.ts
  heroSwap,
  ability1Used,
  ability2Used,
  type DefensiveAssistType,
  type OffensiveAssistType,
  type HeroSpawnType,
  type HeroSwapType,
  type Ability1UsedType,
  type Ability2UsedType,
} from '@atoms';

// Default export the core atom logic (async getter function)
// The helper function 'playerEventsAtomFn' will be inlined.
export default async (get: Getter): Promise<any[]> => {
  const defensiveAssistsData: DefensiveAssistType = await get(defensiveAssist.atom);
  const offensiveAssistsData: OffensiveAssistType = await get(offensiveAssist.atom);
  const heroSpawnsData: HeroSpawnType = await get(heroSpawn.atom);
  const heroSwapsData: HeroSwapType = await get(heroSwap.atom);
  const ability1UsedDataData: Ability1UsedType = await get(ability1Used.atom); // Corrected variable name
  const ability2UsedDataData: Ability2UsedType = await get(ability2Used.atom); // Corrected variable name

  // Inlined logic from playerEventsAtomFn:
  const events: any[] = [];
  
  defensiveAssistsData.forEach(event => {
    events.push({ ...event, eventType: 'defensiveAssist' });
  });
  
  offensiveAssistsData.forEach(event => {
    events.push({ ...event, eventType: 'offensiveAssist' });
  });
  
  heroSpawnsData.forEach(event => {
    events.push({ ...event, eventType: 'heroSpawn' });
  });
  
  heroSwapsData.forEach(event => {
    events.push({ ...event, eventType: 'heroSwap' });
  });
  
  ability1UsedDataData.forEach(event => { // Corrected variable name
    events.push({ ...event, eventType: 'ability1Used' });
  });
  
  ability2UsedDataData.forEach(event => { // Corrected variable name
    events.push({ ...event, eventType: 'ability2Used' });
  });
  
  return events.sort((a, b) => a.matchTime - b.matchTime);
};
