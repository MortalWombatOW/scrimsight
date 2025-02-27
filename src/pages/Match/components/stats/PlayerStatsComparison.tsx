import { useAtomValue } from "jotai";
import { matchDataAtom, useStats } from "../../../../atoms";
import { PlayerStatsCard } from "./PlayerStatsCard";

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
      <div className="border-b border-gray-200 dark:border-gray-700 py-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {matchData.team1Name} Players
        </h2>
      </div>

      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {playerStats.rows
          .filter((stats) => stats.playerTeam === matchData.team1Name)
          .map((player) => (
            <PlayerStatsCard
              key={player.playerName}
              playerName={player.playerName}
              matchId={matchId}
            />
          ))}
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 py-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {matchData.team2Name} Players
        </h2>
      </div>

      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {playerStats.rows
          .filter((stats) => stats.playerTeam === matchData.team2Name)
          .map((player) => (
            <PlayerStatsCard
              key={player.playerName}
              playerName={player.playerName}
              matchId={matchId}
            />
          ))}
      </div>
    </>
  );
};
