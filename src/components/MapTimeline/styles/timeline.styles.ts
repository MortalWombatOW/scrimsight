import styled from '@emotion/styled';
import {Grid} from '@mui/material';

export const TimelineContainer = styled(Grid)`
  position: relative;
  margin-bottom: 20px;
`;

export const PlayerNameCell = styled(Grid)`
  text-align: right;
  padding-right: 16px;
`;

export const WindowHandle = styled('div')<{left?: number}>`
  position: absolute;
  left: ${(props) => (props.left !== undefined ? `${props.left}px` : 'auto')};
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
