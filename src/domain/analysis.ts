/**
 * Detailed Analysis — Pure computation functions
 *
 * Each function takes raw domain data (teamfights, stats, matches) and returns
 * structured analysis results. These power the /analysis "data science report" page,
 * which presents research-backed hypotheses validated by the user's own dataset.
 */

import { Teamfight, ProcessedMatch } from '../types/domain';
import { PlayerStatsBase } from '../types/stats';

// ============================================================================
// Section Summary (for progressive disclosure)
// ============================================================================

export interface SectionSummary {
  /** Unique key for the section */
  id: string;
  /** The hero stat value shown in collapsed view (e.g., "72%") */
  heroStat: string;
  /** Label for the hero stat (e.g., "first-pick win rate") */
  heroLabel: string;
  /** One-sentence insight */
  insight: string;
  /** How notable this finding is (for ranking in executive summary) */
  notability: 'high' | 'medium' | 'low';
  /** Short finding for the executive summary (e.g., "First pick wins 72% of fights — above the 75% benchmark") */
  finding: string;
}

export interface KeyFindings {
  findings: SectionSummary[];
  topFindings: SectionSummary[];
}

// ============================================================================
// Result Types
// ============================================================================

export interface FirstPickAnalysis {
  totalFights: number;
  fightsWithFirstPick: number;
  firstPickWins: number;
  firstPickWinRate: number;
  researchBenchmark: number;
  perTeamRates: Array<{
    teamName: string;
    firstPickWinRate: number;
    totalFirstPicks: number;
  }>;
}

export interface FightTypeWinRate {
  type: 'dry' | 'ult-invested' | 'all-in' | 'stagger';
  label: string;
  totalFights: number;
  fightsWithWinner: number;
  winnerWinRate: number;
}

export interface UltEconomyAnalysis {
  winRateByFightType: FightTypeWinRate[];
  ultEfficiency: {
    avgUltsPerWin: number;
    avgUltsPerLoss: number;
    totalFightsAnalyzed: number;
  };
  fightTypeDistribution: Array<{
    type: string;
    label: string;
    count: number;
    percentage: number;
  }>;
}

export interface SurvivalPlayerData {
  playerName: string;
  playerRole: string;
  playerTeam: string;
  deathsPer10: number;
  totalPlaytime: number;
  totalDeaths: number;
  winRate: number;
}

export interface SurvivalAnalysis {
  players: SurvivalPlayerData[];
  benchmarks: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  quartiles: {
    q25: number;
    q50: number;
    q75: number;
  };
  distributionBuckets: Array<{
    range: string;
    min: number;
    max: number;
    count: number;
  }>;
}

export interface TFWRDataPoint {
  teamName: string;
  matchId: string;
  mapName: string;
  tfwr: number;
  matchWon: boolean;
}

export interface TFWRCorrelation {
  dataPoints: TFWRDataPoint[];
  winRateAboveBenchmark: number;
  winRateBelowBenchmark: number;
  benchmark: number;
}

export interface StrategyProfile {
  overallDistribution: Array<{
    type: string;
    label: string;
    count: number;
    percentage: number;
  }>;
  winnerDistribution: Array<{
    type: string;
    label: string;
    count: number;
    percentage: number;
  }>;
  loserDistribution: Array<{
    type: string;
    label: string;
    count: number;
    percentage: number;
  }>;
}

export interface TeamFocusData {
  teamName: string;
  totalFinalBlows: number;
  totalEliminations: number;
  fbRatio: number;
}

export interface TargetFocusAnalysis {
  perTeam: TeamFocusData[];
  datasetAverage: number;
}

// ============================================================================
// Helper
// ============================================================================

const FIGHT_TYPE_LABELS: Record<string, string> = {
  'dry': 'Dry (No Ults)',
  'ult-invested': 'Ult-Invested (1-3)',
  'all-in': 'All-In (4+)',
  'stagger': 'Stagger',
};

