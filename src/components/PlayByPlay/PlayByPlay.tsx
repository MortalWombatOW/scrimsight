import React, {useEffect, useMemo, useRef, useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import './PlayByPlay.scss';
// import ThreeRenderer from '../ThreeRenderer/ThreeRenderer';
import Candlestick, {
  toMetricPeriod,
  toPointData,
} from '~/components/Chart/Candlestick';
import useScrimsightEvents from '../../hooks/useScrimsightEvents';

const Timeline = ({
  events,
  width,
  height,
}: {
  events: object[];
  width: number;
  height: number;
}) => {
  const [categoryKey, setCategoryKey] = useState('Player Name');
  const [subcategoryKey, setSubcategoryKey] = useState('Target Name');
  const validCategories = [
    'Player Name',
    'Player Team',
    'Target Name',
    'Target Team',
  ];

  const [period, setPeriod] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [windowLength, setWindowLength] = useState(200);
  const [topMetric, setTopMetric] = useState('healing_received');
  const [bottomMetric, setBottomMetric] = useState('damage_received');
  const validMetrics = {
    damage: 'Damage Done',
    healing: 'Healing Done',
    damage_received: 'Damage Received',
    healing_received: 'Healing Received',
  };

  const candlestickData = useMemo(
    () =>
      toMetricPeriod(
        events,
        period,
        topMetric,
        bottomMetric,
        categoryKey,
        subcategoryKey,
        startTime,
        windowLength,
      ),
    [
      events,
      period,
      categoryKey,
      subcategoryKey,
      startTime,
      windowLength,
      topMetric,
      bottomMetric,
    ],
  );

  const pointData = useMemo(
    () => toPointData(events, startTime, windowLength, categoryKey),
    [events, startTime, windowLength, categoryKey],
  );
  // console.log('candlestickData', candlestickData);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 10,
        flexGrow: 1,
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 10,
          // lineHeight: '36px',
        }}>
        <div style={{width: 100}}>Category</div>
        <select
          value={categoryKey}
          onChange={(e) => setCategoryKey(e.target.value)}>
          {validCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div style={{width: 100}}>Subcategory</div>
        <select
          value={subcategoryKey}
          onChange={(e) => setSubcategoryKey(e.target.value)}>
          {validCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div style={{width: 100}}>Period</div>
        <select
          value={period}
          onChange={(e) => setPeriod(parseInt(e.target.value))}>
          {[1, 2, 5, 10, 15, 30, 60].map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
        <div style={{width: 100}}>Start Time</div>
        <input
          type="number"
          value={startTime}
          onChange={(e) => setStartTime(parseInt(e.target.value))}
        />
        <div style={{width: 100}}>Window Length</div>
        <input
          type="number"
          value={windowLength}
          onChange={(e) => setWindowLength(parseInt(e.target.value))}
        />
        <div style={{width: 100}}>Top Metric</div>
        <select
          value={topMetric}
          onChange={(e) => setTopMetric(e.target.value)}>
          {Object.entries(validMetrics).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <div style={{width: 100}}>Bottom Metric</div>
        <select
          value={bottomMetric}
          onChange={(e) => setBottomMetric(e.target.value)}>
          {Object.entries(validMetrics).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <Candlestick
        metricName="Health change"
        barData={candlestickData}
        pointData={pointData}
        width={width}
        height={height}
      />
    </div>
  );
};

const PlayByPlay = ({
  mapId,
  onLoaded,
}: {
  mapId: number;
  onLoaded: () => void;
}) => {
  const [events, loaded] = useScrimsightEvents(mapId);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const ref = useRef(null);

  useEffect(() => {
    if (loaded) {
      onLoaded();
    }
  }, [loaded]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      // Depending on the layout, you may need to swap inlineSize with blockSize
      // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
      setWidth(event[0].contentBoxSize[0].inlineSize);
      setHeight(event[0].contentBoxSize[0].blockSize);
    });

    if (ref && ref.current) {
      resizeObserver.observe(ref.current);
    }
  });

  return (
    <div
      ref={ref}
      style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
      <Timeline events={events} width={width} height={height} />
    </div>
  );
};

export default PlayByPlay;
