import React, { memo } from 'react';
import { Tooltip } from '@mui/material';
import { TimelineEventProps } from '../types/timeline.types';

interface TimelineInteractionEventProps extends Omit<TimelineEventProps, 'time'> {
  time: number;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const TimelineInteractionEvent: React.FC<TimelineInteractionEventProps> = memo(({
  color,
  icon,
  tooltipTitle,
  className,
  id,
  style
}) => (
  <Tooltip title={tooltipTitle} arrow>
    <div className={className} id={id} style={style}>
      {icon || '?'}
    </div>
  </Tooltip>
));

TimelineInteractionEvent.displayName = 'TimelineInteractionEvent'; 