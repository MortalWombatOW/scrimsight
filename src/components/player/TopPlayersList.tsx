import { useMemo } from "react";
import { RoleIcon } from "@icons";
import { formatStat } from "@library";
import { Link } from "react-router-dom";
import { useStatsWithDerived } from "../../hooks/useStats";
import { PlayerStats } from "../../types";

export const TopPlayersList = () => {
  const allStats = useStatsWithDerived();

  // Aggregate stats by player and sort by eliminations per 10 minutes
  const topPlayers = useMemo(() => {
    const playerMap = new Map<string, PlayerStats>();

    // Aggregate stats by player
    for (const stat of allStats) {
      const existing = playerMap.get(stat.playerName);
      if (!existing) {
        playerMap.set(stat.playerName, { ...stat });
      } else {
        // Sum numerical values
        existing.playtime += stat.playtime;
        existing.eliminations += stat.eliminations;
        existing.deaths += stat.deaths;
      }
    }

    // Recalculate per-10-minute stats for aggregated data
    const aggregated = Array.from(playerMap.values()).map(player => ({
      ...player,
      eliminationsPer10Minutes: player.playtime > 0
        ? (player.eliminations / player.playtime) * 600
        : 0
    }));

    // Sort by eliminations per 10 minutes and take top 5
    return aggregated
      .sort((a, b) => b.eliminationsPer10Minutes - a.eliminationsPer10Minutes)
      .slice(0, 5);
  }, [allStats]);

  return (
    <div className="bg-base-200 p-6 rounded-box">
      <h2 className="text-xl font-bold mb-4">Top Performers</h2>
      <div className="grid gap-4">
        {topPlayers.map((player) => (
          <div
            key={player.playerName}
            className="flex items-center justify-between bg-base-100 p-4 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <RoleIcon role={player.playerRole} />
              <Link
                to={`/players/${player.playerName}`}
                className="link link-hover font-medium"
              >
                {player.playerName}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">
                  {formatStat('eliminationsPer10Minutes', player.eliminationsPer10Minutes)}
                </span>
                <span className="text-base-content/70 ml-1">elims/10min</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">
                  {formatStat('eliminations', ((player as any).winRate || 0) * 100)}%
                </span>
                <span className="text-base-content/70 ml-1">win rate</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
