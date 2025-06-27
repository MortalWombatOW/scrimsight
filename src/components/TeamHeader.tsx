import { ReactNode } from "react";
import { PlayerName } from "../lib/ScrimsightDataModel";
import TeamColorDot from "./TeamColorDot";
import { Link } from "react-router-dom";

interface TeamHeaderProps {
  teamName: string;
  players: PlayerName[];
  children?: ReactNode;
  className?: string;
}

const TeamHeader = ({ teamName, players, children, className = "" }: TeamHeaderProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <TeamColorDot teamName={teamName} size={24} />
        <h2 className="text-2xl font-bold text-base-content">{teamName}</h2>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-base-content/80">Players</h3>
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <Link
              key={player}
              to={`/player/${encodeURIComponent(player)}`}
              className="btn btn-sm btn-outline hover:btn-primary"
            >
              {player}
            </Link>
          ))}
        </div>
      </div>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default TeamHeader;