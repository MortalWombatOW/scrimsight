import React, { memo } from 'react';
import { UltimateBarProps } from '../types/timeline.types';
import { UltimateBarContainer, UltimateChargeBar, UltimateActiveBar } from '../styles/timeline.styles';
import { COLORS } from '../constants/timeline.constants';

interface UltimateBarComponentProps extends UltimateBarProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const UltimateBar: React.FC<UltimateBarComponentProps> = memo(({
  startTime,
  endTime,
  chargedTime,
  timeToX,
  windowStartTime,
  windowEndTime,
  className,
  id,
  style
}) => {
  if (endTime < windowStartTime || chargedTime > windowEndTime) return null;

  return (
    <div className={className} id={id} style={style}>
      <UltimateChargeBar
        left={timeToX(Math.max(chargedTime, windowStartTime))}
        width={timeToX(Math.min(startTime, windowEndTime)) - timeToX(Math.max(chargedTime, windowStartTime))}
        color={COLORS.ultimate}
      />
      <UltimateActiveBar
        left={timeToX(Math.max(startTime, windowStartTime))}
        width={timeToX(Math.min(endTime, windowEndTime)) - timeToX(Math.max(startTime, windowStartTime))}
        color={COLORS.ultimate}
      />
    </div>
  );
});

UltimateBar.displayName = 'UltimateBar'; 