function computeQuartiles(values: number[]): { q25: number; q50: number; q75: number } {
  if (values.length === 0) return { q25: 0, q50: 0, q75: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const q = (p: number) => {
    const pos = (sorted.length - 1) * p;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
  };
  return { q25: q(0.25), q50: q(0.5), q75: q(0.75) };
}

// ============================================================================
// 1. First Pick Analysis
// ============================================================================

export function computeFirstPickAnalysis(fights: Teamfight[]): FirstPickAnalysis {
  const decidedFights = fights.filter(f => f.firstPick !== null && f.winner !== null);
  const firstPickWins = decidedFights.filter(f => f.firstPick!.team === f.winner).length;

  // Per-team breakdown
  const teamMap = new Map<string, { wins: number; total: number }>();
  for (const fight of decidedFights) {
    const fpTeam = fight.firstPick!.team;
    const entry = teamMap.get(fpTeam) || { wins: 0, total: 0 };
    entry.total++;
    if (fight.winner === fpTeam) entry.wins++;
    teamMap.set(fpTeam, entry);
  }

  const perTeamRates = Array.from(teamMap.entries())
    .map(([teamName, { wins, total }]) => ({
      teamName,
      firstPickWinRate: total > 0 ? (wins / total) * 100 : 0,
      totalFirstPicks: total,
    }))
    .sort((a, b) => b.firstPickWinRate - a.firstPickWinRate);

  return {
    totalFights: fights.length,
    fightsWithFirstPick: decidedFights.length,
    firstPickWins,
    firstPickWinRate: decidedFights.length > 0 ? (firstPickWins / decidedFights.length) * 100 : 0,
    researchBenchmark: 75,
    perTeamRates,
  };
}

export function getFirstPickInsight(analysis: FirstPickAnalysis): string {
  const { firstPickWinRate, fightsWithFirstPick } = analysis;
  if (fightsWithFirstPick < 10) return 'Not enough data to draw conclusions yet.';
  if (firstPickWinRate >= 78) return 'First pick is even more decisive in your dataset than competitive benchmarks suggest.';
  if (firstPickWinRate >= 70) return 'Your data closely matches competitive research — first pick is king.';
  if (firstPickWinRate >= 60) return 'First pick matters, but your teams show resilience when trading down.';
  return 'First pick has less impact than expected — fights are decided by other factors.';
}

// ============================================================================
// 2. Ultimate Economy Analysis
// ============================================================================

export function computeUltEconomyAnalysis(fights: Teamfight[]): UltEconomyAnalysis {
  const types: Array<'dry' | 'ult-invested' | 'all-in' | 'stagger'> = ['dry', 'ult-invested', 'all-in', 'stagger'];

  // Win rate by fight type
  const winRateByFightType: FightTypeWinRate[] = types.map(type => {
    const typeFights = fights.filter(f => f.type === type);
    const withWinner = typeFights.filter(f => f.winner !== null);
    return {
      type,
      label: FIGHT_TYPE_LABELS[type],
      totalFights: typeFights.length,
      fightsWithWinner: withWinner.length,
      // Win rate from the perspective of the team with more kills (natural winner)
      // Since we can't pick a "team" globally, show the percentage that have a decisive winner
      winnerWinRate: withWinner.length > 0 ? (withWinner.length / typeFights.length) * 100 : 0,
    };
  });

  // Ult efficiency: avg ults used by winning team vs losing team
  let totalWinnerUlts = 0;
  let totalLoserUlts = 0;
  let analyzedFights = 0;

  for (const fight of fights) {
    if (!fight.winner) continue;
    const winnerIsTeam1 = fight.winner === fight.team1Name;
    const winnerUlts = winnerIsTeam1 ? fight.team1UltsUsed.length : fight.team2UltsUsed.length;
    const loserUlts = winnerIsTeam1 ? fight.team2UltsUsed.length : fight.team1UltsUsed.length;
    totalWinnerUlts += winnerUlts;
    totalLoserUlts += loserUlts;
    analyzedFights++;
  }

  // Fight type distribution
  const fightTypeDistribution = types.map(type => {
    const count = fights.filter(f => f.type === type).length;
    return {
      type,
      label: FIGHT_TYPE_LABELS[type],
      count,
      percentage: fights.length > 0 ? (count / fights.length) * 100 : 0,
    };
  });

  return {
    winRateByFightType,
    ultEfficiency: {
      avgUltsPerWin: analyzedFights > 0 ? totalWinnerUlts / analyzedFights : 0,
      avgUltsPerLoss: analyzedFights > 0 ? totalLoserUlts / analyzedFights : 0,
      totalFightsAnalyzed: analyzedFights,
    },
    fightTypeDistribution,
  };
}

export function getUltEconomyInsight(analysis: UltEconomyAnalysis): string {
  const { ultEfficiency } = analysis;
  if (ultEfficiency.totalFightsAnalyzed < 10) return 'Not enough data to draw conclusions yet.';
  const diff = ultEfficiency.avgUltsPerLoss - ultEfficiency.avgUltsPerWin;
  if (diff > 0.5) return `Losing teams use ${diff.toFixed(1)} more ults per fight on average — classic over-investment pattern.`;
  if (diff > 0.2) return 'Slight ult over-investment in losses, suggesting resource discipline could improve.';
  if (diff < -0.2) return 'Winning teams use more ults — your dataset rewards aggressive ult usage.';
  return 'Ult usage is similar between wins and losses — fights are decided by execution, not resources.';
}

// ============================================================================
// 3. Survival Analysis
// ============================================================================

export function computeSurvivalAnalysis(
  stats: PlayerStatsBase[],
  matches: ProcessedMatch[],
): SurvivalAnalysis {
  // Build match result lookup: matchId -> winner team name
  const matchWinners = new Map<string, string | null>();
  for (const match of matches) {
    matchWinners.set(match.metadata.matchId, match.metadata.winner);
  }

  // Aggregate stats per player (sum across all rows)
  const playerAgg = new Map<string, {
    deaths: number; playtime: number; role: string; team: string;
    matchResults: Array<{ matchId: string; team: string }>;
  }>();

  for (const stat of stats) {
    const existing = playerAgg.get(stat.playerName);
    if (!existing) {
      playerAgg.set(stat.playerName, {
        deaths: stat.deaths,
        playtime: stat.playtime,
        role: stat.playerRole,
        team: stat.playerTeam,
        matchResults: [{ matchId: stat.matchId, team: stat.playerTeam }],
      });
    } else {
      existing.deaths += stat.deaths;
      existing.playtime += stat.playtime;
      // Track all match appearances for win rate
      if (!existing.matchResults.some(mr => mr.matchId === stat.matchId)) {
        existing.matchResults.push({ matchId: stat.matchId, team: stat.playerTeam });
      }
      // Use most-played role/team
      if (stat.playtime > 0) {
        existing.role = stat.playerRole;
        existing.team = stat.playerTeam;
      }
    }
  }

  const players: SurvivalPlayerData[] = [];
  for (const [playerName, agg] of playerAgg) {
    if (agg.playtime <= 0) continue;
    const deathsPer10 = (agg.deaths / agg.playtime) * 600;

    // Compute win rate from match results
    let wins = 0;
    for (const { matchId, team } of agg.matchResults) {
      if (matchWinners.get(matchId) === team) wins++;
    }
    const winRate = agg.matchResults.length > 0 ? (wins / agg.matchResults.length) * 100 : 0;

    players.push({
      playerName,
      playerRole: agg.role,
      playerTeam: agg.team,
      deathsPer10,
      totalPlaytime: agg.playtime,
      totalDeaths: agg.deaths,
      winRate,
    });
  }

  const deathRates = players.map(p => p.deathsPer10);
  const quartiles = computeQuartiles(deathRates);

  // Build histogram buckets
  const bucketDefs = [
    { range: '0-3', min: 0, max: 3 },
    { range: '3-4', min: 3, max: 4 },
    { range: '4-5', min: 4, max: 5 },
    { range: '5-6', min: 5, max: 6 },
    { range: '6-7', min: 6, max: 7 },
    { range: '7-8', min: 7, max: 8 },
    { range: '8-9', min: 8, max: 9 },
    { range: '9+', min: 9, max: Infinity },
  ];
  const distributionBuckets = bucketDefs.map(b => ({
    ...b,
    count: players.filter(p => p.deathsPer10 >= b.min && p.deathsPer10 < b.max).length,
  }));

  return {
    players,
    benchmarks: { excellent: 5, good: 6, average: 7.5, poor: 8 },
    quartiles,
    distributionBuckets,
  };
}

export function getSurvivalInsight(analysis: SurvivalAnalysis): string {
  if (analysis.players.length < 5) return 'Not enough players to draw conclusions yet.';
  const { q50 } = analysis.quartiles;
  if (q50 < 5) return 'Your player pool has excellent survival — median deaths/10 is below competitive benchmarks.';
  if (q50 < 6) return 'Solid survival rates across the board — most players are in the competitive range.';
  if (q50 < 7.5) return 'Average survival — reducing deaths would be the highest-leverage improvement for most players.';
  return 'High death rates across the dataset — survival is likely the biggest barrier to improvement.';
}

// ============================================================================
// 4. Teamfight Win Rate Correlation
// ============================================================================

export function computeTFWRCorrelation(
  fights: Teamfight[],
  matches: ProcessedMatch[],
): TFWRCorrelation {
  const BENCHMARK = 55;

  // Group fights by matchId, then compute TFWR per team per match
  const fightsByMatch = new Map<string, Teamfight[]>();
  for (const fight of fights) {
    const arr = fightsByMatch.get(fight.matchId) || [];
    arr.push(fight);
    fightsByMatch.set(fight.matchId, arr);
  }

  const dataPoints: TFWRDataPoint[] = [];

  for (const match of matches) {
    const { matchId, team1Name, team2Name, winner, map: mapName } = match.metadata;
    const matchFights = fightsByMatch.get(matchId) || [];
    const decidedFights = matchFights.filter(f => f.winner !== null);
    if (decidedFights.length === 0) continue;

    for (const teamName of [team1Name, team2Name]) {
      const teamWins = decidedFights.filter(f => f.winner === teamName).length;
      const tfwr = (teamWins / decidedFights.length) * 100;
      dataPoints.push({
        teamName,
        matchId,
        mapName,
        tfwr,
        matchWon: winner === teamName,
      });
    }
  }

  const aboveBenchmark = dataPoints.filter(d => d.tfwr >= BENCHMARK);
  const belowBenchmark = dataPoints.filter(d => d.tfwr < BENCHMARK);

  return {
    dataPoints,
    winRateAboveBenchmark: aboveBenchmark.length > 0
      ? (aboveBenchmark.filter(d => d.matchWon).length / aboveBenchmark.length) * 100
      : 0,
    winRateBelowBenchmark: belowBenchmark.length > 0
      ? (belowBenchmark.filter(d => d.matchWon).length / belowBenchmark.length) * 100
      : 0,
    benchmark: BENCHMARK,
  };
}

export function getTFWRInsight(analysis: TFWRCorrelation): string {
  if (analysis.dataPoints.length < 10) return 'Not enough data to draw conclusions yet.';
  const gap = analysis.winRateAboveBenchmark - analysis.winRateBelowBenchmark;
  if (gap > 50) return 'Teamfight win rate is a very strong predictor of map wins in your dataset.';
  if (gap > 30) return 'Winning more fights clearly translates to winning more maps.';
  if (gap > 10) return 'Fight win rate correlates with map wins, but other factors also matter.';
  return 'Surprisingly, fight win rate alone doesn\'t predict map outcomes well here — macro play may dominate.';
}

// ============================================================================
// 5. Strategy Profile (Fight Type Distribution)
// ============================================================================

export function computeStrategyProfile(fights: Teamfight[]): StrategyProfile {
  const types = ['dry', 'ult-invested', 'all-in', 'stagger'] as const;

  const buildDistribution = (subset: Teamfight[]) =>
    types.map(type => {
      const count = subset.filter(f => f.type === type).length;
      return {
        type,
        label: FIGHT_TYPE_LABELS[type],
        count,
        percentage: subset.length > 0 ? (count / subset.length) * 100 : 0,
      };
    });

  // For winner/loser distributions, duplicate each fight for both teams
  const winnerFights: Teamfight[] = [];
  const loserFights: Teamfight[] = [];
  for (const fight of fights) {
    if (fight.winner) {
      winnerFights.push(fight);
      loserFights.push(fight);
    }
  }

  return {
    overallDistribution: buildDistribution(fights),
    winnerDistribution: buildDistribution(winnerFights),
    loserDistribution: buildDistribution(loserFights),
  };
}

export function getStrategyInsight(profile: StrategyProfile): string {
  if (profile.overallDistribution.every(d => d.count === 0)) return 'No fight data available.';
  const dryPct = profile.overallDistribution.find(d => d.type === 'dry')?.percentage ?? 0;
  const allInPct = profile.overallDistribution.find(d => d.type === 'all-in')?.percentage ?? 0;
  if (dryPct > 40) return 'High proportion of dry fights — teams are frequently engaging without ultimates.';
  if (allInPct > 30) return 'Many all-in fights — teams tend to commit heavy resources to engagements.';
  return 'Balanced fight type distribution — teams vary their resource investment across engagements.';
}

// ============================================================================
// 6. Target Focus Analysis
// ============================================================================

export function computeTargetFocusAnalysis(stats: PlayerStatsBase[]): TargetFocusAnalysis {
  // Aggregate final blows and eliminations per team
  const teamAgg = new Map<string, { finalBlows: number; eliminations: number }>();

  for (const stat of stats) {
    const existing = teamAgg.get(stat.playerTeam) || { finalBlows: 0, eliminations: 0 };
    existing.finalBlows += stat.finalBlows;
    existing.eliminations += stat.eliminations;
    teamAgg.set(stat.playerTeam, existing);
  }

  const perTeam: TeamFocusData[] = Array.from(teamAgg.entries())
    .map(([teamName, { finalBlows, eliminations }]) => ({
      teamName,
      totalFinalBlows: finalBlows,
      totalEliminations: eliminations,
      fbRatio: eliminations > 0 ? finalBlows / eliminations : 0,
    }))
    .sort((a, b) => b.fbRatio - a.fbRatio);

  const totalFB = perTeam.reduce((sum, t) => sum + t.totalFinalBlows, 0);
  const totalElims = perTeam.reduce((sum, t) => sum + t.totalEliminations, 0);
  const datasetAverage = totalElims > 0 ? totalFB / totalElims : 0;

  return { perTeam, datasetAverage };
}

export function getTargetFocusInsight(analysis: TargetFocusAnalysis): string {
  if (analysis.perTeam.length < 2) return 'Not enough teams to compare.';
  const { datasetAverage } = analysis;
  if (datasetAverage > 0.45) return 'High focus fire across the dataset — teams are coordinating well on target selection.';
  if (datasetAverage > 0.35) return 'Average coordination — there\'s room for improvement in target prioritization.';
  return 'Low FB/E ratio suggests distributed damage — teams may benefit from calling targets more clearly.';
}

// ============================================================================
// Section Summaries (for progressive disclosure)
// ============================================================================

export function getFirstPickSummary(data: FirstPickAnalysis): SectionSummary {
  const deviation = Math.abs(data.firstPickWinRate - data.researchBenchmark);
  const direction = data.firstPickWinRate >= data.researchBenchmark ? 'above' : 'below';
  return {
    id: 'first-pick',
    heroStat: `${data.firstPickWinRate.toFixed(0)}%`,
    heroLabel: 'first-pick win rate',
    insight: getFirstPickInsight(data),
    notability: deviation > 10 ? 'high' : deviation > 5 ? 'medium' : 'low',
    finding: `First pick wins ${data.firstPickWinRate.toFixed(0)}% of fights — ${deviation.toFixed(0)}% ${direction} the ${data.researchBenchmark}% benchmark`,
  };
}

export function getUltEconomySummary(data: UltEconomyAnalysis): SectionSummary {
  const diff = data.ultEfficiency.avgUltsPerLoss - data.ultEfficiency.avgUltsPerWin;
  return {
    id: 'ult-economy',
    heroStat: diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1),
    heroLabel: 'more ults used in losses',
    insight: getUltEconomyInsight(data),
    notability: Math.abs(diff) > 0.5 ? 'high' : Math.abs(diff) > 0.2 ? 'medium' : 'low',
    finding: diff > 0
      ? `Losing teams use ${diff.toFixed(1)} more ults per fight — over-investment is costly`
      : 'Ult usage is similar in wins and losses — execution matters more than resources',
  };
}

