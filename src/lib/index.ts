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
export * from './playerMetricsUtils';
export * from './playerComparison';
export * from './killMatrixUtils';
export * from './useMetricsTableColumns';
export * from './metricExplorerStyles';
export * from './dagre';

// Re-export atoms that pages need (per architecture rules, pages can only import from @components or @library)
export { 
  logFileInputAtom, 
  sampleDataEnabledAtom,
  matchData,
  scrimListSummaryAtom,
  teamListSummaryAtom,
  playerListSummaryAtom,
  contextualStatAtoms,
  scrims,
  teamNames,
  teamStats,
  uniqueCategoryValues,
  playerStatsBase,
  playerStatsNumericalKeys,
  playerRankingsAtom
} from '@atoms';

export type { 
  MatchData,
  ScrimListSummary,
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
  PlayerStatsBase,
  PlayerStats,
  PlayerStatsBaseNumericalKeys,
  // Re-export event types that were previously duplicated in lib/types.ts
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
  Ability2UsedType
} from '@atoms';

