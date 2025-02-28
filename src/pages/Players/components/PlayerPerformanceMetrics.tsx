import { useAtomValue } from "jotai";
import { playerStatsByPlayerAtom } from "../../../atoms/metrics/playerMetricsAtoms";

const numericFields = [
  "eliminations",
  "finalBlows",
  "deaths",
  "heroDamageDealt",
  "healingDealt",
  "damageTaken",
  "damageBlocked",
  "ultimatesEarned",
  "ultimatesUsed",
  "weaponAccuracy",
] as const;

type NumericField = typeof numericFields[number];

export const PlayerPerformanceMetrics = () => {
  const playerStats = useAtomValue(playerStatsByPlayerAtom);
  const playerStatsRows = playerStats?.rows || [];

  const calculateAverages = () => {
    if (playerStatsRows.length === 0) return null;

    const totals = playerStatsRows.reduce((acc, curr) => {
      numericFields.forEach((field) => {
        acc[field] = (acc[field] || 0) + (curr[field] || 0);
      });
      return acc;
    }, {} as Record<NumericField, number>);

    const averages = Object.entries(totals).reduce((acc, [key, value]) => {
      acc[key as NumericField] = value / playerStatsRows.length;
      return acc;
    }, {} as Record<NumericField, number>);

    return averages;
  };

  const averages = calculateAverages();

  if (!averages) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300">
          No performance data available
        </p>
      </div>
    );
  }

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1") // Insert a space before all capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Average Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(averages).map(([key, value]) => (
          <div
            key={key}
            className="p-3 border border-gray-200 rounded dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatLabel(key)}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {key === "weaponAccuracy"
                ? `${(value * 100).toFixed(1)}%`
                : value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
