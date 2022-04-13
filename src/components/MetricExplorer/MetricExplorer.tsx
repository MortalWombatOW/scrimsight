import {Avatar, Chip, Grid} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import useData from '../../hooks/useData';
import {groupColorClass} from '../../lib/color';
import {
  getHeroesByPlayer,
  getInteractionStat,
  getMostCommonHeroes,
} from '../../lib/data/data';
import {
  calculateMetric,
  getMetricGroups,
  getTypeForMetric,
  getMetricValues,
} from '../../lib/data/metrics';
import {
  Metric,
  MetricData,
  MetricGroup,
  MetricType,
  MetricValue,
  OWMap,
  PlayerInteraction,
  PlayerStatus,
} from '../../lib/data/types';
import {heroNameToNormalized, isNumeric} from '../../lib/string';
import StackedBarChart, {StackedBarChartDatum} from '../Chart/StackedBarChart';
import TimeChart, {
  TimeChartProps,
  TimeChartSeries,
} from '../Chart/TimeChart/TimeChart';
import './MetricExplorer.scss';
import MetricSelect from './MetricSelect';

const MetricExplorer = ({mapId}: {mapId: number}) => {
  const [mapList, mapListUpdates] = useData<OWMap>('map', mapId);
  const [interactions, updates] = useData<PlayerInteraction>(
    'player_interaction',
    mapId,
  );
  const [statuses, statusUpdates] = useData<PlayerStatus>(
    'player_status',
    mapId,
  );
  const [metric, setMetric] = useState<Metric>();

  const metricData = useMemo(() => {
    if (
      !interactions ||
      !mapList ||
      !statuses ||
      mapList.length === 0 ||
      !metric
    ) {
      return {};
    }

    return calculateMetric(metric, mapList[0], statuses, interactions);
  }, [metric, mapListUpdates, statusUpdates, updates]);

  if (!interactions || !mapList || mapList.length === 0 || !statuses) {
    return <div>Loading...</div>;
  }

  console.log(metricData);

  let display = <div>No data</div>;

  const dataDimensions = !metric ? 0 : metric.groups.length;

  const playerHeroes = getHeroesByPlayer(statuses);
  const mostCommonHeroes = getMostCommonHeroes(playerHeroes);

  if (dataDimensions === 1) {
    const barChartData: StackedBarChartDatum[] = Object.keys(metricData).map(
      (key) => {
        return {
          value: metricData[key] as number,
          barGroup: key,
          withinBarGroup: '',
          clazz: heroNameToNormalized(mostCommonHeroes[key]) || 'ana',
        };
      },
    );

    display = (
      <StackedBarChart data={barChartData} width={800} barHeight={30} />
    );
  }

  if (dataDimensions === 2 && !metric?.groups.includes('time')) {
    const barChartData: StackedBarChartDatum[] = Object.keys(
      metricData,
    ).flatMap((group1) =>
      Object.keys(metricData[group1]).map((group2) => {
        return {
          value: metricData[group1][group2] as number,
          barGroup: group1,
          withinBarGroup: group2,
          clazz:
            groupColorClass(group2) ||
            heroNameToNormalized(mostCommonHeroes[group2]),
        };
      }),
    );

    display = (
      <StackedBarChart data={barChartData} width={800} barHeight={30} />
    );
  }

  if (
    dataDimensions === 2 &&
    metric?.groups.includes('time') &&
    Object.keys(metricData).reduce(
      (acc, g) => isNumeric(Object.keys(metricData[g])[0]) || acc,
      false,
    )
  ) {
    // debugger;
    const timeData: TimeChartSeries[] = Object.keys(metricData).map(
      (group1) => {
        return {
          label: group1,
          data: Object.keys(metricData[group1]).map((time) => {
            return {
              time: parseInt(time),
              val: metricData[group1][time] as number,
            };
          }),
          clazz:
            groupColorClass(group1) ||
            heroNameToNormalized(mostCommonHeroes[group1]),
        };
      },
    );
    display = (
      <TimeChart
        series={timeData}
        width={1800}
        height={700}
        yLabel={metric?.value}
      />
    );
  }

  return (
    <div className="MetricExplorer">
      <div className="controls">
        <MetricSelect onSelect={setMetric} />
      </div>
      <div className="display">{display}</div>
    </div>
  );
};

export default MetricExplorer;
