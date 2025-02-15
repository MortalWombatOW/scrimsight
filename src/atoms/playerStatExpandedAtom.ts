import { atom } from 'jotai';
import { playerStatExtractorAtom, PlayerStatLogEvent } from './event_extractors/playerStatExtractorAtom';
import {getRoleFromHero} from '../lib/data/hero';

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
  const playerStats = await get(playerStatExtractorAtom);
  
  return playerStats.map(stat => ({
    ...stat,
    playerRole: getRoleFromHero(stat.playerHero)
  }));
}); 