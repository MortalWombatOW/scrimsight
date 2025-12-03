import { useAtomValue, atom, Atom, Getter } from "jotai";
import { 
  groupByAtom, 
  Grouped, 
  Metric, 
  OverwatchRole, 
  getRankForRole,
  PlayerStatsCategoryKeys, 
  PlayerStatsBaseNumericalKeys,
  PlayerStatsBase,
  PlayerStats,
  PlayerStatsNumericalKeys,
  playerStatsNumericalKeys,
  playerStatsBase
} from '@library';
import { PlayerStatKey } from './statConfig';

function filterBaseAtom<T extends PlayerStatsCategoryKeys>(
  metricAtom: Atom<Promise<Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>>>,
  filter: Record<T, string[]>
): Atom<Promise<Metric<PlayerStatsBase, T, PlayerStatsBaseNumericalKeys>>> { // Changed return type to use T for categoryKeys
  const newAtom = atom(async (get: Getter) => {
    const metricData = await get(metricAtom);
    const { numericalKeys, rows } = metricData; // Removed categoryKeys from destructuring as it will be T[]

    const filteredRows = rows.filter((row: PlayerStatsBase) => {
      return Object.keys(filter).every((key) => filter[key as T].includes(row[key as T]));
    });

    return {
      categoryKeys: Object.keys(filter) as T[], // Use filter keys as categoryKeys
      numericalKeys,
      rows: filteredRows
    } as Metric<PlayerStatsBase, T, PlayerStatsBaseNumericalKeys>; // Explicitly cast return value
  });

  return newAtom;
}

function addDerivedMetrics<T extends PlayerStatsCategoryKeys>(
  metricAtom: Atom<Promise<Metric<Grouped<PlayerStatsBase, T, PlayerStatsBaseNumericalKeys>, T, PlayerStatsBaseNumericalKeys>>>
): Atom<Promise<Metric<Grouped<PlayerStats, T, PlayerStatsNumericalKeys>, T, PlayerStatsNumericalKeys>>> {
  const newAtom = atom(async (get: Getter) => {
    const metricData = await get(metricAtom);
    const { categoryKeys, rows } = metricData;

    const newRows: Grouped<PlayerStats, T, PlayerStatsNumericalKeys>[] = [];

    for (const row of rows) {
      const playtime = row.playtime;
      
      const newRow: Grouped<PlayerStats, T, PlayerStatsNumericalKeys> = {
        ...row,
        eliminationsPer10Minutes: playtime > 0 ? row.eliminations / (playtime / 600) : 0,
        finalBlowsPer10Minutes: playtime > 0 ? row.finalBlows / (playtime / 600) : 0,
        deathsPer10Minutes: playtime > 0 ? row.deaths / (playtime / 600) : 0,
        allDamageDealtPer10Minutes: playtime > 0 ? row.allDamageDealt / (playtime / 600) : 0,
        barrierDamageDealtPer10Minutes: playtime > 0 ? row.barrierDamageDealt / (playtime / 600) : 0,
        heroDamageDealtPer10Minutes: playtime > 0 ? row.heroDamageDealt / (playtime / 600) : 0,
        healingDealtPer10Minutes: playtime > 0 ? row.healingDealt / (playtime / 600) : 0,
        healingReceivedPer10Minutes: playtime > 0 ? row.healingReceived / (playtime / 600) : 0,
        selfHealingPer10Minutes: playtime > 0 ? row.selfHealing / (playtime / 600) : 0,
        damageTakenPer10Minutes: playtime > 0 ? row.damageTaken / (playtime / 600) : 0,
        damageBlockedPer10Minutes: playtime > 0 ? row.damageBlocked / (playtime / 600) : 0,
        defensiveAssistsPer10Minutes: playtime > 0 ? row.defensiveAssists / (playtime / 600) : 0,
        offensiveAssistsPer10Minutes: playtime > 0 ? row.offensiveAssists / (playtime / 600) : 0,
        ultimatesEarnedPer10Minutes: playtime > 0 ? row.ultimatesEarned / (playtime / 600) : 0,
        ultimatesUsedPer10Minutes: playtime > 0 ? row.ultimatesUsed / (playtime / 600) : 0,
        multikillsPer10Minutes: playtime > 0 ? row.multikills / (playtime / 600) : 0,
        soloKillsPer10Minutes: playtime > 0 ? row.soloKills / (playtime / 600) : 0,
        objectiveKillsPer10Minutes: playtime > 0 ? row.objectiveKills / (playtime / 600) : 0,
        environmentalKillsPer10Minutes: playtime > 0 ? row.environmentalKills / (playtime / 600) : 0,
        environmentalDeathsPer10Minutes: playtime > 0 ? row.environmentalDeaths / (playtime / 600) : 0,
        criticalHitsPer10Minutes: playtime > 0 ? row.criticalHits / (playtime / 600) : 0,
        shotsFiredPer10Minutes: playtime > 0 ? row.shotsFired / (playtime / 600) : 0,
        shotsHitPer10Minutes: playtime > 0 ? row.shotsHit / (playtime / 600) : 0,
        shotsMissedPer10Minutes: playtime > 0 ? row.shotsMissed / (playtime / 600) : 0,
        scopedShotsFiredPer10Minutes: playtime > 0 ? row.scopedShotsFired / (playtime / 600) : 0,
        scopedShotsHitPer10Minutes: playtime > 0 ? row.scopedShotsHit / (playtime / 600) : 0,
        weaponAccuracy: row.shotsFired > 0 ? row.shotsHit / row.shotsFired : 0,
        scopedWeaponAccuracy: row.scopedShotsFired > 0 ? row.scopedShotsHit / row.scopedShotsFired : 0,
        criticalHitRate: row.shotsFired > 0 ? row.criticalHits / row.shotsFired : 0,
      };
      newRows.push(newRow);
    }

    return {
      categoryKeys, // Use the categoryKeys from the input metricData
      numericalKeys: playerStatsNumericalKeys,
      rows: newRows
    } as Metric<Grouped<PlayerStats, T, PlayerStatsNumericalKeys>, T, PlayerStatsNumericalKeys>;
  });

  return newAtom;
}

