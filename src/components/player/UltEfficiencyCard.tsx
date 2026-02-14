import React from 'react';
import { PlayerUltMetrics } from '../../domain/economy';
import { Timer, Hourglass, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

interface UltEfficiencyCardProps {
  metrics: PlayerUltMetrics[];
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

export const UltEfficiencyCard: React.FC<UltEfficiencyCardProps> = ({ metrics }) => {
  const totalEarned = metrics.reduce((s, m) => s + m.totalUltsEarned, 0);
  const totalUsed = metrics.reduce((s, m) => s + m.totalUltsUsed, 0);
  const weightedCharge = metrics.reduce((s, m) => s + m.avgTimeToCharge * m.totalUltsEarned, 0);
  const weightedHold = metrics.reduce((s, m) => s + m.avgTimeHeld * m.totalUltsEarned, 0);

  const avgCharge = totalEarned > 0 ? weightedCharge / totalEarned : 0;
  const avgHold = totalEarned > 0 ? weightedHold / totalEarned : 0;
  const usageRate = totalEarned > 0 ? (totalUsed / totalEarned) * 100 : 0;

  const getUsageRateColor = (rate: number) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-base-200/50 rounded-xl p-3 border border-base-content/10 mt-2">
      <h4 className="text-xs font-bold text-base-content/60 uppercase mb-3">Ult Efficiency</h4>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center bg-base-300/50 p-2 rounded-lg">
          <div className="p-1 bg-info/20 rounded text-info mb-1">
            <Timer size={14} />
          </div>
          <span className="text-sm font-bold">{formatTime(avgCharge)}</span>
          <span className="text-[10px] text-base-content/50">Avg Charge</span>
        </div>

        <div className="flex flex-col items-center bg-base-300/50 p-2 rounded-lg">
          <div className="p-1 bg-warning/20 rounded text-warning mb-1">
            <Hourglass size={14} />
          </div>
          <span className="text-sm font-bold">{formatTime(avgHold)}</span>
          <span className="text-[10px] text-base-content/50">Avg Hold</span>
        </div>

        <div className="flex flex-col items-center bg-base-300/50 p-2 rounded-lg">
          <div className="p-1 bg-success/20 rounded text-success mb-1">
            <TrendingUp size={14} />
          </div>
          <span className={clsx("text-sm font-bold", getUsageRateColor(usageRate))}>
            {usageRate.toFixed(0)}%
          </span>
          <span className="text-[10px] text-base-content/50">Used Rate</span>
        </div>
      </div>

      <div className="text-center mt-2">
        <span className="text-[10px] text-base-content/40">
          {totalUsed}/{totalEarned} ults used across {metrics.length} hero{metrics.length !== 1 ? 'es' : ''}
        </span>
      </div>
    </div>
  );
};
