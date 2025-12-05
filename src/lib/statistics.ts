/**
 * Calculates the mean (average) of an array of numbers.
 */
export function calculateMean(data: number[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

/**
 * Calculates the minimum value in an array of numbers.
 */
export function calculateMin(data: number[]): number {
  if (data.length === 0) return 0;
  return Math.min(...data);
}

/**
 * Calculates the maximum value in an array of numbers.
 */
export function calculateMax(data: number[]): number {
  if (data.length === 0) return 0;
  return Math.max(...data);
}

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
  label: string;
}

/**
 * Calculates histogram data from an array of numbers.
 * @param data The array of numbers to analyze.
 * @param binCount The number of bins to create (default: 10).
 */
export function calculateHistogram(data: number[], binCount: number = 10): HistogramBin[] {
  if (data.length === 0) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Handle case where all values are the same
  if (min === max) {
    return [{
      binStart: min,
      binEnd: max,
      count: data.length,
      label: `${min}`,
    }];
  }

  const range = max - min;
  const binSize = range / binCount;
  
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const start = min + i * binSize;
    const end = start + binSize;
    return {
      binStart: start,
      binEnd: end,
      count: 0,
      // Format label nicely
      label: `${start.toFixed(1)}-${end.toFixed(1)}`,
    };
  });

  data.forEach((value) => {
    // Find the bin index
    let binIndex = Math.floor((value - min) / binSize);
    
    // Handle the edge case where value equals max (put in last bin)
    if (binIndex >= binCount) {
      binIndex = binCount - 1;
    }
    
    if (binIndex >= 0 && binIndex < binCount) {
      bins[binIndex].count++;
    }
  });

  return bins;
}
