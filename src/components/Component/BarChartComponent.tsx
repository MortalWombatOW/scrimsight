import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  YAxis,
  XAxis,
  Bar,
  Tooltip,
  Legend,
} from 'recharts';
import {getMetricColor} from '../../lib/color';
import {Metric, MetricGroup, MetricValue} from '../../lib/data/types';
import {height, width} from '@mui/system';
import {Data, getMetricName} from '../../lib/data/metricsv2';
import {capitalize, listToNaturalLanguage} from '../../lib/string';

const BarChartComponent = ({
  height,
  width,
  data,
  metric,
  sortBy,
  setSortBy,
}: {
  height: number;
  width: number;
  data: Data;
  metric: Metric;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}) => {
  console.log('BarChartComponent');
  return (
    <div>
      <div className="title">
        <div className="title-text">{getMetricName(metric)}</div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          width={width}
          height={height}
          layout="vertical"
          data={data.slice(0, 8)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 25,
          }}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <YAxis
            dataKey={MetricGroup[metric.groups[0]]}
            width={180}
            type="category"></YAxis>
          <XAxis type="number"></XAxis>
          <Tooltip
            formatter={(value) => new Intl.NumberFormat('en').format(value)}
          />
          <Legend
            align="right"
            layout="vertical"
            verticalAlign="top"
            onClick={(e) => setSortBy(e.dataKey)}
          />
          {metric.values.map((value, _) => (
            <Bar
              key={value}
              dataKey={MetricValue[value]}
              fill={getMetricColor(value)}></Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;