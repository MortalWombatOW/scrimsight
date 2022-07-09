import React, {useEffect, useRef, useState} from 'react';
import {MetricData, Statistic} from '../../lib/data/types';
import './StackedBarChart.scss';
import {flatten, getObjectDepth} from './../../lib/data/metrics';
import {groupColorClass} from '../../lib/color';
import {Button, IconButton} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Sort, TableRows} from '@mui/icons-material';
export interface StackedBarChartDatum {
  value: number;
  primaryGroup: string;
  secondaryGroup?: string;
  clazz: string;
}

interface StackedBarChartProps {
  data: MetricData;

  barHeight: number;
}

const StackedBarChart = (props: StackedBarChartProps) => {
  const {data, barHeight} = props;
  const [oneHundredPercentMode, setOneHundredPercentMode] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(1);
  const [width, setWidth] = useState<number>(1);

  const [, setTooltipDatum] = useState<null | StackedBarChartDatum>(null);
  const [sortFn, setSortFn] = useState<string>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  // const primaryGroups = Array.from(new Set(data.map((d) => d.barGroup)));
  // primaryGroups.sort();

  // get width of longest primary group in px
  const depth = getObjectDepth(data);
  const hasInnerGroups = depth > 1;

  useEffect(() => {
    if (wrapperRef.current) {
      setHeight(wrapperRef.current.clientHeight);
      setWidth(wrapperRef.current.clientWidth);
    }
  }, [wrapperRef.current]);

  useEffect(() => {
    if (!hasInnerGroups) {
      setOneHundredPercentMode(false);
    }
  }, [hasInnerGroups]);
  const cumSumBySecondaryGroup =
    depth > 1 ? (flatten(data, 2) as Statistic) : undefined;

  const computeRatioSort = (a: string, b: string) => {
    const ratios = [a, b].map((k) => {
      const value = cumSumBySecondaryGroup
        ? cumSumBySecondaryGroup[k][Object.keys(cumSumBySecondaryGroup[k])[0]]
        : cumSumByPrimaryGroup[k];
      const firstValue = cumSumBySecondaryGroup
        ? cumSumBySecondaryGroup[k][Object.keys(cumSumBySecondaryGroup[k])[1]]
        : cumSumByPrimaryGroup[k];
      const ratio = value / firstValue;
      console.log(a, b, value, firstValue, ratio);
      console.log(Object.keys(cumSumBySecondaryGroup![a]));
      return ratio;
    });
    return ratios[1] - ratios[0];
  };

  // need to calculate the start x for each data point
  const cumSumByPrimaryGroup: Statistic = flatten(data, 1) as Statistic;
  // const ratioByPrimaryGroup: Statistic | undefined =  (flatten(data, 2) as Statistic
  // sort keys by value
  const sortedPrimaryGroups = Object.keys(cumSumByPrimaryGroup).sort(
    (a, b) =>
      (sortFn === 'total'
        ? cumSumByPrimaryGroup[b] - cumSumByPrimaryGroup[a]
        : sortFn === 'ratio'
        ? computeRatioSort(a, b)
        : a.localeCompare(b)) * (sortDirection === 'asc' ? 1 : -1),
  );

  const maxPrimaryGroupSum = Math.max(...Object.values(cumSumByPrimaryGroup));
  const primaryGroupWidth = 150;

  const leftPadding = primaryGroupWidth + 10;
  let xScale = (value: number) => {
    return (value / maxPrimaryGroupSum) * (width - leftPadding);
  };

  const bars = sortedPrimaryGroups.map((group) => {
    const dataForGroup = data[group];
    const total = cumSumByPrimaryGroup[group];

    const inner = (depth > 1 ? Object.keys(dataForGroup) : [0]).map(
      (withinGroup, i) => {
        const value = cumSumBySecondaryGroup
          ? cumSumBySecondaryGroup[group][withinGroup]
          : total;
        const height = barHeight - 5;

        if (oneHundredPercentMode) {
          xScale = (value: number) => {
            return (value / total) * (width - leftPadding);
          };
        }
        const barWidth = xScale(value);

        const datum: StackedBarChartDatum = {
          value,
          primaryGroup: group,
          secondaryGroup: depth > 1 ? withinGroup : undefined,
          clazz: groupColorClass(withinGroup) || withinGroup,
        };

        return (
          <div
            key={`${group}-${withinGroup}`}
            style={{
              width: barWidth,
              height,
              lineHeight: barHeight - 5 + 'px',
            }}
            onMouseEnter={() => {
              setTooltipDatum(datum);
            }}
            onMouseLeave={() => {
              setTooltipDatum(null);
            }}
            className={`bar color-${i + 1}`}>
            {withinGroup === 0 ? '' : withinGroup}
          </div>
        );
      },
    );

    const comparison =
      Object.keys(dataForGroup).length == 2
        ? Object.keys(dataForGroup).map((withinGroup, i) => {
            if (i === 1) {
              return null;
            }
            const value = cumSumBySecondaryGroup
              ? cumSumBySecondaryGroup[group][withinGroup]
              : total;
            const firstValue = cumSumBySecondaryGroup
              ? cumSumBySecondaryGroup[group][Object.keys(dataForGroup)[1]]
              : total;
            const ratio = value / firstValue;
            return (
              <span key={`${group}-${withinGroup}`} style={{marginLeft: 20}}>
                {`${ratio.toFixed(2)}x`}
              </span>
            );
          })
        : null;

    return (
      <tr key={group} className="barWrapper">
        <td
          className="grouplabel"
          style={{
            // width: leftPadding,
            lineHeight: `${barHeight - 5}px`,
          }}>
          {group}
        </td>
        <td className="barContainer">{inner}</td>
        <td
          className="grouptotal"
          style={{
            lineHeight: `${barHeight - 5}px`,
          }}>
          {total.toLocaleString()}
        </td>
        <td>{comparison}</td>
      </tr>
    );
  });

  // const endLabels = primaryGroups.map((group, i) => {
  //   const dataForGroup = data.filter((d) => d.barGroup === group);
  //   const total = dataForGroup.reduce((acc, d) => acc + d.value, 0);
  //   const x = xScale(total) + leftPadding;
  //   const prettyTotal = total.toLocaleString();
  //   return (
  //     <text
  //       key={group}
  //       x={x + 5}
  //       y={i * barHeight + barHeight / 2}
  //       textAnchor="start"
  //       dominantBaseline="middle">
  //       {prettyTotal}
  //     </text>
  //   );
  // });

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
    <div className="StackedBarChart" ref={wrapperRef}>
      <table>
        <thead>
          <tr>
            <th style={{textAlign: 'right'}}>Primary Group</th>
            <th>
              <span
                onClick={() =>
                  setOneHundredPercentMode(!oneHundredPercentMode)
                }>
                Metric
                <span className="icon">
                  {oneHundredPercentMode ? (
                    <Sort fontSize="small" />
                  ) : (
                    <TableRows fontSize="inherit" />
                  )}
                </span>
              </span>
            </th>
            <th onClick={() => setSortFn('total')}>
              Total
              {sortFn === 'total' ? (
                <span className="icon">
                  <NavigateNextIcon
                    // viewBox="-10 -20 40 40"
                    fontSize="small"
                    sx={{
                      transform: `rotate(${
                        sortDirection == 'asc' ? 90 : -90
                      }deg)`,
                      transition: 'rotate 0.2s ease-in-out',
                    }}
                    onClick={() =>
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                    }
                  />
                </span>
              ) : null}
            </th>
            <th onClick={() => setSortFn('ratio')}>
              Ratio
              {sortFn === 'ratio' ? (
                <span className="icon">
                  <NavigateNextIcon
                    // viewBox="-10 -20 40 40"
                    fontSize="small"
                    sx={{
                      transform: `rotate(${
                        sortDirection == 'asc' ? 90 : -90
                      }deg)`,
                      transition: 'rotate 0.2s ease-in-out',
                    }}
                    onClick={() =>
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                    }
                  />
                </span>
              ) : null}
            </th>
          </tr>
        </thead>
        <tbody>{bars}</tbody>
      </table>
      {/* {tooltip} */}
      <IconButton
        aria-label="delete"
        style={{
          position: 'relative',
          top: 50,
          left: width + 100,
        }}>
        <AutoGraphIcon />
      </IconButton>
    </div>
  );
};

export default StackedBarChart;
