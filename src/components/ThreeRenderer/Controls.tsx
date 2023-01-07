import {Box, Slider, ToggleButton, ToggleButtonGroup} from '@mui/material';
import React, {useState} from 'react';
import {useSpring} from 'react-spring';
import {formatTime} from '../../lib/data/format';
import {Button} from '../Common/Mui';
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

export type CameraMode = 'topdown' | 'teamfollow' | 'sideview' | 'free';
export type LayerMode = 'default' | 'mapcontrol';

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
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  layerMode: LayerMode;
  setLayerMode: (mode: LayerMode) => void;
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
        flexDirection: 'column',
        width: width || '100%',
      }}>
      <Box
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
        <Box
          component="div"
          sx={{
            fontSize: '0.8em',
          }}>
          {renderValue ? renderValue(value) : value}
          {info && (
            <InfoOutlinedIcon
              sx={{fontSize: '0.8em', marginLeft: '0.5em'}}
              onClick={() => alert(info)}
            />
          )}
        </Box>
      </Box>
      <Slider
        value={value}
        min={min}
        max={max}
        onChange={(e, value) => {
          setValue(value as number);
        }}
      />
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
    cameraMode,
    setCameraMode,
    layerMode,
    setLayerMode,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [cameraControlsExpanded, setCameraControlsExpanded] = useState(false);
  const [layersExpanded, setLayersExpanded] = useState(false);

  const handleCameraMode = (
    event: React.MouseEvent<HTMLElement>,
    newCameraMode: CameraMode | null,
  ) => {
    if (newCameraMode) {
      setCameraMode(newCameraMode);
    }
  };

  return (
    <Box
      component="div"
      sx={{
        position: 'absolute',
        bottom: 0,
        paddingLeft: '10px',
        paddingRight: '10px',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        width: width,
        backgroundColor: '#ffffff88',
        backdropFilter: 'blur(10px)',
        transition: 'height 0.5s ease',
      }}>
      <Box
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '15px',
        }}>
        <Button onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </Button>
      </Box>
      <Box
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        id="basicControls">
        <Button onClick={() => setCurrentTime(startTime)}>
          <FirstPageIcon />
        </Button>
        <Button
          onClick={() => setCurrentTime(Math.max(startTime, currentTime - 10))}>
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
        <LabeledSlider
          label="Timestamp"
          value={currentTime}
          min={startTime}
          max={endTime}
          setValue={setCurrentTime}
          renderValue={formatTime}
          info={`Play begins at ${formatTime(startTime)}`}
        />
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
          <Box component="div" sx={{height: '50px', lineHeight: '50px'}}>
            <Button
              onClick={() =>
                setCameraControlsExpanded(!cameraControlsExpanded)
              }>
              <VideocamOutlinedIcon />
            </Button>
            {cameraControlsExpanded && (
              <ToggleButtonGroup
                value={cameraMode}
                exclusive
                onChange={handleCameraMode}>
                <ToggleButton value="topdown">Top Down</ToggleButton>
                <ToggleButton value="teamfollow">Team Follow</ToggleButton>
                <ToggleButton value="sideview">Side View</ToggleButton>
                <ToggleButton value="free">Free Cam</ToggleButton>
              </ToggleButtonGroup>
            )}
            <Button
              onClick={() => {
                setLayersExpanded(!layersExpanded);
              }}>
              <LayersIcon />
            </Button>
            {layersExpanded && (
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
        </Box>
      )}
    </Box>
  );
};

export default Controls;
