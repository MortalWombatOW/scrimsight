import { atom } from 'jotai';
import { PlayerStatLogEvent, playerStat, PlayerStatsExpanded } from '@atoms';
import {getRoleFromHero} from '@library';

export const playerStatExpandedAtomFn = (
  playerStats: PlayerStatLogEvent[]
): PlayerStatsExpanded[] => {
  return playerStats.map(stat => ({
    ...stat,
    playerRole: getRoleFromHero(stat.playerHero)
  }));
};

export default atom(async (get): Promise<PlayerStatsExpanded[]> => {
  const playerStats = await get(playerStat.atom);
  return playerStatExpandedAtomFn(playerStats);
}); 