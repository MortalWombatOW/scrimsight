import { FC } from 'react';
import { EdgeLabelRenderer, EdgeProps } from 'reactflow';

interface EdgeLabelProps {
  label: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

const EdgeLabel: FC<EdgeLabelProps> = ({
  label,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  // Calculate the middle point of the edge
  const edgeCenterX = sourceX + (targetX - sourceX) / 2;
  const edgeCenterY = sourceY + (targetY - sourceY) / 2;

  // Only render the label if it has content
  if (!label) return null;
  
  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${edgeCenterX}px, ${edgeCenterY}px)`,
          background: 'rgba(255, 255, 255, 0.85)',
          padding: '2px 5px',
          borderRadius: '3px',
          fontSize: '10px',
          fontWeight: 'bold',
          border: '1px solid #ccc',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          pointerEvents: 'all',
          zIndex: 10,
        }}
      >
        {label}
      </div>
    </EdgeLabelRenderer>
  );
};

// Custom edge component with our own label
const CustomEdge: FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, label }) => {
  return (
    <>
      {/* Draw edge */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
        strokeWidth={1}
        stroke="#888"
      />
      
      {/* Add label if provided */}
      {label && (
        <EdgeLabel
          label={label as string}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
        />
      )}
    </>
  );
};

export default CustomEdge;