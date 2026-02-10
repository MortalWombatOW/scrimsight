import { PlayerStatsCard } from "./PlayerStatsCard";
import { useMatch } from "../../hooks/useMatch";
import { useStats } from "../../hooks/useStats";

interface PlayerStatsComparisonProps {
  matchId: string;
}

export const PlayerStatsComparison = ({
  matchId,
}: PlayerStatsComparisonProps) => {
  const match = useMatch(matchId);
  const playerStats = useStats({ matchId });

  if (!match) {
    return null;
  }

  const matchDataItem = match.metadata;

  return (
    <>
      <div className="border-b border-base-content/10 py-2 mb-4">
        <h2 className="text-xl font-semibold text-base-content">
          {matchDataItem.team1Name} Players
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {playerStats
          .filter((stats) => stats.playerTeam === matchDataItem.team1Name)
          .map((player) => (
            <div
              key={player.playerName}
              className="flex-1 min-w-[200px] max-w-[400px]"
            >
              <PlayerStatsCard
                playerName={player.playerName}
              />
            </div>
          ))}
      </div>

      <div className="border-b border-base-content/10 py-2 mb-4">
        <h2 className="text-xl font-semibold text-base-content">
          {matchDataItem.team2Name} Players
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {playerStats
          .filter((stats) => stats.playerTeam === matchDataItem.team2Name)
          .map((player) => (
            <div
              key={player.playerName}
              className="flex-1 min-w-[200px] max-w-[400px]"
            >
              <PlayerStatsCard
                playerName={player.playerName}
              />
            </div>
          ))}
      </div>
    </>
  );
};
