import { atom } from 'jotai';
import {
  playerStatsBaseAtom,
  PlayerStatsNumericalKeys,
  playerStatsNumericalKeys, // Import all numerical keys
  // PlayerStatsBaseNumericalKeys, // Type not needed directly here
  playerStatsBaseNumericalKeys, // Import the constant array
} from '../metrics/playerMetricsAtoms';
import { OverwatchRole } from '../../lib/hero';
// Removed unused: import { Grouped } from '../metrics/metricUtils';

// Define the output structure for average stats per role
export type AverageRoleStats = {
  [K in PlayerStatsNumericalKeys]?: number; // All numerical stats are optional averages
};

export type AverageMetricPerRole = Record<OverwatchRole, AverageRoleStats>;

// Atom to calculate average metrics per player role
export const averageMetricPerRoleAtom = atom(async (get): Promise<AverageMetricPerRole> => {
  // Get the base player stats (includes role and playtime)
  const playerStatsData = await get(playerStatsBaseAtom);

  // Intermediate structure to sum stats and playtime per role
  // Use typeof to get the type from the constant array keys
  type BaseKey = (typeof playerStatsBaseNumericalKeys)[number];
  const roleStatSums: Record<OverwatchRole, { [K in BaseKey]: number } & { count: number }> = {
    tank: { ...Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as any, count: 0 },
    damage: { ...Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as any, count: 0 },
    support: { ...Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as any, count: 0 },
  };

  // Aggregate sums and playtime for each role
  for (const row of playerStatsData.rows) {
    const role = row.playerRole as OverwatchRole;
    if (roleStatSums[role]) {
      roleStatSums[role].count++; // Increment count for averaging later (though playtime is better)
      playerStatsBaseNumericalKeys.forEach(key => {
        roleStatSums[role][key] += row[key] ?? 0;
      });
    }
  }

  // Calculate averages and per-10 stats
  const finalAverages: AverageMetricPerRole = {
    tank: {},
    damage: {},
    support: {},
  };

  for (const role of ['tank', 'damage', 'support'] as OverwatchRole[]) {
    const sums = roleStatSums[role];
    const totalPlaytime = sums.playtime; // Use summed playtime for per-10 calculation

    if (totalPlaytime > 0) {
      // Calculate averages for base stats (optional, maybe not needed directly)
      // playerStatsBaseNumericalKeys.forEach(key => {
      //   if (key !== 'playtime') { // Don't average playtime itself
      //      finalAverages[role][key] = sums[key] / sums.count; // Simple average by count
      //   }
      // });

      // Calculate per-10 minute stats based on summed values and total playtime
      playerStatsBaseNumericalKeys.forEach(key => {
        if (key !== 'playtime') {
          const per10Key = `${key}Per10Minutes` as keyof AverageRoleStats;
          finalAverages[role][per10Key] = (sums[key] / (totalPlaytime / 600));
        }
      });

      // Calculate derived rates like accuracy
      finalAverages[role].weaponAccuracy = sums.shotsFired > 0 ? sums.shotsHit / sums.shotsFired : 0;
      finalAverages[role].scopedWeaponAccuracy = sums.scopedShotsFired > 0 ? sums.scopedShotsHit / sums.scopedShotsFired : 0;
      finalAverages[role].criticalHitRate = sums.shotsFired > 0 ? sums.criticalHits / sums.shotsFired : 0;

      // Clean up NaN/Infinity results
      playerStatsNumericalKeys.forEach(key => {
        if (finalAverages[role][key] !== undefined && !Number.isFinite(finalAverages[role][key])) {
          finalAverages[role][key] = 0;
        }
      });

    } else {
      // If no playtime, set all averages to 0
      playerStatsNumericalKeys.forEach(key => {
        finalAverages[role][key] = 0;
      });
    }
  }

  return finalAverages;
});
