import { useMemo } from 'react';
import { useMatches } from './useRepository';
import { useStats } from './useStats';
import {
  computeFirstPickAnalysis,
  computeUltEconomyAnalysis,
  computeSurvivalAnalysis,
  computeTFWRCorrelation,
  computeStrategyProfile,
  computeTargetFocusAnalysis,
  FirstPickAnalysis,
  UltEconomyAnalysis,
  SurvivalAnalysis,
  TFWRCorrelation,
  StrategyProfile,
  TargetFocusAnalysis,
} from '../domain/analysis';

export interface DetailedAnalysisResult {
  firstPick: FirstPickAnalysis;
  ultEconomy: UltEconomyAnalysis;
  survival: SurvivalAnalysis;
  tfwr: TFWRCorrelation;
  strategyProfile: StrategyProfile;
  targetFocus: TargetFocusAnalysis;
  totalMatches: number;
  totalFights: number;
  hasData: boolean;
}

const EMPTY_RESULT: DetailedAnalysisResult = {
  firstPick: {
    totalFights: 0, fightsWithFirstPick: 0, firstPickWins: 0,
    firstPickWinRate: 0, researchBenchmark: 75, perTeamRates: [],
  },
  ultEconomy: {
    winRateByFightType: [], fightTypeDistribution: [],
    ultEfficiency: { avgUltsPerWin: 0, avgUltsPerLoss: 0, totalFightsAnalyzed: 0 },
  },
  survival: {
    players: [], benchmarks: { excellent: 5, good: 6, average: 7.5, poor: 8 },
    quartiles: { q25: 0, q50: 0, q75: 0 }, distributionBuckets: [],
  },
  tfwr: {
    dataPoints: [], winRateAboveBenchmark: 0, winRateBelowBenchmark: 0, benchmark: 55,
  },
  strategyProfile: {
    overallDistribution: [], winnerDistribution: [], loserDistribution: [],
  },
  targetFocus: { perTeam: [], datasetAverage: 0 },
  totalMatches: 0,
  totalFights: 0,
  hasData: false,
};

export function useDetailedAnalysis(): DetailedAnalysisResult {
  const matches = useMatches();
  const allStats = useStats();

  return useMemo(() => {
    if (matches.length === 0) return EMPTY_RESULT;

    const allFights = matches.flatMap(m => m.teamfights);

    return {
      firstPick: computeFirstPickAnalysis(allFights),
      ultEconomy: computeUltEconomyAnalysis(allFights),
      survival: computeSurvivalAnalysis(allStats, matches),
      tfwr: computeTFWRCorrelation(allFights, matches),
      strategyProfile: computeStrategyProfile(allFights),
      targetFocus: computeTargetFocusAnalysis(allStats),
      totalMatches: matches.length,
      totalFights: allFights.length,
      hasData: true,
    };
  }, [matches, allStats]);
}
