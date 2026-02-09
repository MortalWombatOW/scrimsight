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
    if (rate >= 60) return 'text-success';
    if (rate >= 45) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-base-200/50 rounded-xl p-3 border border-base-content/10 mt-2">
      <h4 className="text-xs font-bold text-base-content/60 uppercase mb-3">Fight Impact</h4>

      <div className="space-y-4">
        {/* Entry vs Death Ratio */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <div className="flex items-center gap-1 text-success">
              <Target size={12} />
              <span>{totalFirstPicks} First Picks</span>
            </div>
            <div className="flex items-center gap-1 text-error">
              <span>{totalFirstDeaths} First Deaths</span>
              <Skull size={12} />
            </div>
          </div>

          <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-success/80 transition-all duration-500"
              style={{ width: `${pickPercentage}%` }}
            />
            <div
              className="h-full bg-error/80 transition-all duration-500"
              style={{ width: `${100 - pickPercentage}%` }}
            />
          </div>

          <div className="text-center mt-1">
            <span className="text-xs text-base-content/50">
              {totalEntries > 0
                ? `${(totalFirstPicks / totalEntries).toFixed(1)} Ratio`
                : "No Entry Data"}
            </span>
          </div>
        </div>

        {/* Ult Value */}
        <div className="flex items-center justify-between bg-base-300/50 p-2 rounded-lg border border-base-content/8">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-warning/20 rounded text-warning">
              <Zap size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-base-content/60">Ult Value</span>
              <span className="text-[10px] text-base-content/50">{totalUltsWon}/{totalUltsUsed} Fights Won</span>
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
