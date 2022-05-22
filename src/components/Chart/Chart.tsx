import React, {useEffect, useRef, useState} from 'react';
import {
  BarController,
  LinearScale,
  BarElement,
  TimeScale,
  CategoryScale,
  Tooltip,
  ChartData,
} from 'chart.js';
import {ReactChart} from 'chartjs-react';
import {MatrixController, MatrixElement} from 'chartjs-chart-matrix';
import {MetricGroup} from '../../lib/data/types';
ReactChart.register(
  BarController,
  LinearScale,
  BarElement,
  TimeScale,
  Tooltip,
  CategoryScale,
  MatrixController,
  MatrixElement,
);

interface ChartProps {
  data: ChartData;
  groups: MetricGroup[];
}

const Chart = ({data, groups}: ChartProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const isTimeSeries = groups.length > 1 && groups[1] === MetricGroup.time;

  const indexAxis = 'y';
  const chartType = isTimeSeries ? 'matrix' : 'bar';
  console.log(chartType);

  const [chartIsMounted, setChartIsMounted] = useState(true);

  useEffect(() => {
    if (!chartIsMounted) {
      setChartIsMounted(true);
    }
  }, [chartIsMounted]);

  useEffect(() => {
    setChartIsMounted(false);
  }, [chartType]);
  return (
    <div ref={ref}>
      {chartIsMounted && (
        <ReactChart
          type={chartType}
          // type="matrix"
          data={JSON.parse(JSON.stringify(data))}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                type: 'linear',
                stacked: true,
                min: 0,
                max: 600,
              },
              // x: {
              //   type: xAxisType,
              //   stacked: true,
              // },
              y: {
                type: 'category',
                stacked: true,
              },
            },
            indexAxis,
            animation: isTimeSeries ? false : {duration: 0},
          }}
          height={Math.max(ref?.current?.clientHeight || 0, 500)}
          // width={ref?.current?.clientWidth}
        />
      )}
    </div>
  );
};

export default Chart;