export function getSurvivalSummary(data: SurvivalAnalysis): SectionSummary {
  const { q50 } = data.quartiles;
  const rating = q50 < 5 ? 'excellent' : q50 < 6 ? 'good' : q50 < 7.5 ? 'average' : 'poor';
  return {
    id: 'survival',
    heroStat: q50.toFixed(1),
    heroLabel: 'median deaths/10',
    insight: getSurvivalInsight(data),
    notability: q50 < 5 || q50 > 7.5 ? 'high' : 'medium',
    finding: `Median deaths/10 is ${q50.toFixed(1)} (${rating}) — ${q50 > 6 ? 'reducing deaths is the top priority' : 'survival rates are competitive'}`,
  };
}

export function getTFWRSummary(data: TFWRCorrelation): SectionSummary {
  const gap = data.winRateAboveBenchmark - data.winRateBelowBenchmark;
  return {
    id: 'tfwr',
    heroStat: `${gap.toFixed(0)}pp`,
    heroLabel: 'map win rate gap',
    insight: getTFWRInsight(data),
    notability: gap > 40 ? 'high' : gap > 20 ? 'medium' : 'low',
    finding: `Teams above ${data.benchmark}% TFWR win maps ${data.winRateAboveBenchmark.toFixed(0)}% of the time vs ${data.winRateBelowBenchmark.toFixed(0)}%`,
  };
}

