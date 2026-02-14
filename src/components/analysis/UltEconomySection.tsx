import React, { useMemo } from 'react';
import { StatCard } from '../ui/StatCard';
import { Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from 'recharts';
import { UltEconomyAnalysis, FightTypeWinRate, getUltEconomySummary } from '../../domain/analysis';
import { PlayerUltMetrics } from '../../domain/economy';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';

interface UltEconomySectionProps {
  data: UltEconomyAnalysis;
  playerMetrics: PlayerUltMetrics[];
  defaultOpen?: boolean;
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

const FightTypeTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as { label: string; totalFights: number; percentage: number };
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.label}</p>
        <p>{item.totalFights} fights ({item.percentage.toFixed(1)}%)</p>
      </div>
    );
  }
  return null;
};

const WinRateTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as FightTypeWinRate;
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.label}</p>
        <p>Decisive outcome: {item.winnerWinRate.toFixed(1)}%</p>
        <p className="text-xs text-base-content/60">
          {item.fightsWithWinner} of {item.totalFights} fights
        </p>
      </div>
    );
  }
  return null;
};

const FIGHT_TYPE_COLORS: Record<string, string> = {
  dry: 'fill-info',
  'ult-invested': 'fill-warning',
  'all-in': 'fill-error',
  stagger: 'fill-base-content/30',
};

export const UltEconomySection: React.FC<UltEconomySectionProps> = ({ data, playerMetrics, defaultOpen }) => {
  const summary = getUltEconomySummary(data);
  const { ultEfficiency } = data;

  const sortedPlayerMetrics = useMemo(
    () => [...playerMetrics].sort((a, b) => {
      const aRate = a.totalUltsEarned > 0 ? a.totalUltsUsed / a.totalUltsEarned : 0;
      const bRate = b.totalUltsEarned > 0 ? b.totalUltsUsed / b.totalUltsEarned : 0;
      return aRate - bRate;
    }),
    [playerMetrics],
  );

  return (
    <AnalysisSectionWrapper
      summary={summary}
      icon={<Zap size={20} className="text-warning" />}
      title="Ultimate Economy Wins Games"
      researchContext="Winning fights with fewer ultimates invested creates a sustainable advantage. Over-ulting (using 3-4 ults to win an already-won fight) wastes resources."
      defaultOpen={defaultOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Avg Ults per Win"
          value={ultEfficiency.avgUltsPerWin.toFixed(2)}
          description="Ults used by winning team"
        />
        <StatCard
          title="Avg Ults per Loss"
          value={ultEfficiency.avgUltsPerLoss.toFixed(2)}
          description="Ults used by losing team"
        />
        <StatCard
          title="Fights Analyzed"
          value={ultEfficiency.totalFightsAnalyzed.toString()}
          description="Fights with a decisive winner"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">Fight Type Distribution</h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.fightTypeDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="label" style={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v}`} style={{ fontSize: 12 }} />
                <Tooltip content={<FightTypeTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.fightTypeDistribution.map((entry, index) => (
                    <Cell key={index} className={FIGHT_TYPE_COLORS[entry.type] || 'fill-base-content/30'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">Decisive Outcome Rate by Fight Type</h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.winRateByFightType}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} style={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="label" width={120} style={{ fontSize: 12 }} />
                <Tooltip content={<WinRateTooltip />} />
                <Bar dataKey="winnerWinRate" radius={[0, 4, 4, 0]}>
                  {data.winRateByFightType.map((entry, index) => (
                    <Cell key={index} className={FIGHT_TYPE_COLORS[entry.type] || 'fill-base-content/30'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {sortedPlayerMetrics.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">Per-Player Ultimate Performance</h4>
          <div className="overflow-x-auto">
            <table className="table table-sm table-zebra">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Hero</th>
                  <th>Avg Charge</th>
                  <th>Avg Hold</th>
                  <th>Earned</th>
                  <th>Used</th>
                  <th>Usage Rate</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayerMetrics.map((pm, idx) => {
                  const usageRate = pm.totalUltsEarned > 0
                    ? (pm.totalUltsUsed / pm.totalUltsEarned) * 100
                    : 0;
                  return (
                    <tr key={idx}>
                      <td className="font-medium">{pm.playerName}</td>
                      <td className="text-xs text-base-content/60">{pm.teamName}</td>
                      <td className="text-xs">{pm.hero}</td>
                      <td>{formatTime(pm.avgTimeToCharge)}</td>
                      <td>{formatTime(pm.avgTimeHeld)}</td>
                      <td>{pm.totalUltsEarned}</td>
                      <td>{pm.totalUltsUsed}</td>
                      <td>
                        <span className={usageRate < 70 ? 'text-warning' : ''}>
                          {usageRate.toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-base-content/50 mt-2">
            Usage rate below 70% may indicate holding ults too long or losing them to hero swaps and round ends.
          </p>
        </div>
      )}
    </AnalysisSectionWrapper>
  );
};
