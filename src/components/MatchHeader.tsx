import { ReactNode } from "react";
import { MatchID, MapName, GameMode, TeamName } from "../lib/ScrimsightDataModel";
import TeamColorDot from "./TeamColorDot";

interface MatchHeaderProps {
  matchId: MatchID;
  mapName: MapName;
  gameMode: GameMode;
  team1Name: TeamName;
  team2Name: TeamName;
  winningTeam: TeamName;
  team1Score: number;
  team2Score: number;
  children?: ReactNode;
  className?: string;
}

const MatchHeader = ({ 
  matchId, 
  mapName, 
  gameMode, 
  team1Name, 
  team2Name, 
  winningTeam,
  team1Score,
  team2Score,
  children,
  className = "" 
}: MatchHeaderProps) => {
  const team1Won = winningTeam === team1Name;
  const team2Won = winningTeam === team2Name;
  const isDraw = team1Score === team2Score;

  const getScoreColor = (teamName: TeamName) => {
    if (isDraw) return "text-base-content/70";
    return winningTeam === teamName ? "text-success" : "text-error";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-base-content/70">
          <span className="font-mono text-sm">{matchId}</span>
          <span>•</span>
          <span>{mapName}</span>
          <span>•</span>
          <span className="badge badge-outline">{gameMode}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TeamColorDot teamName={team1Name} size={20} />
              <span className={`text-xl font-semibold ${team1Won ? 'text-success' : ''}`}>
                {team1Name}
              </span>
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(team1Name)}`}>
              {team1Score}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TeamColorDot teamName={team2Name} size={20} />
              <span className={`text-xl font-semibold ${team2Won ? 'text-success' : ''}`}>
                {team2Name}
              </span>
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(team2Name)}`}>
              {team2Score}
            </span>
          </div>
        </div>

        {!isDraw && (
          <div className="text-center">
            <span className="text-success font-semibold">
              {winningTeam} wins!
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

export default MatchHeader;