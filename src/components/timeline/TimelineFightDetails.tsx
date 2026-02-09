import React from 'react';
import { Teamfight, TeamfightEvent } from '../../types/domain';
import { KillLogEvent } from '../../types/logs';
import { Clock, Target } from 'lucide-react';
import { cn } from '@library/cn';

function isKillEvent(e: TeamfightEvent): e is KillLogEvent {
  return 'attackerName' in e && 'victimName' in e;
}

interface TimelineFightDetailsProps {
  fight: Teamfight;
  userTeamName: string;
}

export const TimelineFightDetails: React.FC<TimelineFightDetailsProps> = ({
  fight,
  userTeamName,
}) => {
  const isWin = fight.winner === userTeamName;
  const winnerColor = isWin ? 'text-success' : fight.winner ? 'text-error' : 'text-base-content/60';
  const borderColor = isWin ? 'border-success/30' : fight.winner ? 'border-error/30' : 'border-base-content/20';

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("w-full bg-base-200/50 border rounded-xl p-4 mt-4", borderColor)}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className={winnerColor}>
              {fight.winner ? (isWin ? "WON" : "LOST") : "DRAW"}
            </span>
            <span className="text-base-content/50 text-sm font-normal">
              ({fight.type.toUpperCase().replace('-', ' ')})
            </span>
          </h3>
          <div className="text-xs text-base-content/60 flex items-center gap-2 mt-1">
            <Clock size={12} />
            {formatTime(fight.startTime)} - {formatTime(fight.endTime)} ({fight.duration.toFixed(1)}s)
          </div>
        </div>

        {/* First Pick Highlight */}
        {fight.firstPick && (
          <div className="bg-base-300 px-3 py-2 rounded-lg border border-base-content/10 flex items-center gap-3">
            <div className="text-xs text-base-content/60 uppercase tracking-wider font-bold">First Pick</div>
            <div className="flex items-center gap-2 text-sm">
              <span className={fight.firstPick.team === userTeamName ? "text-success" : "text-error"}>
                {fight.firstPick.player} ({fight.firstPick.hero})
              </span>
              <Target size={14} className="text-base-content/50" />
              <span className={fight.firstPick.team !== userTeamName ? "text-success" : "text-error"}>
                {fight.firstPick.victim}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Economy Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Us */}
        <div className="bg-base-300/50 p-3 rounded-lg border border-base-content/8">
          <div className="text-xs text-base-content/60 mb-2 uppercase font-bold flex justify-between">
            <span>Our Ults Used</span>
            <span className="text-base-content">{fight.team1Name === userTeamName ? fight.team1UltsUsed.length : fight.team2UltsUsed.length}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(fight.team1Name === userTeamName ? fight.team1UltsUsed : fight.team2UltsUsed).map((ult, i) => (
              <span key={i} className="px-2 py-0.5 bg-info/20 text-info text-xs rounded border border-info/30">
                {ult}
              </span>
            ))}
            {(fight.team1Name === userTeamName ? fight.team1UltsUsed : fight.team2UltsUsed).length === 0 && (
              <span className="text-base-content/40 text-xs italic">None used</span>
            )}
          </div>
        </div>

        {/* Them */}
        <div className="bg-base-300/50 p-3 rounded-lg border border-base-content/8">
          <div className="text-xs text-base-content/60 mb-2 uppercase font-bold flex justify-between">
            <span>Enemy Ults Used</span>
            <span className="text-base-content">{fight.team1Name !== userTeamName ? fight.team1UltsUsed.length : fight.team2UltsUsed.length}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(fight.team1Name !== userTeamName ? fight.team1UltsUsed : fight.team2UltsUsed).map((ult, i) => (
              <span key={i} className="px-2 py-0.5 bg-error/20 text-error text-xs rounded border border-error/30">
                {ult}
              </span>
            ))}
            {(fight.team1Name !== userTeamName ? fight.team1UltsUsed : fight.team2UltsUsed).length === 0 && (
              <span className="text-base-content/40 text-xs italic">None used</span>
            )}
          </div>
        </div>
      </div>

      {/* Kill Feed (Simplified) */}
      <div className="space-y-1">
        {fight.events.filter(isKillEvent).map((e, i) => (
          <div key={i} className="flex items-center gap-2 text-xs py-1 border-b border-base-content/8 last:border-0">
            <span className="text-base-content/50 font-mono w-12 text-right">{formatTime(e.matchTime)}</span>
            <span className={e.attackerTeam === userTeamName ? "text-success font-medium" : "text-error font-medium"}>
              {e.attackerName} ({e.attackerHero})
            </span>
            <span className="text-base-content/40">killed</span>
            <span className={e.victimTeam === userTeamName ? "text-success" : "text-error"}>
              {e.victimName} ({e.victimHero})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
