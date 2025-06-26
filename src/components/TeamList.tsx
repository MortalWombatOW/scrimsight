import { Link } from "react-router-dom";
import { getRoute } from "../lib/route";
import { TeamRelationships } from "../lib/ScrimsightDataModel";
import TeamColorDot from "./TeamColorDot";
// import { listToNaturalLanguage } from "../lib/format";
import EmptyState from "./EmptyState";
import { Users } from "lucide-react";

interface TeamListProps {
  teams: TeamRelationships[];
  className?: string;
}

const TeamList = ({ teams, className = "" }: TeamListProps) => {
  if (teams.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No teams found"
        description="There are no teams to display"
        size="md"
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {teams.map((team) => {
        // const playersList = listToNaturalLanguage(team.players);

        return (
          <Link
            key={team.team}
            to={getRoute(`/team/${encodeURIComponent(team.team)}`)}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-3">
                <TeamColorDot teamName={team.team} size={24} />
                <h3 className="card-title text-lg">{team.team}</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-base-content/70 mb-2">Players</p>
                  <div className="flex flex-wrap gap-1">
                    {team.players.slice(0, 6).map((player) => (
                      <span key={player} className="badge badge-outline badge-sm">
                        {player}
                      </span>
                    ))}
                    {team.players.length > 6 && (
                      <span className="badge badge-outline badge-sm">
                        +{team.players.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="stats stats-vertical text-xs">
                  <div className="stat py-2">
                    <div className="stat-title text-xs">Total Players</div>
                    <div className="stat-value text-sm">{team.players.length}</div>
                  </div>
                  <div className="stat py-2">
                    <div className="stat-title text-xs">Scrims Played</div>
                    <div className="stat-value text-sm">{team.scrims.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default TeamList;