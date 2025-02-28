import { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useStats } from "../../../../atoms";
import {
  getHeroImage,
  camelCaseToAbbreviation,
  camelCaseToWords,
  prettyFormat,
} from "../../../../lib";

interface PlayerStatsCardProps {
  playerName: string;
  matchId: string;
}

// Custom useHover hook
const useHover = () => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return { ref, hovered };
};

// Custom usePrevious hook
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// Custom useTimeout hook
const useTimeout = (callback: (args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(args);
    }, delay);
  };

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return clear;
  }, []);

  return { start, clear };
};

// Custom useInterval hook
const useInterval = (callback: () => void, delay: number) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, delay);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { start, stop };
};

export const PlayerStatsCard = ({
  playerName,
  matchId,
}: PlayerStatsCardProps) => {
  const playerStats = useStats(["playerName", "playerTeam", "playerRole"], {
    matchId: [matchId],
  });
  const heroStats = useStats(
    ["playerName", "playerHero"],
    { matchId: [matchId] },
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
    return (
      playerStats.rows.find((stats) => stats.playerName === playerName)?.[
        stat
      ] ?? 0
    );
  };

  const getMaxStat = (stat: string) => {
    return Math.max(...playerStats.rows.map((stats) => stats[stat] || 0));
  };

  const getRanking = (
    stat: string
  ): { rank: number; max: number; percentage: number } => {
    const max = getMaxStat(stat);
    const percentage = max > 0 ? (getStat(stat) / max) * 100 : 0;
    const rank =
      playerStats.rows.filter((stats) => (stats[stat] || 0) > getStat(stat))
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700 h-full w-full transition-all duration-300 hover:shadow-md">
      <div className="flex items-start">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center mb-3">
            <img
              src={heroImage}
              alt={`Hero`}
              className="w-8 h-8 rounded-full mr-2 border border-gray-200 dark:border-gray-600"
            />
            <div className="flex flex-col mr-3">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {playerName}
              </h5>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {
                  playerStats.rows.find(
                    (stats) => stats.playerName === playerName
                  )?.playerTeam
                }
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
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
                        ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }
                  `}
                >
                  <span className="text-xs font-medium">
                    #{getRanking(stat).rank}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {camelCaseToAbbreviation(stat)}
                </span>
                {showTooltip === stat && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-1 bg-gray-800 text-white text-xs p-1 rounded shadow-lg z-10 whitespace-nowrap dark:bg-gray-700">
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
                  <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {stat === "finalBlows"
                      ? "Final Blows"
                      : stat === "allDamageDealt"
                      ? "All Damage"
                      : stat === "ultimatesUsed"
                      ? "Ultimates Used"
                      : camelCaseToWords(stat)}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {prettyFormat(getStat(stat))}
                  </span>
                </div>
                <div className="h-[16px] w-full bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-gray-600 dark:bg-gray-500 rounded-sm"
                    style={{
                      width: `${Math.max(5, getRanking(stat).percentage)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
