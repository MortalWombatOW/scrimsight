import React from 'react';
import {
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DataRow } from '../../lib/data/logging/spec';
const TimeChartComponent = ({
  height,
  width,
  data,
}: {
  height: number;
  width: number;
  data: DataRow[];
}) => {
  return (
    <div>
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
          <XAxis type="number" dataKey={'foo'} />
          <YAxis type="number" domain={['dataMin', 'dataMax']} />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend align="right" layout="vertical" verticalAlign="top" />
          {/* {data.length > 0 &&
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
            )} */}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeChartComponent;
