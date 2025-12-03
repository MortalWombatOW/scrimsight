/**
 * Main library index file - re-exports all functionality from subdirectories
 */

export * from './base64';
export * from './color';
export * from './date';
export * from './string';
export * from './time';

// Re-export from format.ts with explicit naming to avoid conflicts
export {
  safeDivide,
  prettyFormat,
  camelCaseToWords,
  camelCaseToAbbreviation,
  formatTime,
  formatDuration as formatDurationDetailed, // Rename to avoid conflict
  formatPercentage,
  formatStat,
} from './format';
export * from './hero';
export * from './scrimtime';
export * from './eventExtractionUtils';
// Re-export specific functions from metricUtils to ensure they're available
export {
  groupByAtom,
  type Grouped,
  type Metric,
  type MetricAtom
} from './metricUtils';
// Temporarily export getStatsAtom for old atoms - will be removed when atoms directory is deleted
export { getStatsAtom } from './playerMetricsUtils';
export * from './playerComparison';
export * from './killMatrixUtils';
export * from './useMetricsTableColumns';
export * from './metricExplorerStyles';
export * from './dagre';
export * from './statConfig';

// Re-export types from data layer
export type {
  // Match and metadata types
  MatchData,
  MatchMetadata,
  ProcessedMatch,
  RepositoryState,

  // Player stats types
  PlayerStatsCategoryKeys,
  PlayerStatsBaseNumericalKeys,
  PlayerStatsDerivedNumericalKeys,
  PlayerStatsNumericalKeys,
  PlayerStatsBase,
  PlayerStats,

  // Summary types
  PlayerListSummary,
  TeamListSummary,
  ScrimListSummary,
  TeamStats,

  // Scrim and teamfight types
  Scrim,
  Teamfight,

  // Ultimate and event types
  UltimateEvent,
  DefensiveAssistLogEvent,
  DefensiveAssistType,
  OffensiveAssistLogEvent,
  OffensiveAssistType,
  HeroSpawnLogEvent,
  HeroSpawnType,
  HeroSwapLogEvent,
  HeroSwapType,
  Ability1UsedLogEvent,
  Ability1UsedType,
  Ability2UsedLogEvent,
  Ability2UsedType,
  KillLogEvent,
  KillType,
  DamageLogEvent,
  DamageType,
  HealingLogEvent,
  HealingType,
  RoundStartLogEvent,
  RoundStartType,
  RoundEndLogEvent,
  RoundEndType,
  MatchStartLogEvent,
  MatchStartType,
  MatchEndLogEvent,
  MatchEndType,
  UltimateChargedLogEvent,
  UltimateStartLogEvent,
  UltimateEndLogEvent,
  PlayerStatLogEvent,
  PlayerStatType,
  MatchEvents,

  // Timeline types
  PlayerStatusEntry,
  PlayerStatusTimeline,

  // Map and round types
  MapTimes,
  RoundTimes
} from '../data/types';

// Re-export constants from data layer
export {
  playerStatsCategoryKeys,
  playerStatsBaseNumericalKeys,
  playerStatsDerivedNumericalKeys,
  playerStatsNumericalKeys,
} from '../data/types';

// Re-export atoms that are still needed
// TODO: Remove sampleDataEnabledAtom after migrating ZeroState and AddFilesPage
export {
  sampleDataEnabledAtom,
} from '@atoms';

