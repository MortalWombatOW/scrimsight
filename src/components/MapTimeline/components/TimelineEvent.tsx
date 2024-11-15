import React, {memo} from 'react';
import {Tooltip} from '@mui/material';
import {TimelineEventProps} from '../types/timeline.types';
import {EventIcon} from '../styles/timeline.styles';

export const TimelineEvent: React.FC<TimelineEventProps> = memo(({time, timeToX, color, icon, tooltipTitle}) => (
  <Tooltip title={tooltipTitle} arrow>
    <EventIcon left={timeToX(time)} color={color}>
      {icon || '?'}
    </EventIcon>
  </Tooltip>
));

TimelineEvent.displayName = 'TimelineEvent'; 