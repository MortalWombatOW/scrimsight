import React from 'react';
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
import { UltEconomyAnalysis, getUltEconomySummary } from '../../domain/analysis';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';

interface UltEconomySectionProps {
  data: UltEconomyAnalysis;
  defaultOpen?: boolean;
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

const FIGHT_TYPE_COLORS: Record<string, string> = {
  dry: 'fill-info',
  'ult-invested': 'fill-warning',
  'all-in': 'fill-error',
  stagger: 'fill-base-content/30',
};

export const UltEconomySection: React.FC<UltEconomySectionProps> = ({ data, defaultOpen }) => {
  const summary = getUltEconomySummary(data);
  const { ultEfficiency } = data;

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
    </AnalysisSectionWrapper>
  );
};
