import { PieChart } from "@mui/x-charts/PieChart";
import { useAtomValue } from "jotai";
import { playerStatsByPlayerAndHeroAtom } from "../../../atoms/metrics/playerMetricsAtoms";

export const HeroDistributionChart = () => {
  const { rows: heroStats } = useAtomValue(playerStatsByPlayerAndHeroAtom);

  // Calculate hero play distribution
  const heroDistribution = heroStats.reduce((acc, stat) => {
    const hero = stat.playerHero;
    if (!acc[hero]) {
      acc[hero] = {
        count: 0,
        eliminations: 0,
        damage: 0,
        healing: 0,
      };
    }
    acc[hero].count += 1;
    acc[hero].eliminations += stat.eliminations;
    acc[hero].damage += stat.heroDamageDealt;
    acc[hero].healing += stat.healingDealt;
    return acc;
  }, {} as Record<string, { count: number; eliminations: number; damage: number; healing: number }>);

  // Convert to array and sort by play count
  const sortedHeroes = Object.entries(heroDistribution)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10) // Take top 10 heroes
    .map(([hero, stats], index) => ({
      id: index,
      value: stats.count,
      label: hero,
      eliminations: stats.eliminations,
      damage: stats.damage,
      healing: stats.healing,
    }));

  if (sortedHeroes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300">
          No hero distribution data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Hero Distribution
      </h2>
      <div className="w-full h-[400px]">
        <PieChart
          series={[
            {
              data: sortedHeroes,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30 },
            },
          ]}
          height={400}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
              padding: 0,
            },
          }}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
          Top Heroes Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {sortedHeroes.slice(0, 5).map((hero) => (
            <div
              key={hero.label}
              className="p-3 border border-gray-200 rounded dark:border-gray-700"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {hero.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Matches: {hero.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Avg. Elims: {(hero.eliminations / hero.value).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Avg. Damage:{" "}
                {Math.round(hero.damage / hero.value).toLocaleString()}
              </p>
              {hero.healing > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avg. Healing:{" "}
                  {Math.round(hero.healing / hero.value).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
