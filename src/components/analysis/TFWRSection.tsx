import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Swords } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
  ZAxis,
  Legend,
} from 'recharts';
import { TFWRCorrelation, getTFWRSummary } from '../../domain/analysis';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';
import { BenchmarkComparison } from './BenchmarkComparison';
import { TFWRBenchmarks } from '../../hooks/useBenchmarks';

interface TFWRSectionProps {
  data: TFWRCorrelation;
  benchmarks?: TFWRBenchmarks;
  defaultOpen?: boolean;
}

const ScatterTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as { teamName: string; mapName: string; tfwr: number; matchWon: boolean };
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.teamName}</p>
        <p>{item.mapName}</p>
        <p>TFWR: {item.tfwr.toFixed(1)}%</p>
        <p className={item.matchWon ? 'text-success' : 'text-error'}>
          {item.matchWon ? 'Won' : 'Lost'}
        </p>
      </div>
    );
  }
  return null;
};

export const TFWRSection: React.FC<TFWRSectionProps> = ({ data, benchmarks: bm, defaultOpen }) => {
  const summary = getTFWRSummary(data);

  const wins = data.dataPoints.filter(d => d.matchWon);
  const losses = data.dataPoints.filter(d => !d.matchWon);

  return (
    <AnalysisSectionWrapper
      summary={summary}
      icon={<Swords size={20} className="text-info" />}
      title="Teamfight Win Rate Predicts Map Success"
      researchContext="Teams winning 55%+ of teamfight engagements statistically climb over time. TFWR is a more reliable metric than map win rate due to larger sample size."
      defaultOpen={defaultOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title={`Map Win Rate (TFWR ≥${data.benchmark}%)`}
          value={`${data.winRateAboveBenchmark.toFixed(1)}%`}
          description="When winning most fights"
        />
        <StatCard
          title={`Map Win Rate (TFWR <${data.benchmark}%)`}
          value={`${data.winRateBelowBenchmark.toFixed(1)}%`}
          description="When losing most fights"
        />
        <StatCard
          title="Data Points"
          value={data.dataPoints.length.toString()}
          description="Team-match observations"
        />
      </div>

      {bm && data.dataPoints.length > 0 && (() => {
        const avgTfwr = data.dataPoints.reduce((s, d) => s + d.tfwr, 0) / data.dataPoints.length / 100;
        return (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-base-content/70 mb-2">How You Compare (Teamfight Win Rate)</h4>
            <BenchmarkComparison
              position={bm.getTeamPosition(avgTfwr)}
              distribution={bm.teamOverall}
              label="Your average TFWR vs community"
              formatValue={(v) => `${(v * 100).toFixed(0)}%`}
            />
          </div>
        );
      })()}

      <div>
        <h4 className="text-sm font-semibold text-base-content/70 mb-2">TFWR vs Match Outcome</h4>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                type="number"
                dataKey="tfwr"
                name="TFWR"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                style={{ fontSize: 12 }}
              />
              <YAxis type="number" dataKey="tfwr" hide />
              <ZAxis range={[50, 50]} />
              <Tooltip content={<ScatterTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine
                x={55}
                stroke="oklch(var(--p))"
                strokeDasharray="3 3"
                label={{ value: '55% benchmark', position: 'top', fontSize: 11 }}
              />
              <Scatter name="Map Win" data={wins} fill="oklch(var(--su))" />
              <Scatter name="Map Loss" data={losses} fill="oklch(var(--er))" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnalysisSectionWrapper>
  );
};
