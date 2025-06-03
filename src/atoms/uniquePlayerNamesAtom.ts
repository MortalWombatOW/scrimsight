import { Getter } from 'jotai'; // atom will be used in index.ts
import { playerStat, type PlayerStatType } from '@atoms'; // Assuming PlayerStatType is from @atoms

// Default export the core atom logic (async getter function)
// The helper function 'uniquePlayerNamesAtomFn' will be inlined.
export default async (get: Getter): Promise<string[]> => {
  const playerStats: PlayerStatType = await get(playerStat.atom);

  // Inlined logic from uniquePlayerNamesAtomFn:
  return Array.from(new Set(
    playerStats.map(stat => stat.playerName)
  ));
};