import { Link } from "react-router-dom";
import { MatchRelationships } from "../lib/ScrimsightDataModel";
import TeamColorDot from "./TeamColorDot";
import { formatDuration, formatDate } from "../lib/format";
import EmptyState from "./EmptyState";
import { Trophy } from "lucide-react";

interface MatchListProps {
  matches: MatchRelationships[];
  className?: string;
}

const MatchList = ({ matches, className = "" }: MatchListProps) => {
  if (matches.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No matches found"
        description="There are no matches to display"
        size="md"
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {matches.map((match) => {
        const [team1, team2] = match.teams;
        const team1Won = match.winningTeam === team1;
        const team2Won = match.winningTeam === team2;
        const isDraw = match.team1Score === match.team2Score;

        const getScoreColor = (teamName: string) => {
          if (isDraw) return "text-base-content/70";
          return match.winningTeam === teamName ? "text-success" : "text-error";
        };

        return (
          <Link
            key={match.match}
            to={`/match/${encodeURIComponent(match.match)}`}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-base-content/70">
                  <span className="font-mono">{match.match}</span>
                </div>
                <div className="badge badge-outline">{match.gameMode}</div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TeamColorDot teamName={team1} size={16} />
                    <span className={`font-medium ${team1Won ? 'text-success' : ''}`}>
                      {team1}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(team1)}`}>
                    {match.team1Score}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TeamColorDot teamName={team2} size={16} />
                    <span className={`font-medium ${team2Won ? 'text-success' : ''}`}>
                      {team2}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(team2)}`}>
                    {match.team2Score}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-base-content/70">
                <div className="flex justify-between">
                  <span>Map:</span>
                  <span className="font-medium">{match.map}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{formatDuration(match.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{formatDate(match.date)}</span>
                </div>
              </div>

              {!isDraw && (
                <div className="text-center mt-2">
                  <span className="text-success text-sm font-semibold">
                    {match.winningTeam} wins
                  </span>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MatchList;