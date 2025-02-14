import { atom } from "jotai";
import { playerStatExpandedAtom, PlayerStats } from "../playerStatExpandedAtom";
import { groupByAtom, MetricAtom } from "./createAggregateAtoms";
import { heroPlaytimeAtom } from './heroPlaytimeAtom';

type PlayerStatsCategoryKeys = 'matchId' | 'roundNumber' | 'playerTeam' | 'playerName' | 'playerHero' | 'playerRole';
type PlayerStatsNumericalKeys = Exclude<keyof PlayerStats, PlayerStatsCategoryKeys | 'type'> | 'playtime';

// The most granular data, which is the player stats for each round.
export const playerStatsBaseAtom: MetricAtom<PlayerStats & { playtime: number }, PlayerStatsCategoryKeys, PlayerStatsNumericalKeys> = atom(async (get) => {
  const playerStats = await get(playerStatExpandedAtom);
  const playtimeData = await get(heroPlaytimeAtom);

  // Create a playtime lookup map
  const playtimeMap = new Map<string, number>();
  for (const pt of playtimeData.rows) {
    const key = `${pt.playerName}-${pt.matchId}-${pt.roundNumber}-${pt.hero}`;
    playtimeMap.set(key, pt.playtime);
  }

  // Merge playtime into player stats
  const mergedStats = playerStats.map(stat => ({
    ...stat,
    playtime: playtimeMap.get(
      `${stat.playerName}-${stat.matchId}-${stat.roundNumber}-${stat.playerHero}`
    ) || 0
  }));

  return {
    categoryKeys: ['matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole'] as PlayerStatsCategoryKeys[],
    numericalKeys: [
      ...(playerStats[0] ? Object.keys(playerStats[0]).filter(k => 
        !['matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole', 'type'].includes(k)
      ) as PlayerStatsNumericalKeys[] : []),
      'playtime'
    ] as PlayerStatsNumericalKeys[],
    rows: mergedStats
  };
});

// The numerical keys are the same for all of these, but the category keys are different. Order does not matter for the category keys, e.g. ['playerName', 'playerTeam'] is the same as ['playerTeam', 'playerName'].

// Totals for a player
export const playerStatsByPlayerAtom = groupByAtom(playerStatsBaseAtom, ['playerName']);

// Totals for each hero
export const playerStatsByHeroAtom = groupByAtom(playerStatsBaseAtom, ['playerHero']);

// Totals for each role
export const playerStatsByRoleAtom = groupByAtom(playerStatsBaseAtom, ['playerRole']);

// Totals for each team
export const playerStatsByTeamAtom = groupByAtom(playerStatsBaseAtom, ['playerTeam']);

// Totals for each match per team
export const playerStatsByMatchIdAtom = groupByAtom(playerStatsBaseAtom, ['matchId', 'playerTeam']);

// Totals for each round per team
export const playerStatsByMatchIdAndRoundNumberAtom = groupByAtom(playerStatsBaseAtom, ['matchId', 'roundNumber', 'playerTeam']);

// Totals for each match per player 
export const playerStatsByMatchIdAndPlayerNameAtom = groupByAtom(playerStatsBaseAtom, ['matchId', 'playerName']);

// Totals for each round per player
export const playerStatsByMatchIdAndRoundNumberAndPlayerNameAtom = groupByAtom(playerStatsBaseAtom, ['matchId', 'roundNumber', 'playerName']);

// Totals for each player broken down by role
export const playerStatsByPlayerAndRoleAtom = groupByAtom(playerStatsBaseAtom, ['playerName', 'playerRole']);

// Totals for each player broken down by hero
export const playerStatsByPlayerAndHeroAtom = groupByAtom(playerStatsBaseAtom, ['playerName', 'playerHero']);

// Totals for each player broken down by team
export const playerStatsByPlayerAndTeamAtom = groupByAtom(playerStatsBaseAtom, ['playerName', 'playerTeam']);