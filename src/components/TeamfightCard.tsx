import { Teamfight } from "../lib/ScrimsightDataModel";
import TeamColorDot from "./TeamColorDot";
import HeroIcon from "../icons/HeroIcon";
import { formatDuration } from "../lib/format";
import { Users, Zap, Target } from "lucide-react";

interface TeamfightCardProps {
  teamfight: Teamfight;
  className?: string;
}

const TeamfightCard = ({ teamfight, className = "" }: TeamfightCardProps) => {
  const { start, end, winner, team1KillsPerUlt, team2KillsPerUlt } = teamfight;
  
  const team1 = start.team1.teamName;
  const team2 = start.team2.teamName;
  
  const team1Won = winner === team1;
  const team2Won = winner === team2;

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`card bg-base-100 shadow-md border-l-4 ${
      team1Won ? 'border-l-success' : team2Won ? 'border-l-error' : 'border-l-base-content/20'
    } ${className}`}>
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-base-content/70">
            <span>{formatTime(teamfight.startTime)} - {formatTime(teamfight.endTime)}</span>
            <span className="ml-2">({formatDuration(teamfight.duration)})</span>
          </div>
          <div className="badge badge-sm">
            Round {teamfight.roundIndex}
          </div>
        </div>

        <div className="space-y-3">
          {/* Team 1 */}
          <div className={`p-3 rounded-lg ${team1Won ? 'bg-success/10' : 'bg-base-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TeamColorDot teamName={team1} size={16} />
                <span className={`font-semibold ${team1Won ? 'text-success' : ''}`}>
                  {team1}
                </span>
                {team1Won && <span className="text-success text-xs font-bold">WINNER</span>}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{end.team1.alivePlayers.length} alive</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target size={14} />
                  <span>{end.team1.kills.length} kills</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {start.team1.ultimatesReady.length > 0 && (
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-warning" />
                  <span className="text-sm text-base-content/70">Ults ready:</span>
                  <div className="flex gap-1">
                    {start.team1.ultimatesReady.slice(0, 3).map((hero, index) => (
                      <HeroIcon key={`${hero}-${index}`} hero={hero} size={20} showTooltip />
                    ))}
                    {start.team1.ultimatesReady.length > 3 && (
                      <span className="text-xs text-base-content/70 ml-1">
                        +{start.team1.ultimatesReady.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {end.team1.ultimatesUsed.length > 0 && (
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-primary" />
                  <span className="text-sm text-base-content/70">Ults used:</span>
                  <div className="flex gap-1">
                    {end.team1.ultimatesUsed.slice(0, 3).map((hero, index) => (
                      <HeroIcon key={`${hero}-${index}`} hero={hero} size={20} showTooltip />
                    ))}
                    {end.team1.ultimatesUsed.length > 3 && (
                      <span className="text-xs text-base-content/70 ml-1">
                        +{end.team1.ultimatesUsed.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className={`p-3 rounded-lg ${team2Won ? 'bg-success/10' : 'bg-base-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TeamColorDot teamName={team2} size={16} />
                <span className={`font-semibold ${team2Won ? 'text-success' : ''}`}>
                  {team2}
                </span>
                {team2Won && <span className="text-success text-xs font-bold">WINNER</span>}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{end.team2.alivePlayers.length} alive</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target size={14} />
                  <span>{end.team2.kills.length} kills</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {start.team2.ultimatesReady.length > 0 && (
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-warning" />
                  <span className="text-sm text-base-content/70">Ults ready:</span>
                  <div className="flex gap-1">
                    {start.team2.ultimatesReady.slice(0, 3).map((hero, index) => (
                      <HeroIcon key={`${hero}-${index}`} hero={hero} size={20} showTooltip />
                    ))}
                    {start.team2.ultimatesReady.length > 3 && (
                      <span className="text-xs text-base-content/70 ml-1">
                        +{start.team2.ultimatesReady.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {end.team2.ultimatesUsed.length > 0 && (
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-primary" />
                  <span className="text-sm text-base-content/70">Ults used:</span>
                  <div className="flex gap-1">
                    {end.team2.ultimatesUsed.slice(0, 3).map((hero, index) => (
                      <HeroIcon key={`${hero}-${index}`} hero={hero} size={20} showTooltip />
                    ))}
                    {end.team2.ultimatesUsed.length > 3 && (
                      <span className="text-xs text-base-content/70 ml-1">
                        +{end.team2.ultimatesUsed.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Efficiency Stats */}
          {(team1KillsPerUlt > 0 || team2KillsPerUlt > 0) && (
            <div className="flex justify-center gap-4 text-sm text-base-content/70 pt-2 border-t border-base-300">
              <div>Kills/Ult: {team1KillsPerUlt.toFixed(1)} vs {team2KillsPerUlt.toFixed(1)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamfightCard;