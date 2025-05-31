import { atom } from 'jotai';
import defensiveAssistAtom from '@atoms/defensiveAssist'; // Corrected path and import kind
import offensiveAssistAtom from '@atoms/offensiveAssist'; // Corrected path and import kind
import heroSpawnAtom from '@atoms/heroSpawn'; // Corrected path and import kind
import heroSwapAtom from '@atoms/heroSwap'; // Corrected path and import kind
import ability1UsedAtom from '@atoms/ability1Used'; // Corrected path and import kind
import ability2UsedAtom from '@atoms/ability2Used'; // Corrected path and import kind
import { combinePlayerEvents, type PlayerEvent } from '@library/playerEvents'; // Corrected path and import kind

/**
 * Atom that combines various player events
 */
export const playerEventsAtom = atom(async (get): Promise<PlayerEvent[]> => {
  // Get all the event data from extractor atoms
  const defensiveAssists = await get(defensiveAssistAtom);
  const offensiveAssists = await get(offensiveAssistAtom);
  const heroSpawns = await get(heroSpawnAtom);
  const heroSwaps = await get(heroSwapAtom);
  const ability1Used = await get(ability1UsedAtom);
  const ability2Used = await get(ability2UsedAtom);

  // Use the pure function to combine events
  return combinePlayerEvents(
    defensiveAssists,
    offensiveAssists,
    heroSpawns,
    heroSwaps,
    ability1Used,
    ability2Used
  );
});

// Re-export the PlayerEvent type for convenience
export type { PlayerEvent } from '../lib/playerEvents';
