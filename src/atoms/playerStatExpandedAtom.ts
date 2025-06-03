import { atom } from 'jotai';
import { PlayerStatLogEvent, playerStat } from '@atoms';
import {getRoleFromHero} from '@library';

/**
 * Interface for expanded player stat events that includes role information
 */
export interface PlayerStatsExpanded extends PlayerStatLogEvent {
  playerRole: string;
}

/**
 * Atom that adds role information to player stat events
 */
export const playerStatExpandedAtom = atom(async (get): Promise<PlayerStatsExpanded[]> => {
  const playerStats = await get(playerStat.atom);
  
  return playerStats.map(stat => ({
    ...stat,
    playerRole: getRoleFromHero(stat.playerHero)
  }));
}); 