/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
import React, {useEffect, useRef, useState} from 'react';

const computeHistogram = (data: number[], bins: number): number[] => {
  const histogram = new Array(bins).fill(0);
  const data2 = data.map((d) => (Number.isNaN(d) ? 0 : d));
  const min = Math.min(...data2);
  const max = Math.max(...data2);
  const range = max - min;
  const binSize = range / bins;
  // eslint-disable-next-line no-restricted-syntax
  for (const value of data2) {
    const bin = Math.floor((value - min) / binSize);
    // eslint-disable-next-line no-plusplus
    histogram[bin] = Number.isNaN(histogram[bin]) ? 1 : histogram[bin] + 1;
  }
  return histogram;
};

const binToValue = (
  bin: number,
  min: number,
  max: number,
  bins: number,
): number => {
  const range = max - min;
  const binSize = range / bins;
  return min + bin * binSize;
};

interface HistogramProps {
  data: number[];
  onSelectionChange: (min: number, max: number) => void;
  width: number;
  height: number;
  bins: number;
}

const Histogram = (props: HistogramProps) => {
  const rectRefs = useRef<Map<number, React.RefObject<SVGRectElement>>>(
    new Map(),
  );
  const {data, onSelectionChange, width, height, bins} = props;
  const [selectStart, setSelectStart] = useState<number | null>(null);
  const [selectEnd, setSelectEnd] = useState<number | null>(null);
  const [histogram, setHistogram] = useState<number[]>([]);
  useEffect(() => setHistogram(computeHistogram(data, bins)), [data, bins]);
  // const minValue = Math.min(...data);
  // const maxValue = Math.max(...data);

  useEffect(() => {
    histogram.forEach((count, key) =>
      rectRefs.current.set(key, React.createRef<SVGRectElement>()),
    );
  }, [histogram]);

  const getSelected = () => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    if (selectStart === null || selectEnd === null) {
      return [binToValue(0, min, max, bins), binToValue(bins, min, max, bins)];
    }
    const start = binToValue(Math.min(selectStart, selectEnd), min, max, bins);
    const end = binToValue(Math.max(selectStart, selectEnd), min, max, bins);
    return [start, end];
  };

  // useEffect(() => {
  //   if (selectStart !== null && selectEnd !== null) {
  //     getSelected().forEach((key) => {
  //       const rect = rectRefs.current.get(key);
  //       if (rect && rect.current) {
  //         rect.current.setAttribute('fill', '#ff0000');
  //       }
  //     });
  //   }
  // }, [selectStart, selectEnd]);

  useEffect(() => {
    if (selectStart !== null) {
      const rect = rectRefs.current.get(selectStart);
      if (rect && rect.current) {
        rect.current.classList.add('selected');
      }
    }
  }, [selectStart]);

  useEffect(() => {
    if (selectEnd !== null) {
      const rect = rectRefs.current.get(selectEnd);
      if (rect && rect.current) {
        rect.current.classList.add('selected');
      }
    }
  }, [selectEnd]);

  const mouseOver = (e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
    const target = e.target as SVGPathElement;
    const value = target.getAttribute('data-value');
    // target.setAttribute('fill', 'green');
    target.classList.add('datahover');
    if (value) {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const tooltip = document.getElementById('tooltip');
      if (tooltip) {
        tooltip.innerHTML = `${binToValue(
          Number(value),
          Math.min(...data),
          Math.max(...data),
          bins,
        ).toFixed(2)}: ${histogram[Number(value)]} events`;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.style.display = 'block';
      }
    }
    if (selectStart !== null && value !== null) {
      setSelectEnd(parseInt(value, 10));
    }
  };

  const mouseOut = (e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
    const target = e.target as SVGPathElement;
    target.classList.remove('datahover');

    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  };

  const mouseDown = (e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
    const target = e.target as SVGPathElement;
    setSelectStart(parseInt(target.getAttribute('data-value') || '0', 10));
  };

  const mouseUp = () => {
    const range = getSelected();
    onSelectionChange(range[0], range[1]);
    setSelectStart(null);
    setSelectEnd(null);
  };

  // const xScale = (value: number) => ((value - minValue) / (maxValue - minValue)) * width;
  const yScale = (value: number) =>
    height * (1 - value / Math.max(...histogram));
  const yScaleInverse = (value: number) =>
    Math.max(...histogram) * (1 - value / height);

  return (
    <div className="histogram">
      <svg
        width={`${width + 100}px`}
        height={`${height + 40}px`}
        viewBox={`-60 -10 ${width + 100} ${height + 40}`}>
        <g transform="translate(0,0)">
          {histogram.map((frequency, bin) => (
            <rect
              key={bin}
              x={(bin / bins) * width}
              y={yScale(frequency)}
              width={width / bins}
              height={height - yScale(frequency)}
              data-value={`${bin}`}
              onMouseOver={mouseOver}
              onMouseOut={mouseOut}
              onMouseDown={mouseDown}
              onMouseUp={mouseUp}
              ref={rectRefs.current.get(bin)}
              className="datapoint"
            />
          ))}
        </g>
        <g transform="translate(0, 0)">
          {/* x axis */}
          <line x1={0} y1={height} x2={width} y2={height} className="axis" />
          {/* y axis */}
          <line x1={0} y1={0} x2={0} y2={height} className="axis" />
          {/* highlight selected bins */}
          {selectStart !== null && selectEnd !== null && (
            <rect
              x={(Math.min(selectStart, selectEnd) / bins) * width}
              y={0}
              width={(Math.abs(selectEnd - selectStart) / bins) * width}
              height={height}
              className="selection"
            />
          )}
          {/* x axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((x) => (
            <text
              key={x}
              x={x * width}
              y={height + 20}
              className="axis-label"
              textAnchor="middle">
              {/* two decimal */}
              {binToValue(
                x * bins,
                Math.min(...data),
                Math.max(...data),
                bins,
              ).toFixed(2)}
            </text>
          ))}
          {/* y axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((y) => (
            <text
              key={y}
              x={-10}
              y={y * height + 10}
              className="axis-label"
              textAnchor="end">
              {/* two decimal */}
              {yScaleInverse(y * height).toFixed(2)}
            </text>
          ))}
        </g>
      </svg>
      <div id="tooltip" style={{display: 'none'}} />
    </div>
  );
};

export default Histogram;
