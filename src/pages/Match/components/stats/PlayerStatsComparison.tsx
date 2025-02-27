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
    <div className="bg-white rounded-lg border border-gray-200 w-full dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {matchData.team1Name} Players
          </h3>
          <div className="flex flex-wrap gap-4 items-start">
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
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {matchData.team2Name} Players
          </h3>
          <div className="flex flex-wrap gap-4 items-start">
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
        </div>
      </div>
    </div>
  );
};
