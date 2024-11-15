import React, {memo} from 'react';
import {UltimateBarProps} from '../types/timeline.types';
import {UltimateBarContainer, UltimateChargeBar, UltimateActiveBar} from '../styles/timeline.styles';
import {COLORS} from '../constants/timeline.constants';

export const UltimateBar: React.FC<UltimateBarProps> = memo(({
  startTime,
  endTime,
  chargedTime,
  timeToX,
  windowStartTime,
  windowEndTime,
}) => (
  <UltimateBarContainer>
    {startTime >= windowStartTime && (
      <UltimateChargeBar
        left={timeToX(Math.max(chargedTime, windowStartTime))}
        width={timeToX(Math.min(startTime, windowEndTime)) - timeToX(Math.max(chargedTime, windowStartTime))}
        color={COLORS.ultimate}
      />
    )}
    {startTime <= windowEndTime && (
      <UltimateActiveBar
        left={timeToX(Math.max(startTime, windowStartTime))}
        width={timeToX(Math.min(endTime, windowEndTime)) - timeToX(Math.max(startTime, windowStartTime))}
        color={COLORS.ultimate}
      />
    )}
  </UltimateBarContainer>
));

UltimateBar.displayName = 'UltimateBar'; 