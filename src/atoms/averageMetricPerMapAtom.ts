import { atom } from 'jotai';
import {
  playerStatsBaseAtom,
  PlayerStatsNumericalKeys,
  playerStatsNumericalKeys,
  playerStatsBaseNumericalKeys,
} from '~/atoms/metrics/playerMetricsAtoms';
import { matchDataAtom } from '~/atoms/matchDataAtom';
import { uniqueMapNamesAtom } from '~/atoms/uniqueMapNamesAtom'; // Assuming this exists

// Define the output structure for average stats per map
export type AverageMapStats = {
  [K in PlayerStatsNumericalKeys]?: number; // All numerical stats are optional averages
};

// Key could be mapName or mapName-mode
export type AverageMetricPerMap = Record<string, AverageMapStats>;

// Atom to calculate average player metrics per map
export const averageMetricPerMapAtom = atom(async (get): Promise<AverageMetricPerMap> => {
  // Get base player stats and match data
  const playerStatsData = await get(playerStatsBaseAtom);
  const allMatches = await get(matchDataAtom);
  // Get unique map names to initialize structure
  const uniqueMaps = await get(uniqueMapNamesAtom); // Need this atom

  // Create a lookup map from matchId to mapName (or mapName-mode)
  const matchIdToMapLookup = new Map<string, string>();
  allMatches.forEach(match => {
    // Use map name as key for simplicity, could use map-mode if needed
    if (match.map) {
      matchIdToMapLookup.set(match.matchId, match.map);
    }
  });

  // Intermediate structure to sum stats and playtime per map
  type BaseKey = (typeof playerStatsBaseNumericalKeys)[number];
  const mapStatSums: Record<string, { [K in BaseKey]: number } & { count: number }> = {};

  // Initialize sums for all known maps
  uniqueMaps.forEach(mapName => {
    mapStatSums[mapName] = { ...Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as any, count: 0 };
  });


  // Aggregate sums and playtime for each map based on player stats
  for (const row of playerStatsData.rows) {
    const mapName = matchIdToMapLookup.get(row.matchId);
    if (mapName && mapStatSums[mapName]) {
      mapStatSums[mapName].count++;
      playerStatsBaseNumericalKeys.forEach(key => {
        mapStatSums[mapName][key] += row[key] ?? 0;
      });
    }
    // Optional: Handle cases where mapName might be missing or not in uniqueMaps
    else if (mapName && !mapStatSums[mapName]) {
      mapStatSums[mapName] = { ...Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as any, count: 1 };
      playerStatsBaseNumericalKeys.forEach(key => {
        mapStatSums[mapName][key] = row[key] ?? 0;
      });
    }
  }

  // Calculate averages and per-10 stats
  const finalAverages: AverageMetricPerMap = {};

  for (const mapName of Object.keys(mapStatSums)) {
    const sums = mapStatSums[mapName];
    const totalPlaytime = sums.playtime;
    finalAverages[mapName] = {}; // Initialize map entry

    if (totalPlaytime > 0) {
      // Calculate per-10 minute stats
      playerStatsBaseNumericalKeys.forEach(key => {
        if (key !== 'playtime') {
          const per10Key = `${key}Per10Minutes` as keyof AverageMapStats;
          finalAverages[mapName][per10Key] = (sums[key] / (totalPlaytime / 600));
        }
      });

      // Calculate derived rates
      finalAverages[mapName].weaponAccuracy = sums.shotsFired > 0 ? sums.shotsHit / sums.shotsFired : 0;
      finalAverages[mapName].scopedWeaponAccuracy = sums.scopedShotsFired > 0 ? sums.scopedShotsHit / sums.scopedShotsFired : 0;
      finalAverages[mapName].criticalHitRate = sums.shotsFired > 0 ? sums.criticalHits / sums.shotsFired : 0;

      // Clean up NaN/Infinity results
      playerStatsNumericalKeys.forEach(key => {
        if (finalAverages[mapName][key] !== undefined && !Number.isFinite(finalAverages[mapName][key])) {
          finalAverages[mapName][key] = 0;
        }
      });

    } else {
      // If no playtime, set all averages to 0
      playerStatsNumericalKeys.forEach(key => {
        finalAverages[mapName][key] = 0;
      });
    }
  }

  return finalAverages;
});

// Assuming uniqueMapNamesAtom exists, if not, it needs to be created similar to uniqueHeroNamesAtom
// Example:
// export const uniqueMapNamesAtom = atom(async (get) => {
//     const matches = await get(matchDataAtom);
//     const mapSet = new Set<string>();
//     matches.forEach(match => {
//         if (match.map) {
//             mapSet.add(match.map);
//         }
//     });
//     return Array.from(mapSet).sort();
// });
