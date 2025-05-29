import { Atom, atom } from 'jotai';
import { defensiveAssistExtractorAtom } from '~/atoms/event_extractors/defensiveAssistExtractorAtom';
import { offensiveAssistExtractorAtom } from '~/atoms/event_extractors/offensiveAssistExtractorAtom';
import { heroSpawnExtractorAtom } from '~/atoms/event_extractors/heroSpawnExtractorAtom';
import { heroSwapExtractorAtom } from '~/atoms/event_extractors/heroSwapExtractorAtom';
import { ability1UsedExtractorAtom } from '~/atoms/event_extractors/ability1UsedExtractorAtom';
import { ability2UsedExtractorAtom } from '~/atoms/event_extractors/ability2UsedExtractorAtom';
import { combinePlayerEvents, type PlayerEvent } from '~/atoms/derived_events/playerEvents';

/**
 * Atom that combines various player events
 */
export const playerEventsAtom: Atom<Promise<PlayerEvent[]>> = atom(async (get) => {
  // Get all the event data from extractor atoms
  const defensiveAssists = await get(defensiveAssistExtractorAtom);
  const offensiveAssists = await get(offensiveAssistExtractorAtom);
  const heroSpawns = await get(heroSpawnExtractorAtom);
  const heroSwaps = await get(heroSwapExtractorAtom);
  const ability1Used = await get(ability1UsedExtractorAtom);
  const ability2Used = await get(ability2UsedExtractorAtom);

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