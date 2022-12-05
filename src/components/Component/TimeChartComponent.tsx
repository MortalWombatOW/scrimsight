import React, {useEffect, useState} from 'react';
import {
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {getMetricColor} from '../../lib/color';
import {getMetricName} from '../../lib/data/metricsv2';
import {Data, Metric, MetricGroup, MetricValue} from '../../lib/data/types';

const TimeChartComponent = ({
  height,
  width,
  data,
  metric,
}: {
  height: number;
  width: number;
  data: Data;
  metric: Metric;
}) => {
  // need to plot every value and group combo
  const hasNonTimeGroup = metric.groups.length == 2;
  const [nonTimeGroup, setNonTimeGroup] = React.useState<MetricGroup | null>(
    null,
  );
  const [groupedData, setGroupedData] = useState<{[key: string]: Data}>({});

  useEffect(() => {
    () => {
      if (hasNonTimeGroup) {
        setNonTimeGroup(
          metric.groups.filter((group) => group !== MetricGroup.time)[0],
        );
        setGroupedData(
          data.reduce<{
            [key: string]: Data;
          }>((acc, d) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const groupValue = d[MetricGroup[nonTimeGroup!]];

            if (!acc[groupValue]) {
              acc[groupValue] = [];
            }

            acc[groupValue].push(d);
            return acc;
          }, {}),
        );
      }
      console.log('TimeChartComponent', groupedData, nonTimeGroup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, JSON.stringify(metric)]);

  console.log(metric);

  return (
    <div>
      <div className="title">
        <div className="title-text">{getMetricName(metric)}</div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          width={width}
          height={height}
          layout="horizontal"
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 25,
          }}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis type="number" dataKey={MetricGroup[metric.groups[0]]} />
          <YAxis type="number" domain={['dataMin', 'dataMax']} />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend align="right" layout="vertical" verticalAlign="top" />
          {data.length > 0 &&
            (hasNonTimeGroup ? Object.values(groupedData) : [data]).map(
              (lineData, i) =>
                metric.values.map((value) => (
                  <Scatter
                    line
                    key={`$line-${value}-${i}`}
                    dataKey={MetricValue[value]}
                    fill={getMetricColor(value)}
                    data={lineData}
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    name={lineData[0][MetricGroup[nonTimeGroup!]] as string}
                  />
                )),
            )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeChartComponent;
