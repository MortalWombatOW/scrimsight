import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Shield } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  TooltipProps,
  Cell,
  ZAxis,
  Legend,
} from 'recharts';
import { SurvivalAnalysis, getSurvivalSummary } from '../../domain/analysis';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';

interface SurvivalSectionProps {
  data: SurvivalAnalysis;
  defaultOpen?: boolean;
}

const HistogramTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as { range: string; count: number };
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">Deaths/10: {item.range}</p>
        <p>{item.count} players</p>
      </div>
    );
  }
  return null;
};

const ScatterTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as { playerName: string; deathsPer10: number; winRate: number; playerRole: string };
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.playerName}</p>
        <p>Deaths/10: {item.deathsPer10.toFixed(1)}</p>
        <p>Win Rate: {item.winRate.toFixed(1)}%</p>
        <p className="text-xs text-base-content/60">{item.playerRole}</p>
      </div>
    );
  }
  return null;
};

function getBucketColor(min: number): string {
  if (min < 5) return 'fill-success';
  if (min < 6) return 'fill-success/60';
  if (min < 7.5) return 'fill-warning';
  return 'fill-error';
}

const ROLE_COLORS: Record<string, string> = {
  tank: 'oklch(0.7 0.15 250)',
  damage: 'oklch(0.7 0.15 25)',
  support: 'oklch(0.7 0.15 145)',
};

export const SurvivalSection: React.FC<SurvivalSectionProps> = ({ data, defaultOpen }) => {
  const summary = getSurvivalSummary(data);

  const tankPlayers = data.players.filter(p => p.playerRole.toLowerCase() === 'tank');
  const damagePlayers = data.players.filter(p => p.playerRole.toLowerCase() === 'damage');
  const supportPlayers = data.players.filter(p => p.playerRole.toLowerCase() === 'support');

  return (
    <AnalysisSectionWrapper
      summary={summary}
      icon={<Shield size={20} className="text-success" />}
      title="Survival Correlates with Winning"
      researchContext="Deaths per 10 minutes is the strongest individual correlate with win rate across all roles. Benchmarks: <5 excellent, 5-6 good, 6-7.5 average, >8 poor."
      defaultOpen={defaultOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="25th Percentile"
          value={data.quartiles.q25.toFixed(1)}
          description="Deaths/10 (top performers)"
        />
        <StatCard
          title="Median"
          value={data.quartiles.q50.toFixed(1)}
          description="Deaths/10 (typical player)"
        />
        <StatCard
          title="75th Percentile"
          value={data.quartiles.q75.toFixed(1)}
          description="Deaths/10 (needs improvement)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">Deaths/10 Distribution</h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.distributionBuckets} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="range" style={{ fontSize: 12 }} />
                <YAxis style={{ fontSize: 12 }} />
                <Tooltip content={<HistogramTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.distributionBuckets.map((entry, index) => (
                    <Cell key={index} className={getBucketColor(entry.min)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 justify-center mt-2 text-xs text-base-content/60">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success inline-block" /> Excellent (&lt;5)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning inline-block" /> Average (6-7.5)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-error inline-block" /> Poor (&gt;8)</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">Deaths/10 vs Win Rate (by Role)</h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis type="number" dataKey="deathsPer10" name="Deaths/10" style={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="winRate" name="Win Rate" unit="%" style={{ fontSize: 12 }} />
                <ZAxis range={[40, 40]} />
                <Tooltip content={<ScatterTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {tankPlayers.length > 0 && (
                  <Scatter name="Tank" data={tankPlayers} fill={ROLE_COLORS.tank} />
                )}
                {damagePlayers.length > 0 && (
                  <Scatter name="Damage" data={damagePlayers} fill={ROLE_COLORS.damage} />
                )}
                {supportPlayers.length > 0 && (
                  <Scatter name="Support" data={supportPlayers} fill={ROLE_COLORS.support} />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AnalysisSectionWrapper>
  );
};
