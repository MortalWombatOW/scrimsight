import { useState, useMemo } from "react";
import {
  getHeroImage,
  camelCaseToAbbreviation,
  PlayerStatKey,
  formatStat,
  getStatLabel,
} from "@library";
import { VisualCard } from "../ui/VisualCard";
import { usePlayerRankings } from "../../hooks/useStats";
import { PlayerImpactCard } from "./PlayerImpactCard";
import { UltEfficiencyCard } from "./UltEfficiencyCard";
import { useFightAnalysis } from "../../hooks/useFightAnalysis";
import { useUltCycles } from "../../hooks/useUltCycles";
import { useMatch } from "../../hooks/useMatch";
import { useMatches } from "../../hooks/useRepository";
import { useParams } from "react-router-dom";

interface PlayerStatsCardProps {
  playerName: string;
}

export const PlayerStatsCard = ({ playerName }: PlayerStatsCardProps) => {
  const { getRanking, getPlayerStats } = usePlayerRankings();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Get Match Context or Global Context for Impact Analysis
  const { matchId } = useParams<{ matchId: string }>();
  const singleMatchData = useMatch(matchId || "");
  const allMatches = useMatches();

  const relevantTeamfights = useMemo(() => {
    if (matchId && singleMatchData) {
      return singleMatchData.teamfights;
    }
    // Global context: aggregate from all matches where player played
    return allMatches
      .filter((m) =>
        m.metadata.team1Players.includes(playerName) ||
        m.metadata.team2Players.includes(playerName)
      )
      .flatMap((m) => m.teamfights);
  }, [matchId, singleMatchData, allMatches, playerName]);

  const { getPlayerImpact } = useFightAnalysis(relevantTeamfights);

  const ultCycles = useUltCycles();
  const playerUltMetrics = useMemo(
    () => ultCycles.playerMetrics.filter(m => m.playerName === playerName),
    [ultCycles.playerMetrics, playerName],
  );

  const playerStats = getPlayerStats(playerName);

  if (!playerStats) {
    // Return null or loading state if stats aren't ready
    return null;
  }

  const heroImage = getHeroImage(playerStats.playerHero, true);
  const { playerRole, playerTeam } = playerStats;

  // Build list of stats to show - always include these 3
  const statsToShow: PlayerStatKey[] = [
    "finalBlows",
    "allDamageDealt",
    "ultimatesUsed",
  ];

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
          <img
            src={heroImage}
            alt={playerName}
            className="w-full h-full object-cover"
          />
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
          {statsToShow.slice(0, 4).map((stat) => {
            const ranking = getRanking(playerName, stat);
            return (
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
              ranking.rank === 1
                ? "bg-primary text-primary-content"
                : "bg-base-200/60 text-base-content"
              }
                `}
                >
                  #{ranking.rank}
                </div>
                <span className="text-xs text-base-content/60 mt-1">
                  {camelCaseToAbbreviation(stat)}
                </span>
                {showTooltip === stat && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-1 bg-base-300 text-base-content text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                    {getStatLabel(stat)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Stats with Progress Bars */}
        <div className="space-y-3">
          {statsToShow.slice(0, 4).map((stat) => {
            const ranking = getRanking(playerName, stat);
            return (
              <div key={stat}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-base-content/70">
                    {getStatLabel(stat)}
                  </span>
                  <span className="text-sm font-semibold text-base-content">
                    {formatStat(stat, ranking.value)}
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

        {/* Impact Card (Show if we have data) */}
        {relevantTeamfights.length > 0 && (
          <PlayerImpactCard metrics={getPlayerImpact(playerName)} />
        )}

        {/* Ult Efficiency (Show if we have cycle data for this player) */}
        {playerUltMetrics.length > 0 && (
          <UltEfficiencyCard metrics={playerUltMetrics} />
        )}
      </div>
    </VisualCard>
  );
};
