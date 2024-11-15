import styled from '@emotion/styled';
import {Grid, Typography} from '@mui/material';

export const TimelineContainer = styled(Grid)`
  position: relative;
  margin-bottom: 20px;
`;

export const PlayerNameCell = styled(Grid)`
  text-align: right;
  padding-right: 16px;
`;

export const TimelineBase = styled.div<{width: number}>`
  width: ${props => props.width}px;
  height: 20px;
  position: relative;
`;

export const TimelineLine = styled.div`
  width: 1px;
  height: 20px;
  background-color: grey;
  position: absolute;
  left: 0;
`;

export const TimelineHorizontalLine = styled.div<{width: number}>`
  width: ${props => props.width}px;
  height: 1px;
  background-color: #222;
  position: absolute;
  left: 1px;
  top: 10px;
  z-index: 0;
`;

export const XAxisContainer = styled.div<{width: number}>`
  width: ${props => props.width}px;
  height: 100px;
  position: relative;
`;

export const XAxisMarker = styled.div<{left: number}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 0;
  width: 1px;
  height: 10px;
  background-color: grey;
`;

export const WindowHandle = styled.div<{left: number}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 20px;
  cursor: ew-resize;
  user-select: none;
  border-left: 2px solid #666;
  padding: 2px 4px;
  background-color: #333;
  color: white;
  font-size: 12px;
  border-radius: 2px;
  transform: translateX(-50%);
  z-index: 1;

  &:hover {
    background-color: #444;
  }
`;

export const RoundSetupSection = styled.div<{left: number; width: number}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 0;
  width: ${props => props.width}px;
  height: 10px;
  background-color: #88222250;
`;

export const RoundActiveSection = styled.div<{left: number; width: number}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 0;
  width: ${props => props.width}px;
  height: 10px;
  background-color: #4caf5050;
`;

export const RoundLabel = styled(Typography)<{left: number}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 10px;
  transform: translateX(-50%);
  variant: body2;
`;

export const EventMarker = styled.div<{left: number}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 0;
  width: 1px;
  height: 10px;
  background-color: white;
  opacity: 0.2;
`;

export const WindowSection = styled.div<{left: number; width: number}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 0;
  width: ${props => props.width}px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
`;

export const EventIcon = styled.div<{left: number; color: string}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 5px;
  color: ${props => props.color};
`;

export const InteractionEventIcon = styled.div<{left: number; color: string}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 2px;
  color: ${props => props.color};
  fill: ${props => props.color};
`;

export const UltimateBarContainer = styled.div`
  position: relative;
`;

export const UltimateChargeBar = styled.div<{left: number; width: number; color: string}>`
  position: absolute;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  top: 5px;
  height: 10px;
  background-color: ${props => props.color}50;
`;

export const UltimateActiveBar = styled.div<{left: number; width: number; color: string}>`
  position: absolute;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  top: 5px;
  height: 10px;
  background-color: ${props => props.color};
`;

export const RecentEventsContainer = styled.div`
  margin-top: 20px;
`;

export const EventsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const EventListItem = styled.li`
  margin: 8px 0;
  font-family: monospace;
`;

export const ChartContainer = styled('div')<{width: number}>`
  width: ${props => props.width}px;
  height: 60px;
  position: relative;
  margin: 20px 0;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

export const CenterLine = styled('div')`
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  top: 50%;
`;

export const Team1Bar = styled('div')<{left: number; width: number; height: number}>`
  position: absolute;
  left: ${props => props.left}px;
  bottom: 50%;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: #4caf50;
  opacity: 0.8;
`;

export const Team2Bar = styled('div')<{left: number; width: number; height: number}>`
  position: absolute;
  left: ${props => props.left}px;
  top: 50%;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: #f44336;
  opacity: 0.8;
`;

export const AdvantageLine = styled('path')`
  stroke: #fff;
  stroke-width: 2;
  fill: none;
  opacity: 0.8;
`; 