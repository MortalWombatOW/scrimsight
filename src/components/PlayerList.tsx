import { Link } from "react-router-dom";
import { getRoute } from "../lib/route";
import { PlayerRelationships } from "../lib/ScrimsightDataModel";
import HeroIcon from "../icons/HeroIcon";
import RoleIcon from "../icons/RoleIcon";
import { formatDuration, listToNaturalLanguage } from "../lib/format";
import EmptyState from "./EmptyState";
import { User } from "lucide-react";

interface PlayerListProps {
  players: PlayerRelationships[];
  className?: string;
}

const PlayerList = ({ players, className = "" }: PlayerListProps) => {
  if (players.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="No players found"
        description="There are no players to display"
        size="md"
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {players.map((player) => {
        const topHeroes = player.heroes
          .sort((a, b) => b.playtime - a.playtime)
          .slice(0, 3);
        
        const topRole = player.roles
          .sort((a, b) => b.playtime - a.playtime)[0];

        const totalPlaytime = player.heroes.reduce((sum, hero) => sum + hero.playtime, 0);
        const teamsList = listToNaturalLanguage(player.teams);

        return (
          <Link
            key={player.player}
            to={getRoute(`/player/${encodeURIComponent(player.player)}`)}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-3">
                {topRole && <RoleIcon role={topRole.role} />}
                <h3 className="card-title text-lg">{player.player}</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-base-content/70 mb-2">Top Heroes</p>
                  <div className="flex gap-2">
                    {topHeroes.map((heroData) => (
                      <div key={heroData.hero} className="flex flex-col items-center">
                        <HeroIcon 
                          hero={heroData.hero} 
                          size={32} 
                          showTooltip
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stats stats-vertical text-xs">
                  <div className="stat py-2">
                    <div className="stat-title text-xs">Playtime</div>
                    <div className="stat-value text-sm">{formatDuration(totalPlaytime)}</div>
                  </div>
                  <div className="stat py-2">
                    <div className="stat-title text-xs">Teams</div>
                    <div className="stat-value text-sm truncate" title={teamsList}>
                      {teamsList}
                    </div>
                  </div>
                  <div className="stat py-2">
                    <div className="stat-title text-xs">Scrims</div>
                    <div className="stat-value text-sm">{player.scrims.length}</div>
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

export default PlayerList;