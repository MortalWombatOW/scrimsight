import {useMemo} from 'react';
import {computeMetric} from '../lib/data/metricsv2';
import {Metric} from '../lib/data/types';
import useBaseData from './useBaseData';

const useMetric = (metric: Metric) => {
  const [baseData, updates] = useBaseData();
  const results = useMemo(() => {
    if (baseData) {
      return computeMetric(metric, baseData);
    } else {
      return [];
    }
  }, [baseData, metric]);
  return [results, updates];
};

export default useMetric;
