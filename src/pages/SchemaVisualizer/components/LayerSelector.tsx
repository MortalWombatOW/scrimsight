import React from 'react';

interface LayerSelectorProps {
  selectedLayers: string[];
  setSelectedLayers: (layers: string[]) => void;
  onLayout: () => void;
  direction?: 'LR' | 'TB';
  setDirection?: (direction: 'LR' | 'TB') => void;
}

const LayerSelector: React.FC<LayerSelectorProps> = ({ 
  selectedLayers, 
  setSelectedLayers,
  onLayout,
  direction = 'LR',
  setDirection
}) => {
  const layers = ['data', 'extractor', 'derived_event', 'derived_state', 'derived_stats', 'metrics'];
  
  const handleLayerChange = (layer: string) => {
    if (selectedLayers.includes(layer)) {
      setSelectedLayers(selectedLayers.filter(l => l !== layer));
    } else {
      setSelectedLayers([...selectedLayers, layer]);
    }
  };
  
  const layerColors: Record<string, string> = {
    data: '#ffdab9',          // Light orange
    extractor: '#ffcccb',     // Light red
    derived_event: '#e6e6fa', // Light purple
    derived_state: '#d8f0d8', // Light green
    derived_stats: '#d4f4f4', // Light cyan
    metrics: '#fafad2'        // Light yellow
  };
  
  return (
    <div style={{ 
      background: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Layer Visibility</div>
      <div style={{ fontSize: '11px', marginBottom: '8px', color: '#666' }}>
        Select layers to view atom dependencies
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {layers.map(layer => (
          <div key={layer} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              id={`layer-${layer}`}
              checked={selectedLayers.includes(layer)}
              onChange={() => handleLayerChange(layer)}
            />
            <label 
              htmlFor={`layer-${layer}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                textTransform: 'capitalize'
              }}
            >
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: layerColors[layer], 
                border: '1px solid #ccc',
                borderRadius: '2px'
              }} />
              {layer}
            </label>
          </div>
        ))}
      </div>
      
      {setDirection && (
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', marginBottom: '5px', color: '#444' }}>Layout Direction:</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setDirection('LR')}
              style={{
                flex: 1,
                padding: '4px 8px',
                background: direction === 'LR' ? '#e6e6fa' : '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer',
                fontWeight: direction === 'LR' ? 'bold' : 'normal'
              }}
            >
              Horizontal
            </button>
            <button
              onClick={() => setDirection('TB')}
              style={{
                flex: 1,
                padding: '4px 8px',
                background: direction === 'TB' ? '#e6e6fa' : '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer',
                fontWeight: direction === 'TB' ? 'bold' : 'normal'
              }}
            >
              Vertical
            </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={onLayout}
        style={{
          marginTop: '10px',
          padding: '4px 8px',
          background: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '3px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Apply Layout
      </button>
      <div style={{ fontSize: '10px', marginTop: '8px', color: '#666' }}>
        Tip: Select 1-2 layers at a time for best results
      </div>
    </div>
  );
};

export default LayerSelector;
