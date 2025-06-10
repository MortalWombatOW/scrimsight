import { useState } from "react";
import { useStats } from "@library";
import {
  getHeroImage,
  camelCaseToAbbreviation,
  camelCaseToWords,
  prettyFormat,
} from "@library";
import { ProgressBar } from "@components";

interface PlayerStatsCardProps {
  playerName: string;
}

export const PlayerStatsCard = ({
  playerName,
}: PlayerStatsCardProps) => {
  const playerStats = useStats(["playerName", "playerTeam", "playerRole"]);
  const heroStats = useStats(
    ["playerName", "playerHero"],
    undefined,
    "playtime",
    "desc"
  ).rows.filter((stats) => stats.playerName === playerName);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  if (!playerStats || !heroStats.length) {
    throw new Error("No player stats");
  }

  const heroImage = getHeroImage(heroStats[0]?.playerHero, true);

  const playerRole = playerStats.rows.find(
    (stats) => stats.playerName === playerName
  )?.playerRole;

  const getStat = (stat: string): number => {
    const playerRow = playerStats.rows.find((stats) => stats.playerName === playerName);
    return playerRow ? (playerRow as Record<string, unknown>)[stat] as number || 0 : 0;
  };

  const getMaxStat = (stat: string) => {
    return Math.max(...playerStats.rows.map((stats) => (stats as Record<string, unknown>)[stat] as number || 0));
  };

  const getRanking = (
    stat: string
  ): { rank: number; max: number; percentage: number } => {
    const max = getMaxStat(stat);
    const percentage = max > 0 ? (getStat(stat) / max) * 100 : 0;
    const rank =
      playerStats.rows.filter((stats) => ((stats as Record<string, unknown>)[stat] as number || 0) > getStat(stat))
        .length + 1;
    return { rank, max, percentage };
  };

  // Build list of stats to show - always include these 3
  const statsToShow = ["finalBlows", "allDamageDealt", "ultimatesUsed"];

  // Add a 4th stat based on role
  if (playerRole === "damage") {
    statsToShow.push("eliminations");
  } else if (playerRole === "support") {
    statsToShow.push("healingDealt");
  } else if (playerRole === "tank") {
    statsToShow.push("damageBlocked");
  } else {
    // Default 4th metric if role is unknown
    statsToShow.push("eliminations");
  }

  return (
    <div className="bg-base-100 rounded-lg border border-gray-700 border-gray-700 p-4 shadow-sm dark:bg-base-800 dark:border-gray-700 h-full w-full transition-all duration-300 hover:shadow-md">
      <div className="flex items-start">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center mb-1">
            <img
              src={heroImage}
              alt={`Hero`}
              className="w-8 h-8 rounded-full mr-2 border border-gray-700 border-gray-700 dark:border-gray-700"
            />
            <div className="flex flex-col mr-3">
              <h5 className="text-sm font-semibold text-base-800 dark:text-base-200">
                {playerName}
              </h5>
              <span className="text-xs text-base-500 dark:text-base-400">
                {
                  playerStats.rows.find(
                    (stats) => stats.playerName === playerName
                  )?.playerTeam
                }
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1">
            {statsToShow.slice(0, 4).map((stat) => (
              <div
                key={stat}
                className="flex flex-col items-center relative"
                onMouseEnter={() => setShowTooltip(stat)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div
                  className={`
                    flex items-center justify-center rounded-full w-6 h-6
                    ${
              getRanking(stat).rank === 1
                ? "bg-base-800 text-white dark:bg-base-200 dark:text-base-800"
                : "bg-base-200 text-base-800 dark:bg-base-600 dark:text-base-200"
              }
                  `}
                >
                  <span className="text-xs font-medium">
                    #{getRanking(stat).rank}
                  </span>
                </div>
                <span className="text-xs text-base-500 dark:text-base-400 mt-1">
                  {camelCaseToAbbreviation(stat)}
                </span>
                {showTooltip === stat && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-1 bg-base-800 text-white text-xs p-1 rounded shadow-lg z-10 whitespace-nowrap dark:bg-base-700">
                    {camelCaseToWords(stat)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {statsToShow.slice(0, 4).map((stat) => (
            <div key={stat} className="mb-0">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-base-600 dark:text-base-400 capitalize">
                    {stat === "finalBlows"
                      ? "Final Blows"
                      : stat === "allDamageDealt"
                        ? "All Damage"
                        : stat === "ultimatesUsed"
                          ? "Ultimates Used"
                          : camelCaseToWords(stat)}
                  </span>
                  <span className="text-sm font-medium text-base-800 dark:text-base-200">
                    {prettyFormat(getStat(stat))}
                  </span>
                </div>
                <ProgressBar value={getRanking(stat).percentage} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
