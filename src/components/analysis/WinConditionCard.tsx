import React from 'react';
import { Card } from '../surface';
import { WinConditionMetrics } from '../../hooks/useFightAnalysis';
import { clsx } from 'clsx';
import { TrendingUp, ShieldAlert, Swords } from 'lucide-react';

interface WinConditionCardProps {
  teamName: string;
  metrics: WinConditionMetrics;
}

export const WinConditionCard: React.FC<WinConditionCardProps> = ({ teamName, metrics }) => {
  const {
    winRateWithFirstPick,
    winRateAgainstFirstPick,
    dryFightWinRate,
    totalFightsWithFirstPick,
    totalFightsAgainstFirstPick,
    totalDryFights
  } = metrics;

  // Helper for progress bar color
  const getProgressColor = (value: number, type: 'snowball' | 'resilience' | 'neutral') => {
    if (type === 'snowball') {
      if (value >= 75) return 'bg-success';
      if (value >= 60) return 'bg-warning';
      return 'bg-error';
    }
    if (type === 'resilience') {
      if (value >= 35) return 'bg-success';
      if (value >= 20) return 'bg-warning';
      return 'bg-error';
    }
    return 'bg-info';
  };

  // Dynamic Insight Text
  const getInsight = () => {
    if (winRateWithFirstPick > 80 && winRateAgainstFirstPick < 20) {
      return "Matches are decided by the opening pick.";
    }
    if (winRateAgainstFirstPick > 40) {
      return "Highly resilient team, capable of turning fights.";
    }
    if (winRateWithFirstPick < 50) {
      return "Struggling to convert advantages into wins.";
    }
    return "Balanced performance across fight states.";
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-base-content">Win Conditions</h3>
          <p className="text-sm text-base-content/60">{teamName}</p>
        </div>
        <div className="text-xs text-base-content/50 italic">
          {getInsight()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Snowball Potential */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-base-content/80">
              <TrendingUp size={16} className="text-success" />
              Snowball Potential
            </div>
            <span className="text-xl font-bold text-base-content">{winRateWithFirstPick.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className={clsx("h-2 rounded-full transition-all duration-500", getProgressColor(winRateWithFirstPick, 'snowball'))}
              style={{ width: `${winRateWithFirstPick}%` }}
            />
          </div>
          <p className="text-xs text-base-content/50">Win Rate when getting First Pick ({totalFightsWithFirstPick} fights)</p>
        </div>

        {/* Resilience */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-base-content/80">
              <ShieldAlert size={16} className="text-error" />
              Resilience
            </div>
            <span className="text-xl font-bold text-base-content">{winRateAgainstFirstPick.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className={clsx("h-2 rounded-full transition-all duration-500", getProgressColor(winRateAgainstFirstPick, 'resilience'))}
              style={{ width: `${winRateAgainstFirstPick}%` }}
            />
          </div>
          <p className="text-xs text-base-content/50">Win Rate when enemy gets First Pick ({totalFightsAgainstFirstPick} fights)</p>
        </div>

        {/* Neutral Game */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-base-content/80">
              <Swords size={16} className="text-info" />
              Neutral / Dry Fights
            </div>
            <span className="text-xl font-bold text-base-content">{dryFightWinRate.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className={clsx("h-2 rounded-full transition-all duration-500", getProgressColor(dryFightWinRate, 'neutral'))}
              style={{ width: `${dryFightWinRate}%` }}
            />
          </div>
          <p className="text-xs text-base-content/50">Win Rate in fights without Ults ({totalDryFights} fights)</p>
        </div>
      </div>
    </Card>
  );
};
