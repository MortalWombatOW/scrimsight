import { useAtomValue, atom } from "jotai";
import { playerStatExpandedAtom } from "../playerStatExpandedAtom";
import { groupByAtom, Grouped, MetricAtom } from "./metricUtils";
import { heroPlaytimeAtom } from './heroPlaytimeAtom';
import { OverwatchRole, getRankForRole } from "../../lib/data/hero";

export type PlayerStatsCategoryKeys = 'matchId' | 'roundNumber' | 'playerTeam' | 'playerName' | 'playerHero' | 'playerRole';

type PlayerStatsBaseNumericalKeys = 'playtime' | 'eliminations' | 'finalBlows' | 'deaths' | 'allDamageDealt' | 'barrierDamageDealt'
| 'heroDamageDealt' | 'healingDealt' | 'healingReceived' | 'selfHealing' | 'damageTaken' 
| 'damageBlocked' | 'defensiveAssists' | 'offensiveAssists' | 'ultimatesEarned' | 'ultimatesUsed' | 'multikills'
| 'soloKills' | 'objectiveKills' | 'environmentalKills' | 'environmentalDeaths' | 'criticalHits' | 'shotsFired' | 'shotsHit' | 'shotsMissed' | 'scopedShotsFired' | 'scopedShotsHit';

type PlayerStatsBase = {[k in PlayerStatsCategoryKeys]: string} & {[k in PlayerStatsBaseNumericalKeys]: number};

type PlayerStatsDerivedNumericalKeys = 'eliminationsPer10Minutes' | 'finalBlowsPer10Minutes' | 'deathsPer10Minutes' | 'allDamageDealtPer10Minutes' | 'barrierDamageDealtPer10Minutes'
| 'heroDamageDealtPer10Minutes' | 'healingDealtPer10Minutes' | 'healingReceivedPer10Minutes' | 'selfHealingPer10Minutes' | 'damageTakenPer10Minutes'
| 'damageBlockedPer10Minutes' | 'defensiveAssistsPer10Minutes' | 'offensiveAssistsPer10Minutes' | 'ultimatesEarnedPer10Minutes' | 'ultimatesUsedPer10Minutes'
| 'multikillsPer10Minutes' | 'soloKillsPer10Minutes' | 'objectiveKillsPer10Minutes' | 'environmentalKillsPer10Minutes' | 'environmentalDeathsPer10Minutes'
| 'criticalHitsPer10Minutes' | 'shotsFiredPer10Minutes' | 'shotsHitPer10Minutes' | 'shotsMissedPer10Minutes' | 'scopedShotsFiredPer10Minutes' | 'scopedShotsHitPer10Minutes'
| 'weaponAccuracy' | 'scopedWeaponAccuracy' | 'utility' | 'criticalHitRate';

export type PlayerStats = PlayerStatsBase & {[k in PlayerStatsDerivedNumericalKeys]: number};

export type PlayerStatsNumericalKeys = PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys;

const playerStatsBaseNumericalKeys: PlayerStatsBaseNumericalKeys[] = [
  'playtime',
  'eliminations',
  'finalBlows', 
  'deaths',
  'allDamageDealt',
  'barrierDamageDealt',
  'heroDamageDealt',
  'healingDealt',
  'healingReceived',
  'selfHealing',
  'damageTaken',
  'damageBlocked',
  'defensiveAssists',
  'offensiveAssists',
  'ultimatesEarned',
  'ultimatesUsed',
  'multikills',
  'soloKills',
  'objectiveKills',
  'environmentalKills',
  'environmentalDeaths',
  'criticalHits',
  'shotsFired',
  'shotsHit',
  'shotsMissed',
  'scopedShotsFired',
  'scopedShotsHit',
];

const playerStatsDerivedNumericalKeys: PlayerStatsDerivedNumericalKeys[] = [
  'eliminationsPer10Minutes', 'finalBlowsPer10Minutes',
      'deathsPer10Minutes', 'allDamageDealtPer10Minutes', 'barrierDamageDealtPer10Minutes', 'heroDamageDealtPer10Minutes',
      'healingDealtPer10Minutes', 'healingReceivedPer10Minutes', 'selfHealingPer10Minutes', 'damageTakenPer10Minutes',
      'damageBlockedPer10Minutes', 'defensiveAssistsPer10Minutes', 'offensiveAssistsPer10Minutes', 'ultimatesEarnedPer10Minutes',
      'ultimatesUsedPer10Minutes', 'multikillsPer10Minutes', 'soloKillsPer10Minutes', 'objectiveKillsPer10Minutes', 'environmentalKillsPer10Minutes',
      'environmentalDeathsPer10Minutes', 'criticalHitsPer10Minutes', 'shotsFiredPer10Minutes', 'shotsHitPer10Minutes', 'shotsMissedPer10Minutes', 'scopedShotsFiredPer10Minutes',
      'scopedShotsHitPer10Minutes', 'weaponAccuracy', 'scopedWeaponAccuracy', 'utility', 'criticalHitRate'
];


