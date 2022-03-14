import React, {useState} from 'react';
import {interpolateColors} from './../../lib/color';
import './StackedBarChart.scss';

interface StackedBarChartDatum {
  value: number;
  primaryGroup: string;
  secondaryGroup: string;
}

interface StackedBarChartProps {
  data: StackedBarChartDatum[];
  width: number;
  barHeight: number;
}

const StackedBarChart = (props: StackedBarChartProps) => {
  const {data, width, barHeight} = props;

  const [tooltipDatum, setTooltipDatum] = useState(null);

  const primaryGroups = Array.from(new Set(data.map((d) => d.primaryGroup)));
  primaryGroups.sort();

  // get width of longest primary group in px
  const primaryGroupWidth = primaryGroups.reduce((acc, group) => {
    const width = group.length * 8;
    return width > acc ? width : acc;
  }, 0);

  const leftPadding = primaryGroupWidth + 10;
  const rightPadding = 150;

  // need to calculate the start x for each data point
  const cumSumByPrimaryGroup: {
    [primaryGroup: string]: number[];
  } = data.reduce((acc, d) => {
    if (!acc[d.primaryGroup]) {
      acc[d.primaryGroup] = [0, d.value];
    } else {
      acc[d.primaryGroup].push(
        acc[d.primaryGroup][acc[d.primaryGroup].length - 1] + d.value,
      );
    }
    return acc;
  }, {});

  const maxPrimaryGroupSum = Math.max(
    ...Object.values(cumSumByPrimaryGroup).map((arr) => arr[arr.length - 1]),
  );

  const height = barHeight * primaryGroups.length;

  const svgWidth = width;
  const svgHeight = height;

  const xScale = (value: number) => {
    return (value / maxPrimaryGroupSum) * (width - leftPadding - rightPadding);
  };

  const yScale = (d: StackedBarChartDatum) => {
    return primaryGroups.indexOf(d.primaryGroup) * barHeight;
  };

  const xAxis = (
    <g className="x-axis">
      <line x1={0} y1={height} x2={width} y2={height} />
    </g>
  );

  const yAxis = (
    <g className="y-axis">
      {primaryGroups.map((group, i) => (
        <text key={group} x={0} y={i * barHeight + barHeight / 2}>
          {group}
        </text>
      ))}
    </g>
  );

  const startColor = '#cccccc';
  const endColor = '#3c006d';

  const bars = primaryGroups.flatMap((group, i) => {
    const dataForGroup = data.filter((d) => d.primaryGroup === group);
    const colors = interpolateColors(startColor, endColor, dataForGroup.length);
    return dataForGroup.map((d, j) => {
      const x = xScale(cumSumByPrimaryGroup[group][j]) + leftPadding;
      const y = yScale(d);
      const width = xScale(d.value);
      const height = barHeight - 5;

      return (
        <rect
          key={`${group}-${j}`}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={colors[j]}
          onMouseEnter={(e) => {
            setTooltipDatum(d);
          }}
          onMouseLeave={() => {
            setTooltipDatum(null);
          }}
          className="bar"
        />
      );
    });
  });

  const endLabels = primaryGroups.map((group, i) => {
    const dataForGroup = data.filter((d) => d.primaryGroup === group);
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

  const tooltip = hasTooltip ? (
    <div className="tooltip">
      {tooltipDatum?.secondaryGroup}: {tooltipDatum?.value.toLocaleString()}
    </div>
  ) : null;

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
      <svg width={svgWidth} height={svgHeight}>
        {bars}
        {xAxis}
        {yAxis}
        {endLabels}
      </svg>
      {tooltip}
    </div>
  );
};

export default StackedBarChart;
