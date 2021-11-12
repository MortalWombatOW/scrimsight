import React from 'react';

interface MapOverlayProps {
  map: string;
  // [[time x y]]
  data: number[][];
  width: number;
  height: number;

}

const MapOverlay = (props: MapOverlayProps) => {
  const {
    map, data, width, height,
  } = props;

  // const centerX = width / 2;
  // const centerY = height / 2;

  const [transformMatrix, setTransformMatrix] = React.useState<number[]>([1, 0, 0, 1, 0, 0]);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const addPan = (dx: number, dy: number) => {
    const [x, y] = transformMatrix.slice(4, 6);
    const zoom = transformMatrix[0];
    setTransformMatrix([
      zoom,
      0,
      0,
      zoom,
      x + dx,
      y + dy,
    ]);
  };

  // const setZoom = (zoom: number) => {
  //   setTransformMatrix([
  //     zoom,
  //     transformMatrix[1],
  //     transformMatrix[2],
  //     zoom,
  //     transformMatrix[4],
  //     transformMatrix[5],
  //   ]);
  // };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      addPan(e.movementX, e.movementY);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (imgRef.current === null) {
      return;
    }
    const [x, y] = [e.clientX - e.currentTarget.offsetLeft,
      e.clientY - e.currentTarget.offsetTop];
    console.log(transformMatrix.slice(4, 6));

    const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = transformMatrix[0] * zoom;

    const [dx, dy] = [x - transformMatrix[4], y - transformMatrix[5]];
    const zoomRatio = newZoom / transformMatrix[0];

    setTransformMatrix([
      newZoom,
      transformMatrix[1],
      transformMatrix[2],
      newZoom,
      x - dx * zoomRatio,
      y - dy * zoomRatio,
    ]);

    // addPan(-x, -y);
    // setZoom(newZoom);
    // addPan(x, y);
  };

  return (
    <div
      className="mapoverlaycontainer"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      role="presentation"
    >
      <img
        src={`/assets/topdown/${map}_anno.png`}
        alt={map}
        width={width}
        height={height}
        style={
          {
            position: 'absolute',
            // paddingLeft: `${transformMatrix[4]}px`,
            // paddingTop: `${transformMatrix[5]}px`,
            width: `${width * transformMatrix[0]}px`,
            height: `${height * transformMatrix[0]}px`,
            left: `${transformMatrix[4]}px`,
            top: `${transformMatrix[5]}px`,
            // transform: `matrix(${transformMatrix.join(',')})`,
          }
        }
        ref={imgRef}
      />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`matrix(${transformMatrix.join(' ')})`}>
          {data.map(([time, x, y]) => (
            <circle
              key={`${time}-${x}-${y}`}
              cx={x}
              cy={y}
              r={5}
              fill="red"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default MapOverlay;
