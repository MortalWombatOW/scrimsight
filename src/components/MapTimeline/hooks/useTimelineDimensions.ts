import {useState, useEffect, useRef} from 'react';

interface TimelineDimensions {
  width: number | undefined;
  windowStartTime: number;
  windowEndTime: number;
  setWindowStartTime: (time: number) => void;
  setWindowEndTime: (time: number) => void;
  timeToX: (time: number) => number;
  timeToXWindow: (time: number) => number;
  xToTime: (x: number) => number;
  xToTimeWindow: (x: number) => number;
  gridRef: React.RefObject<HTMLDivElement>;
  mapStartTime: number;
  mapEndTime: number;
}

export const useTimelineDimensions = (mapStartTime: number, mapEndTime: number): TimelineDimensions => {
  const [windowStartTime, setWindowStartTime] = useState<number>(mapStartTime);
  const [windowEndTime, setWindowEndTime] = useState<number>(mapEndTime);
  const gridRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>();

  useEffect(() => {
    if (!gridRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width - 32;
        console.log('New width set by ResizeObserver:', newWidth);
        setWidth(newWidth);
      }
    });

    resizeObserver.observe(gridRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [gridRef.current]);

  useEffect(() => {
    console.log('Setting initial window times:', {mapStartTime, mapEndTime});
    setWindowStartTime(mapStartTime);
    setWindowEndTime(mapEndTime);
  }, [mapStartTime, mapEndTime]);

  const timeToX = (time: number) => {
    if (!width) return 0;
    return ((time - mapStartTime) / (mapEndTime - mapStartTime)) * width;
  };

  const timeToXWindow = (time: number) => {
    if (!width) return 0;
    return ((time - windowStartTime) / (windowEndTime - windowStartTime)) * width;
  };

  const xToTime = (x: number) => {
    if (!width) return 0;
    return (x / width) * (mapEndTime - mapStartTime) + mapStartTime;
  };

  const xToTimeWindow = (x: number) => {
    if (!width) return 0;
    return (x / width) * (windowEndTime - windowStartTime) + windowStartTime;
  };

  return {
    width,
    windowStartTime,
    windowEndTime,
    mapStartTime,
    mapEndTime,
    setWindowStartTime,
    setWindowEndTime,
    timeToX,
    timeToXWindow,
    xToTime,
    xToTimeWindow,
    gridRef,
  };
}; 