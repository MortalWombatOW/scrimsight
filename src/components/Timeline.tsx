import React from 'react';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface TimelineProps {
  lanes: string[];
  events: {lane: string; time: number; icon: React.ReactElement}[];
  metrics: {lane: string; time: number; value: number}[][];
  periods: {lane: string; startTime: number; endTime: number}[];
  width: number;
  heightPerLane: number;
}

const TimelineLane = ({
  name,
  events,
  metrics,
  periods,
  width,
  height,
  startTime,
  endTime,
}: {
  name: string;
  events: {lane: string; time: number; icon: React.ReactElement}[];
  metrics: {lane: string; time: number; value: number}[][];
  periods: {lane: string; startTime: number; endTime: number}[];
  width: number;
  height: number;
  startTime: number;
  endTime: number;
}) => {
  return (
    <ScatterChart width={width} height={height} style={{paddingLeft: '50px'}}>
      <XAxis
        dataKey="time"
        type="number"
        domain={[startTime, endTime]}
        unit="s"
        name="Match Time"
      />
      <YAxis dataKey="lane" type="category" />
      {/* <Tooltip /> */}
      {/* <CartesianGrid stroke="#f5f5f5" /> */}
      <Scatter data={events} fill="#8884d8" />
    </ScatterChart>
  );
};

const Timeline: React.FC<TimelineProps> = ({
  lanes,
  events,
  metrics,
  periods,
  width,
  heightPerLane,
}: TimelineProps) => {
  const startTime = Math.min(
    ...events.map((e) => e.time),
    ...metrics.map((m) => m[0].time),
    ...periods.map((p) => p.startTime),
  );

  const endTime = Math.max(
    ...events.map((e) => e.time),
    ...metrics.map((m) => m[m.length - 1].time),
    ...periods.map((p) => p.endTime),
  );

  return (
    <div>
      {lanes.map((lane, i) => (
        <div key={i}>
          {/* <div>{lane}</div> */}
          <TimelineLane
            name={lane}
            events={events.filter((e) => e.lane === lane)}
            metrics={metrics.filter((m) => m[0].lane === lane)}
            periods={periods.filter((p) => p.lane === lane)}
            width={width}
            height={heightPerLane}
            startTime={startTime}
            endTime={endTime}
          />
        </div>
      ))}
    </div>
  );
};

export default Timeline;
