import { type ReactNode } from "react";
import { useStats } from "../../../../atoms/metrics/playerMetricsAtoms";
import RoleIcon from "../../../../components/Common/RoleIcon";
import { getRoleFromHero } from "../../../../lib/hero";
import { TopPlayersList } from "./TopPlayersList";
import { PlayerList } from "./PlayerList";

export const PlayersOverview = (): ReactNode => {
  const heroStats = useStats(["playerName", "playerHero"]);

  // Safely calculate most played hero
  const mostPlayedHero = heroStats.rows.reduce((prev, current) => {
    if (!prev || current.playtime > prev.playtime) {
      return current;
    }
    return prev;
  }, null as any);

  // Only try to get role if we have a valid hero
  const mostPlayedRole = mostPlayedHero?.playerHero
    ? getRoleFromHero(mostPlayedHero.playerHero)
    : "unknown";

  return (
    <div className="space-y-8">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Most Played Hero</div>
          <div className="stat-value flex items-center gap-2">
            {mostPlayedHero?.playerHero || "N/A"}
            {mostPlayedRole !== "unknown" && <RoleIcon role={mostPlayedRole} />}
          </div>
          <div className="stat-desc">
            {mostPlayedHero
              ? `${(mostPlayedHero.playtime / 60).toFixed(1)} minutes played`
              : "No data available"}
          </div>
        </div>
      </div>

      {/* Top Players */}
      <TopPlayersList />

      {/* Player List */}
      <PlayerList />
    </div>
  );
};
