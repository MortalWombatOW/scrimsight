import React, { memo, useState } from 'react';
import { Tooltip } from '@mui/material';
import { TimelineEventProps } from '../types/timeline.types';
import { EventIcon } from '../styles/timeline.styles';

export const TimelineEvent: React.FC<TimelineEventProps> = memo(({
  color,
  icon,
  tooltipTitle,
  className,
  id,
  style
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const content = (
    <div
      className={className}
      id={id}
      style={style}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {icon || '?'}
    </div>
  );

  return showTooltip ? (
    <Tooltip title={tooltipTitle} arrow>
      {content}
    </Tooltip>
  ) : content;
});

TimelineEvent.displayName = 'TimelineEvent'; 