export function getStrategySummary(data: StrategyProfile): SectionSummary {
  const dominant = [...data.overallDistribution].sort((a, b) => b.percentage - a.percentage)[0];
  return {
    id: 'strategy',
    heroStat: `${dominant?.percentage.toFixed(0) ?? 0}%`,
    heroLabel: dominant?.label.toLowerCase() ?? 'fights',
    insight: getStrategyInsight(data),
    notability: (dominant?.percentage ?? 0) > 50 ? 'high' : 'low',
    finding: `${dominant?.label ?? 'Unknown'} is the dominant fight type at ${dominant?.percentage.toFixed(0) ?? 0}% of all engagements`,
  };
}

export function getTargetFocusSummary(data: TargetFocusAnalysis): SectionSummary {
  const { datasetAverage } = data;
  return {
    id: 'target-focus',
    heroStat: datasetAverage.toFixed(2),
    heroLabel: 'avg FB/E ratio',
    insight: getTargetFocusInsight(data),
    notability: datasetAverage > 0.45 || datasetAverage < 0.3 ? 'high' : 'medium',
    finding: `Dataset-wide FB/E ratio is ${datasetAverage.toFixed(2)} — ${datasetAverage > 0.4 ? 'strong' : datasetAverage > 0.35 ? 'average' : 'weak'} target focus`,
  };
}

export function generateKeyFindings(
  firstPick: FirstPickAnalysis,
  ultEconomy: UltEconomyAnalysis,
  survival: SurvivalAnalysis,
  tfwr: TFWRCorrelation,
  strategy: StrategyProfile,
  targetFocus: TargetFocusAnalysis,
): KeyFindings {
  const all: SectionSummary[] = [
    getFirstPickSummary(firstPick),
    getUltEconomySummary(ultEconomy),
    getSurvivalSummary(survival),
    getTFWRSummary(tfwr),
    getStrategySummary(strategy),
    getTargetFocusSummary(targetFocus),
  ];

  const notabilityOrder = { high: 0, medium: 1, low: 2 };
  const topFindings = [...all]
    .sort((a, b) => notabilityOrder[a.notability] - notabilityOrder[b.notability])
    .slice(0, 3);

  return { findings: all, topFindings };
}
