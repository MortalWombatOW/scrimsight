import { useState } from "react";
import { useStats } from "@library";
import {
  getHeroImage,
  camelCaseToAbbreviation,
  camelCaseToWords,
  prettyFormat,
} from "@library";
import { VisualCard } from "@components";

interface PlayerStatsCardProps {
  playerName: string;
}

export const PlayerStatsCard = ({ playerName }: PlayerStatsCardProps) => {
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

  const playerTeam = playerStats.rows.find(
    (stats) => stats.playerName === playerName
  )?.playerTeam;

  const getStat = (stat: string): number => {
    return (
      (playerStats.rows.find((stats) => stats.playerName === playerName) as any)?.[
        stat
      ] ?? 0
    );
  };

  const getMaxStat = (stat: string) => {
    return Math.max(...playerStats.rows.map((stats) => (stats as any)[stat] || 0));
  };

  const getRanking = (
    stat: string
  ): { rank: number; max: number; percentage: number } => {
    const max = getMaxStat(stat);
    const percentage = max > 0 ? (getStat(stat) / max) * 100 : 0;
    const rank =
      playerStats.rows.filter((stats) => ((stats as any)[stat] || 0) > getStat(stat))
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
    statsToShow.push("eliminations");
  }

  return (
    <VisualCard
      title={playerName}
      backgroundImage={heroImage}
      className="w-full"
      icon={
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
          <img src={heroImage} alt={playerName} className="w-full h-full object-cover" />
        </div>
      }
    >
      <div className="space-y-4">
        {/* Team and Role */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-base-content/70">{playerTeam}</span>
          {playerRole && (
            <span className="badge badge-primary badge-sm">{playerRole}</span>
          )}
        </div>

        {/* Top 4 Rankings */}
        <div className="flex items-center justify-between gap-2">
          {statsToShow.slice(0, 4).map((stat) => (
            <div
              key={stat}
              className="flex flex-col items-center relative"
              onMouseEnter={() => setShowTooltip(stat)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div
                className={`
                  flex items-center justify-center rounded-full w-8 h-8 text-sm font-bold
                  ${
                    getRanking(stat).rank === 1
                      ? "bg-primary text-primary-content"
                      : "bg-base-200/60 text-base-content"
                  }
                `}
              >
                #{getRanking(stat).rank}
              </div>
              <span className="text-xs text-base-content/60 mt-1">
                {camelCaseToAbbreviation(stat)}
              </span>
              {showTooltip === stat && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-1 bg-base-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                  {camelCaseToWords(stat)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Stats with Progress Bars */}
        <div className="space-y-3">
          {statsToShow.slice(0, 4).map((stat) => {
            const ranking = getRanking(stat);
            return (
              <div key={stat}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-base-content/70">
                    {stat === "finalBlows"
                      ? "Final Blows"
                      : stat === "allDamageDealt"
                        ? "All Damage"
                        : stat === "ultimatesUsed"
                          ? "Ultimates"
                          : camelCaseToWords(stat)}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {prettyFormat(getStat(stat))}
                  </span>
                </div>
                <div className="w-full bg-base-200/40 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
                    style={{ width: `${ranking.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </VisualCard>
  );
};
