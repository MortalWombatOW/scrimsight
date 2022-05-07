import {Slider} from '@mui/material';
import {useHover} from '@use-gesture/react';
import React, {ReactElement, useMemo, useRef, useState} from 'react';
import {cumulativeSum, sortBy, timeBound} from '../../../lib/data/data';
import './TimeChart.scss';
import {groupColorClass} from './../../../lib/color';

export type TimeChartSeries = {
  label: string;
  data: {
    time: number;
    val: number;
  }[];
  clazz: string;
};

export type TimeChartProps = {
  series: TimeChartSeries[];
  yLabel: string;
  width: number;
  height: number;
};

const TimeChart = (props: TimeChartProps) => {
  const {series, yLabel, width, height} = props;

  console.log(series);

  const [tooltipDatum, setTooltipDatum] = useState<null | {
    x: number;
    y: number;
    title: string;
    label: string;
  }>(null);

  const xPadding = 150;
  const yPadding = 50;

  const minTime = series.reduce(
    (acc, s) =>
      Math.min(
        acc,
        s.data.map((d) => d.time).reduce((a, b) => Math.min(a, b)),
      ),
    1000000,
  );
  const maxTime = series.reduce(
    (acc, s) =>
      Math.max(
        acc,
        s.data.map((d) => d.time).reduce((a, b) => Math.max(a, b)),
      ),
    0,
  );

  const [timeRange, setTimeRange] = useState<[number, number]>([
    minTime,
    maxTime,
  ]);

  const processedSeries = useMemo(
    () =>
      series.map((s) => {
        return {
          label: s.label,
          clazz: s.clazz,
          data: timeBound(cumulativeSum(s.data), timeRange),
        };
      }),
    [series, timeRange],
  );

  const minVal =
    processedSeries === undefined
      ? 0
      : Math.min(
          ...processedSeries.map((s) => Math.min(...s.data.map((d) => d.val))),
        );
  const maxVal =
    processedSeries === undefined
      ? 1000
      : Math.max(
          ...processedSeries.map((s) => Math.max(...s.data.map((d) => d.val))),
        );

  const ref = useRef<SVGSVGElement>(null);
  const bind = useHover(({xy}) => {
    if (processedSeries.length === 0 || ref.current === null) {
      return;
    }
    const parentPos = ref.current.getBoundingClientRect();
    const x = xy[0] - parentPos.left;
    const y = xy[1] - parentPos.top;
    // console.log(x);
    // const time = Math.round(xScaleInverse(x));
    // const val = yScaleInverse(y);

    // setTooltipPos([time, val]);

    // console.log(time, val);

    const closest: {
      x: number;
      y: number;
      title: string;
      label: string;
    } = processedSeries.reduce(
      (acc, s) => {
        if (s.data.length === 0) {
          return acc;
        }
        const sortedData = sortBy(s.data, (d) =>
          Math.sqrt(
            Math.pow(xScale(d.time) - x, 2) + Math.pow(yScale(d.val) - y, 2),
          ),
        );
        console.log(sortedData);
        const closest = sortedData[0];
        const tDist = x - xScale(closest.time);
        const vDist = y - yScale(closest.val);
        const dist = tDist * tDist + vDist * vDist;
        if (dist > 100) {
          return acc;
        }
        console.log(dist);
        if (dist < acc.dist) {
          return {
            x: xScale(closest.time),
            y: yScale(closest.val),
            // x,
            // y,
            title: s.label,
            label: `${closest.val.toLocaleString()}`,
            distance: dist,
          };
        } else {
          return acc;
        }
      },
      {x: -5000, y: -50000, title: '', label: '', dist: Infinity},
    );
    setTooltipDatum(closest);
  });

  if (processedSeries === undefined) {
    return <div>Loading...</div>;
  }

  const xScale = (time: number) => {
    return (
      ((time - timeRange[0]) / (timeRange[1] - timeRange[0])) *
        (width - 2 * xPadding) +
      xPadding
    );
  };

  const yScale = (val: number) => {
    return (
      height -
      ((val - minVal) / (maxVal - minVal)) * (height - 2 * yPadding) -
      yPadding
    );
  };

  const seriesLines = processedSeries.map((s) => {
    let line = s.data.map((d) => [xScale(d.time), yScale(d.val)]);
    if (line.length < 50) {
      // for each new point draw line on x then line on y
      line = line.flatMap((p, i) =>
        i === 0 ? [p] : [[p[0], line[i - 1][1]], p],
      );
    }
    return (
      <polyline
        key={s.label}
        className={`line ${s.clazz}`}
        points={line.map((p) => p.join(',')).join(' ')}
        {...bind()}
      />
    );
  });

  const seriesLabels = processedSeries.map((s) => {
    if (s.data.length === 0) {
      return null;
    }

    const labelPosX = xScale(timeRange[1]) + 10;
    const sorted = sortBy(s.data, (d) => d.time);
    const labelPosYLatest = yScale(sorted[sorted.length - 1].val);

    return (
      <text
        key={s.label}
        x={labelPosX}
        y={labelPosYLatest}
        className={`label ${s.clazz}`}>
        {s.label}
      </text>
    );
  });

  const xAxis = (
    <g className="x-axis">
      <line
        x1={xPadding}
        y1={height - yPadding}
        x2={width - xPadding}
        y2={height - yPadding}
        className="axis"
      />
      <text x={width / 2} y={height - yPadding + 40} textAnchor="middle">
        time (s)
      </text>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        let time = t * (maxTime - minTime) + minTime;
        if (isNaN(time)) {
          time = t;
        }
        const x = xScale(time);
        return (
          <g key={`x-tick-${time}`}>
            <line
              x1={x}
              y1={height - yPadding}
              x2={x}
              y2={height - yPadding + 5}
              className="axis"
            />
            <text key={`x-tick-label-${time}`} x={x} y={height - yPadding + 20}>
              {time.toLocaleString()}
            </text>
          </g>
        );
      })}
    </g>
  );

  const yAxis = (
    <g className="y-axis">
      <line
        x1={xPadding}
        y1={yPadding}
        x2={xPadding}
        y2={height - yPadding}
        className="axis"
      />
      <text x={0} y={height / 2} textAnchor="start" dy="0.35em">
        {yLabel}
      </text>
      {[0, 0.25, 0.5, 0.75, 1].map((y) => {
        let val = y * (maxVal - minVal) + minVal;
        if (isNaN(val)) {
          val = y;
        }
        const yPos = yScale(val);
        return (
          <g key={`y-tick-${val}`}>
            <line
              x1={xPadding}
              y1={yPos}
              x2={xPadding - 5}
              y2={yPos}
              className="axis"
            />
            <text x={xPadding - 10} y={yPos} textAnchor="end" dy="0.35em">
              {val.toLocaleString()}
            </text>
          </g>
        );
      })}
    </g>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tooltip: ReactElement<any, any> | null = null;
  if (tooltipDatum !== null) {
    const yOffset = -20;
    tooltip = (
      <g
        className="tooltip"
        transform={`translate(${tooltipDatum.x}, ${tooltipDatum.y})`}>
        <circle
          cx={0}
          cy={0}
          r={5}
          className={groupColorClass(tooltipDatum.title)}
        />
        {/* <rect
          x={-labelWidth / 2}
          y={yOffset - 20}
          width={labelWidth}
          height={20}
          fill="white"
        /> */}
        <text
          x={0}
          y={yOffset}
          textAnchor="middle"
          className={groupColorClass(tooltipDatum.title)}>
          {tooltipDatum.label}
        </text>
      </g>
    );
  }

  const handleChange2 = (
    event: Event,
    newValue: number | [number, number],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    const minDistance = 20;

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], maxTime - minDistance);
        setTimeRange([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minTime + minDistance);
        setTimeRange([clamped - minDistance, clamped]);
      }
    } else {
      setTimeRange(newValue as [number, number]);
    }
  };

  return (
    <div className="TimeChart">
      <svg width={width} height={height} ref={ref}>
        {seriesLines}
        {seriesLabels}
        {xAxis}
        {yAxis}
        {tooltip}
      </svg>
      <div
        className="controls"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem',
        }}>
        <label>Window Size:</label>
        <Slider
          valueLabelDisplay="auto"
          // step={1}
          // marks
          value={timeRange}
          onChange={handleChange2}
          min={minTime || 0}
          max={maxTime || 100000}
          // bounds={[minTime, maxTime]}
          aria-labelledby="discrete-slider-restrict"
          valueLabelFormat={(v) => `${v}s`}
        />
      </div>
    </div>
  );
};

export default TimeChart;
