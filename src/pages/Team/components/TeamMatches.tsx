import React from "react";
import { Link } from "react-router-dom";
import { MatchData } from "../../../atoms/matchDataAtom";
import { formatDate } from "../../../lib/date";

interface TeamMatchesProps {
  matches: MatchData[];
  teamName: string;
}

export const TeamMatches: React.FC<TeamMatchesProps> = ({ matches, teamName }) => {
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.dateString).getTime() - new Date(a.dateString).getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Match History</h2>
      <div className="grid gap-4">
        {sortedMatches.map((match) => {
          const isTeam1 = match.team1Name === teamName;
          const teamScore = isTeam1 ? match.team1Score : match.team2Score;
          const opposingScore = isTeam1 ? match.team2Score : match.team1Score;
          const opposingTeam = isTeam1 ? match.team2Name : match.team1Name;
          const result = teamScore > opposingScore ? "win" : teamScore < opposingScore ? "loss" : "draw";

          return (
            <Link
              key={match.matchId}
              to={`/matches/${match.matchId}`}
              className="block hover:bg-base-200 transition-colors duration-200 rounded-lg p-4 border border-base-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${
                      result === "win" ? "text-success" :
                      result === "loss" ? "text-error" :
                      "text-warning"
                    }`}>
                      {result.toUpperCase()}
                    </span>
                    <span className="text-base-content">vs {opposingTeam}</span>
                  </div>
                  <div className="text-sm text-base-content/70">
                    {match.map} - {match.mode}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg">
                    {teamScore} - {opposingScore}
                  </div>
                  <div className="text-sm text-base-content/70">
                    {formatDate(new Date(match.dateString))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};