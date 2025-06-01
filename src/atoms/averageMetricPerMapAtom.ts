import { atom } from 'jotai';
import { Metric } from '@library/metricUtils'; 
import {
  playerStatsBase, 
  PlayerStatsBase,
  PlayerStatsCategoryKeys, 
  PlayerStatsBaseNumericalKeys, 
  playerStatsNumericalKeys,
  playerStatsBaseNumericalKeys as baseNumericalKeysArray,
  AverageMapStats,
  AverageMetricPerMap,
} from '@atoms';
import matchData, { MatchData } from '@atoms/matchDataAtom';
import uniqueMapNames from '@atoms/uniqueMapNamesAtom';

// Pure function to calculate average metrics per map
export const averageMetricPerMapFn = (
  playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>,
  allMatches: MatchData[],
  uniqueMaps: string[]
): AverageMetricPerMap => {
  // Create a lookup map from matchId to mapName (or mapName-mode)
  const matchIdToMapLookup = new Map<string, string>();
  allMatches.forEach(match => {
    // Use map name as key for simplicity, could use map-mode if needed
    if (match.map) {
      matchIdToMapLookup.set(match.matchId, match.map);
    }
  });

  // Intermediate structure to sum stats and playtime per map
  type BaseKey = PlayerStatsBaseNumericalKeys;
  const mapStatSums: Record<string, { [K in BaseKey]: number } & { count: number }> = {};

  // Initialize sums for all known maps
  uniqueMaps.forEach(mapName => {
    const initialStats: { [K in BaseKey]: number } = {} as { [K in BaseKey]: number };
    baseNumericalKeysArray.forEach((key: BaseKey) => {
      initialStats[key] = 0;
    });
    mapStatSums[mapName] = { ...initialStats, count: 0 };
  });


  // Aggregate sums and playtime for each map based on player stats
  for (const row of playerStatsData.rows) {
    const mapName = matchIdToMapLookup.get(row.matchId);
    if (mapName && mapStatSums[mapName]) {
      mapStatSums[mapName].count++;
      baseNumericalKeysArray.forEach((key: BaseKey) => {
        mapStatSums[mapName][key] += row[key] ?? 0;
      });
    }
    // Optional: Handle cases where mapName might be missing or not in uniqueMaps
    else if (mapName && !mapStatSums[mapName]) {
      const initialStats: { [K in BaseKey]: number } = {} as { [K in BaseKey]: number };
      baseNumericalKeysArray.forEach((key: BaseKey) => {
        initialStats[key] = 0;
      });
      mapStatSums[mapName] = { ...initialStats, count: 1 };
      baseNumericalKeysArray.forEach((key: BaseKey) => {
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
      baseNumericalKeysArray.forEach((key: BaseKey) => {
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
        if (finalAverages[mapName][key] !== undefined && !Number.isFinite(finalAverages[mapName][key]!)) {
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
};

export default atom(async (get): Promise<AverageMetricPerMap> => {
  // Get base player stats and match data
  const playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = await get(playerStatsBase.atom);
  const allMatches: MatchData[] = await get(matchData);
  // Get unique map names to initialize structure
  const uniqueMaps: string[] = await get(uniqueMapNames);

  return averageMetricPerMapFn(playerStatsData, allMatches, uniqueMaps);
});
