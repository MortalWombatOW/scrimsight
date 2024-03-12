import React from 'react';
import {Grid, Typography, Button, Select, MenuItem} from '@mui/material';
import {getColorgorical} from '../lib/color';
import DraggableTimeWindow from './DraggableTimeWindow';

const PlaybackButton = ({playing, setPlaying, loaded}) => (
  <Button
    variant="contained"
    color="primary"
    onClick={() => setPlaying(!playing)}
    sx={{
      marginRight: '1em',
      backgroundColor: playing ? 'warning.main' : 'primary.main',
    }}
    disabled={!loaded}>
    {playing ? 'Pause' : 'Play'}
  </Button>
);

const ResetButton = ({
  startTime,
  setStartTimeFilter,
  setEndTimeFilter,
  loaded,
}) => (
  <Button
    variant="contained"
    color="primary"
    onClick={() => {
      setStartTimeFilter(startTime);
      setEndTimeFilter(startTime + 60 * 3);
    }}
    disabled={!loaded}>
    Reset
  </Button>
);

const SpeedSelect = ({ticksPerFrame, setTicksPerFrame}) => (
  <Select
    value={ticksPerFrame}
    onChange={(e) => setTicksPerFrame(e.target.value)}
    label="Playback Speed"
    sx={{
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
    }}>
    {[1, 2, 5, 10, 15].map((speed) => (
      <MenuItem
        key={speed}
        value={speed}
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}>
        {speed}x
      </MenuItem>
    ))}
  </Select>
);

const KillVisualizations = ({kills, endTime}) => (
  <svg width="50px" height="500">
    {kills.map((kill, i) => (
      <rect
        key={kill.matchTime + i}
        y={`${(kill.matchTime / endTime) * 100}%`}
        x={0}
        width={50}
        height={2}
        fill={getColorgorical(kill.team)}
      />
    ))}
  </svg>
);

function TimelineControls({
  playing,
  loaded,
  startTime,
  startTimeFilter,
  endTime,
  endTimeFilter,
  ticksPerFrame,
  setPlaying,
  setStartTimeFilter,
  setEndTimeFilter,
  setTicksPerFrame,
  kills,
}: {
  playing: boolean;
  loaded: boolean;
  startTime: number | null;
  startTimeFilter: number;
  endTime: number | null;
  endTimeFilter: number;
  ticksPerFrame: number;
  setPlaying: (playing: boolean) => void;
  setStartTimeFilter: (startTimeFilter: number) => void;
  setEndTimeFilter: (endTimeFilter: number) => void;
  setTicksPerFrame: (ticksPerFrame: number) => void;
  kills: any[];
}) {
  return (
    <div style={{position: 'relative', maxWidth: '200px'}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography id="range-slider" gutterBottom>
            Playback
          </Typography>
          <PlaybackButton
            playing={playing}
            setPlaying={setPlaying}
            loaded={loaded}
          />
        </Grid>
        <Grid item xs={12}>
          <ResetButton
            startTime={startTime}
            setStartTimeFilter={setStartTimeFilter}
            setEndTimeFilter={setEndTimeFilter}
            loaded={loaded}
          />
        </Grid>
        <Grid item xs={12}>
          <SpeedSelect
            ticksPerFrame={ticksPerFrame}
            setTicksPerFrame={setTicksPerFrame}
          />
        </Grid>
        <Grid item xs={12}>
          <DraggableTimeWindow
            startTimeFilter={startTimeFilter}
            setStartTimeFilter={setStartTimeFilter}
            endTime={endTime}
            endTimeFilter={endTimeFilter}
            setEndTimeFilter={setEndTimeFilter}
          />
          <KillVisualizations kills={kills} endTime={endTime} />
        </Grid>
      </Grid>
    </div>
  );
}

export default TimelineControls;
