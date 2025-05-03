import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { metricsConfigAtom } from '../metrics/metricsConfig';
import { calculateAggregatedMetrics } from '../layers/goldLogic';
import { AggregationParams } from '../schemas/metricsSchema';
import { silverMatchesAtom } from './silverAtoms';
import { silverPlayerRoundStatsAtom } from './silverAtoms';
import { silverTeamfightsAtom } from './silverAtoms';
import { silverUltimateCyclesAtom } from './silverAtoms';
import { silverPlayerLivesAtom } from './silverAtoms';

// Map of source atom names to atoms
const sourceAtoms: Record<string, any> = {
  'silverMatches': silverMatchesAtom,
  'silverPlayerRoundStats': silverPlayerRoundStatsAtom,
  'silverTeamfights': silverTeamfightsAtom,
  'silverUltimateCycles': silverUltimateCyclesAtom,
  'silverPlayerLives': silverPlayerLivesAtom
};

/**
 * Atom family for aggregated metrics (Gold layer)
 * Takes aggregation parameters and returns the calculated metrics
 */
export const getAggregatedMetricsAtom = atomFamily(
  (params: AggregationParams) => {
    return atom(async (get) => {
      // Get the source data from the specified atom
      const sourceAtom = sourceAtoms[params.sourceAtom];
      if (!sourceAtom) {
        console.error(`Source atom ${params.sourceAtom} not found`);
        return [];
      }
      
      const sourceData = await get(sourceAtom);
      
      // Get metric configurations
      const metricsConfig = get(metricsConfigAtom);
      
      // Calculate the aggregated metrics
      return calculateAggregatedMetrics(
        sourceData as any[],
        {
          groupBy: params.groupBy,
          filters: params.filters,
          metrics: params.metrics,
          includeCount: params.includeCount
        },
        metricsConfig
      );
    });
  },
  (a: AggregationParams, b: AggregationParams) => {
      // Compare sourceAtom
      if (a.sourceAtom !== b.sourceAtom) return false;
      
      // Compare groupBy (order matters)
      if (a.groupBy.length !== b.groupBy.length) return false;
      for (let i = 0; i < a.groupBy.length; i++) {
        if (a.groupBy[i] !== b.groupBy[i]) return false;
      }
      
      // Compare filters
      const aFilterKeys = Object.keys(a.filters || {});
      const bFilterKeys = Object.keys(b.filters || {});
      
      if (aFilterKeys.length !== bFilterKeys.length) return false;
      
      for (const key of aFilterKeys) {
        const aValue = a.filters?.[key];
        const bValue = b.filters?.[key];
        
        if (Array.isArray(aValue) && Array.isArray(bValue)) {
          if (aValue.length !== bValue.length) return false;
          for (let i = 0; i < aValue.length; i++) {
            if (aValue[i] !== bValue[i]) return false;
          }
        } else if (aValue !== bValue) {
          return false;
        }
      }
      
      // Compare metrics (order doesn't matter for calculation)
      if (a.metrics.length !== b.metrics.length) return false;
      const aMetricsSet = new Set(a.metrics);
      for (const metric of b.metrics) {
        if (!aMetricsSet.has(metric)) return false;
      }
      
      // Compare includeCount
      if (a.includeCount !== b.includeCount) return false;
      
      return true;
    }
);