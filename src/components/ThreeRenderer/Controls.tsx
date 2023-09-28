import {
  Box,
  Grid,
  Slider,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useSpring} from 'react-spring';
import {formatTime} from '../../lib/format';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Replay10Icon from '@mui/icons-material/Replay10';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import FastForwardIcon from '@mui/icons-material/FastForward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import LayersIcon from '@mui/icons-material/Layers';
import {Stack} from '@mui/system';

export type LayerMode = 'default' | 'mapcontrol';
export type CameraFollowMode = null | 'all' | {player: string};

interface ControlsProps {
  width: number;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  startTime: number;
  endTime: number;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  layerMode: LayerMode;
  setLayerMode: (mode: LayerMode) => void;
  setControlsHeight: (height: number) => void;
  isOrthographic: boolean;
  setIsOrthographic: (isOrthographic: boolean) => void;
  triggerTopDownCamera: (zoomDelay: number) => void;
  triggerSideViewCamera: () => void;
  follow: CameraFollowMode;
  setFollow: (follow: CameraFollowMode) => void;
}

const LabeledSlider = (props: {
  label: string;
  value: number;
  min: number;
  max: number;
  setValue: (value: number) => void;
  renderValue?: (value: number) => string;
  info?: string;
  width?: number;
}) => {
  const {label, value, min, max, setValue, width, renderValue, info} = props;
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: width || '100%',
      }}>
      {/* <Box
        component="div"
        sx={{
          display: 'flex',
          // justifyContent: 'space-between',
        }}>
        <Box
          component="div"
          sx={{
            fontSize: '0.8em',
            marginRight: '0.5em',
          }}>
          {label}:
        </Box>
      </Box> */}
      <Slider
        value={value}
        min={min}
        max={max}
        onChange={(e, value) => {
          setValue(value as number);
        }}
      />
      <Box
        component="div"
        sx={{
          fontSize: '0.8em',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          marginLeft: '0.5em',
        }}>
        <Typography variant="body2" sx={{fontSize: '0.8em'}}>
          {renderValue ? renderValue(value) : value}
        </Typography>
        {info && (
          <InfoOutlinedIcon
            sx={{fontSize: '0.8em', marginLeft: '0.5em'}}
            onClick={() => alert(info)}
          />
        )}
      </Box>
    </Box>
  );
};

const Controls = (props: ControlsProps) => {
  const {
    width,
    playing,
    setPlaying,
    currentTime,
    setCurrentTime,
    startTime,
    endTime,
    playbackSpeed,
    setPlaybackSpeed,
    layerMode,
    setLayerMode,
    setControlsHeight,
    isOrthographic,
    setIsOrthographic,
    triggerTopDownCamera,
    triggerSideViewCamera,
    follow,
    setFollow,
  } = props;

  const [detailsType, setDetailsType] = useState<'camera' | 'layers' | null>(
    null,
  );
  const expanded = detailsType !== null;

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // when controls are expanded, set the height of the controls
  useEffect(() => {
    if (containerRef.current) {
      setControlsHeight(containerRef.current.clientHeight);
    }
  }, [expanded, containerRef, setControlsHeight]);

  return (
    <Box
      component="div"
      ref={containerRef}
      sx={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        width: width,
        backgroundColor: '#ffffff88',
        backdropFilter: 'blur(10px)',
      }}>
      <Box
        component="div"
        sx={{
          padding: '5px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
        id="basicControls">
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Button onClick={() => setCurrentTime(startTime)}>
              <FirstPageIcon />
            </Button>
            <Button
              onClick={() =>
                setCurrentTime(Math.max(startTime, currentTime - 10))
              }>
              <Replay10Icon />
            </Button>
            <Button onClick={() => setPlaying(!playing)}>
              {playing ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
            <Button
              onMouseDown={() => setPlaybackSpeed(10)}
              onMouseUp={() => setPlaybackSpeed(1)}>
              <FastForwardIcon />
            </Button>
          </Grid>
          <Grid item xs={6}>
            <LabeledSlider
              label="Timestamp"
              value={currentTime}
              min={startTime}
              max={endTime}
              setValue={setCurrentTime}
              renderValue={formatTime}
              info={`Play begins at ${formatTime(startTime)}`}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              onClick={() =>
                setDetailsType(detailsType === 'camera' ? null : 'camera')
              }>
              <VideocamOutlinedIcon />
            </Button>
            <Button
              onClick={() => {
                setDetailsType(detailsType === 'layers' ? null : 'layers');
              }}>
              <LayersIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
      {expanded && (
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          id="advancedControls">
          {detailsType === 'camera' && (
            //
            <Box component="div" sx={{display: 'flex', flexDirection: 'row'}}>
              <Button
                onClick={() => triggerTopDownCamera(0)}
                sx={{
                  fontSize: '0.8em',
                  marginLeft: '0.5em',
                  marginRight: '0.5em',
                }}>
                <Typography>Top Down</Typography>
              </Button>
              <Button
                onClick={() => triggerSideViewCamera()}
                sx={{
                  fontSize: '0.8em',
                  marginLeft: '0.5em',
                  marginRight: '0.5em',
                }}>
                <Typography>Side View</Typography>
              </Button>
              <Box component="div">
                <Typography>Camera</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Overhead</Typography>
                  <Switch
                    checked={!isOrthographic}
                    onChange={() => setIsOrthographic(!isOrthographic)}
                  />
                  <Typography>3D</Typography>
                </Stack>
              </Box>
            </Box>
          )}

          {detailsType === 'layers' && (
            <ToggleButtonGroup
              value={layerMode}
              exclusive
              onChange={(event, newLayerMode) => {
                if (newLayerMode) {
                  setLayerMode(newLayerMode);
                }
              }}>
              <ToggleButton value="default">Default</ToggleButton>
              <ToggleButton value="mapcontrol">Map Control</ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Controls;
