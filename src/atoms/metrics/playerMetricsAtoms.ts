import { atom } from "jotai";
import { playerStatExpandedAtom, PlayerStats } from "../playerStatExpandedAtom";
import { groupByAtom, Metric, MetricAtom } from "./createAggregateAtoms";

type PlayerStatsCategoryKeys = 'matchId' | 'roundNumber' | 'playerTeam' | 'playerName' | 'playerHero' | 'playerRole';
type PlayerStatsNumericalKeys = Exclude<keyof PlayerStats, PlayerStatsCategoryKeys | 'type'>;

// The most granular data, which is the player stats for each round.
export const playerStatsBaseAtom: MetricAtom<PlayerStats, PlayerStatsCategoryKeys, PlayerStatsNumericalKeys> = atom(async (get) => {
  const playerStats = await get(playerStatExpandedAtom);

  const metric: Metric<PlayerStats, PlayerStatsCategoryKeys, PlayerStatsNumericalKeys> = {
    categoryKeys: ['matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole'],
    numericalKeys: ['eliminations', 'finalBlows', 'deaths', 'allDamageDealt', 'barrierDamageDealt', 'heroDamageDealt', 'healingDealt', 'healingReceived', 'selfHealing', 'damageTaken', 'damageBlocked', 'defensiveAssists', 'offensiveAssists', 'ultimatesEarned', 'ultimatesUsed', 'multikillBest', 'multikills', 'soloKills', 'objectiveKills', 'environmentalKills', 'environmentalDeaths', 'criticalHits', 'criticalHitAccuracy', 'scopedAccuracy', 'scopedCriticalHitAccuracy', 'scopedCriticalHitKills', 'shotsFired', 'shotsHit', 'shotsMissed', 'scopedShotsFired', 'scopedShotsHit', 'weaponAccuracy', 'heroTimePlayed'],
    rows: playerStats 
  };
  return metric;
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