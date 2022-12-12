import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {useDraggable} from 'react-use-draggable-scroll';

const CardCarousel = (props) => {
  const {children, width, childSpacing} = props;

  const ref = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const {events} = useDraggable(ref);

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
      {...children.map((child) => (
        <div
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
