import {CircularProgress} from '@mui/material';
import React, {useState} from 'react';
import {Cell, Pie, PieChart, Sector, Tooltip} from 'recharts';
import {DataRow} from '../../lib/data/types';
import {groupColorClass} from '../../lib/color';
import ResultCache from '../../lib/data/ResultCache';
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

  const midAngleProjectionX = cx + radius * Math.cos(-midAngle * RADIAN);
  const midAngleProjectionY = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      fill="white"
      // stroke="grey"
      x={midAngleProjectionX}
      y={midAngleProjectionY}
      // textAnchor={x > cx ? 'start' : 'end'}
      textAnchor="middle"
      dominantBaseline="middle"
      textRendering="optimizeLegibility"
      style={{
        // let mouse interactions pass through
        pointerEvents: 'none',
        fontSize: '0.8em',
        // boxShadow: '0 0 5px 5px black',
      }}>
      {`${(percent * 100).toFixed(0)}%`}
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
  colorKey,
  deps,
}: {
  height: number;
  width: number;
  data: DataRow[];
  title: string;
  formatFn: (value: DataRow) => string;
  dataKey: string;
  colorKey: string;
  deps: string[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const loading =
    data === undefined || deps.some((dep) => ResultCache.notDone(dep));

  const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      // console.log('payload', payload);
      return (
        <div className="tooltip">
          <p className="label">{formatFn(payload[0].payload.payload)}</p>
        </div>
      );
    }

    return null;
  };

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
          <PieChart
            width={width}
            height={height}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <Pie
              activeIndex={activeIndex}
              // activeShape={renderActiveShape}
              // activeShape
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={width / 7}
              outerRadius={width / 3}
              dataKey={dataKey}
              label={renderCustomizedLabel}
              onMouseEnter={(data, index) => setActiveIndex(index)}
              labelLine={false}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  className={groupColorClass(entry[colorKey] as string)}
                />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
          </PieChart>
        )}
      </div>
    </div>
  );
};

export default PieChartComponent;
