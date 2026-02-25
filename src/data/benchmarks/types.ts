/**
 * TypeScript interfaces for the training path benchmarks JSON schema.
 * Generated from analysis/outputs/benchmarks/training_path_benchmarks.json
 */

export interface PercentileDistribution {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  n: number;
}

export interface HeroStat {
  median: number;
  mean?: number;
  n: number;
}

export interface HeroFBRatio {
  fb_ratio: number;
  n: number;
}

export interface HeroCritRate {
  crit_rate: number;
  n: number;
}

export interface HeroMeta {
  win_rate: number;
  pick_rate: number;
  n: number;
}

export interface ByRoleDistribution {
  DPS?: PercentileDistribution;
  Support?: PercentileDistribution;
  Tank?: PercentileDistribution;
  Unknown?: PercentileDistribution;
}

export interface WinnerLoserGap {
  winner_mean: number;
  loser_mean: number;
  gap: number;
  cohens_d?: number;
  p_value?: number;
}

export interface WinRateBin {
  win_rate: number;
  n: number;
}

export interface DeathsPer10Concept {
  description: string;
  player_distribution: {
    overall: PercentileDistribution;
    by_role: ByRoleDistribution;
    by_hero: Record<string, HeroStat>;
  };
  team_distribution: {
    overall: PercentileDistribution;
  };
  winner_loser_gap: WinnerLoserGap;
  team_d10_win_rate_bins: Record<string, WinRateBin>;
  community_benchmarks: Record<string, number>;
}

export interface RateWithCI {
  rate: number;
  ci_95?: [number, number];
  n: number;
}

export interface FirstPickWinRateConcept {
  description: string;
  overall: RateWithCI;
  research_benchmark: { claimed_range: [number, number] };
  by_fight_size: Record<string, RateWithCI>;
  fp_win_rate_by_killer_role: Record<string, RateWithCI>;
  team_distribution: { overall: PercentileDistribution };
}

export interface EntryPickRateConcept {
  description: string;
  by_role: Record<string, { count: number; rate: number }>;
  total_fights: number;
}

export interface FirstDeathRateConcept {
  description: string;
  by_role: Record<string, { count: number; rate: number }>;
  total_fights: number;
}

export interface TimeToFirstBloodConcept {
  description: string;
  distribution: PercentileDistribution;
}

export interface UltChargeTimeConcept {
  description: string;
  player_distribution: {
    overall: PercentileDistribution;
    by_role: ByRoleDistribution;
    by_hero: Record<string, { median: number; n: number }>;
  };
}

export interface UltHoldTimeConcept {
  description: string;
  player_distribution: {
    overall: PercentileDistribution;
    by_role: ByRoleDistribution;
  };
}

export interface UltEfficiencyConcept {
  description: string;
  winner_distribution: PercentileDistribution;
  loser_distribution: PercentileDistribution;
  mean_winner_ults: number;
  mean_loser_ults: number;
}

export interface DryFightWinRateConcept {
  description: string;
  overall_rate: number;
  total_dry_fights: number;
}

export interface UltDifferentialEntry {
  win_rate: number;
  n: number;
}

export interface FightWinRateByUltDifferentialConcept {
  description: string;
  by_differential: Record<string, UltDifferentialEntry>;
}

export interface FBElimRatioConcept {
  description: string;
  player_distribution: {
    overall: PercentileDistribution;
    by_role: ByRoleDistribution;
    by_hero: Record<string, HeroFBRatio>;
  };
}

export interface CritKillRateConcept {
  description: string;
  by_hero: Record<string, HeroCritRate>;
}

export interface HeroMetaConcept {
  description: string;
  by_hero: Record<string, HeroMeta>;
}

export interface ArchetypeWinRate {
  win_rate: number;
  n: number;
}

export interface CompositionArchetypesConcept {
  description: string;
  archetype_win_rates: Record<string, ArchetypeWinRate>;
}

export interface TeamFightWinRateConcept {
  description: string;
  team_distribution: { overall: PercentileDistribution };
}

export interface TeamPerformancePredictorsConcept {
  description: string;
  correlations: Record<string, number>;
  winner_vs_loser: Record<string, WinnerLoserGap>;
  team_d10_distribution: PercentileDistribution;
}

export interface FirstPickRateTeamConcept {
  description: string;
  team_distribution: { overall: PercentileDistribution };
}

export interface Round1MomentumConcept {
  description: string;
  overall_r1_win_match_pct: number;
  by_map_mode: Record<string, { r1_win_pct: number; n: number }>;
  n: number;
}

export interface MapBalanceConcept {
  description: string;
  by_map: Record<string, { t1_win_rate: number; n: number }>;
}

export interface MercyRezConcept {
  description: string;
  total_rezzes: number;
  rez_per_match: {
    median: number;
    mean: number;
    distribution: PercentileDistribution;
  };
}

export interface DvaRemechConcept {
  description: string;
  total_remechs: number;
  remech_per_match: { median: number; mean: number };
  charge_to_call: { median_seconds: number; mean_seconds: number; n: number };
}

export interface EchoDuplicateConcept {
  description: string;
  total_duplicates: number;
  target_role_distribution: Record<string, number>;
  duration: {
    median_seconds: number;
    mean_seconds: number;
    pct_full_duration: number;
    pct_killed_early: number;
    n: number;
  };
}

export interface HypothesisResult {
  verdict: string;
  confidence: string;
  detail: string;
}

export interface TrainingPathBenchmarks {
  metadata: {
    generated_at: string;
    pipeline_version: string;
  };
  concepts: {
    deaths_per_10: DeathsPer10Concept;
    first_pick_win_rate: FirstPickWinRateConcept;
    entry_pick_rate: EntryPickRateConcept;
    first_death_rate: FirstDeathRateConcept;
    time_to_first_blood: TimeToFirstBloodConcept;
    ult_charge_time: UltChargeTimeConcept;
    ult_hold_time: UltHoldTimeConcept;
    ult_efficiency: UltEfficiencyConcept;
    dry_fight_win_rate: DryFightWinRateConcept;
    fight_win_rate_by_ult_differential: FightWinRateByUltDifferentialConcept;
    fb_elim_ratio: FBElimRatioConcept;
    crit_kill_rate: CritKillRateConcept;
    hero_meta: HeroMetaConcept;
    composition_archetypes: CompositionArchetypesConcept;
    team_fight_win_rate: TeamFightWinRateConcept;
    team_performance_predictors: TeamPerformancePredictorsConcept;
    first_pick_rate_team: FirstPickRateTeamConcept;
    round_1_momentum: Round1MomentumConcept;
    map_balance: MapBalanceConcept;
    mercy_rez: MercyRezConcept;
    dva_remech: DvaRemechConcept;
    echo_duplicate: EchoDuplicateConcept;
    sample_size_guide: { description: string; table: Record<string, number> };
    hypothesis_validation: { description: string; hypotheses: Record<string, HypothesisResult> };
  };
}

/** Result of computing where a user's value falls in a benchmark distribution */
export interface PercentilePosition {
  value: number;
  percentile: number;
  rating: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Needs Work';
  color: string;
}
