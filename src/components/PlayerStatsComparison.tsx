import { useAtomValue } from "jotai";
import { matchDataAtom, useStats } from "@atoms";
import { PlayerStatsCard } from "@components/PlayerStatsCard";

interface PlayerStatsComparisonProps {
  matchId: string;
}

export const PlayerStatsComparison = ({
  matchId,
}: PlayerStatsComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  const playerStats = useStats(["playerName", "playerTeam", "playerRole"], {
    matchId: [matchId],
  });

  if (!matchData) {
    return null;
  }

  return (
    <>
      <div className="border-b border-gray-700 dark:border-gray-700 py-2 mb-4">
        <h2 className="text-xl font-semibold text-base-800 dark:text-base-200">
          {matchData.team1Name} Players
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {playerStats.rows
          .filter((stats) => stats.playerTeam === matchData.team1Name)
          .map((player) => (
            <div
              key={player.playerName}
              className="flex-1 min-w-[200px] max-w-[400px]"
            >
              <PlayerStatsCard
                playerName={player.playerName}
                matchId={matchId}
              />
            </div>
          ))}
      </div>

      <div className="border-b border-gray-700 dark:border-gray-700 py-2 mb-4">
        <h2 className="text-xl font-semibold text-base-800 dark:text-base-200">
          {matchData.team2Name} Players
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {playerStats.rows
          .filter((stats) => stats.playerTeam === matchData.team2Name)
          .map((player) => (
            <div
              key={player.playerName}
              className="flex-1 min-w-[200px] max-w-[400px]"
            >
              <PlayerStatsCard
                playerName={player.playerName}
                matchId={matchId}
              />
            </div>
          ))}
      </div>
    </>
  );
};
