/**
 * Hook providing typed access to community benchmark data.
 *
 * Each accessor returns the relevant benchmark distributions for a section,
 * plus helpers to compute percentile positions for user values.
 */

import { useMemo } from 'react';
import {
  benchmarks,
  computePercentilePosition,
  selectDistribution,
  PercentilePosition,
  PercentileDistribution,
} from '../data/benchmarks';
import { OverwatchRole } from '../lib/hero';

export interface SurvivalBenchmarks {
  teamOverall: PercentileDistribution;
  playerOverall: PercentileDistribution;
  playerByRole: typeof benchmarks.concepts.deaths_per_10.player_distribution.by_role;
  communityBenchmarks: typeof benchmarks.concepts.deaths_per_10.community_benchmarks;
  getTeamPosition: (teamD10: number) => PercentilePosition;
  getPlayerPosition: (playerD10: number, role?: OverwatchRole) => PercentilePosition;
}

export interface FirstPickBenchmarks {
  teamOverall: PercentileDistribution;
  overallRate: number;
  researchRange: [number, number];
  getTeamPosition: (teamFPWR: number) => PercentilePosition;
}

export interface TFWRBenchmarks {
  teamOverall: PercentileDistribution;
  getTeamPosition: (tfwr: number) => PercentilePosition;
}

export interface UltEconomyBenchmarks {
  chargeTimeByRole: typeof benchmarks.concepts.ult_charge_time.player_distribution.by_role;
  chargeTimeOverall: PercentileDistribution;
  holdTimeByRole: typeof benchmarks.concepts.ult_hold_time.player_distribution.by_role;
  holdTimeOverall: PercentileDistribution;
  ultDifferentialWinRates: typeof benchmarks.concepts.fight_win_rate_by_ult_differential.by_differential;
  dryFightWinRate: number;
  getChargePosition: (seconds: number, role?: OverwatchRole) => PercentilePosition;
  getHoldPosition: (seconds: number, role?: OverwatchRole) => PercentilePosition;
}

export interface TargetFocusBenchmarks {
  playerOverall: PercentileDistribution;
  playerByRole: typeof benchmarks.concepts.fb_elim_ratio.player_distribution.by_role;
  getPlayerPosition: (fbRatio: number, role?: OverwatchRole) => PercentilePosition;
}

export interface StrategyBenchmarks {
  dryFightWinRate: number;
}

export interface BenchmarkAccessors {
  survival: SurvivalBenchmarks;
  firstPick: FirstPickBenchmarks;
  tfwr: TFWRBenchmarks;
  ultEconomy: UltEconomyBenchmarks;
  targetFocus: TargetFocusBenchmarks;
  strategy: StrategyBenchmarks;
}

export function useBenchmarks(): BenchmarkAccessors {
  return useMemo(() => {
    const c = benchmarks.concepts;

    const survival: SurvivalBenchmarks = {
      teamOverall: c.deaths_per_10.team_distribution.overall,
      playerOverall: c.deaths_per_10.player_distribution.overall,
      playerByRole: c.deaths_per_10.player_distribution.by_role,
      communityBenchmarks: c.deaths_per_10.community_benchmarks,
      getTeamPosition: (teamD10: number) =>
        computePercentilePosition(teamD10, c.deaths_per_10.team_distribution.overall, true),
      getPlayerPosition: (playerD10: number, role?: OverwatchRole) =>
        computePercentilePosition(
          playerD10,
          selectDistribution(
            c.deaths_per_10.player_distribution.by_role,
            c.deaths_per_10.player_distribution.overall,
            role,
          ),
          true,
        ),
    };

    const firstPick: FirstPickBenchmarks = {
      teamOverall: c.first_pick_win_rate.team_distribution.overall,
      overallRate: c.first_pick_win_rate.overall.rate,
      researchRange: c.first_pick_win_rate.research_benchmark.claimed_range,
      getTeamPosition: (teamFPWR: number) =>
        computePercentilePosition(teamFPWR, c.first_pick_win_rate.team_distribution.overall),
    };

    const tfwr: TFWRBenchmarks = {
      teamOverall: c.team_fight_win_rate.team_distribution.overall,
      getTeamPosition: (tfwrVal: number) =>
        computePercentilePosition(tfwrVal, c.team_fight_win_rate.team_distribution.overall),
    };

    const ultEconomy: UltEconomyBenchmarks = {
      chargeTimeByRole: c.ult_charge_time.player_distribution.by_role,
      chargeTimeOverall: c.ult_charge_time.player_distribution.overall,
      holdTimeByRole: c.ult_hold_time.player_distribution.by_role,
      holdTimeOverall: c.ult_hold_time.player_distribution.overall,
      ultDifferentialWinRates: c.fight_win_rate_by_ult_differential.by_differential,
      dryFightWinRate: c.dry_fight_win_rate.overall_rate,
      getChargePosition: (seconds: number, role?: OverwatchRole) =>
        computePercentilePosition(
          seconds,
          selectDistribution(
            c.ult_charge_time.player_distribution.by_role,
            c.ult_charge_time.player_distribution.overall,
            role,
          ),
          true,
        ),
      getHoldPosition: (seconds: number, role?: OverwatchRole) =>
        computePercentilePosition(
          seconds,
          selectDistribution(
            c.ult_hold_time.player_distribution.by_role,
            c.ult_hold_time.player_distribution.overall,
            role,
          ),
          true,
        ),
    };

    const targetFocus: TargetFocusBenchmarks = {
      playerOverall: c.fb_elim_ratio.player_distribution.overall,
      playerByRole: c.fb_elim_ratio.player_distribution.by_role,
      getPlayerPosition: (fbRatio: number, role?: OverwatchRole) =>
        computePercentilePosition(
          fbRatio,
          selectDistribution(
            c.fb_elim_ratio.player_distribution.by_role,
            c.fb_elim_ratio.player_distribution.overall,
            role,
          ),
        ),
    };

    const strategy: StrategyBenchmarks = {
      dryFightWinRate: c.dry_fight_win_rate.overall_rate,
    };

    return { survival, firstPick, tfwr, ultEconomy, targetFocus, strategy };
  }, []);
}
