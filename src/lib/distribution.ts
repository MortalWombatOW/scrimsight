export interface DistributionBin {
  binStart: number;
  binEnd: number;
  binCenter: number;
  count: number;
  frequency: number;
}

/**
 * Computes histogram bins for a distribution of values
 * @param values Array of numeric values
 * @param numBins Number of bins to create (default: 10 for deciles)
 * @returns Array of distribution bins with counts and frequencies
 */
export function computeDistributionBins(
  values: number[],
  numBins: number = 10
): DistributionBin[] {
  if (values.length === 0) {
    return [];
  }

  const sortedValues = [...values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  
  // Handle edge case where all values are the same
  if (min === max) {
    return [{
      binStart: min,
      binEnd: max,
      binCenter: min,
      count: values.length,
      frequency: 1.0,
    }];
  }

  const binWidth = (max - min) / numBins;
  const bins: DistributionBin[] = [];

  // Initialize bins
  for (let i = 0; i < numBins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = i === numBins - 1 ? max : min + (i + 1) * binWidth;
    const binCenter = (binStart + binEnd) / 2;

    bins.push({
      binStart,
      binEnd,
      binCenter,
      count: 0,
      frequency: 0,
    });
  }

  // Count values in each bin
  for (const value of values) {
    let binIndex = Math.floor((value - min) / binWidth);
    // Handle edge case for maximum value
    if (binIndex >= numBins) {
      binIndex = numBins - 1;
    }
    bins[binIndex].count++;
  }

  // Calculate frequencies
  const totalCount = values.length;
  for (const bin of bins) {
    bin.frequency = bin.count / totalCount;
  }

  return bins;
}

/**
 * Computes deciles (10 bins) for a distribution
 * @param values Array of numeric values
 * @returns Array of 10 distribution bins
 */
export function computeDeciles(values: number[]): DistributionBin[] {
  return computeDistributionBins(values, 10);
}

/**
 * Smooths a distribution by interpolating between bin centers
 * Useful for creating smooth area charts from histogram data
 * @param bins Distribution bins
 * @param smoothingFactor Number of interpolated points between bins (default: 3)
 * @returns Array of smoothed data points
 */
export function smoothDistribution(
  bins: DistributionBin[],
  smoothingFactor: number = 3
): Array<{ value: number; frequency: number }> {
  if (bins.length === 0) {
    return [];
  }

  const smoothedPoints: Array<{ value: number; frequency: number }> = [];

  for (let i = 0; i < bins.length; i++) {
    const currentBin = bins[i];
    const nextBin = bins[i + 1];

    // Add the current bin center
    smoothedPoints.push({
      value: currentBin.binCenter,
      frequency: currentBin.frequency,
    });

    // Add interpolated points between current and next bin (except for last bin)
    if (nextBin && smoothingFactor > 0) {
      const valueStep = (nextBin.binCenter - currentBin.binCenter) / (smoothingFactor + 1);
      const frequencyStep = (nextBin.frequency - currentBin.frequency) / (smoothingFactor + 1);

      for (let j = 1; j <= smoothingFactor; j++) {
        smoothedPoints.push({
          value: currentBin.binCenter + valueStep * j,
          frequency: currentBin.frequency + frequencyStep * j,
        });
      }
    }
  }

  return smoothedPoints;
}