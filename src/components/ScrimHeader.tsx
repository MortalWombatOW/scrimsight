import { ReactNode } from "react";
import { ScrimID, TeamName } from "../lib/ScrimsightDataModel";
import TeamColorDot from "./TeamColorDot";
import { formatDate } from "../lib/format";

interface ScrimHeaderProps {
  scrimId: ScrimID;
  date: Date;
  team1Name: TeamName;
  team2Name: TeamName;
  team1MatchesWon: number;
  team2MatchesWon: number;
  children?: ReactNode;
  className?: string;
}

const ScrimHeader = ({ 
  scrimId, 
  date, 
  team1Name, 
  team2Name, 
  team1MatchesWon,
  team2MatchesWon,
  children,
  className = "" 
}: ScrimHeaderProps) => {
  const team1Won = team1MatchesWon > team2MatchesWon;
  const team2Won = team2MatchesWon > team1MatchesWon;
  const isDraw = team1MatchesWon === team2MatchesWon;

  const getScoreColor = (isWinner: boolean) => {
    if (isDraw) return "text-base-content/70";
    return isWinner ? "text-success" : "text-error";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-base-content/70">
          <span className="font-mono text-sm">{scrimId}</span>
          <span>•</span>
          <span>{formatDate(date)}</span>
          <span>•</span>
          <span>{formatTime(date)}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TeamColorDot teamName={team1Name} size={20} />
              <span className={`text-xl font-semibold ${team1Won ? 'text-success' : ''}`}>
                {team1Name}
              </span>
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(team1Won)}`}>
              {team1MatchesWon}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TeamColorDot teamName={team2Name} size={20} />
              <span className={`text-xl font-semibold ${team2Won ? 'text-success' : ''}`}>
                {team2Name}
              </span>
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(team2Won)}`}>
              {team2MatchesWon}
            </span>
          </div>
        </div>

        {!isDraw && (
          <div className="text-center">
            <span className="text-success font-semibold">
              {team1Won ? team1Name : team2Name} wins the scrim!
            </span>
          </div>
        )}

        {isDraw && (
          <div className="text-center">
            <span className="text-base-content/70 font-semibold">
              Scrim ends in a draw
            </span>
          </div>
        )}
      </div>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default ScrimHeader;