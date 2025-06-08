import { useAtomValue } from "jotai";
import { matchData } from "@atoms";
import { useStats } from "@library";
import { PlayerStatsCard } from "@components";

interface PlayerStatsComparisonProps {
  matchId: string;
}

export const PlayerStatsComparison = ({
  matchId,
}: PlayerStatsComparisonProps) => {
  const matchDataValue = useAtomValue(matchData.atom);
  const matchDataItem = matchDataValue.find(
    (match) => match.matchId === matchId
  );
  const playerStats = useStats(["playerName", "playerTeam", "playerRole"]);

  if (!matchDataItem) {
    return null;
  }

  return (
    <>
      <div className="border-b border-gray-700 dark:border-gray-700 py-2 mb-4">
        <h2 className="text-xl font-semibold text-base-800 dark:text-base-200">
          {matchDataItem.team1Name} Players
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {playerStats.rows
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

      <div className="border-b border-gray-700 dark:border-gray-700 py-2 mb-4">
        <h2 className="text-xl font-semibold text-base-800 dark:text-base-200">
          {matchDataItem.team2Name} Players
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {playerStats.rows
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
