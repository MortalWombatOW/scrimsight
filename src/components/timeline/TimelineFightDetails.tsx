import React from 'react';
import { Teamfight } from '../../types/domain';
import { Clock, Target } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  const winnerColor = isWin ? 'text-green-400' : fight.winner ? 'text-red-400' : 'text-gray-400';
  const borderColor = isWin ? 'border-green-500/30' : fight.winner ? 'border-red-500/30' : 'border-gray-500/30';

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("w-full bg-gray-900/50 border rounded-lg p-4 mt-4", borderColor)}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className={winnerColor}>
              {fight.winner ? (isWin ? "WON" : "LOST") : "DRAW"}
            </span>
            <span className="text-gray-500 text-sm font-normal">
              ({fight.type.toUpperCase().replace('-', ' ')})
            </span>
          </h3>
          <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
            <Clock size={12} />
            {formatTime(fight.startTime)} - {formatTime(fight.endTime)} ({fight.duration.toFixed(1)}s)
          </div>
        </div>

        {/* First Pick Highlight */}
        {fight.firstPick && (
          <div className="bg-gray-800 px-3 py-2 rounded border border-gray-700 flex items-center gap-3">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">First Pick</div>
            <div className="flex items-center gap-2 text-sm">
              <span className={fight.firstPick.team === userTeamName ? "text-green-400" : "text-red-400"}>
                {fight.firstPick.player} ({fight.firstPick.hero})
              </span>
              <Target size={14} className="text-gray-500" />
              <span className={fight.firstPick.team !== userTeamName ? "text-green-400" : "text-red-400"}>
                {fight.firstPick.victim}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Economy Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Us */}
        <div className="bg-gray-800/50 p-3 rounded border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-2 uppercase font-bold flex justify-between">
            <span>Our Ults Used</span>
            <span className="text-white">{fight.team1Name === userTeamName ? fight.team1UltsUsed.length : fight.team2UltsUsed.length}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(fight.team1Name === userTeamName ? fight.team1UltsUsed : fight.team2UltsUsed).map((ult, i) => (
              <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
                {ult}
              </span>
            ))}
            {(fight.team1Name === userTeamName ? fight.team1UltsUsed : fight.team2UltsUsed).length === 0 && (
              <span className="text-gray-600 text-xs italic">None used</span>
            )}
          </div>
        </div>

        {/* Them */}
        <div className="bg-gray-800/50 p-3 rounded border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-2 uppercase font-bold flex justify-between">
            <span>Enemy Ults Used</span>
            <span className="text-white">{fight.team1Name !== userTeamName ? fight.team1UltsUsed.length : fight.team2UltsUsed.length}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(fight.team1Name !== userTeamName ? fight.team1UltsUsed : fight.team2UltsUsed).map((ult, i) => (
              <span key={i} className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30">
                {ult}
              </span>
            ))}
            {(fight.team1Name !== userTeamName ? fight.team1UltsUsed : fight.team2UltsUsed).length === 0 && (
              <span className="text-gray-600 text-xs italic">None used</span>
            )}
          </div>
        </div>
      </div>

      {/* Kill Feed (Simplified) */}
      <div className="space-y-1">
        {fight.events.filter((e: any) => e.type === 'kill' || (e.attackerName && e.victimName)).map((e: any, i) => (
          <div key={i} className="flex items-center gap-2 text-xs py-1 border-b border-gray-800 last:border-0">
             <span className="text-gray-500 font-mono w-12 text-right">{formatTime(e.matchTime)}</span>
             <span className={e.attackerTeam === userTeamName ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
               {e.attackerName} ({e.attackerHero})
             </span>
             <span className="text-gray-600">killed</span>
             <span className={e.victimTeam === userTeamName ? "text-green-400" : "text-red-400"}>
               {e.victimName} ({e.victimHero})
             </span>
          </div>
        ))}
      </div>
    </div>
  );
};
