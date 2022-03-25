import React from 'react';
import {MapEntity, RenderState} from '../../lib/data/types';
import {mapNameToFileName} from '../../lib/string';
import {useScrollBlock} from '../../hooks/useScrollBlock';
import {useSpring, animated} from 'react-spring';
import './MapOverlay.scss';
import {useDrag, useGesture} from '@use-gesture/react';

interface MapOverlayProps {
  map: string;
  entities: MapEntity[];
  width: number;
  height: number;
}

const MapOverlay = (props: MapOverlayProps) => {
  const {map, entities, width, height} = props;

  // const centerX = width / 2;
  // const centerY = height / 2;

  const [time, setTime] = React.useState(0);
  // const [transformMatrix, setTransformMatrix] = React.useState<number[]>([
  //   1, 0, 0, 1, 0, 0,
  // ]);

  const [blockScroll, unblockScroll] = useScrollBlock();

  const [styles, api] = useSpring(() => ({
    transform: `translate(0,0) scale(0.5)`,
  }));
  const svgRef = React.useRef<SVGSVGElement>(null);
  const transformRef = React.useRef(null);

  useGesture(
    {
      onDrag: ({offset: [x, y]}) => {
        // console.log('drag', x, y);
        const currentTransform = styles.transform.get().split(' ');
        api.start({transform: `translate(${x},${y}) ${currentTransform[1]}`});
      },
      // onWheel: ({_direction: [, y]}) => {
      //   // console.log('wheel', rest);
      //   const currentTransform = styles.transform.get().split(' ');

      //   const scaleText = currentTransform[1];
      //   // console.log(scaleText);
      //   const scale = parseFloat(scaleText.substring(7, scaleText.length - 1));
      //   console.log(scale);
      //   const newScale = scale * (1 + y / 100);
      //   api.start({
      //     transform: `${currentTransform[0]} scale(${newScale})`,
      //   });
      //   // api.start({zoom: transform.zoom.get() * (1 + y / 100)});
      // },
    },
    {
      target: svgRef,
      // drag: {
      //   from: () => [transform.x.get(), transform.y.get()],
      // },
      // wheel: {
      //   from: () => transform.zoom.get(),
      // },
    },
  );

  const getScale = () => {
    const currentTransform = styles.transform.get().split(' ');
    const scaleText = currentTransform[1];
    const scale = parseFloat(scaleText.substring(7, scaleText.length - 1));
    return scale;
  };

  const setScale = (scale: number) => {
    const currentTransform = styles.transform.get().split(' ');
    api.start({
      transform: `${currentTransform[0]} scale(${scale})`,
    });
  };

  // const bindDrag = useDrag(({down, delta: [mx, my]}) => {
  //   if (down) {
  //     console.log(transform.x.get(), transform.y.get());
  //     api.start({
  //       x: transform.x.get() + mx,
  //       y: transform.y.get() + my,
  //       immediate: true,
  //     });
  //   }
  // });

  // const bindWheel = useWheel(({delta: [, my], first}) => {
  //   console.log(cz.get());
  //   api.start({
  //     cz: cz.get() * (1 + my / 100),
  //   });
  // });

  // const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   if (isDragging) {
  //     addPan(e.movementX, e.movementY);
  //   }
  //   const point = svgRef.current!.createSVGPoint();
  //   point.x = e.clientX;
  //   point.y = e.clientY;
  //   const cursorPoint = point.matrixTransform(
  //     svgRef.current!.getScreenCTM().inverse(),
  //   );
  //   setPos({
  //     x: screenXToWorldX(cursorPoint.x),
  //     y: screenYToWorldY(cursorPoint.y),
  //   });
  // };

  // const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
  //   // if (imgRef.current === null) {
  //   //   return;
  //   // }
  //   // console.log(transformMatrix.slice(4, 6));

  //   const zoom = e.deltaY < 0 ? 1.1 : 0.9;
  //   const newZoom = camZoom * zoom;

  //   // const [dx, dy] = [pos.x - transformMatrix[4], pos.y - transformMatrix[5]];
  //   // const zoomRatio = newZoom / transformMatrix[0];

  //   // setTransformMatrix([
  //   //   newZoom,
  //   //   transformMatrix[1],
  //   //   transformMatrix[2],
  //   //   newZoom,
  //   //   pos.x - dx * zoomRatio,
  //   //   pos.y - dy * zoomRatio,
  //   // ]);

  //   // addPan(-pos.x, -pos.y);
  //   setCamZoom(newZoom);
  //   // addPan(pos.x, pos.y);
  // };

  // const worldXToScreenX = (x: number) => {
  //   return x * cz.get() + cx.get();
  // };

  // const worldYToScreenY = (y: number) => {
  //   return y * cz.get() + cy.get();
  // };

  // const screenXToWorldX = (x: number) => {
  //   return (x - cx.get()) / cz.get();
  // };

  // const screenYToWorldY = (y: number) => {
  //   return (y - cy.get()) / cz.get();
  // const mouseEntity = {
  //   id: 'mouse',
  //   label: 'mouse',
  //   clazz: '',
  //   image: '',
  //   states: [
  //     {
  //       x: pos.x,
  //       y: pos.y,
  //     },
  //   ],
  // };

  // console.log(pos);

  // const entitiesWithExtra = [...entities, mouseEntity];

  return (
    <div
      className="MapOverlay"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseEnter={blockScroll}
      onMouseLeave={unblockScroll}
      role="presentation">
      {/* <animated.img
        src={mapNameToFileName(map, true)}
        alt={map}
        width={width}
        height={height}
        style={mapStyles}
        ref={imgRef}
      /> */}
      {/* <div className="imgcover" /> */}

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        ref={svgRef}>
        <animated.g ref={transformRef} {...styles}>
          {entities.map((entity) => (
            <circle
              key={entity.id}
              cx={entity.states[time].x}
              cy={entity.states[time].y}
              r={10}
              className={entity.clazz}
            />
          ))}
        </animated.g>
      </svg>
      <div className="controls">
        <button className="control" onClick={() => setScale(getScale() * 0.9)}>
          -
        </button>
        <button className="control" onClick={() => setScale(getScale() * 1.1)}>
          +
        </button>
        <span className="control">{time} s</span>
      </div>
    </div>
  );
};

export default MapOverlay;
