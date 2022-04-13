import React, {useState} from 'react';
import {interpolateColors} from './../../lib/color';
import './StackedBarChart.scss';

export interface StackedBarChartDatum {
  value: number;
  barGroup: string;
  withinBarGroup: string;
  clazz: string;
}

interface StackedBarChartProps {
  data: StackedBarChartDatum[];
  width: number;
  barHeight: number;
}

const StackedBarChart = (props: StackedBarChartProps) => {
  const {data, width, barHeight} = props;

  const [tooltipDatum, setTooltipDatum] = useState<null | StackedBarChartDatum>(
    null,
  );

  const primaryGroups = Array.from(new Set(data.map((d) => d.barGroup)));
  primaryGroups.sort();

  // get width of longest primary group in px
  const primaryGroupWidth = primaryGroups.reduce((acc, group) => {
    const width = group.length * 8;
    return width > acc ? width : acc;
  }, 0);

  const leftPadding = primaryGroupWidth + 10;

  // need to calculate the start x for each data point
  const cumSumByPrimaryGroup: {
    [primaryGroup: string]: number[];
  } = data.reduce((acc, d) => {
    if (!acc[d.barGroup]) {
      acc[d.barGroup] = [0, d.value];
    } else {
      acc[d.barGroup].push(
        acc[d.barGroup][acc[d.barGroup].length - 1] + d.value,
      );
    }
    return acc;
  }, {});

  const maxPrimaryGroupSum = Math.max(
    ...Object.values(cumSumByPrimaryGroup).map((arr) => arr[arr.length - 1]),
  );

  const xScale = (value: number) => {
    return (value / maxPrimaryGroupSum) * (width - leftPadding);
  };

  const bars = primaryGroups.map((group, i) => {
    const dataForGroup = data.filter((d) => d.barGroup === group);
    const total = dataForGroup
      .reduce((acc, d) => acc + d.value, 0)
      .toLocaleString();

    const inner = dataForGroup.map((d, j) => {
      const width = xScale(d.value);
      const height = barHeight - 5;

      return (
        <div
          key={`${group}-${j}`}
          style={{
            width,
            height,
            lineHeight: barHeight - 5 + 'px',
          }}
          onMouseEnter={(e) => {
            setTooltipDatum(d);
          }}
          onMouseLeave={() => {
            setTooltipDatum(null);
          }}
          className={`bar ${d.clazz}`}>
          {width > 75
            ? d.withinBarGroup
            : d.withinBarGroup
                .split(' ')
                .map((w) => w[0])
                .join('')}
        </div>
      );
    });

    return (
      <div key={group}>
        <div
          className="grouplabel"
          style={{
            width: leftPadding,
            lineHeight: `${barHeight - 5}px`,
          }}>
          {group}
        </div>
        {inner}
        <div
          className="grouptotal"
          style={{
            lineHeight: `${barHeight}px`,
          }}>
          {total}
        </div>
      </div>
    );
  });

  const endLabels = primaryGroups.map((group, i) => {
    const dataForGroup = data.filter((d) => d.barGroup === group);
    const total = dataForGroup.reduce((acc, d) => acc + d.value, 0);
    const x = xScale(total) + leftPadding;
    const prettyTotal = total.toLocaleString();
    return (
      <text
        key={group}
        x={x + 5}
        y={i * barHeight + barHeight / 2}
        textAnchor="start"
        dominantBaseline="middle">
        {prettyTotal}
      </text>
    );
  });

  const hasTooltip = tooltipDatum !== null;

  //   const dividingLines = data.map((d) => {
  //     const x = xScale(d);
  //     const y = yScale(d);
  //     const height = barHeight;
  //     const width = 1;
  //     return (
  //       <rect
  //         key={d.primaryGroup + d.secondaryGroup}
  //         x={x}
  //         y={y}
  //         height={height}
  //         width={width}
  //         fill="#000"
  //       />
  //     );
  //   });

  return (
    <div className="StackedBarChart">
      {bars}
      {/* {tooltip} */}
    </div>
  );
};

export default StackedBarChart;
