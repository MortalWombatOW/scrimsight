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
  const { hovered, ref } = useHover();
  const lastHovered = usePrevious(hovered);
  const [highlighted, setHighlighted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const { start, clear } = useTimeout(([hovered]) => {
    setHighlighted(hovered);
  }, 1000);

  const interval = useInterval(() => {
    if (progress < 100) {
      setProgress(progress + 20);
    }
  }, 100);

  useEffect(() => {
    if (lastHovered !== hovered) {
      clear();
      start(hovered);
      setProgress(0);
      interval.start();
    }
    if ((!hovered && !highlighted) || (hovered && highlighted)) {
      clear();
      setProgress(0);
      interval.stop();
    }
  }, [hovered, lastHovered, highlighted, clear, start, interval, progress]);

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

  const statsToShow = ["finalBlows", "allDamageDealt", "ultimatesUsed"];

  if (playerRole === "damage") {
    statsToShow.push("eliminations", "weaponAccuracy", "criticalHits");
  }

  if (playerRole === "support") {
    statsToShow.push("healingDealt", "offensiveAssists", "defensiveAssists");
  }

  if (playerRole === "tank") {
    statsToShow.push("damageBlocked");
  }

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700 h-full w-fit transition-opacity duration-300"
    >
      <div className="flex items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-start">
            <img
              src={heroImage}
              alt={`Hero`}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="flex flex-col mr-2">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                {playerName}
              </h5>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {
                  playerStats.rows.find(
                    (stats) => stats.playerName === playerName
                  )?.playerTeam
                }
              </span>
            </div>
            <div className="flex items-end space-x-1">
              {(highlighted ? statsToShow : statsToShow.slice(0, 3)).map(
                (stat) => (
                  <div
                    key={stat}
                    className="w-12 flex flex-col items-center relative"
                    onMouseEnter={() => setShowTooltip(stat)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <div className="flex justify-center">
                      <div
                        className={`
                          flex items-center justify-center rounded-full
                          ${
                            getRanking(stat).rank === 1
                              ? "bg-primary-500 w-8 h-8 text-white"
                              : "bg-gray-300 dark:bg-gray-600 w-6 h-6 text-gray-800 dark:text-gray-200"
                          }
                        `}
                      >
                        <span
                          className={`${
                            getRanking(stat).rank === 1 ? "text-sm" : "text-xs"
                          }`}
                        >
                          #{getRanking(stat).rank}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {camelCaseToAbbreviation(stat)}
                      </span>
                    </div>
                    {showTooltip === stat && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10 whitespace-nowrap">
                        {playerName} is ranked #{getRanking(stat).rank} in{" "}
                        {camelCaseToWords(stat)} this match
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {(highlighted ? statsToShow : statsToShow.slice(0, 3)).map((stat) => (
            <div key={stat} className="h-[25px] w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { stat: camelCaseToWords(stat), value: getStat(stat) },
                  ]}
                  margin={{ top: 0, right: 30, left: 80, bottom: 0 }}
                >
                  <XAxis type="number" domain={[0, getMaxStat(stat)]} hide />
                  <YAxis
                    type="category"
                    dataKey="stat"
                    width={80}
                    tickLine={false}
                  />
                  <Bar
                    dataKey="value"
                    fill="#4F46E5"
                    radius={5}
                    label={{
                      position: "right",
                      formatter: (value: number) => prettyFormat(value),
                      fill: "white",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
          {progress > 0 && progress < 100 && (
            <div className="h-0.5 mt-0 -mb-4">
              <div
                className="h-full bg-primary-500"
                style={{
                  width: `${progress}%`,
                  transition: "width 100ms linear",
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
