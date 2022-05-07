import React, {useMemo} from 'react';
import useData from '../../hooks/useData';
import {calculateMetric, formatDataForChart} from '../../lib/data/metrics';
import {
  Metric,
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
} from '../../lib/data/types';
import Chart from '../Chart/Chart';

const MetricDisplay = ({metric}: {metric: Metric}) => {
  // compute the data for the chart based on the metric and then render it

  const [mapList, mapListUpdates] = useData<OWMap>('map');
  const [interactions, updates] =
    useData<PlayerInteraction>('player_interaction');
  const [statuses, statusUpdates] = useData<PlayerStatus>('player_status');
  const [abilities, abilityUpdates] = useData<PlayerAbility>('player_ability');

  const metricData = useMemo(() => {
    if (
      !interactions ||
      !mapList ||
      !statuses ||
      !abilities ||
      mapList.length === 0 ||
      !metric
    ) {
      return {};
    }

    return calculateMetric(metric, mapList[0], statuses, interactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric, mapListUpdates, statusUpdates, updates, abilityUpdates]);

  const chartData = formatDataForChart(metricData);
  return (
    <Chart
      data={{
        labels: Object.keys(metricData),
        datasets: chartData,
      }}
      groups={metric.groups}
    />
  );
};

export default MetricDisplay;
