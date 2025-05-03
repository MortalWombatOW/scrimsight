import React from 'react';

type DataLayer = 'overview' | 'raw' | 'bronze' | 'silver' | 'gold' | 'explore';

interface DataFlowNavigationProps {
  selectedLayer: DataLayer;
  onLayerSelect: (layer: DataLayer) => void;
}

export const DataFlowNavigation: React.FC<DataFlowNavigationProps> = ({ 
  selectedLayer, 
  onLayerSelect 
}) => {
  const layers: { id: DataLayer; label: string; description: string }[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      description: 'End-to-end process visualization'
    },
    { 
      id: 'raw', 
      label: 'Raw Layer', 
      description: 'File loading and input state' 
    },
    { 
      id: 'bronze', 
      label: 'Bronze Layer', 
      description: 'Parsing and validation' 
    },
    { 
      id: 'silver', 
      label: 'Silver Layer', 
      description: 'Data transformation and correlation' 
    },
    { 
      id: 'gold', 
      label: 'Gold Layer', 
      description: 'Metrics aggregation and calculation' 
    },
    {
      id: 'explore',
      label: 'Atom Explorer',
      description: 'Explore data across all layers'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {layers.map((layer) => (
        <button
          key={layer.id}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedLayer === layer.id
              ? 'bg-primary-500 text-white'
              : 'bg-base-100 hover:bg-base-200 dark:bg-base-700 dark:hover:bg-base-600'
          }`}
          onClick={() => onLayerSelect(layer.id)}
        >
          <span className="font-medium">{layer.label}</span>
          <span className="block text-xs mt-1 opacity-80">{layer.description}</span>
        </button>
      ))}
    </div>
  );
};

export default DataFlowNavigation;