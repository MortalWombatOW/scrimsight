import React from 'react';

const SvgWrapText = ({
  x,
  y,
  color,
  size,
  children,
}: {
  x: number;
  y: number;
  color: string;
  size: number;
  children: React.ReactNode;
}) => {
  return (
    <g
      className="svg-wrap-text-group"
      data-x={x}
      data-y={y}
      transform={`translate(${x},${y})`}>
      <foreignObject
        width="80"
        height={50}
        requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
        <p
          className="svg-foreign-object"
          style={{
            color,
            fontSize: size,
            lineHeight: 0.9,
            margin: 0,
            paddingBottom: '5px',
          }}>
          {children}
        </p>
      </foreignObject>
    </g>
  );
};

export default SvgWrapText;
