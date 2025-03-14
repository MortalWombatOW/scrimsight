import { useAtomValue } from "jotai";
import { playerStatsByPlayerAndHeroAtom } from "../../../atoms/metrics/playerMetricsAtoms";
import { getRoleFromHero, OverwatchRole } from "../../../lib";

interface HeroStats {
  hero: string;
  role: OverwatchRole;
  matches: number;
  winRate: number;
  avgElims: number;
  avgDamage: number;
  avgHealing: number;
}

export const HeroPoolAnalysis = () => {
  const { rows: heroStats } = useAtomValue(playerStatsByPlayerAndHeroAtom);

  // Process hero stats
  const heroPool = heroStats.reduce(
    (acc, stat) => {
      const hero = stat.playerHero;
      const role = getRoleFromHero(hero);

      if (!acc[hero]) {
        acc[hero] = {
          hero,
          role,
          matches: 0,
          wins: 0,
          eliminations: 0,
          damage: 0,
          healing: 0,
        };
      }

      acc[hero].matches += 1;
      acc[hero].eliminations += stat.eliminations;
      acc[hero].damage += stat.heroDamageDealt;
      acc[hero].healing += stat.healingDealt;

      return acc;
    },
    {} as Record<
      string,
      {
        hero: string;
        role: OverwatchRole;
        matches: number;
        wins: number;
        eliminations: number;
        damage: number;
        healing: number;
      }
    >
  );

  // Convert to array and calculate averages
  const heroPoolStats: HeroStats[] = Object.values(heroPool).map((stats) => ({
    hero: stats.hero,
    role: stats.role,
    matches: stats.matches,
    winRate: 0, // TODO: Add win rate calculation when available
    avgElims: stats.eliminations / stats.matches,
    avgDamage: stats.damage / stats.matches,
    avgHealing: stats.healing / stats.matches,
  }));

  // Group by role
  const roleGroups = heroPoolStats.reduce((acc, hero) => {
    if (!acc[hero.role]) {
      acc[hero.role] = [];
    }
    acc[hero.role].push(hero);
    return acc;
  }, {} as Record<OverwatchRole, HeroStats[]>);

  // Sort roles in the standard order: tank, damage, support
  const roleOrder: OverwatchRole[] = ["tank", "damage", "support"];

  if (heroPoolStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 dark:bg-base-800">
        <p className="text-base-700 dark:text-base-300">
          No hero pool data available
        </p>
      </div>
    );
  }

  // Find the maximum matches for progress bar scaling
  const maxMatches = Math.max(...heroPoolStats.map((h) => h.matches));

  // Role color mapping
  const getRoleColor = (role: OverwatchRole) => {
    switch (role) {
      case "tank":
        return "text-blue-600 dark:text-blue-400";
      case "damage":
        return "text-red-600 dark:text-red-400";
      case "support":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-base-600 dark:text-base-400";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 dark:bg-base-800">
      <h2 className="text-xl font-semibold mb-4 text-base-900 dark:text-white">
        Hero Pool Analysis
      </h2>

      {roleOrder.map((role) => (
        <div key={role} className="mb-6">
          <h3 className={`text-lg font-medium mb-2 ${getRoleColor(role)}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </h3>

          {roleGroups[role]
            ?.sort((a, b) => b.matches - a.matches)
            .map((hero) => (
              <div key={hero.hero} className="mb-3">
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-base-900 dark:text-white">
                    {hero.hero}
                  </p>
                  <p className="text-sm text-base-500 dark:text-base-400">
                    {hero.matches} matches
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-grow">
                    <div className="w-full bg-base-200 rounded-full h-2 dark:bg-base-700">
                      <div
                        className={`h-2 rounded-full ${
                          role === "tank"
                            ? "bg-blue-500"
                            : role === "damage"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(hero.matches / maxMatches) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <p className="text-xs text-base-500 dark:text-base-400">
                      {Math.round(hero.avgElims)} elims
                    </p>
                    {hero.role !== "support" && (
                      <p className="text-xs text-base-500 dark:text-base-400">
                        {Math.round(hero.avgDamage).toLocaleString()} dmg
                      </p>
                    )}
                    {hero.role === "support" && (
                      <p className="text-xs text-base-500 dark:text-base-400">
                        {Math.round(hero.avgHealing).toLocaleString()} heal
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};
