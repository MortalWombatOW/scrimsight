/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import Dataset from '../services/Dataset';
import DataRow from '../services/DataRow';
import { stringHash } from '../../lib/string';

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
    dataset, width, height, xField, yField, cField, sField, colorScale, sizeScale,
  } = props;

  const hasColorField = cField !== null;
  const hasSizeField = sField !== null;

  const xMin = Math.min(...dataset.map((row) => Number.parseFloat(row.get(xField))) as number[]);
  const xMax = Math.max(...dataset.map((row) => Number.parseFloat(row.get(xField))) as number[]);
  const yMin = Math.min(...dataset.map((row) => Number.parseFloat(row.get(yField))) as number[]);
  const yMax = Math.max(...dataset.map((row) => Number.parseFloat(row.get(yField))) as number[]);

  const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * width;

  const yScale = (y: number) => (1 - ((y - yMin) / (yMax - yMin))) * height;

  return (
    <g>
      {dataset.map((point, i) => {
        const x = xScale(Number.parseFloat(point.get(xField)));
        const y = yScale(Number.parseFloat(point.get(yField)));
        const c = colorScale(hasColorField ? point.get(cField!) : 0);
        const s = sizeScale(hasSizeField ? Number.parseFloat(point.get(sField!)) : 0);
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
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={height}
        stroke="black"
        strokeWidth={1}
      />
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
              alignmentBaseline="middle"
            >
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
            <line
              x1={0}
              y1={y}
              x2={-5}
              y2={y}
              stroke="black"
              strokeWidth={1}
            />
            <text
              x={-10}
              y={y + 5}
              textAnchor="end"
            >
              {((1 - (y / height)) * (yMax - yMin) + yMin).toFixed(2)}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const Legend = (props: DataPlotInnerProps) => {
  const {
    dataset, cField, colorScale, xOffset, yOffset,
  } = props;

  const hasColorField = cField !== null;

  const uniqueCategories = [...new Set(dataset.map((row: DataRow) => row.get(cField!) as string))];

  return (
    <g>
      {uniqueCategories.map((category, i) => {
        const color = colorScale(hasColorField ? category : 0);
        return (
          <g key={i}>
            <circle
              cx={xOffset}
              cy={yOffset + i * 20}
              r={5}
              fill={color}
            />
            <text
              x={xOffset + 10}
              y={yOffset + i * 20 + 5}
              textAnchor="start"
            >
              {category}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const DataPlot = (props: DataPlotProps) => {
  const {
    dataset, width, height,
  } = props;

  const xPadding = 50;
  const yPadding = 50;

  const [chartType, setChartType] = useState<string>('scatter');
  const [xField, setXField] = useState<string | null>(null);
  const [yField, setYField] = useState<string | null>(null);
  const [cField, setCField] = useState<string | null>(null);
  const [sField, setSField] = useState<string | null>(null);

  const hasColorField = cField !== null;
  const hasSizeField = sField !== null;
  const hasLegend = hasColorField || hasSizeField;
  const innerWidth = width - xPadding * 2;
  const innerHeight = height - yPadding * 2;
  const mainChartWidth = innerWidth - (hasLegend ? 150 : 0);
  const mainChartHeight = innerHeight;

  let colorScale: (value: any) => string;

  if (hasColorField) {
    const categoryIsNumeric = dataset.getFields().filter((field) => field.name === cField)[0].type === 'number';

    // let colorScale: (value: any) => string;
    if (categoryIsNumeric) {
    /// //todo add support for numeric categories
      return null;
    }
    const uniqueCategories = new Set(dataset.getField(cField!)).size;
    if (uniqueCategories > colorPalette.length) {
      console.warn(`Too many categories (${uniqueCategories}) for color palette (${colorPalette.length})`);
      return null;
    }
    colorScale = (value: any) => mapValueToColor(stringHash(value));
  } else {
    colorScale = (value: any) => colorPalette[0];
  }
  let sizeScale: (value: number) => number;
  if (hasSizeField) {
    const sMin = Math.min(...dataset.map((row) => Number.parseFloat(row.get(sField!))) as number[]);
    const sMax = Math.max(...dataset.map((row) => Number.parseFloat(row.get(sField!))) as number[]);
    sizeScale = (s: number) => ((s - sMin) / (sMax - sMin)) * 20;
  } else {
    sizeScale = (value: number) => 2;
  }

  return (
    <div className="dataplot">
      <div className="DataPlot-controls">
        <Select label="Chart type" value={chartType} onChange={(e) => setChartType(e.target.value as string)}>
          <MenuItem value="line">Line</MenuItem>
          <MenuItem value="scatter">Scatter</MenuItem>
          <MenuItem value="bar">Bar</MenuItem>
        </Select>
        <Select label="X field" value={xField} onChange={(e) => setXField(e.target.value as string)}>
          {dataset.getFields().filter((field) => field.type === 'number').map((field) => (
            <MenuItem key={field.name} value={field.name}>{field.name}</MenuItem>
          ))}
        </Select>
        <Select label="Y field" value={yField} onChange={(e) => setYField(e.target.value as string)}>
          {dataset.getFields().filter((field) => field.type === 'number').map((field) => (
            <MenuItem key={field.name} value={field.name}>{field.name}</MenuItem>
          ))}
        </Select>
        <Select label="Color field" value={cField} onChange={(e) => setCField((e.target.value as string) === '' ? null : (e.target.value as string))}>
          <MenuItem value="">None</MenuItem>
          {dataset.getFields().filter((field) => field.type === 'string').map((field) => (
            <MenuItem key={field.name} value={field.name}>{field.name}</MenuItem>
          ))}
        </Select>
        <Select label="Size field" value={sField} onChange={(e) => setSField((e.target.value as string) === '' ? null : (e.target.value as string))}>
          <MenuItem value="">None</MenuItem>
          {dataset.getFields().filter((field) => field.type === 'number').map((field) => (
            <MenuItem key={field.name} value={field.name}>{field.name}</MenuItem>
          ))}
        </Select>
      </div>
      {xField && yField && (
      <svg width={width} height={height}>
        {chartType === 'scatter' && (
        <ScatterPlot
          dataset={dataset}
          width={mainChartWidth}
          height={mainChartHeight}
          xField={xField}
          yField={yField}
          cField={cField}
          sField={sField}
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
          xField={xField}
          yField={yField}
          cField={cField}
          sField={sField}
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
  xField: string;
  yField: string;
  cField: string | null;
  sField: string | null;
  colorScale: (value: any) => string;
  sizeScale: (value: number) => number;
}

export default DataPlot;
