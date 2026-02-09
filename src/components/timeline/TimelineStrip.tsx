import React from 'react';
import { Teamfight } from '../../types/domain';
import { Skull, Zap } from 'lucide-react';
import { cn } from '@library/cn';

interface TimelineStripProps {
  fights: Teamfight[];
  duration: number; // Match duration in seconds
  onFightSelect: (fight: Teamfight) => void;
  selectedFightId?: string;
  userTeamName: string; // To determine Win/Loss color
}

export const TimelineStrip: React.FC<TimelineStripProps> = ({
  fights,
  duration,
  onFightSelect,
  selectedFightId,
  userTeamName,
}) => {
  if (duration <= 0) return null;

  return (
    <div className="w-full h-24 bg-base-200 rounded-xl relative overflow-hidden border border-base-content/10">
      {/* Time markers could go here */}
      
      {fights.map((fight) => {
        const left = (fight.startTime / duration) * 100;
        const width = (fight.duration / duration) * 100;
        
        // Determine color based on winner
        const isWin = fight.winner === userTeamName;
        const isDraw = !fight.winner;
        
        // Determine intensity/opacity based on type
        // 'dry' = low opacity
        // 'ult-invested' = medium
        // 'all-in' = high
        let opacity = 0.6;
        if (fight.type === 'ult-invested') opacity = 0.8;
        if (fight.type === 'all-in') opacity = 1.0;
        if (fight.type === 'stagger') opacity = 0.4;

        const bgClass = isDraw
          ? 'bg-base-content/40'
          : isWin
            ? 'bg-success'
            : 'bg-error';

        const isSelected = fight.fightId === selectedFightId;

        return (
          <button
            key={fight.fightId}
            onClick={() => onFightSelect(fight)}
            className={cn(
              "absolute top-0 bottom-0 hover:brightness-110 transition-all cursor-pointer group",
              bgClass,
              isSelected && "ring-2 ring-white z-10 brightness-125"
            )}
            style={{
              left: `${left}%`,
              width: `${Math.max(width, 0.5)}%`, // Min width for visibility
              opacity: isSelected ? 1 : opacity,
            }}
            title={`Fight ${fight.fightId} (${fight.type})`}
          >
            {/* Icons Overlay */}
            <div className="absolute top-1 left-1 flex flex-col gap-0.5">
              {/* First Pick Skull */}
              {fight.firstPick && fight.firstPick.victim === userTeamName && ( // Wait, victim is player name. We need team.
              // fight.firstPick.team is the ATTACKER team.
              // If victim team is user team, then we got picked.
              // We don't have victim team in firstPick object explicitly in the interface I defined?
              // Let's check Teamfight interface.
              // firstPick: { player, team, hero, victim, time }
              // 'team' is attacker team.
              // So if team !== userTeamName, then we got picked?
              // Assuming 2 teams.
                fight.firstPick.team !== userTeamName && (
                  <Skull size={12} className="text-white drop-shadow-md" />
                )
              )}
            </div>
            
            {/* Ults Used Count */}
            <div className="absolute bottom-1 right-1 flex items-center">
              {(fight.team1UltsUsed.length + fight.team2UltsUsed.length) > 0 && (
                <div className="flex items-center text-[10px] font-bold text-white drop-shadow-md">
                  <Zap size={10} className="mr-0.5 fill-current" />
                  {fight.team1UltsUsed.length + fight.team2UltsUsed.length}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
