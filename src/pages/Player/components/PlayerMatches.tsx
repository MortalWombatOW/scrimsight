import React from "react";
import { useStats } from "../../../atoms";
import { useAtomValue } from "jotai";
import { matchDataAtom } from "../../../atoms/matchDataAtom";
import { Link } from "react-router-dom";

interface PlayerMatchesProps {
  playerName: string;
}

export const PlayerMatches: React.FC<PlayerMatchesProps> = ({ playerName }) => {
  const matchStats = useStats(
    ["matchId", "playerName", "playerHero", "playerTeam"],
    { playerName: [playerName] }
  );
  const allMatches = useAtomValue(matchDataAtom);

  // Combine match stats with match data
  const matchData = matchStats.rows
    .map((stat) => {
      const match = allMatches.find((m) => m.matchId === stat.matchId);

      if (!match) return null;

      const isTeam1 = match.team1Players.includes(playerName);
      const won =
        (isTeam1 && match.team1Score > match.team2Score) ||
        (!isTeam1 && match.team2Score > match.team1Score);

      return {
        ...stat,
        ...match,
        won,
        score: `${match.team1Score} - ${match.team2Score}`,
        elimsPerLife: (stat.eliminations / Math.max(stat.deaths, 1)).toFixed(2),
        damage: Math.round(stat.heroDamageDealt).toLocaleString(),
        healing: Math.round(stat.healingDealt).toLocaleString(),
      };
    })
    .filter(Boolean);

  return (
    <div className="bg-base-100 p-6 rounded-box">
      <h2 className="text-xl font-bold mb-4">Recent Matches</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Map</th>
              <th>Hero</th>
              <th>Result</th>
              <th>Score</th>
              <th>E/D</th>
              <th>Damage</th>
              <th>Healing</th>
            </tr>
          </thead>
          <tbody>
            {matchData.map((match) => (
              <tr key={match.matchId}>
                <td>{new Date(match.dateString).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/matches/${match.matchId}`}
                    className={
                      "link link-hover " +
                      (match.won
                        ? "border-b-success border-b-2"
                        : "border-b-error border-b-2")
                    }
                  >
                    {match.map}
                  </Link>
                </td>
                <td>{match.playerHero}</td>
                <td>{match.won ? "Win" : "Loss"}</td>
                <td>{match.score}</td>
                <td>{match.elimsPerLife}</td>
                <td>{match.damage}</td>
                <td>{match.healing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
