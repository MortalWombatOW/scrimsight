import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMatches } from '../hooks/useRepository';
import { useTrendData } from '../hooks/useTrendData';
import { useDetailedAnalysis } from '../hooks/useDetailedAnalysis';
import { useBenchmarks } from '../hooks/useBenchmarks';
import { useCompositionAnalysis } from '../hooks/useCompositionAnalysis';
import { useStats } from '../hooks/useStats';
import { useFocus } from '../hooks/useFocus';
import { computeMeanCI, computeTrend } from '../lib/ci';
import { VitalsStrip, VitalMetric } from '../components/pulse/VitalsStrip';
import { SparklineStrip, SparklineMetric } from '../components/pulse/SparklineStrip';
import { PlayerSnapshotTable, PlayerSnapshot } from '../components/pulse/PlayerSnapshotTable';
import { QuickInsights } from '../components/pulse/QuickInsights';
import { ComparisonPair } from '../components/metrics/ComparisonPair';
import ZeroState from '../components/ui/ZeroState';

function PulseContent() {
  const { mode, effectiveTeamName, playerName } = useFocus();
  const { data: trendData } = useTrendData(effectiveTeamName ?? undefined);
  const analysis = useDetailedAnalysis();
  const benchmarks = useBenchmarks();
  const composition = useCompositionAnalysis();
  const allStats = useStats();

  // Compute vitals from trend data
  const vitals = useMemo((): VitalMetric[] => {
    if (trendData.length === 0) return [];

    const tfwrValues = trendData.map(d => d.tfwr);
    const d10Values = trendData.map(d => d.deathsPer10);
    const fpValues = trendData.map(d => d.firstPickRate);

    const latestTfwr = tfwrValues[tfwrValues.length - 1];
    const latestD10 = d10Values[d10Values.length - 1];
    const latestFP = fpValues[fpValues.length - 1];

    // Compute CIs
    const tfwrCI = computeMeanCI(tfwrValues);
    const d10CI = computeMeanCI(d10Values);
    const fpCI = computeMeanCI(fpValues);

    // Compute trends (recent 5 vs prior 5)
    const splitIdx = Math.max(0, tfwrValues.length - 5);
    const tfwrTrend = computeTrend(tfwrValues.slice(splitIdx), tfwrValues.slice(Math.max(0, splitIdx - 5), splitIdx));
    const d10Trend = computeTrend(d10Values.slice(splitIdx), d10Values.slice(Math.max(0, splitIdx - 5), splitIdx));
    const fpTrend = computeTrend(fpValues.slice(splitIdx), fpValues.slice(Math.max(0, splitIdx - 5), splitIdx));

    // Percentiles from benchmarks
    const avgTfwr = tfwrValues.reduce((s, v) => s + v, 0) / tfwrValues.length;
    const avgD10 = d10Values.reduce((s, v) => s + v, 0) / d10Values.length;
    const tfwrPos = benchmarks.tfwr.getTeamPosition(avgTfwr / 100);
    const d10Pos = benchmarks.survival.getTeamPosition(avgD10);

    // Dry fight win rate from analysis
    const dryFights = analysis.ultEconomy.winRateByFightType.find(f => f.type === 'dry');
    const dryWR = dryFights ? dryFights.winnerWinRate * 100 : 50;

    return [
      {
        label: 'Teamfight Win Rate',
        value: latestTfwr,
        ci: tfwrCI,
        trend: { direction: tfwrTrend.direction, delta: tfwrTrend.delta },
        percentile: tfwrPos.percentile,
        format: 'percent',
      },
      {
        label: 'Deaths / 10min',
        value: latestD10,
        ci: d10CI,
        trend: { direction: d10Trend.direction, delta: d10Trend.delta },
        percentile: d10Pos.percentile,
        format: 'per10',
        lowerIsBetter: true,
      },
      {
        label: 'First Pick Rate',
        value: latestFP,
        ci: fpCI,
        trend: { direction: fpTrend.direction, delta: fpTrend.delta },
        format: 'percent',
      },
      {
        label: 'Dry Fight WR',
        value: dryWR,
        format: 'percent',
      },
    ];
  }, [trendData, benchmarks, analysis]);

  // Sparkline data
  const sparklines = useMemo((): SparklineMetric[] => {
    if (trendData.length < 2) return [];
    const last10 = trendData.slice(-10);
    return [
      { label: 'TFWR', data: last10.map(d => d.tfwr), color: '#3b82f6', benchmarkLine: 50 },
      { label: 'D/10', data: last10.map(d => d.deathsPer10), color: '#ef4444' },
      { label: '1st Pick%', data: last10.map(d => d.firstPickRate), color: '#10b981', benchmarkLine: 50 },
      { label: 'Win Rate', data: last10.map(d => d.winRate), color: '#f59e0b', benchmarkLine: 50 },
    ];
  }, [trendData]);

  // Latest scrim info
  const latestScrim = useMemo(() => {
    if (trendData.length === 0) return null;
    const latest = trendData[trendData.length - 1];
    const prior = trendData.slice(0, -1);
    const avgTfwr = prior.length > 0 ? prior.reduce((s, d) => s + d.tfwr, 0) / prior.length : latest.tfwr;
    const avgD10 = prior.length > 0 ? prior.reduce((s, d) => s + d.deathsPer10, 0) / prior.length : latest.deathsPer10;
    return { ...latest, avgTfwr, avgD10 };
  }, [trendData]);

  // Player snapshot data
  const playerSnapshots = useMemo((): PlayerSnapshot[] => {
    if (allStats.length === 0) return [];

    // Group stats by player, compute averages
    const playerMap = new Map<string, {
      role: string;
      d10Values: number[];
      fpRatio: number[];
      playtime: number;
      deaths: number;
    }>();

    for (const stat of allStats) {
      // Only include players from the focused team
      if (effectiveTeamName && stat.playerTeam !== effectiveTeamName) continue;

      const existing = playerMap.get(stat.playerName) || {
        role: stat.playerRole,
        d10Values: [],
        fpRatio: [],
        playtime: 0,
        deaths: 0,
      };

      const d10 = stat.playtime > 0 ? (stat.deaths / stat.playtime) * 600 : 0;
      existing.d10Values.push(d10);
      existing.playtime += stat.playtime;
      existing.deaths += stat.deaths;
      playerMap.set(stat.playerName, existing);
    }

    return Array.from(playerMap.entries())
      .map(([name, data]) => {
        const avgD10 = data.playtime > 0 ? (data.deaths / data.playtime) * 600 : 0;
        const d10CI = computeMeanCI(data.d10Values);
        const d10Pos = benchmarks.survival.getPlayerPosition(avgD10);

        // Trend: last 3 vs prior 3
        const splitIdx = Math.max(0, data.d10Values.length - 3);
        const d10Trend = computeTrend(
          data.d10Values.slice(splitIdx),
          data.d10Values.slice(Math.max(0, splitIdx - 3), splitIdx),
        );

        return {
          name,
          role: data.role,
          metrics: [
            {
              value: avgD10,
              ci: d10CI,
              format: 'per10' as const,
              percentile: d10Pos.percentile,
              lowerIsBetter: true,
            },
          ],
          trend: d10Trend.direction !== 'stable'
            ? { direction: d10Trend.direction, delta: d10Trend.delta }
            : undefined,
        };
      })
      .sort((a, b) => a.role.localeCompare(b.role));
  }, [allStats, effectiveTeamName, benchmarks]);

  // Quick insights
  const quickInsightGroups = useMemo(() => {
    const groups = [];

    // Ult Economy
    const ultEcon = analysis.ultEconomy;
    groups.push({
      title: 'Ult Economy',
      metrics: [
        {
          label: 'Ults / Win',
          value: ultEcon.ultEfficiency.avgUltsPerWin,
          format: 'ratio' as const,
          lowerIsBetter: true,
        },
        {
          label: 'Ults / Loss',
          value: ultEcon.ultEfficiency.avgUltsPerLoss,
          format: 'ratio' as const,
        },
      ],
    });

    // Composition
    if (composition.hasData) {
      groups.push({
        title: 'Composition',
        metrics: [
          {
            label: 'Most Played',
            value: composition.archetypeStats.length > 0
              ? composition.archetypeStats.reduce((best, a) => a.count > best.count ? a : best).winRate * 100
              : 0,
            format: 'percent' as const,
          },
          {
            label: 'Best WR Archetype',
            value: composition.archetypeStats.length > 0
              ? composition.archetypeStats.reduce((best, a) => a.winRate > best.winRate ? a : best).winRate * 100
              : 0,
            format: 'percent' as const,
          },
        ],
      });
    }

    return groups;
  }, [analysis, composition]);

  return (
    <div className="max-w-[960px] mx-auto space-y-6 py-4">
      {/* Header */}
      {effectiveTeamName && (
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-bold">{effectiveTeamName}</h1>
          {mode === 'player' && playerName && (
            <span className="text-sm font-medium text-primary">{playerName}</span>
          )}
          <span className="text-sm text-base-content/40">
            {trendData.length} matches
          </span>
        </div>
      )}

      {/* Section 1: Vitals */}
      {vitals.length > 0 && <VitalsStrip metrics={vitals} />}

      {/* Section 2: Sparklines */}
      {sparklines.length > 0 && <SparklineStrip metrics={sparklines} />}

      {/* Section 3: Focus + Latest Scrim */}
      {latestScrim && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Focus — placeholder until Train page is built */}
          <div className="card-surface rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
              Current Focus
            </h3>
            <p className="text-sm text-base-content/60">
              Set a training focus on the <Link to="/train" className="text-primary hover:underline">Train</Link> page to track progress here.
            </p>
          </div>

          {/* Latest Scrim */}
          <div className="card-surface rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
              Latest Scrim
            </h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm font-medium">vs {latestScrim.opponent}</span>
              <span className="text-xs text-base-content/40">{latestScrim.date}</span>
              <span className={`text-xs font-semibold ${
                latestScrim.result === 'WIN' ? 'text-success' : latestScrim.result === 'LOSS' ? 'text-error' : 'text-base-content/50'
              }`}>
                {latestScrim.result}
              </span>
            </div>
            <div className="space-y-1.5">
              <ComparisonPair
                label="TFWR"
                current={latestScrim.tfwr}
                average={latestScrim.avgTfwr}
                format="percent"
              />
              <ComparisonPair
                label="D/10"
                current={latestScrim.deathsPer10}
                average={latestScrim.avgD10}
                format="per10"
                lowerIsBetter
              />
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Player Snapshot */}
      {playerSnapshots.length > 0 && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
            Player Snapshot
          </h2>
          <PlayerSnapshotTable
            players={playerSnapshots}
            columnHeaders={['D/10']}
            focusedPlayer={mode === 'player' ? playerName ?? undefined : undefined}
          />
        </>
      )}

      {/* Section 5: Quick Insights */}
      {quickInsightGroups.length > 0 && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
            Quick Insights
          </h2>
          <QuickInsights groups={quickInsightGroups} />
        </>
      )}
    </div>
  );
}

export default function PulsePage() {
  const matches = useMatches();

  if (matches.length === 0) {
    return <ZeroState />;
  }

  return <PulseContent />;
}
