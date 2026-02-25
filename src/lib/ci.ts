/**
 * Confidence interval and trend computation utilities.
 *
 * Wilson score intervals are preferred for rate metrics because they
 * handle small sample sizes better than normal approximation.
 */

/** Wilson score interval for binomial proportions (rates). */
export function computeWilsonCI(
  successes: number,
  trials: number,
  z = 1.96,
): [number, number] {
  if (trials === 0) return [0, 0];

  const p = successes / trials;
  const z2 = z * z;
  const denom = 1 + z2 / trials;
  const center = (p + z2 / (2 * trials)) / denom;
  const margin =
    (z / denom) * Math.sqrt((p * (1 - p)) / trials + z2 / (4 * trials * trials));

  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}

/** CI for continuous metrics using mean +/- z*SE. */
export function computeMeanCI(
  values: number[],
  z = 1.96,
): [number, number] {
  if (values.length < 2) return [0, 0];

  const n = values.length;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1);
  const se = Math.sqrt(variance / n);

  return [mean - z * se, mean + z * se];
}

export interface TrendResult {
  direction: 'up' | 'down' | 'stable';
  delta: number;
  deltaPercent: number;
  significant: boolean;
}

/**
 * Compare two time windows to detect a trend.
 * `recent` and `prior` are arrays of metric values from each window.
 * Significance is determined by non-overlapping CIs.
 */
export function computeTrend(
  recent: number[],
  prior: number[],
): TrendResult {
  if (recent.length === 0 || prior.length === 0) {
    return { direction: 'stable', delta: 0, deltaPercent: 0, significant: false };
  }

  const recentMean = recent.reduce((s, v) => s + v, 0) / recent.length;
  const priorMean = prior.reduce((s, v) => s + v, 0) / prior.length;

  const delta = recentMean - priorMean;
  const deltaPercent = priorMean !== 0 ? (delta / Math.abs(priorMean)) * 100 : 0;

  const recentCI = computeMeanCI(recent);
  const priorCI = computeMeanCI(prior);
  const significant = recentCI[0] > priorCI[1] || recentCI[1] < priorCI[0];

  const THRESHOLD = 0.01;
  let direction: TrendResult['direction'] = 'stable';
  if (Math.abs(delta) > THRESHOLD * Math.abs(priorMean || 1)) {
    direction = delta > 0 ? 'up' : 'down';
  }

  return { direction, delta, deltaPercent, significant };
}
