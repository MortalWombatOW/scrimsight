import { atom } from 'jotai';
import {
  playerStatsBase, 
  PlayerStatsBase, 
  PlayerStatsCategoryKeys, 
  playerStatsNumericalKeys, 
  PlayerStatsBaseNumericalKeys, 
  playerStatsBaseNumericalKeys,
  AverageHeroStatsType,
  AverageMetricPerHeroType,
  uniqueHeroNames,
} from '@atoms'; 
import { Metric } from '@library'; 


export const averageMetricPerHeroAtomFn = (
  playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>,
  uniqueHeroes: string[]
): AverageMetricPerHeroType => {
  // Intermediate structure to sum stats and playtime per hero
  type BaseKey = PlayerStatsBaseNumericalKeys;
  const heroStatSums: Record<string, { [K in BaseKey]: number } & { count: number }> = {};

  // Initialize sums for all known heroes
  uniqueHeroes.forEach(heroName => {
    const initialStats = Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as { [K in PlayerStatsBaseNumericalKeys]: number };
    heroStatSums[heroName] = { ...initialStats, count: 0 };
  });

  // Aggregate sums and playtime for each hero
  for (const row of playerStatsData.rows) {
    const heroName = row.playerHero;
    if (heroStatSums[heroName]) {
      heroStatSums[heroName].count++;
      playerStatsBaseNumericalKeys.forEach(key => {
        heroStatSums[heroName][key] += row[key] ?? 0;
      });
    }
    // Handle cases where a hero might appear in stats but not unique list (shouldn't happen ideally)
    else if (heroName) {
      const initialStats = Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as { [K in PlayerStatsBaseNumericalKeys]: number };
      heroStatSums[heroName] = { ...initialStats, count: 1 };
      playerStatsBaseNumericalKeys.forEach(key => {
        heroStatSums[heroName][key] = row[key] ?? 0;
      });
    }
  }

  // Calculate averages and per-10 stats
  const finalAverages: AverageMetricPerHeroType = {};

  for (const heroName of Object.keys(heroStatSums)) {
    const sums = heroStatSums[heroName];
    const totalPlaytime = sums.playtime;
    finalAverages[heroName] = {}; // Initialize hero entry

    if (totalPlaytime > 0) {
      // Calculate per-10 minute stats
      playerStatsBaseNumericalKeys.forEach(key => {
        if (key !== 'playtime') {
          const per10Key = `${key}Per10Minutes` as keyof AverageHeroStatsType;
          finalAverages[heroName][per10Key] = (sums[key] / (totalPlaytime / 600));
        }
      });

      // Calculate derived rates
      finalAverages[heroName].weaponAccuracy = sums.shotsFired > 0 ? sums.shotsHit / sums.shotsFired : 0;
      finalAverages[heroName].scopedWeaponAccuracy = sums.scopedShotsFired > 0 ? sums.scopedShotsHit / sums.scopedShotsFired : 0;
      finalAverages[heroName].criticalHitRate = sums.shotsFired > 0 ? sums.criticalHits / sums.shotsFired : 0;

      // Clean up NaN/Infinity results
      playerStatsNumericalKeys.forEach(key => {
        if (finalAverages[heroName][key] !== undefined && !Number.isFinite(finalAverages[heroName][key]!)) {
          finalAverages[heroName][key] = 0;
        }
      });

    } else {
      // If no playtime, set all averages to 0
      playerStatsNumericalKeys.forEach(key => {
        finalAverages[heroName][key] = 0;
      });
    }
  }

  return finalAverages;
};


export default atom(async (get): Promise<AverageMetricPerHeroType> => {
  const playerStatsData = await get(playerStatsBase.atom);
  const uniqueHeroesData = await get(uniqueHeroNames.atom);

  return averageMetricPerHeroAtomFn(playerStatsData, uniqueHeroesData);
});
