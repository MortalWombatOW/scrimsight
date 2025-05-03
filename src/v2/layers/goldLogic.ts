import { MetricConfig } from '../schemas/metricsSchema';
import pd from '../utils/pandas-adapter';

/**
 * Resolve dependencies for metrics needed for calculation
 */
export const resolveMetricDependencies = (
  metricIds: string[],
  metricsConfig: Record<string, MetricConfig>
): string[] => {
  const allRequiredMetrics = new Set<string>();
  
  // Helper function to recursively add dependencies
  const addDependencies = (id: string) => {
    if (allRequiredMetrics.has(id)) return;
    
    allRequiredMetrics.add(id);
    
    const metric = metricsConfig[id];
    if (!metric) return;
    
    if (metric.type === 'derived' && metric.dependencies) {
      metric.dependencies.forEach(depId => {
        addDependencies(depId);
      });
    } else if (metric.type === 'ratio') {
      addDependencies(metric.numerator);
      addDependencies(metric.denominator);
    } else if (metric.type === 'per10min') {
      addDependencies(metric.source);
      addDependencies(metric.playtimeField);
    }
  };
  
  // Add all requested metrics and their dependencies
  metricIds.forEach(id => {
    addDependencies(id);
  });
  
  return Array.from(allRequiredMetrics);
};

/**
 * Calculate aggregated metrics based on the given parameters
 */
export const calculateAggregatedMetrics = (
  sourceData: any[],
  params: {
    groupBy: string[];
    filters?: Record<string, string | string[]>;
    metrics: string[];
    includeCount?: boolean;
  },
  metricsConfig: Record<string, MetricConfig>
): any[] => {
  // Handle empty case
  if (!sourceData || sourceData.length === 0) {
    return [];
  }
  
  // Apply filters first
  let filteredData = sourceData;
  if (params.filters) {
    filteredData = sourceData.filter(item => {
      return Object.entries(params.filters || {}).every(([key, value]) => {
        if (Array.isArray(value)) {
          return value.includes(String(item[key]));
        }
        return String(item[key]) === value;
      });
    });
  }
  
  // If no data after filtering, return empty array
  if (filteredData.length === 0) {
    return [];
  }
  
  // Create pandas DataFrame
  const df = new pd.DataFrame(filteredData);
  
  // Resolve all metrics needed including dependencies
  const resolvedMetrics = resolveMetricDependencies(params.metrics, metricsConfig);
  
  // Function to determine aggregation function for a metric
  const getAggregation = (metricId: string) => {
    const metric = metricsConfig[metricId];
    if (!metric) return 'sum'; // Default
    
    if (metric.type === 'simple') {
      return metric.aggregation;
    }
    
    return 'sum'; // Default for other types
  };
  
  // Create aggregation spec for pd.DataFrame.groupBy().agg()
  const aggregations: Record<string, string> = {};
  
  resolvedMetrics.forEach(metricId => {
    const metric = metricsConfig[metricId];
    
    if (metric && metric.type === 'simple') {
      // For simple metrics, use the source field and specified aggregation
      aggregations[metric.source] = getAggregation(metricId);
    }
  });
  
  // Always include count if requested
  if (params.includeCount !== false) {
    // Pick the first column for count
    aggregations[Object.keys(filteredData[0])[0]] = 'count';
  }
  
  // Group and aggregate the data
  let groupedDf: any;
  
  try {
    // Group by specified keys
    if (params.groupBy.length > 0) {
      const groupBy = params.groupBy.filter(key => key in filteredData[0]);
      groupedDf = df.groupBy(groupBy).agg(aggregations);
    } else {
      // If no groupBy is provided, aggregate all rows
      groupedDf = df.agg(aggregations);
    }
  } catch (error) {
    console.error('Error during pandas groupBy/aggregation:', error);
    return [];
  }
  
  // Convert grouped DataFrame to array of objects
  let result: any[] = [];
  
  try {
    result = groupedDf.toCollection();
    
    // Add derived metrics
    result = result.map(item => {
      const newItem = { ...item };
      
      // Calculate simple metrics first
      params.metrics.forEach(metricId => {
        const metric = metricsConfig[metricId];
        if (!metric) return;
        
        if (metric.type === 'simple') {
          // For simple metrics, take the aggregated value directly
          newItem[metricId] = item[metric.source] || 0;
        }
      });
      
      // Calculate ratio metrics
      params.metrics.forEach(metricId => {
        const metric = metricsConfig[metricId];
        if (!metric || metric.type !== 'ratio') return;
        
        const numeratorValue = newItem[metric.numerator] || 0;
        const denominatorValue = newItem[metric.denominator] || 0;
        
        if (denominatorValue === 0) {
          newItem[metricId] = metric.fallbackValue || 0;
        } else {
          newItem[metricId] = numeratorValue / denominatorValue;
        }
      });
      
      // Calculate per-10-minute metrics
      params.metrics.forEach(metricId => {
        const metric = metricsConfig[metricId];
        if (!metric || metric.type !== 'per10min') return;
        
        const sourceValue = newItem[metric.source] || 0;
        const playtimeValue = newItem[metric.playtimeField] || 0;
        
        if (playtimeValue === 0) {
          newItem[metricId] = 0;
        } else {
          // Convert playtime to minutes, then multiply by 10 / playtime
          const playtimeMinutes = playtimeValue / 60;
          newItem[metricId] = sourceValue * (10 / playtimeMinutes);
        }
      });
      
      // Calculate basic derived metrics
      // Note: This is a placeholder for future implementation of a full formula parser
      params.metrics.forEach(metricId => {
        const metric = metricsConfig[metricId];
        if (!metric || metric.type !== 'derived') return;
        
        // For now, implement only a few common formulas as examples
        if (metricId === 'kda') {
          const elims = newItem['eliminations'] || 0;
          const deaths = Math.max(newItem['deaths'] || 0, 1); // Avoid division by zero
          const defAssists = newItem['defensive_assists'] || 0;
          const offAssists = newItem['offensive_assists'] || 0;
          
          newItem[metricId] = (elims + defAssists + offAssists) / deaths;
        } else if (metricId === 'teamfight_win_rate') {
          const wins = newItem['teamfights_won'] || 0;
          const total = Math.max(newItem['teamfights_count'] || 0, 1); // Avoid division by zero
          
          newItem[metricId] = wins / total;
        }
        // Add more derived metric implementations as needed
      });
      
      return newItem;
    });
    
    // Clean up NaN and Infinity values
    result = result.map(item => {
      const cleanItem: Record<string, any> = {};
      
      Object.entries(item).forEach(([key, value]) => {
        if (value === null || value === undefined || Number.isNaN(value) || !Number.isFinite(value)) {
          cleanItem[key] = null;
        } else {
          cleanItem[key] = value;
        }
      });
      
      return cleanItem;
    });
  } catch (error) {
    console.error('Error post-processing aggregated data:', error);
    return [];
  }
  
  return result;
};