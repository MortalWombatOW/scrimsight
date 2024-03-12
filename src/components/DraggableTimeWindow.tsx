import React, {useEffect, useState} from 'react';
import useMousePosition from '../hooks/useMousePosition';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Button from '@mui/material/Button';

const DraggableTimeWindow = ({
  startTimeFilter,
  setStartTimeFilter,
  endTime,
  endTimeFilter,
  setEndTimeFilter,
}: {
  startTimeFilter: number;
  setStartTimeFilter: (time: number | ((time: number) => number)) => void;
  endTime: number | null;
  endTimeFilter: number;
  setEndTimeFilter: (time: number | ((time: number) => number)) => void;
}) => {
  const [dragging, setDragging] = useState(false);
  const [clickOffsetY, setClickOffsetY] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDragging(true);
    setClickOffsetY(e.clientY - e.currentTarget.getBoundingClientRect().top);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const {x, y}: {x: number | null; y: number | null} = useMousePosition();

  const ref = React.useRef<HTMLButtonElement | null>(null);

  //  -------     y = 0
  //
  //  -------     container y
  //
  //  -------     button y
  //
  //    x         click y
  //    |
  //    v         mouse y

  // on click, set click offset y to the difference between the click y and the button y
  // on drag, set the button y to the difference between the mouse y and the button y plus the click offset y so that the mouse y is now equal to the new button y plus the click offset
  // Also, the button y should be clamped to the container y such that the button y is always between 0 and the container height minus the button height

  useEffect(() => {
    if (
      !ref.current ||
      !ref.current.parentElement ||
      !dragging ||
      y === null ||
      clickOffsetY === null ||
      endTime === null
    )
      return;
    const containerRect = ref.current.parentElement.getBoundingClientRect();
    const buttonRect = ref.current.getBoundingClientRect();
    const yDiff = y - clickOffsetY - buttonRect.top;
    const newButtonY = buttonRect.top + yDiff;
    const clampedButtonY = Math.max(
      0,
      Math.min(newButtonY, containerRect.height - buttonRect.height),
    );
    setStartTimeFilter((clampedButtonY / containerRect.height) * endTime);
    setEndTimeFilter((clampedButtonY / containerRect.height) * endTime);
    // log state
    console.log(`y`, y);
    console.log(`clickOffsetY`, clickOffsetY);
    console.log(`containerRect`, containerRect);
    console.log(`buttonRect`, buttonRect);
    console.log(`yDiff`, yDiff);
    console.log(`newButtonY`, newButtonY);
    console.log(`clampedButtonY`, clampedButtonY);
    console.log(`startTimeFilter`, startTimeFilter);
    console.log(`endTimeFilter`, endTimeFilter);
  }, [dragging, y, clickOffsetY, ref, setStartTimeFilter, setEndTimeFilter]);

  if (endTime === null) return null;

  return (
    <Button
      ref={ref}
      variant="contained"
      color="info"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      sx={{
        position: 'absolute',
        left: '5',
        top: (startTimeFilter / endTime) * 100 + '%',
        zIndex: 100,
        width: '50px',
        height: ((endTimeFilter - startTimeFilter) / endTime) * 100 + '%',
        // backgroundColor: 'rgba(50, 59, 108, 0.7)',
      }}>
      <DragHandleIcon color="info" />
    </Button>
  );
};

export default DraggableTimeWindow;
