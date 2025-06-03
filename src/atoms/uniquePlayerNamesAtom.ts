import { atom } from 'jotai';
import { playerStat, PlayerStatType } from '@atoms';

/**
 * Pure function that extracts unique player names from player stats
 */
export const uniquePlayerNamesAtomFn = (playerStats: PlayerStatType): string[] => {
  return Array.from(new Set(
    playerStats.map(stat => stat.playerName)
  ));
};

/**
 * Atom that extracts unique player names from all matches
 */
const uniquePlayerNamesAtom = atom(async (get): Promise<string[]> => {
  const playerStats = await get(playerStat.atom);
  return uniquePlayerNamesAtomFn(playerStats);
});

export default uniquePlayerNamesAtom; 