export const playerStatsNumericalKeys = [
  ...playerStatsBaseNumericalKeys,
  ...playerStatsDerivedNumericalKeys,
] as PlayerStatsNumericalKeys[];

export const playerStatsCategoryKeys: PlayerStatsCategoryKeys[] = [
      'matchId',
      'roundNumber', 
      'playerTeam',
      'playerName',
      'playerHero',
      'playerRole'
    ];

// The most granular data, which is the player stats for each round.
const playerStatsBaseAtom: MetricAtom<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = atom(async (get) => {
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
    categoryKeys: playerStatsCategoryKeys,
    numericalKeys: playerStatsBaseNumericalKeys,
    rows: mergedStats
  };
});

// The numerical keys are the same for all of these, but the category keys are different. Order does not matter for the category keys, e.g. ['playerName', 'playerTeam'] is the same as ['playerTeam', 'playerName'].


function filterBaseAtom<T extends PlayerStatsCategoryKeys>(metricAtom: typeof playerStatsBaseAtom, filter: Record<T, string[]>): typeof playerStatsBaseAtom {
  const newAtom = atom(async (get) => {
    const { categoryKeys, numericalKeys, rows } = await get(metricAtom);

    const filteredRows = rows.filter((row) => {
      return Object.keys(filter).every((key) => filter[key as T].includes(row[key as T]));
    });

    return {
      categoryKeys,
      numericalKeys,
      rows: filteredRows
    };
  });

  return newAtom;
}

function addDerivedMetrics<T extends PlayerStatsCategoryKeys>(metricAtom: MetricAtom<Grouped<PlayerStatsBase, T, PlayerStatsBaseNumericalKeys>, T, PlayerStatsBaseNumericalKeys>): MetricAtom<Grouped<PlayerStats, T, PlayerStatsNumericalKeys>, T, PlayerStatsNumericalKeys> {
  const newAtom = atom(async (get) => {
    const { categoryKeys, rows } = await get(metricAtom);


    const newRows: Grouped<PlayerStats, T, PlayerStatsNumericalKeys>[] = [];

    for (const row of rows) {
      const playtime = row.playtime;

      const newRow: Grouped<PlayerStats, T, PlayerStatsNumericalKeys> = {
        ...row,
        eliminationsPer10Minutes: row.eliminations / (playtime / 600),
        finalBlowsPer10Minutes: row.finalBlows / (playtime / 600),
        deathsPer10Minutes: row.deaths / (playtime / 600),
        allDamageDealtPer10Minutes: row.allDamageDealt / (playtime / 600),
        barrierDamageDealtPer10Minutes: row.barrierDamageDealt / (playtime / 600),
        heroDamageDealtPer10Minutes: row.heroDamageDealt / (playtime / 600),
        healingDealtPer10Minutes: row.healingDealt / (playtime / 600),
        healingReceivedPer10Minutes: row.healingReceived / (playtime / 600),
        selfHealingPer10Minutes: row.selfHealing / (playtime / 600),
        damageTakenPer10Minutes: row.damageTaken / (playtime / 600),
        damageBlockedPer10Minutes: row.damageBlocked / (playtime / 600),
        defensiveAssistsPer10Minutes: row.defensiveAssists / (playtime / 600),
        offensiveAssistsPer10Minutes: row.offensiveAssists / (playtime / 600),
        ultimatesEarnedPer10Minutes: row.ultimatesEarned / (playtime / 600),
        ultimatesUsedPer10Minutes: row.ultimatesUsed / (playtime / 600),
        multikillsPer10Minutes: row.multikills / (playtime / 600),
        soloKillsPer10Minutes: row.soloKills / (playtime / 600),
        objectiveKillsPer10Minutes: row.objectiveKills / (playtime / 600),
        environmentalKillsPer10Minutes: row.environmentalKills / (playtime / 600),
        environmentalDeathsPer10Minutes: row.environmentalDeaths / (playtime / 600),
        criticalHitsPer10Minutes: row.criticalHits / (playtime / 600),
        shotsFiredPer10Minutes: row.shotsFired / (playtime / 600),
        shotsHitPer10Minutes: row.shotsHit / (playtime / 600),
        shotsMissedPer10Minutes: row.shotsMissed / (playtime / 600),
        scopedShotsFiredPer10Minutes: row.scopedShotsFired / (playtime / 600),
        scopedShotsHitPer10Minutes: row.scopedShotsHit / (playtime / 600),
        weaponAccuracy: row.shotsHit / row.shotsFired,
        scopedWeaponAccuracy: row.scopedShotsHit / row.scopedShotsFired,
        criticalHitRate: row.criticalHits / row.shotsFired,
        utility: 0.05 * row.heroDamageDealt + 0.05 * row.healingDealt + 0.5 * row.finalBlows + 0.25 * row.eliminations + 0.1 * row.defensiveAssists + 0.1 * row.offensiveAssists - 0.5 * row.deaths + 0.05 * row.damageBlocked
      }
      newRows.push(newRow);
    }

    return {
      categoryKeys,
      numericalKeys: playerStatsNumericalKeys,
      rows: newRows
    };
  });

  return newAtom;
}

