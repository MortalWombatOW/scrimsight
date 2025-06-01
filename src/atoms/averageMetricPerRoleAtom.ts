import { atom } from 'jotai';
import { Metric } from '@library/metricUtils';
import {
  playerStatsBase,
  PlayerStatsBase,
  PlayerStatsCategoryKeys,
  playerStatsNumericalKeys,
  PlayerStatsBaseNumericalKeys,
  playerStatsBaseNumericalKeys as baseNumericalKeysArray, // Rename to avoid conflict
  AverageRoleStats, // Added import
  AverageMetricPerRole, // Added import
} from '@atoms';
import { OverwatchRole } from '@library/hero';

// Pure function to calculate average metrics per player role
export const averageMetricPerRoleFn = (
  playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>
): AverageMetricPerRole => {
  // Intermediate structure to sum stats and playtime per role
  type BaseKey = PlayerStatsBaseNumericalKeys;
  const roleStatSums: Record<OverwatchRole, { [K in BaseKey]: number } & { count: number }> = {
    tank: { ...Object.fromEntries(baseNumericalKeysArray.map((k: BaseKey) => [k, 0])), count: 0 } as { [K in BaseKey]: number } & { count: number },
    damage: { ...Object.fromEntries(baseNumericalKeysArray.map((k: BaseKey) => [k, 0])), count: 0 } as { [K in BaseKey]: number } & { count: number },
    support: { ...Object.fromEntries(baseNumericalKeysArray.map((k: BaseKey) => [k, 0])), count: 0 } as { [K in BaseKey]: number } & { count: number },
  };

  // Aggregate sums and playtime for each role
  for (const row of playerStatsData.rows) {
    const role = row.playerRole as OverwatchRole;
    if (roleStatSums[role]) {
      roleStatSums[role].count++;
      baseNumericalKeysArray.forEach((key: BaseKey) => {
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
    const totalPlaytime = sums.playtime;

    if (totalPlaytime > 0) {
      baseNumericalKeysArray.forEach((key: BaseKey) => {
        if (key !== 'playtime') {
          const per10Key = `${key}Per10Minutes` as keyof AverageRoleStats;
          finalAverages[role][per10Key] = (sums[key] / (totalPlaytime / 600));
        }
      });

      finalAverages[role].weaponAccuracy = sums.shotsFired > 0 ? sums.shotsHit / sums.shotsFired : 0;
      finalAverages[role].scopedWeaponAccuracy = sums.scopedShotsFired > 0 ? sums.scopedShotsHit / sums.scopedShotsFired : 0;
      finalAverages[role].criticalHitRate = sums.shotsFired > 0 ? sums.criticalHits / sums.shotsFired : 0;

      playerStatsNumericalKeys.forEach(key => {
        if (finalAverages[role][key] !== undefined && !Number.isFinite(finalAverages[role][key]!)) {
          finalAverages[role][key] = 0;
        }
      });

    } else {
      playerStatsNumericalKeys.forEach(key => {
        finalAverages[role][key] = 0;
      });
    }
  }

  return finalAverages;
};

// Atom to calculate average metrics per player role
export default atom(async (get): Promise<AverageMetricPerRole> => {
  const playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = await get(playerStatsBase.atom);
  return averageMetricPerRoleFn(playerStatsData);
});
