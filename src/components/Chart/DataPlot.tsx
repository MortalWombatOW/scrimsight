/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/no-array-index-key */
import React, {useState} from 'react';
import {MenuItem, Select} from '@mui/material';
import {stringHash} from '../../lib/string';
import {Dataset} from '../../lib/data/types';

const colorPalette = [
  '#4c78a8',
  '#9ecae9',
  '#f58518',
  '#ffbf79',
  '#54a24b',
  '#88d27a',
  '#b79a20',
  '#f2cf5b',
  '#439894',
  '#83bcb6',
  '#e45756',
  '#ff9d98',
  '#79706e',
  '#bab0ac',
  '#d67195',
  '#fcbfd2',
  '#b2cde5',
  '#d6a5c9',
  '#9e765f',
  '#d8b5a5',
];

const mapValueToColor = (value: number): string => {
  const color = colorPalette[value % colorPalette.length];

  return color;
};

const ScatterPlot = (props: DataPlotInnerProps) => {
  const {
    dataset,
    width,
    height,
    xCol,
    yCol,
    cCol,
    sCol,
    colorScale,
    sizeScale,
  } = props;

  const hasColorCol = cCol !== null;
  const hasSizeCol = sCol !== null;

  const xI = dataset.columns.findIndex((col) => col.name === xCol);
  const yI = dataset.columns.findIndex((col) => col.name === yCol);
  const cI = hasColorCol
    ? dataset.columns.findIndex((col) => col.name === cCol)
    : null;
  const sI = hasSizeCol
    ? dataset.columns.findIndex((col) => col.name === sCol)
    : null;

  const xMin = Math.min(...dataset.rows.map((row) => row[xI]));
  const xMax = Math.max(...dataset.rows.map((row) => row[xI]));
  const yMin = Math.min(...dataset.rows.map((row) => row[yI]));
  const yMax = Math.max(...dataset.rows.map((row) => row[yI]));

  const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * width;

  const yScale = (y: number) => (1 - (y - yMin) / (yMax - yMin)) * height;

  return (
    <g>
      {dataset.rows.map((row, i) => {
        const x = xScale(Number.parseFloat(row[xI]));
        const y = yScale(Number.parseFloat(row[yI]));
        const c = colorScale(hasColorCol ? row[cI] : 0);
        const s = sizeScale(hasSizeCol ? row[sI] : 0);
        return (
          <circle
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            cx={x}
            cy={y}
            r={s}
            fill={c}
          />
        );
      })}
      {/* x axis */}
      <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke="black"
        strokeWidth={1}
      />
      {/* y axis */}
      <line x1={0} y1={0} x2={0} y2={height} stroke="black" strokeWidth={1} />
      {/* x axis ticks and labels */}
      {[...Array(10).keys()].map((i) => {
        const x = i * (width / 10);
        return (
          <g key={i}>
            <line
              x1={x}
              y1={height}
              x2={x}
              y2={height + 5}
              stroke="black"
              strokeWidth={1}
            />
            <text
              x={x}
              y={height + 20}
              textAnchor="middle"
              alignmentBaseline="middle">
              {((x / width) * (xMax - xMin) + xMin).toFixed(2)}
            </text>
          </g>
        );
      })}
      {/* y axis ticks and labels */}
      {[...Array(10).keys()].map((i) => {
        const y = i * (height / 10);
        return (
          <g key={i}>
            <line x1={0} y1={y} x2={-5} y2={y} stroke="black" strokeWidth={1} />
            <text x={-10} y={y + 5} textAnchor="end">
              {((1 - y / height) * (yMax - yMin) + yMin).toFixed(2)}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const Legend = (props: DataPlotInnerProps) => {
  const {dataset, cCol, colorScale, xOffset, yOffset} = props;

  const hasColorCol = cCol !== null;

  const cI = hasColorCol
    ? dataset.columns.findIndex((col) => col.name === cCol)
    : null;

  const uniqueCategories = [
    ...new Set(dataset.rows.map((row) => row[cI] as string)),
  ];

  return (
    <g>
      {uniqueCategories.map((category, i) => {
        const color = colorScale(hasColorCol ? category : 0);
        return (
          <g key={i}>
            <circle cx={xOffset} cy={yOffset + i * 20} r={5} fill={color} />
            <text x={xOffset + 10} y={yOffset + i * 20 + 5} textAnchor="start">
              {category}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const DataPlot = (props: DataPlotProps) => {
  const {dataset, width, height} = props;

  const xPadding = 50;
  const yPadding = 50;

  const [chartType, setChartType] = useState<string>('scatter');
  const [xCol, setXCol] = useState<string | null>(null);
  const [yCol, setYCol] = useState<string | null>(null);
  const [cCol, setCCol] = useState<string | null>(null);
  const [sCol, setSCol] = useState<string | null>(null);

  const hasColorCol = cCol !== null;
  const hasSizeCol = sCol !== null;
  const cI = dataset.columns.findIndex((col) => col.name === cCol);
  const sI = dataset.columns.findIndex((col) => col.name === sCol);
  const hasLegend = hasColorCol || hasSizeCol;
  const innerWidth = width - xPadding * 2;
  const innerHeight = height - yPadding * 2;
  const mainChartWidth = innerWidth - (hasLegend ? 150 : 0);
  const mainChartHeight = innerHeight;

  let colorScale: (value: any) => string;

  if (hasColorCol) {
    const categoryIsNumeric =
      dataset.columns.filter((col) => col.name === cCol)[0].type === 'number';

    // let colorScale: (value: any) => string;
    if (categoryIsNumeric) {
      /// //todo add support for numeric categories
      return null;
    }
    const uniqueCategories = new Set(dataset.rows.map((row) => row[cI])).size;
    if (uniqueCategories > colorPalette.length) {
      console.warn(
        `Too many categories (${uniqueCategories}) for color palette (${colorPalette.length})`,
      );
      return null;
    }
    colorScale = (value: any) => mapValueToColor(stringHash(value));
  } else {
    colorScale = (value: any) => colorPalette[0];
  }
  let sizeScale: (value: number) => number;
  if (hasSizeCol) {
    const sMin = Math.min(
      ...dataset.rows.map((row) => Number.parseFloat(row[sI])),
    );
    const sMax = Math.max(
      ...dataset.rows.map((row) => Number.parseFloat(row[sI])),
    );
    sizeScale = (s: number) => ((s - sMin) / (sMax - sMin)) * 20;
  } else {
    sizeScale = (value: number) => 2;
  }

  return (
    <div className="dataplot">
      <div className="DataPlot-controls">
        <Select
          label="Chart type"
          value={chartType}
          onChange={(e) => setChartType(e.target.value as string)}>
          <MenuItem value="line">Line</MenuItem>
          <MenuItem value="scatter">Scatter</MenuItem>
          <MenuItem value="bar">Bar</MenuItem>
        </Select>
        <Select
          label="X Col"
          value={xCol}
          onChange={(e) => setXCol(e.target.value as string)}>
          {dataset.columns
            .filter((Col) => Col.type === 'number')
            .map((Col) => (
              <MenuItem key={Col.name} value={Col.name}>
                {Col.name}
              </MenuItem>
            ))}
        </Select>
        <Select
          label="Y Col"
          value={yCol}
          onChange={(e) => setYCol(e.target.value as string)}>
          {dataset.columns
            .filter((Col) => Col.type === 'number')
            .map((Col) => (
              <MenuItem key={Col.name} value={Col.name}>
                {Col.name}
              </MenuItem>
            ))}
        </Select>
        <Select
          label="Color Col"
          value={cCol}
          onChange={(e) =>
            setCCol(
              (e.target.value as string) === ''
                ? null
                : (e.target.value as string),
            )
          }>
          <MenuItem value="">None</MenuItem>
          {dataset.columns
            .filter((Col) => Col.type === 'string')
            .map((Col) => (
              <MenuItem key={Col.name} value={Col.name}>
                {Col.name}
              </MenuItem>
            ))}
        </Select>
        <Select
          label="Size Col"
          value={sCol}
          onChange={(e) =>
            setSCol(
              (e.target.value as string) === ''
                ? null
                : (e.target.value as string),
            )
          }>
          <MenuItem value="">None</MenuItem>
          {dataset.columns
            .filter((Col) => Col.type === 'number')
            .map((Col) => (
              <MenuItem key={Col.name} value={Col.name}>
                {Col.name}
              </MenuItem>
            ))}
        </Select>
      </div>
      {xCol && yCol && (
        <svg width={width} height={height}>
          {chartType === 'scatter' && (
            <ScatterPlot
              dataset={dataset}
              width={mainChartWidth}
              height={mainChartHeight}
              xCol={xCol}
              yCol={yCol}
              cCol={cCol}
              sCol={sCol}
              colorScale={colorScale}
              sizeScale={sizeScale}
              xOffset={xPadding}
              yOffset={yPadding}
            />
          )}
          {hasLegend && (
            <Legend
              dataset={dataset}
              width={mainChartWidth}
              height={mainChartHeight}
              xCol={xCol}
              yCol={yCol}
              cCol={cCol}
              sCol={sCol}
              colorScale={colorScale}
              sizeScale={sizeScale}
              xOffset={xPadding + mainChartWidth}
              yOffset={yPadding}
            />
          )}
        </svg>
      )}
    </div>
  );
};

interface DataPlotProps {
  dataset: Dataset;
  width: number;
  height: number;
}

interface DataPlotInnerProps {
  dataset: Dataset;
  xOffset: number;
  yOffset: number;
  width: number;
  height: number;
  xCol: string;
  yCol: string;
  cCol: string | null;
  sCol: string | null;
  colorScale: (value: any) => string;
  sizeScale: (value: number) => number;
}

export default DataPlot;
