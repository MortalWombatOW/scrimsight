import {CircularProgress} from '@mui/material';
import React, {useState} from 'react';
import {Legend, Pie, PieChart, Sector, Tooltip} from 'recharts';
import {Data, DataRow} from '../../lib/data/metricsv2';
import {Metric} from '../../lib/data/types';
import './Charts.scss';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  console.log('percent', percent);
  if (percent < 0.02) {
    return null;
  }
  if (percent < 0.05 && index % 2 === 0) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="#363636"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{
        // let mouse interactions pass through
        pointerEvents: 'none',
      }}>
      {`${value.toLocaleString()}`}
    </text>
  );
};

const PieChartComponent = ({
  height,
  width,
  data,
  title,
  formatFn,
  dataKey,
}: {
  height: number;
  width: number;
  data: Data;
  title: string;
  formatFn: (value: DataRow) => string;
  dataKey: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const loading = data === undefined;

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333">{`${formatFn(payload.payload)}`}</text>
        {/* <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text> */}
      </g>
    );
  };

  return (
    <div>
      <div className="title">
        <div className="title-text">{title}</div>
      </div>
      <div className="pie-chart">
        {loading ? (
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              padding: `${height / 2 - 20}px`,
            }}>
            <CircularProgress />
          </div>
        ) : (
          <PieChart width={width} height={height}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={width / 12}
              outerRadius={width / 6}
              fill="#8884d8"
              dataKey={dataKey}
              // label
              // label={renderCustomizedLabel}
              onMouseEnter={(data, index) => setActiveIndex(index)}
              labelLine={false}
            />
            <Tooltip />
            <Legend
            // onMouseEnter={this.handleMouseEnter}
            // onMouseLeave={this.handleMouseLeave}
            />
          </PieChart>
        )}
      </div>
    </div>
  );
};

export default PieChartComponent;
