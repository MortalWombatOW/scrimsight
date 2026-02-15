import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Crosshair } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from 'recharts';
import { FirstPickAnalysis, getFirstPickSummary } from '../../domain/analysis';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';
import { BenchmarkComparison } from './BenchmarkComparison';
import { FirstPickBenchmarks } from '../../hooks/useBenchmarks';

interface FirstPickSectionProps {
  data: FirstPickAnalysis;
  benchmarks?: FirstPickBenchmarks;
  defaultOpen?: boolean;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as { teamName: string; firstPickWinRate: number; totalFirstPicks: number };
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.teamName}</p>
        <p>First Pick Win Rate: {item.firstPickWinRate.toFixed(1)}%</p>
        <p className="text-xs text-base-content/60">{item.totalFirstPicks} first picks</p>
      </div>
    );
  }
  return null;
};

export const FirstPickSection: React.FC<FirstPickSectionProps> = ({ data, benchmarks: bm, defaultOpen }) => {
  const summary = getFirstPickSummary(data);

  return (
    <AnalysisSectionWrapper
      summary={summary}
      icon={<Crosshair size={20} className="text-primary" />}
      title="First Pick Determines Fight Outcomes"
      researchContext="Research says the team that gets the first kill wins ~75% of teamfights. In 5v5, losing one player is a 20% reduction in team power."
      defaultOpen={defaultOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="First Pick Win Rate"
          value={`${data.firstPickWinRate.toFixed(1)}%`}
          description={`${data.firstPickWins} of ${data.fightsWithFirstPick} fights`}
        />
        <StatCard
          title="Research Benchmark"
          value={`${data.researchBenchmark}%`}
          description="Competitive average"
        />
        <StatCard
          title="Total Fights Analyzed"
          value={data.totalFights.toString()}
          description={`${data.fightsWithFirstPick} had a first pick`}
        />
      </div>

      {bm && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">How You Compare (First Pick Win Rate)</h4>
          <BenchmarkComparison
            position={bm.getTeamPosition(data.firstPickWinRate / 100)}
            distribution={bm.teamOverall}
            label="Your first pick win rate vs community"
            formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      )}

      {data.perTeamRates.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">First Pick Conversion Rate by Team</h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.perTeamRates}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} style={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="teamName" width={120} style={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={75} stroke="oklch(var(--p))" strokeDasharray="3 3" label={{ value: '75% benchmark', position: 'top', fontSize: 11 }} />
                <Bar dataKey="firstPickWinRate" radius={[0, 4, 4, 0]}>
                  {data.perTeamRates.map((entry, index) => (
                    <Cell
                      key={index}
                      className={entry.firstPickWinRate >= 75 ? 'fill-success' : entry.firstPickWinRate >= 60 ? 'fill-warning' : 'fill-error'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </AnalysisSectionWrapper>
  );
};
