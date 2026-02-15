import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Users } from 'lucide-react';
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
import { CompositionAnalysisResult } from '../../hooks/useCompositionAnalysis';
import { HeroPickRate, ArchetypeStats } from '../../domain/composition';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';
import { SectionSummary } from '../../domain/analysis';
import { benchmarks } from '../../data/benchmarks';

interface CompositionSectionProps {
  data: CompositionAnalysisResult;
  defaultOpen?: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  tank: 'oklch(0.7 0.15 250)',
  damage: 'oklch(0.7 0.15 25)',
  support: 'oklch(0.7 0.15 145)',
};

const ARCHETYPE_COLORS: Record<string, string> = {
  Dive: '#3b82f6',
  Brawl: '#ef4444',
  Poke: '#10b981',
  Mixed: '#9ca3af',
};

const HeroPickTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as HeroPickRate;
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.hero}</p>
        <p>Pick Rate: {item.pickRate.toFixed(1)}%</p>
        <p>Win Rate: {item.winRate.toFixed(1)}%</p>
        <p className="text-xs text-base-content/60">{item.matches} appearances, {item.wins} wins</p>
      </div>
    );
  }
  return null;
};

const ArchetypeTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as ArchetypeStats & { benchmarkWR?: number };
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.archetype}</p>
        <p>Win Rate: {item.winRate.toFixed(1)}%</p>
        {item.benchmarkWR != null && (
          <p className="text-xs text-base-content/60">Community: {item.benchmarkWR.toFixed(1)}%</p>
        )}
        <p className="text-xs text-base-content/60">{item.count} comps, {item.wins} wins</p>
      </div>
    );
  }
  return null;
};

function getCompositionSummary(data: CompositionAnalysisResult): SectionSummary {
  const dominant = data.archetypeStats.sort((a, b) => b.count - a.count)[0];
  return {
    id: 'composition',
    heroStat: dominant ? `${dominant.archetype}` : '—',
    heroLabel: 'most-played archetype',
    insight: data.totalCompsAnalyzed < 10
      ? 'Not enough data to draw conclusions yet.'
      : `${data.mostPlayedArchetype} is the dominant playstyle — ${data.highestWRArchetype} has the highest win rate.`,
    notability: 'medium',
    finding: `${data.totalCompsAnalyzed} compositions analyzed across ${data.heroPickRates.length} heroes`,
  };
}

export const CompositionSection: React.FC<CompositionSectionProps> = ({ data, defaultOpen }) => {
  const summary = getCompositionSummary(data);

  // Merge archetype stats with benchmark data
  const bmArchetypes = benchmarks.concepts.composition_archetypes.archetype_win_rates;
  const archetypeData = data.archetypeStats.map(a => ({
    ...a,
    benchmarkWR: bmArchetypes[a.archetype]?.win_rate,
  }));

  const top15Heroes = data.heroPickRates.slice(0, 15);
  const heroWinRates = data.heroPickRates
    .filter(h => h.matches >= 3)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 15);

  return (
    <AnalysisSectionWrapper
      summary={summary}
      icon={<Users size={20} className="text-violet-500" />}
      title="Composition Analysis"
      researchContext="Team composition affects win probability. Dive, Brawl, and Poke archetypes have distinct strengths — understanding your team's tendencies reveals strategic biases."
      defaultOpen={defaultOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Most Played"
          value={data.mostPlayedArchetype}
          description="Dominant archetype"
        />
        <StatCard
          title="Highest Win Rate"
          value={data.highestWRArchetype}
          description="Best-performing archetype"
        />
        <StatCard
          title="Comps Analyzed"
          value={data.totalCompsAnalyzed.toString()}
          description="Team compositions observed"
        />
      </div>

      {/* Archetype Win Rates */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-base-content/70 mb-2">Archetype Win Rates (Your Data vs Community)</h4>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={archetypeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="archetype" style={{ fontSize: 12 }} />
              <YAxis domain={[0, 60]} tickFormatter={(v) => `${v}%`} style={{ fontSize: 12 }} />
              <Tooltip content={<ArchetypeTooltip />} />
              <Bar dataKey="winRate" name="Your Win Rate" radius={[4, 4, 0, 0]}>
                {archetypeData.map((entry, index) => (
                  <Cell key={index} fill={ARCHETYPE_COLORS[entry.archetype] || '#9ca3af'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 justify-center mt-2 text-xs text-base-content/60">
          {archetypeData.filter(a => a.benchmarkWR != null).map(a => (
            <span key={a.archetype}>
              {a.archetype} community: {a.benchmarkWR?.toFixed(1)}%
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Pick Rates */}
        <div>
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">Hero Pick Rates (Top 15)</h4>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top15Heroes}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis type="number" tickFormatter={(v) => `${v}%`} style={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="hero" width={100} style={{ fontSize: 11 }} />
                <Tooltip content={<HeroPickTooltip />} />
                <Bar dataKey="pickRate" radius={[0, 4, 4, 0]}>
                  {top15Heroes.map((entry, index) => (
                    <Cell key={index} fill={ROLE_COLORS[entry.role] || '#9ca3af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 justify-center mt-2 text-xs text-base-content/60">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: ROLE_COLORS.tank }} /> Tank</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: ROLE_COLORS.damage }} /> Damage</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: ROLE_COLORS.support }} /> Support</span>
          </div>
        </div>

        {/* Hero Win Rates */}
        {heroWinRates.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-base-content/70 mb-2">Hero Win Rates (min 3 matches)</h4>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={heroWinRates}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} style={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="hero" width={100} style={{ fontSize: 11 }} />
                  <Tooltip content={<HeroPickTooltip />} />
                  <ReferenceLine x={50} stroke="oklch(var(--bc)/0.3)" strokeDasharray="3 3" />
                  <Bar dataKey="winRate" radius={[0, 4, 4, 0]}>
                    {heroWinRates.map((entry, index) => (
                      <Cell key={index} fill={entry.winRate >= 50 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </AnalysisSectionWrapper>
  );
};
