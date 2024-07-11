import React, {MutableRefObject, useRef} from 'react';
import {useDraggable} from 'react-use-draggable-scroll';

const CardCarousel = (props) => {
  const {children, width, childSpacing, startX} = props;

  const ref = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const {events} = useDraggable(ref);

  console.log('events', events);

  return (
    <div
      ref={ref}
      {...events}
      style={{
        display: 'flex',
        // width: '500px',
        maxWidth: width,
        overflowX: 'hidden',
        padding: '10px 0',
      }}>
      {...children.map((child, i) => (
        <div
          key={i}
          style={{
            marginRight: childSpacing,
          }}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default CardCarousel;
