import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Focus } from 'lucide-react';
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
import { TargetFocusAnalysis, getTargetFocusSummary } from '../../domain/analysis';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';
import { BenchmarkComparison } from './BenchmarkComparison';
import { TargetFocusBenchmarks } from '../../hooks/useBenchmarks';

interface TargetFocusSectionProps {
  data: TargetFocusAnalysis;
  benchmarks?: TargetFocusBenchmarks;
  defaultOpen?: boolean;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as { teamName: string; fbRatio: number; totalFinalBlows: number; totalEliminations: number };
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.teamName}</p>
        <p>FB/E Ratio: {item.fbRatio.toFixed(3)}</p>
        <p className="text-xs text-base-content/60">{item.totalFinalBlows} final blows / {item.totalEliminations} eliminations</p>
      </div>
    );
  }
  return null;
};

function getRatioColor(ratio: number): string {
  if (ratio >= 0.45) return 'fill-success';
  if (ratio >= 0.35) return 'fill-warning';
  return 'fill-error';
}

export const TargetFocusSection: React.FC<TargetFocusSectionProps> = ({ data, benchmarks: bm, defaultOpen }) => {
  const summary = getTargetFocusSummary(data);
  const topTeam = data.perTeam[0];
  const bottomTeam = data.perTeam[data.perTeam.length - 1];

  return (
    <AnalysisSectionWrapper
      summary={summary}
      icon={<Focus size={20} className="text-accent" />}
      title="Target Focus Indicates Coordination"
      researchContext="The Final Blows / Eliminations ratio measures how well a team concentrates damage on a single target. Higher ratios indicate better focus fire and communication."
      defaultOpen={defaultOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Dataset Average"
          value={data.datasetAverage.toFixed(3)}
          description="FB/E ratio across all teams"
        />
        {topTeam && (
          <StatCard
            title="Highest Focus"
            value={topTeam.fbRatio.toFixed(3)}
            description={topTeam.teamName}
          />
        )}
        {bottomTeam && data.perTeam.length > 1 && (
          <StatCard
            title="Lowest Focus"
            value={bottomTeam.fbRatio.toFixed(3)}
            description={bottomTeam.teamName}
          />
        )}
      </div>

      {bm && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">How You Compare (FB/E Ratio)</h4>
          <BenchmarkComparison
            position={bm.getPlayerPosition(data.datasetAverage)}
            distribution={bm.playerOverall}
            label="Your dataset average vs community"
            formatValue={(v) => v.toFixed(2)}
          />
        </div>
      )}

      {data.perTeam.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">FB/E Ratio by Team</h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.perTeam}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis type="number" domain={[0, 'auto']} style={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="teamName" width={120} style={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  x={data.datasetAverage}
                  stroke="oklch(var(--p))"
                  strokeDasharray="3 3"
                  label={{ value: 'avg', position: 'top', fontSize: 11 }}
                />
                <Bar dataKey="fbRatio" radius={[0, 4, 4, 0]}>
                  {data.perTeam.map((entry, index) => (
                    <Cell key={index} className={getRatioColor(entry.fbRatio)} />
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