function onlyDominantRole(
  metricAtom: MetricAtom<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>
): typeof metricAtom {
  const newAtom = atom(async (get) => {
    const { categoryKeys, numericalKeys, rows } = await get(metricAtom);
    
    // Calculate dominant roles per player per match per round
    const dominantRoles = new Map<string, string>();
    const rolePlaytimes = new Map<string, Map<string, number>>();

    // First pass: accumulate playtime per role per player-match
    for (const row of rows) {
      const playerMatchRoundKey = `${row.playerName}-${row.matchId}-${row.roundNumber}`;
      const currentPlaytime = rolePlaytimes.get(playerMatchRoundKey)?.get(row.playerRole) || 0;
      
      if (!rolePlaytimes.has(playerMatchRoundKey)) {
        rolePlaytimes.set(playerMatchRoundKey, new Map());
      }
      rolePlaytimes.get(playerMatchRoundKey)!.set(row.playerRole, currentPlaytime + row.playtime);
    }

    // Determine dominant role for each player-match
    rolePlaytimes.forEach((roles, playerMatchRoundKey) => {
      let maxPlaytime = -Infinity;
      let dominantRole = '';
      
      roles.forEach((playtime, role) => {
        if (playtime > maxPlaytime) {
          maxPlaytime = playtime;
          dominantRole = role;
        }
      });
      
      dominantRoles.set(playerMatchRoundKey, dominantRole);
    });

    // Filter rows to only include dominant roles
    const filteredRows = rows.filter(row => {
      const playerMatchRoundKey = `${row.playerName}-${row.matchId}-${row.roundNumber}`;
      return row.playerRole === dominantRoles.get(playerMatchRoundKey);
    });

    // sort by role using getRankForRole
    filteredRows.sort((a, b) => getRankForRole(a.playerRole as OverwatchRole) - getRankForRole(b.playerRole as OverwatchRole));

    return {
      categoryKeys,
      numericalKeys,
      rows: filteredRows
    };
  });


  return newAtom as typeof metricAtom;
}

// Totals for a player
export const playerStatsByPlayerAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['playerName']));
// Totals for each hero
export const playerStatsByHeroAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['playerHero']));

// Totals for each role
export const playerStatsByRoleAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['playerRole']));

// Totals for each team
export const playerStatsByTeamAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['playerTeam']));

// Totals for each match per team
export const playerStatsByMatchIdAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['matchId', 'playerTeam']));

// Totals for each round per team
export const playerStatsByMatchIdAndRoundNumberAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['matchId', 'roundNumber', 'playerTeam']));

// Totals for each match per player 
export const playerStatsByMatchIdAndPlayerNameAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['matchId', 'playerName']));

// Totals for each round per player
export const playerStatsByMatchIdAndRoundNumberAndPlayerNameAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['matchId', 'roundNumber', 'playerName']));

// Totals for each player broken down by role
export const playerStatsByPlayerAndRoleAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['playerName', 'playerRole']));

// Totals for each player broken down by hero
export const playerStatsByPlayerAndHeroAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['playerName', 'playerHero']));

// Totals for each player broken down by team
export const playerStatsByPlayerAndTeamAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['playerName', 'playerTeam']));

// Totals for each player broken down by match and role
export const playerStatsByMatchIdAndPlayerNameAndRoleAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['matchId', 'playerName', 'playerRole']));

export const playerStatsByMatchIdAndPlayerNameAndRoleAndTeamAndHeroAtom = addDerivedMetrics(groupByAtom(playerStatsBaseAtom, ['matchId', 'playerName', 'playerRole', 'playerTeam', 'playerHero']));


export const getStatsAtom =  <T extends PlayerStatsCategoryKeys>(groupBy: PlayerStatsCategoryKeys[], filter?: Record<T, string[]>) => {
  if (filter) {
    return addDerivedMetrics(groupByAtom(onlyDominantRole(filterBaseAtom(playerStatsBaseAtom, filter)), groupBy));
  } else {
    return addDerivedMetrics(groupByAtom(onlyDominantRole(playerStatsBaseAtom), groupBy));
  }
}

const statsAtomCache = new Map<string, MetricAtom<any, any, any>>();

export const useStats = <T extends PlayerStatsCategoryKeys>(
  groupBy: PlayerStatsCategoryKeys[],
  filter?: Record<T, string[]>,
  sortBy?: PlayerStatsNumericalKeys,
  sortDirection?: 'asc' | 'desc' 
) => {
  const cacheKey = JSON.stringify({ groupBy, filter, sortBy, sortDirection });
  const statsAtom = statsAtomCache.has(cacheKey) ? statsAtomCache.get(cacheKey)! : getStatsAtom(groupBy, filter);
  if (!statsAtomCache.has(cacheKey)) {
    statsAtomCache.set(cacheKey, statsAtom);
  }
  const stats = useAtomValue(statsAtom);
  if (sortBy) {
    stats.rows.sort((a, b) => {
      return sortDirection === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    });
  }
  return stats;
};
