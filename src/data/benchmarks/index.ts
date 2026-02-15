export type { TrainingPathBenchmarks, PercentileDistribution, ByRoleDistribution, PercentilePosition } from './types';
export { computePercentilePosition, selectDistribution } from './percentileLookup';

import benchmarkJson from './training_path_benchmarks.json';
import { TrainingPathBenchmarks } from './types';

export const benchmarks = benchmarkJson as unknown as TrainingPathBenchmarks;
