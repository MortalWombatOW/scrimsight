import {useState, useRef, useEffect} from 'react';

interface UseTimelineWindowProps {
  windowStartTime: number;
  windowEndTime: number;
  mapStartTime: number;
  mapEndTime: number;
  setWindowStartTime: (time: number) => void;
  setWindowEndTime: (time: number) => void;
  xToTime: (x: number) => number;
}

export const useTimelineWindow = ({
  windowStartTime,
  windowEndTime,
  mapStartTime,
  mapEndTime,
  setWindowStartTime,
  setWindowEndTime,
  xToTime,
}: UseTimelineWindowProps) => {
  const [dragging, setDragging] = useState<null | 'start' | 'end'>(null);
  const lastUpdateTimestamp = useRef(Date.now());
  const currentTime = useRef(0);
  const [innerWindowStartTime, setInnerWindowStartTime] = useState<number>(windowStartTime);
  const [innerWindowEndTime, setInnerWindowEndTime] = useState<number>(windowEndTime);

  useEffect(() => {
    setInnerWindowStartTime(windowStartTime);
    setInnerWindowEndTime(windowEndTime);
  }, [windowStartTime, windowEndTime]);

  const handleMouseDown = (e: React.MouseEvent, type: 'start' | 'end') => {
    setDragging(type);
    if (type === 'start') {
      currentTime.current = windowStartTime;
    } else {
      currentTime.current = windowEndTime;
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const newTime = xToTime(e.movementX);

    if (dragging === 'start') {
      currentTime.current = Math.round(Math.max(mapStartTime, Math.min(windowEndTime, currentTime.current + newTime)));
      setInnerWindowStartTime(currentTime.current);
    } else {
      currentTime.current = Math.round(Math.min(mapEndTime, Math.max(windowStartTime, currentTime.current + newTime)));
      setInnerWindowEndTime(currentTime.current);
    }

    if (Date.now() - lastUpdateTimestamp.current > 50) {
      if (dragging === 'start') {
        setWindowStartTime(currentTime.current);
      } else {
        setWindowEndTime(currentTime.current);
      }
      lastUpdateTimestamp.current = Date.now();
    }
  };

  return {
    dragging,
    innerWindowStartTime,
    innerWindowEndTime,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  };
}; 