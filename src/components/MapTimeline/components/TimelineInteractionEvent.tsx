import React, {memo} from 'react';
import {Tooltip} from '@mui/material';
import {TimelineEventProps} from '../types/timeline.types';
import {InteractionEventIcon} from '../styles/timeline.styles';

export const TimelineInteractionEvent: React.FC<TimelineEventProps> = memo(({time, timeToX, color, icon, tooltipTitle}) => (
  <Tooltip title={tooltipTitle} arrow>
    <InteractionEventIcon left={timeToX(time)} color={color}>
      {icon || '?'}
    </InteractionEventIcon>
  </Tooltip>
));

TimelineInteractionEvent.displayName = 'TimelineInteractionEvent'; 