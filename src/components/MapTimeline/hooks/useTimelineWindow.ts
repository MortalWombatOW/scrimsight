import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimelineWindowProps {
  windowStartTime: number;
  windowEndTime: number;
  mapStartTime: number;
  mapEndTime: number;
  setWindowStartTime: (time: number) => void;
  setWindowEndTime: (time: number) => void;
  xToTime: (x: number) => number;
}

export const useTimelineWindow = ({ windowStartTime, windowEndTime, mapStartTime, mapEndTime, setWindowStartTime, setWindowEndTime, xToTime }: UseTimelineWindowProps) => {
  const [dragging, setDragging] = useState<null | 'start' | 'end'>(null);
  const [innerWindowStartTime, setInnerWindowStartTime] = useState(windowStartTime);
  const [innerWindowEndTime, setInnerWindowEndTime] = useState(windowEndTime);
  const currentTime = useRef(0);

  // Throttled update functions
  const throttledSetWindowStart = useCallback(
    (time: number) => setWindowStartTime(time),
    [setWindowStartTime],
  );

  const throttledSetWindowEnd = useCallback(
    (time: number) => setWindowEndTime(time),
    [setWindowEndTime],
  );

  // Update inner state when props change
  useEffect(() => {
    setInnerWindowStartTime(windowStartTime);
    setInnerWindowEndTime(windowEndTime);
  }, [windowStartTime, windowEndTime]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, type: 'start' | 'end') => {
      setDragging(type);
      currentTime.current = type === 'start' ? windowStartTime : windowEndTime;
    },
    [windowStartTime, windowEndTime],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    // Ensure final values are set
    if (dragging === 'start') {
      setWindowStartTime(innerWindowStartTime);
    } else if (dragging === 'end') {
      setWindowEndTime(innerWindowEndTime);
    }
  }, [dragging, innerWindowStartTime, innerWindowEndTime, setWindowStartTime, setWindowEndTime]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;

      const newTime = xToTime(e.movementX);

      if (dragging === 'start') {
        const nextTime = Math.round(Math.max(mapStartTime, Math.min(windowEndTime, currentTime.current + newTime)));
        currentTime.current = nextTime;
        setInnerWindowStartTime(nextTime);
        throttledSetWindowStart(nextTime);
      } else {
        const nextTime = Math.round(Math.min(mapEndTime, Math.max(windowStartTime, currentTime.current + newTime)));
        currentTime.current = nextTime;
        setInnerWindowEndTime(nextTime);
        throttledSetWindowEnd(nextTime);
      }
    },
    [dragging, mapStartTime, mapEndTime, windowStartTime, windowEndTime, xToTime, throttledSetWindowStart, throttledSetWindowEnd],
  );

  return {
    dragging,
    innerWindowStartTime,
    innerWindowEndTime,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  };
};
