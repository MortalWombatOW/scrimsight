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
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from 'recharts';
import { UltEconomyAnalysis, FightTypeWinRate, UltDifferentialWinRate, HeroUltEffectiveness, getUltEconomySummary } from '../../domain/analysis';
import { PlayerUltMetrics, RoleUltSummary } from '../../domain/economy';
import { AnalysisSectionWrapper } from './AnalysisSectionWrapper';
import { BenchmarkComparison } from './BenchmarkComparison';
import { UltEconomyBenchmarks } from '../../hooks/useBenchmarks';

interface UltEconomySectionProps {
  data: UltEconomyAnalysis;
  playerMetrics: PlayerUltMetrics[];
  roleDistributions?: RoleUltSummary[];
  benchmarks?: UltEconomyBenchmarks;
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

const ROLE_COLORS: Record<string, string> = {
  tank: 'oklch(0.7 0.15 250)',
  damage: 'oklch(0.7 0.15 25)',
  support: 'oklch(0.7 0.15 145)',
};

function getDiffColor(wr: number): string {
  if (wr >= 65) return '#10b981';
  if (wr >= 50) return '#22c55e';
  if (wr >= 40) return '#f59e0b';
  return '#ef4444';
}

const UltDiffTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as UltDifferentialWinRate;
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">Ult Differential: {item.differential > 0 ? `+${item.differential}` : item.differential}</p>
        <p>Win Rate: {item.winRate.toFixed(1)}%</p>
        <p className="text-xs text-base-content/60">{item.totalFights} fights</p>
      </div>
    );
  }
  return null;
};

const HeroUltTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as HeroUltEffectiveness;
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold">{item.hero}</p>
        <p>Fight Win Rate: {item.fightWinRate.toFixed(1)}%</p>
        <p className="text-xs text-base-content/60">{item.totalFightsWithUlt} fights with ult</p>
      </div>
    );
  }
  return null;
};

export const UltEconomySection: React.FC<UltEconomySectionProps> = ({ data, playerMetrics, roleDistributions, benchmarks: bm, defaultOpen }) => {
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
        <StatCard
          title="Avg Ult Differential"
          value={data.avgUltDifferential >= 0 ? `+${data.avgUltDifferential.toFixed(1)}` : data.avgUltDifferential.toFixed(1)}
          description="Your ults − opponent ults"
        />
        {bm && (
          <StatCard
            title="Dry Fight Win Rate"
            value={`${(bm.dryFightWinRate * 100).toFixed(1)}%`}
            description="Community benchmark"
          />
        )}
      </div>

      {bm && playerMetrics.length > 0 && (() => {
        const avgCharge = playerMetrics.reduce((s, pm) => s + pm.avgTimeToCharge, 0) / playerMetrics.length;
        return (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-base-content/70 mb-2">How You Compare (Ult Charge Time)</h4>
            <BenchmarkComparison
              position={bm.getChargePosition(avgCharge)}
              distribution={bm.chargeTimeOverall}
              label="Average charge time vs community"
              lowerIsBetter
              formatValue={(v) => `${Math.floor(v / 60)}m ${Math.floor(v % 60)}s`}
            />
          </div>
        );
      })()}

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

      {data.ultDifferentialWinRates.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-base-content/70 mb-2">Fight Win Rate by Ult Differential</h4>
          <p className="text-xs text-base-content/50 mb-2">
            Win rate based on how many more (or fewer) ults your team uses vs the opponent. The strongest predictor of fight outcomes.
          </p>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.ultDifferentialWinRates.filter(d => d.totalFights >= 3)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis
                  dataKey="differential"
                  style={{ fontSize: 12 }}
                  tickFormatter={(v) => v > 0 ? `+${v}` : `${v}`}
                />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} style={{ fontSize: 12 }} />
                <Tooltip content={<UltDiffTooltip />} />
                <ReferenceLine y={50} stroke="oklch(var(--bc)/0.3)" strokeDasharray="3 3" />
                <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                  {data.ultDifferentialWinRates.filter(d => d.totalFights >= 3).map((entry, index) => (
                    <Cell key={index} fill={getDiffColor(entry.winRate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {data.heroUltEffectiveness.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-base-content/70 mb-2">Hero Ult Effectiveness</h4>
            <p className="text-xs text-base-content/50 mb-2">Fight win rate when hero uses their ultimate (min 5 uses)</p>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.heroUltEffectiveness.slice(0, 15)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} style={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="hero" width={100} style={{ fontSize: 11 }} />
                  <Tooltip content={<HeroUltTooltip />} />
                  <ReferenceLine x={50} stroke="oklch(var(--bc)/0.3)" strokeDasharray="3 3" />
                  <Bar dataKey="fightWinRate" radius={[0, 4, 4, 0]}>
                    {data.heroUltEffectiveness.slice(0, 15).map((entry, index) => (
                      <Cell key={index} fill={getDiffColor(entry.fightWinRate)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {roleDistributions && roleDistributions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-base-content/70 mb-2">Role Charge/Hold Summary</h4>
            <div className="space-y-3">
              {roleDistributions.map(rd => (
                <div key={rd.role} className="rounded-lg border border-base-content/10 bg-base-200/30 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ROLE_COLORS[rd.role] }} />
                    <span className="text-sm font-medium capitalize">{rd.role}</span>
                    <span className="text-xs text-base-content/40 ml-auto">{rd.count} cycles</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-base-content/50">Charge Time: </span>
                      <span className="font-medium">{formatTime(rd.medianCharge)}</span>
                      <span className="text-base-content/30 ml-1">(p25: {formatTime(rd.p25Charge)}, p75: {formatTime(rd.p75Charge)})</span>
                    </div>
                    <div>
                      <span className="text-base-content/50">Hold Time: </span>
                      <span className="font-medium">{formatTime(rd.medianHold)}</span>
                      <span className="text-base-content/30 ml-1">(p25: {formatTime(rd.p25Hold)}, p75: {formatTime(rd.p75Hold)})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