function onlyDominantRole<T extends PlayerStatsCategoryKeys>(
  metricAtom: Atom<Promise<Metric<PlayerStatsBase, T, PlayerStatsBaseNumericalKeys>>> // Changed to use T for categoryKeys
): Atom<Promise<Metric<PlayerStatsBase, T, PlayerStatsBaseNumericalKeys>>> {
  const newAtom = atom(async (get: Getter) => {
    const metricData = await get(metricAtom);
    const { categoryKeys, numericalKeys, rows } = metricData;
    
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
    const filteredRows = rows.filter((row: PlayerStatsBase) => {
      const playerMatchRoundKey = `${row.playerName}-${row.matchId}-${row.roundNumber}`;
      return row.playerRole === dominantRoles.get(playerMatchRoundKey);
    });

    // sort by role using getRankForRole
    filteredRows.sort((a, b) => getRankForRole(a.playerRole as OverwatchRole) - getRankForRole(b.playerRole as OverwatchRole));

    return {
      categoryKeys, // Use the categoryKeys from the input metricData
      numericalKeys,
      rows: filteredRows
    } as Metric<PlayerStatsBase, T, PlayerStatsBaseNumericalKeys>; // Explicitly cast return value
  });


  return newAtom;
}

// Exporting this function for use in other atom files
export const getStatsAtom =  <T extends PlayerStatsCategoryKeys>(
  groupBy: T[], 
  filter?: Partial<Record<T, string[]>> // Changed to Partial
): Atom<Promise<Metric<Grouped<PlayerStats, T, PlayerStatsNumericalKeys>, T, PlayerStatsNumericalKeys>>> => {
  const baseAtomToUse = playerStatsBase.atom;

  if (filter && Object.keys(filter).length > 0) { // Ensure filter is not empty
    // Cast filter to Record<T, string[]> as filterBaseAtom expects a non-partial record
    // This is safe because we check if filter is defined and not empty
    return addDerivedMetrics(groupByAtom(onlyDominantRole(filterBaseAtom(baseAtomToUse, filter as Record<T, string[]>)), groupBy));
  } else {
    return addDerivedMetrics(groupByAtom(onlyDominantRole(baseAtomToUse), groupBy));
  }
}

// Improved cache typing with proper generic constraints while maintaining flexibility for different T types
const statsAtomCache = new Map<string, Atom<Promise<Metric<Grouped<PlayerStats, PlayerStatsCategoryKeys, PlayerStatsNumericalKeys>, PlayerStatsCategoryKeys, PlayerStatsNumericalKeys>>>>();

export const useStats = <T extends PlayerStatsCategoryKeys>(
  groupBy: T[], 
  filter?: Partial<Record<T, string[]>>, // Changed to Partial
  // Update sortBy type to accept both category and numerical keys
  sortBy?: PlayerStatsCategoryKeys | PlayerStatKey | undefined,
  sortDirection?: 'asc' | 'desc'
) => {
  const cacheKey = JSON.stringify({ groupBy, filter, sortBy, sortDirection });
  const statsAtom = statsAtomCache.has(cacheKey) ? statsAtomCache.get(cacheKey)! as unknown as Atom<Promise<Metric<Grouped<PlayerStats, T, PlayerStatsNumericalKeys>, T, PlayerStatsNumericalKeys>>> : getStatsAtom(groupBy, filter);
  if (!statsAtomCache.has(cacheKey)) {
    statsAtomCache.set(cacheKey, statsAtom as unknown as Atom<Promise<Metric<Grouped<PlayerStats, PlayerStatsCategoryKeys, PlayerStatsNumericalKeys>, PlayerStatsCategoryKeys, PlayerStatsNumericalKeys>>>);
  }
  const stats = useAtomValue(statsAtom);
  if (sortBy && stats.rows) {
    // Check if the sortBy key is a numerical or category key
    const isNumerical = playerStatsNumericalKeys.includes(sortBy as PlayerStatsNumericalKeys);

    stats.rows.sort((a: Grouped<PlayerStats, T, PlayerStatsNumericalKeys>, b: Grouped<PlayerStats, T, PlayerStatsNumericalKeys>) => {
      const valA = a[sortBy as keyof typeof a];
      const valB = b[sortBy as keyof typeof b];

      // Handle potential null/undefined values gracefully
      if (valA == null && valB == null) return 0;
      if (valA == null) return sortDirection === 'asc' ? -1 : 1; // Treat nulls as smaller or larger depending on direction
      if (valB == null) return sortDirection === 'asc' ? 1 : -1;

      let comparison = 0;
      if (isNumerical) {
        // Numerical comparison
        comparison = (valA as number) - (valB as number);
      } else {
        // String (locale-aware) comparison for categories
        comparison = String(valA).localeCompare(String(valB));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  return stats;
};
