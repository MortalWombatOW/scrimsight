import { atom } from 'jotai';
import {
  playerStatsBaseAtom,
  PlayerStatsNumericalKeys,
  playerStatsNumericalKeys,
  playerStatsBaseNumericalKeys,
} from '../metrics/playerMetricsAtoms';
// Removed incorrect import: import { uniqueHeroNamesAtom } from '../uniqueHeroNamesAtom';

// Define the output structure for average stats per hero
export type AverageHeroStats = {
  [K in PlayerStatsNumericalKeys]?: number; // All numerical stats are optional averages
};

export type AverageMetricPerHero = Record<string, AverageHeroStats>; // Key is heroName

// Atom to calculate average metrics per player hero
export const averageMetricPerHeroAtom = atom(async (get): Promise<AverageMetricPerHero> => {
  // Get the base player stats (includes hero and playtime)
  const playerStatsData = await get(playerStatsBaseAtom);
  // Get all unique hero names encountered to initialize the result map
  const uniqueHeroes = await get(uniqueHeroNamesAtom); // Need this atom

  // Intermediate structure to sum stats and playtime per hero
  type BaseKey = (typeof playerStatsBaseNumericalKeys)[number];
  const heroStatSums: Record<string, { [K in BaseKey]: number } & { count: number }> = {};

  // Initialize sums for all known heroes
  uniqueHeroes.forEach(heroName => {
    heroStatSums[heroName] = { ...Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as any, count: 0 };
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
       heroStatSums[heroName] = { ...Object.fromEntries(playerStatsBaseNumericalKeys.map(k => [k, 0])) as any, count: 1 };
       playerStatsBaseNumericalKeys.forEach(key => {
         heroStatSums[heroName][key] = row[key] ?? 0;
       });
    }
  }

  // Calculate averages and per-10 stats
  const finalAverages: AverageMetricPerHero = {};

  for (const heroName of Object.keys(heroStatSums)) {
    const sums = heroStatSums[heroName];
    const totalPlaytime = sums.playtime;
    finalAverages[heroName] = {}; // Initialize hero entry

    if (totalPlaytime > 0) {
      // Calculate per-10 minute stats
      playerStatsBaseNumericalKeys.forEach(key => {
        if (key !== 'playtime') {
          const per10Key = `${key}Per10Minutes` as keyof AverageHeroStats;
          finalAverages[heroName][per10Key] = (sums[key] / (totalPlaytime / 600));
        }
      });

       // Calculate derived rates
       finalAverages[heroName].weaponAccuracy = sums.shotsFired > 0 ? sums.shotsHit / sums.shotsFired : 0;
       finalAverages[heroName].scopedWeaponAccuracy = sums.scopedShotsFired > 0 ? sums.scopedShotsHit / sums.scopedShotsFired : 0;
       finalAverages[heroName].criticalHitRate = sums.shotsFired > 0 ? sums.criticalHits / sums.shotsFired : 0;

       // Clean up NaN/Infinity results
       playerStatsNumericalKeys.forEach(key => {
         if (finalAverages[heroName][key] !== undefined && !Number.isFinite(finalAverages[heroName][key])) {
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
});

// Atom to get unique hero names (kept local as it's only used here for now)
const uniqueHeroNamesAtom = atom(async (get) => {
    const { rows } = await get(playerStatsBaseAtom);
    const heroSet = new Set<string>();
    rows.forEach(row => {
        if (row.playerHero) {
            heroSet.add(row.playerHero);
        }
    });
    return Array.from(heroSet).sort();
});
