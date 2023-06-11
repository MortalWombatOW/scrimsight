import React, {useEffect, useMemo, useState} from 'react';
import './PlayByPlay.scss';
import useQueries, {useQuery, useResult} from '../../hooks/useQueries';
import useWindowSize from '../../hooks/useWindowSize';
// import ThreeRenderer from '../ThreeRenderer/ThreeRenderer';
import {buildQueryFromSpec} from '~/pages/AnalysisPage/AnalysisPage';
import Candlestick, {
  toMetricPeriod,
  toPointData,
} from '~/components/Chart/Candlestick';
import useScrimsightEvents from '../../hooks/useScrimsightEvents';

// displays players grouped by team. each player has an associated value that scales the bar to the right of their name. all data is passed in.
const PlayerPanel = ({playerTimeData}) => {
  // const longestNameLength = players.reduce((acc, player) => {
  //   const name = player['Player Name'] + player['Player Team'];
  //   return name.length > acc ? name.length : acc;
  // }, 0);
  // const width = longestNameLength * 10;

  console.log('playerTimeData', playerTimeData);

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
        playerTimeData,
        period,
        topMetric,
        bottomMetric,
        categoryKey,
        subcategoryKey,
        startTime,
        windowLength,
      ),
    [
      playerTimeData,
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
    () => toPointData(playerTimeData, startTime, windowLength),
    [playerTimeData, startTime, windowLength],
  );
  const {width, height} = useWindowSize();
  // console.log('candlestickData', candlestickData);
  return (
    <div style={{display: 'flex', flexDirection: 'column', paddingLeft: 10}}>
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
        width={width - 200}
        height={height - 200}
      />
      {/* {players.map((player, i) => {
      

        const playerData = playerTimeData[player['Player Name']].map((event) => {
          return {
            x: [event['Match Time']],
            y: [event['Event Damage']],
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'red' },
        };
        });


        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              position: 'relative',
              height: '36px',
              lineHeight: '36px',
            }}
            key={i}
          >
            <div style={{ width, textAlign: 'left' }}>
              {player['Player Team']} {player['Player Name']}
            </div>
            <div
              style={{
                width: '150px',
                height: '100%',
                borderRight: '1px solid #32466d',
              }}
            >
              <div
                style={{
                  width: `${playerValues[player['Player Name']]}%`,
                  height: '100%',
                  backgroundColor: 'red',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              >
                {playerValues[player['Player Name']]}
              </div>
            </div>
            <div>
              <Candlestick
                metricName="Damage"
                slice={player['Player Name']}
                data={playerData}
                width={500}
                height={100}
              />

            </div>
          </div>
        );
      })} */}
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

  useEffect(() => {
    if (loaded) {
      console.log('loaded');
      onLoaded();
    }
  }, [loaded]);

  console.log('events', events);
  const {width, height} = useWindowSize();

  const playerTimeData = useMemo(() => {
    if (!loaded) {
      return {};
    }
    events!.reduce<Record<string, any[]>>((acc, event) => {
      const player = event['Player Name'];
      if (!acc[player]) {
        acc[player] = [];
      }
      acc[player].push(event);
      return acc;
    }, {});
  }, [loaded]);

  console.log('playerTimeData', playerTimeData);

  return (
    <div
      className="PlayByPlay"
      style={{
        height: height - 70,
      }}>
      {/* <ThreeRenderer
        entities={entities}
        width={width}
        height={height - 70}
        onLoaded={onLoaded}
      /> */}
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <PlayerPanel playerTimeData={playerTimeData} />
        {/* <Timeline events={events} currentTime={currentTime} /> */}
      </div>
    </div>
  );
};

export default PlayByPlay;
