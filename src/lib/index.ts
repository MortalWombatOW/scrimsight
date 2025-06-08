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
export * from './metricUtils';
export * from './playerMetricsUtils';
export * from './playerComparison';
export * from './killMatrixUtils';
export * from './useAtomData';
export * from './useMetricsTableColumns';
export * from './atomDataService';
export * from './schemaVisualizer';
export * from './metricExplorerStyles';
export * from './dagre';

// Re-export atoms needed by pages
// Note: This violates independent-modules but may be necessary for the architecture
export {
  // AddFilesPage & ZeroState atoms
  logFileInputAtom,
  logFileInputMutationAtom,
  sampleDataEnabledAtom,
  
  // HomePage atoms
  matchData,
  scrimListSummaryAtom,
  teamListSummaryAtom,
  playerListSummaryAtom,
  
  // MatchOverviewPage atoms
  // matchData (already exported above)
  
  // MetricsExplorerPage atoms
  uniqueCategoryValues,
  
  // ScrimPage atoms
  scrims,
  contextualStatAtoms,
  
  // TeamPage atoms
  teamNames,
  teamStats,
  
  // Additional contextual atoms
} from '@atoms';

// Re-export types needed by pages
export type {
  MatchData,
  ScrimListSummary,
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
} from '@atoms';