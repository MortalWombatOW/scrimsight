import React, {useMemo, useState} from 'react';
import useData from '../../hooks/useData';
import {groupColorClass} from '../../lib/color';
import {getHeroesByPlayer, getMostCommonHeroes} from '../../lib/data/data';
import {
  calculateMetric,
  formatDataForChart,
  getTimeSeriesLabels,
} from '../../lib/data/metrics';
import {
  Metric,
  MetricGroup,
  OWMap,
  PlayerInteraction,
  PlayerStatus,
} from '../../lib/data/types';
import {heroNameToNormalized, isNumeric} from '../../lib/string';
import StackedBarChart, {StackedBarChartDatum} from '../Chart/StackedBarChart';
import TimeChart, {TimeChartSeries} from '../Chart/TimeChart/TimeChart';
import './MetricExplorer.scss';
import MetricSelect from './MetricSelect';
import Chart from '../Chart/Chart';
import {ChartDataset} from 'chart.js';
import {formatTimeSeriesHeatmap} from './../../lib/data/metrics';
import MetricDisplay from '../MetricDisplay/MetricDisplay';

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

    return calculateMetric(metric, mapList, statuses, interactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric, mapListUpdates, statusUpdates, updates]);

  const chartData: ChartDataset[] = useMemo(() => {
    if (
      !interactions ||
      !mapList ||
      !statuses ||
      mapList.length === 0 ||
      !metric
    ) {
      return [];
    }
    console.log('yay');
    console.log(metric);
    if (metric.groups.length === 2 && metric.groups[1] === MetricGroup.time) {
      console.log('formatting time series');
      return formatTimeSeriesHeatmap(metricData);
    }

    return formatDataForChart(metricData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric, mapListUpdates, statusUpdates, updates]);

  console.log(metricData);
  if (!interactions || !mapList || mapList.length === 0 || !statuses) {
    return <div>Loading...</div>;
  }

  let display = <div>No data</div>;

  const dataDimensions = !metric ? 0 : metric.groups.length;

  const playerHeroes = getHeroesByPlayer(statuses);
  const mostCommonHeroes = getMostCommonHeroes(playerHeroes);

  // if (dataDimensions === 1) {
  //   // display = <StackedBarChart data={metricData} width={800} barHeight={30} />;
  //   // display = (
  //   //   <Chart
  //   //     data={{
  //   //       labels: Object.keys(metricData),
  //   //       datasets: chartData,
  //   //     }}
  //   //   />
  //   // );
  // }

  if (dataDimensions === 2 && !metric?.groups.includes(MetricGroup.time)) {
    // const barChartData: StackedBarChartDatum[] = Object.keys(
    //   metricData,
    // ).flatMap((group1) =>
    //   Object.keys(metricData[group1]).map((group2) => {
    //     return {
    //       value: metricData[group1][group2] as number,
    //       barGroup: group1,
    //       withinBarGroup: group2,
    //       clazz:
    //         groupColorClass(group2) ||
    //         heroNameToNormalized(mostCommonHeroes[group2]),
    //     };
    //   }),
    // );

    display = <StackedBarChart data={metricData} width={800} barHeight={30} />;
  }

  if (
    dataDimensions === 2 &&
    metric?.groups.includes(MetricGroup.time) &&
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
              val: Object.keys(metricData[group1][time]).reduce(
                (acc, group2) =>
                  acc + (metricData[group1][time][group2] as number),
                0,
              ),
            };
          }),

          clazz: '',
        };
      },
    );
    display = (
      <TimeChart
        series={timeData}
        width={1800}
        height={700}
        yLabel={metric?.values.join(' / ')}
      />
    );
  }

  // console.log(metricData);

  return (
    <div className="MetricExplorer">
      <div className="controls">
        <MetricSelect onSelect={setMetric} />
      </div>
      <div className="display">
        {!!metric && <MetricDisplay metric={metric} />}
      </div>
    </div>
  );
};

export default MetricExplorer;
