import React from 'react';
import { stringHash } from '../../shared';

const colorPalette = [
  '#00bcd4',
  '#ff9800',
  '#9c27b0',
  '#009688',
  '#ff5722',
  '#795548',
  '#607d8b',
  '#3f51b5',
  '#2196f3',
  '#e91e63',
  '#cddc39',
  '#9e9e9e',
  '#8bc34a',
  '#673ab7',
  '#ffeb3b',
];

const mapValueToColor = (value: number): string => {
  const color = colorPalette[value % colorPalette.length];

  return color;
};

const DataPlot = (props: DataPlotProps) => {
  const {
    data, width, height, legend,
  } = props;

  const xMin = Math.min(...data.map((d) => d[0]));
  const xMax = Math.max(...data.map((d) => d[0]));
  const yMin = Math.min(...data.map((d) => d[1]));
  const yMax = Math.max(...data.map((d) => d[1]));
  const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
  const yScale = (y: number) => (1 - ((y - yMin) / (yMax - yMin))) * height;
  const xScaleInverse = (x: number) => ((x / width) * (xMax - xMin)) + xMin;
  const yScaleInverse = (y: number) => (1 - (y / height)) * (yMax - yMin) + yMin;

  return (
    <div className="dataplot">
      <svg width={width + 250} height={height + 50} viewBox={`-50 -20 ${width + 250} ${height + 50}`}>
        <g>

          {data.map(([x, y, c], i) => (
            <circle
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              cx={xScale(x)}
              cy={yScale(y)}
              r="2"
              className="datapoint"
              fill={mapValueToColor(c)}
            />
          ))}
        </g>
        <g>
          {/* x axis */}
          <line
            x1={xScale(xMin)}
            y1={height}
            x2={xScale(xMax)}
            y2={height}
            className="axis"
          />
          {/* y axis */}
          <line
            x1={0}
            y1={yScale(yMin)}
            x2={0}
            y2={yScale(yMax)}
            className="axis"
          />
          {/* x labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((i) => (
            <text
              key={i}
              x={i * width}
              y={height + 20}
              className="axis-label"
              textAnchor="middle"
            >
              {xScaleInverse(i * width).toFixed(2)}
            </text>
          ))}
          {/* y labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((i) => (
            <text
              key={i}
              x={-10}
              y={i * height}
              className="axis-label"
              textAnchor="end"
            >
              {yScaleInverse(i * height).toFixed(2)}
            </text>
          ))}
          {/* legend */}
          {legend.map((label, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <g key={i}>
              <circle
                cx={width + 20}
                cy={i * 20 + 10}
                r="2"
                className="datapoint"
                fill={mapValueToColor(stringHash(label))}
              />
              <text
                x={width + 30}
                y={i * 20 + 10}
                className="legend-label"
              >
                {label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

interface DataPlotProps {
    data: number[][];
    width: number;
    height: number;
    legend: string[];
}

export default DataPlot;
