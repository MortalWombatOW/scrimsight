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
      if (value >= 75) return 'bg-green-500';
      if (value >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    if (type === 'resilience') {
      if (value >= 35) return 'bg-green-500';
      if (value >= 20) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    return 'bg-blue-500';
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
          <h3 className="text-lg font-bold text-white">Win Conditions</h3>
          <p className="text-sm text-gray-400">{teamName}</p>
        </div>
        <div className="text-xs text-gray-500 italic">
          {getInsight()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Snowball Potential */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <TrendingUp size={16} className="text-green-400" />
              Snowball Potential
            </div>
            <span className="text-xl font-bold text-white">{winRateWithFirstPick.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={clsx("h-2 rounded-full transition-all duration-500", getProgressColor(winRateWithFirstPick, 'snowball'))} 
              style={{ width: `${winRateWithFirstPick}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Win Rate when getting First Pick ({totalFightsWithFirstPick} fights)</p>
        </div>

        {/* Resilience */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <ShieldAlert size={16} className="text-red-400" />
              Resilience
            </div>
            <span className="text-xl font-bold text-white">{winRateAgainstFirstPick.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={clsx("h-2 rounded-full transition-all duration-500", getProgressColor(winRateAgainstFirstPick, 'resilience'))} 
              style={{ width: `${winRateAgainstFirstPick}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Win Rate when enemy gets First Pick ({totalFightsAgainstFirstPick} fights)</p>
        </div>

        {/* Neutral Game */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Swords size={16} className="text-blue-400" />
              Neutral / Dry Fights
            </div>
            <span className="text-xl font-bold text-white">{dryFightWinRate.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={clsx("h-2 rounded-full transition-all duration-500", getProgressColor(dryFightWinRate, 'neutral'))} 
              style={{ width: `${dryFightWinRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Win Rate in fights without Ults ({totalDryFights} fights)</p>
        </div>
      </div>
    </Card>
  );
};
