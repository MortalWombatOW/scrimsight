import React from 'react';
import { Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from 'recharts';
import { StrategyProfile, getStrategySummary } from '../../domain/analysis';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';
import { StrategyBenchmarks } from '../../hooks/useBenchmarks';

interface StrategyProfileSectionProps {
  data: StrategyProfile;
  benchmarks?: StrategyBenchmarks;
  defaultOpen?: boolean;
}

function buildComparisonData(profile: StrategyProfile) {
  return profile.overallDistribution.map(d => {
    const winner = profile.winnerDistribution.find(w => w.type === d.type);
    const loser = profile.loserDistribution.find(l => l.type === d.type);
    return {
      label: d.label,
      type: d.type,
      overall: d.percentage,
      winnerPct: winner?.percentage ?? 0,
      loserPct: loser?.percentage ?? 0,
      overallCount: d.count,
    };
  });
}

const ComparisonTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const StrategyProfileSection: React.FC<StrategyProfileSectionProps> = ({ data, benchmarks: bm, defaultOpen }) => {
  const summary = getStrategySummary(data);
  const comparisonData = buildComparisonData(data);

  return (
    <AnalysisSectionWrapper
      summary={summary}
      icon={<Target size={20} className="text-secondary" />}
      title="Fight Type Distribution Reveals Strategy"
      researchContext="How teams resource their fights defines their playstyle. The distribution of dry, ult-invested, all-in, and stagger fights reveals strategic tendencies."
      defaultOpen={defaultOpen}
    >
      {bm && (
        <p className="text-sm text-base-content/60 mb-4">
          Community benchmark: dry fight win rate is <span className="font-semibold">{(bm.dryFightWinRate * 100).toFixed(1)}%</span> — winning without ults is the foundation of ult economy.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {data.overallDistribution.map(d => (
          <div key={d.type} className="card-surface rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-base-content">{d.percentage.toFixed(1)}%</div>
            <div className="text-xs text-base-content/60 mt-1">{d.label}</div>
            <div className="text-xs text-base-content/40">{d.count} fights</div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-base-content/70 mb-2">Fight Type: Winners vs Losers</h4>
        <p className="text-xs text-base-content/50 mb-2">
          Compares the fight type distribution when a team wins vs when it loses.
        </p>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="label" style={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v}%`} style={{ fontSize: 12 }} />
              <Tooltip content={<ComparisonTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="winnerPct" name="Winner %" fill="oklch(var(--su))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="loserPct" name="Loser %" fill="oklch(var(--er))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnalysisSectionWrapper>
  );
};
