import { useAtomValue } from "jotai";
import { playerStatsByMatchIdAndPlayerNameAtom } from "../../atoms/metrics/playerMetricsAtoms";

interface PlayerMatchHistoryProps {
  playerName: string;
}

export const PlayerMatchHistory = ({ playerName }: PlayerMatchHistoryProps) => {
  const { rows } = useAtomValue(playerStatsByMatchIdAndPlayerNameAtom);
  const playerMatches = rows
    .filter((match) => match.playerName === playerName)
    .sort((a, b) => a.matchId.localeCompare(b.matchId));

  if (!playerMatches.length) {
    return (
      <p className="text-base-700 dark:text-base-300">
        No match history available
      </p>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-base-800">
      <h2 className="mb-4 text-xl font-semibold text-base-900 dark:text-white">
        Match History
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {playerMatches.map((match) => (
          <div
            key={match.matchId}
            className="rounded-lg border border-base-200 bg-white p-4 dark:border-base-700 dark:bg-base-900"
          >
            <h3 className="mb-2 text-lg font-medium text-base-900 dark:text-white">
              Match ID: {match.matchId}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div>
                <p className="text-sm text-base-500 dark:text-base-400">
                  Eliminations
                </p>
                <p className="font-medium">{match.eliminations}</p>
              </div>
              <div>
                <p className="text-sm text-base-500 dark:text-base-400">
                  Deaths
                </p>
                <p className="font-medium">{match.deaths}</p>
              </div>
              <div>
                <p className="text-sm text-base-500 dark:text-base-400">
                  Hero Damage
                </p>
                <p className="font-medium">{match.heroDamageDealt}</p>
              </div>
              <div>
                <p className="text-sm text-base-500 dark:text-base-400">
                  Healing
                </p>
                <p className="font-medium">{match.healingDealt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
