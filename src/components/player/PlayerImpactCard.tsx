import React from 'react';
import { PlayerImpactMetrics } from '../../hooks/useFightAnalysis';
import { Target, Skull, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface PlayerImpactCardProps {
  metrics: PlayerImpactMetrics;
}

export const PlayerImpactCard: React.FC<PlayerImpactCardProps> = ({ metrics }) => {
  const {
    totalFirstPicks,
    totalFirstDeaths,
    ultWinRate,
    totalUltsUsed,
    totalUltsWon
  } = metrics;

  // Calculate ratio for the bar
  const totalEntries = totalFirstPicks + totalFirstDeaths;
  const pickPercentage = totalEntries > 0 ? (totalFirstPicks / totalEntries) * 100 : 50;
  
  // Color for Ult Win Rate
  const getUltWinRateColor = (rate: number) => {
    if (rate >= 60) return 'text-green-400';
    if (rate >= 45) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800 mt-2">
      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Fight Impact</h4>
      
      <div className="space-y-4">
        {/* Entry vs Death Ratio */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <div className="flex items-center gap-1 text-green-400">
              <Target size={12} />
              <span>{totalFirstPicks} First Picks</span>
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <span>{totalFirstDeaths} First Deaths</span>
              <Skull size={12} />
            </div>
          </div>
          
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-green-500/80 transition-all duration-500" 
              style={{ width: `${pickPercentage}%` }}
            />
            <div 
              className="h-full bg-red-500/80 transition-all duration-500" 
              style={{ width: `${100 - pickPercentage}%` }}
            />
          </div>
          
          <div className="text-center mt-1">
            <span className="text-xs text-gray-500">
              {totalEntries > 0 
                ? `${(totalFirstPicks / totalEntries).toFixed(1)} Ratio` 
                : "No Entry Data"}
            </span>
          </div>
        </div>

        {/* Ult Value */}
        <div className="flex items-center justify-between bg-gray-800/50 p-2 rounded border border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-yellow-500/20 rounded text-yellow-500">
              <Zap size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Ult Value</span>
              <span className="text-[10px] text-gray-500">{totalUltsWon}/{totalUltsUsed} Fights Won</span>
            </div>
          </div>
          <div className={clsx("text-lg font-bold", getUltWinRateColor(ultWinRate))}>
            {ultWinRate.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
};
