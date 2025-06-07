import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { Atom } from '@lib';

const AtomNode: React.FC<NodeProps<Atom>> = ({ data, sourcePosition, targetPosition }) => {
  const { id, label, type, fields, layer } = data;
  
  // Determine handle position based on the layout direction
  const inputPosition = targetPosition || Position.Left;
  const outputPosition = sourcePosition || Position.Right;
  
  // Define base color by layer
  const layerColors: Record<string, string> = {
    data: '#ffdab9',          // Light orange
    extractor: '#ffcccb',     // Light red
    derived_event: '#e6e6fa', // Light purple
    derived_state: '#d8f0d8', // Light green
    derived_stats: '#d4f4f4', // Light cyan
    metrics: '#fafad2'        // Light yellow
  };
  
  // Get base color from layer or default to white
  const baseColor = layerColors[layer] || '#ffffff';
  
  return (
    <div 
      style={{
        background: baseColor,
        border: '1px solid #555',
        borderRadius: '5px',
        padding: '10px',
        width: '220px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px', textAlign: 'center' }}>
        {label}
      </div>
      <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
        {type}
      </div>
      <div style={{ 
        fontSize: '9px', 
        textTransform: 'uppercase', 
        backgroundColor: '#f0f0f0', 
        color: '#444', 
        padding: '2px 4px', 
        borderRadius: '3px',
        textAlign: 'center',
        marginBottom: '6px'
      }}>
        {layer}
      </div>
      
      {/* Field handles */}
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '8px' }}>
        {fields && fields.map((field, index) => (
          <div key={`${id}-${field.name}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
            <div>{field.name}</div>
            
            {/* Input handle */}
            <Handle
              id={`input-${field.name}`}
              type="target"
              position={inputPosition}
              style={{ 
                top: inputPosition === Position.Left || inputPosition === Position.Right 
                  ? `${86 + index * 20}px` 
                  : undefined,
                left: inputPosition === Position.Top || inputPosition === Position.Bottom 
                  ? `${30 + (index * 40)}px` 
                  : undefined,
                background: '#555' 
              }}
            />
            
            {/* Output handle */}
            <Handle
              id={`output-${field.name}`}
              type="source"
              position={outputPosition}
              style={{ 
                top: outputPosition === Position.Left || outputPosition === Position.Right 
                  ? `${86 + index * 20}px` 
                  : undefined,
                left: outputPosition === Position.Top || outputPosition === Position.Bottom 
                  ? `${30 + (index * 40)}px` 
                  : undefined,
                background: '#555' 
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(AtomNode);
