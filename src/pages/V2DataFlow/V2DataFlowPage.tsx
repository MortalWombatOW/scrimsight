import React, { useState } from 'react';
import Container from '~/components/Container/Container';
import { RawDataMetrics } from './components/RawDataMetrics';
import { BronzeDataMetrics } from './components/BronzeDataMetrics';
import { SilverDataMetrics } from './components/SilverDataMetrics';
import { GoldDataMetrics } from './components/GoldDataMetrics';
import { DataFlowOverview } from './components/DataFlowOverview';
import { DataFlowNavigation } from './components/DataFlowNavigation';
import { AtomExplorer } from './components/AtomExplorer';

// Layer types for navigation
type DataLayer = 'overview' | 'raw' | 'bronze' | 'silver' | 'gold' | 'explore';

export const V2DataFlowPage: React.FC = () => {
  // State for which layer is currently selected
  const [selectedLayer, setSelectedLayer] = useState<DataLayer>('overview');

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">V2 Data Flow Dashboard</h1>
      
      {/* Navigation between layers */}
      <DataFlowNavigation 
        selectedLayer={selectedLayer} 
        onLayerSelect={setSelectedLayer} 
      />

      {/* Layer-specific content */}
      <div className="mt-4">
        {selectedLayer === 'overview' && <DataFlowOverview />}
        {selectedLayer === 'raw' && <RawDataMetrics />}
        {selectedLayer === 'bronze' && <BronzeDataMetrics />}
        {selectedLayer === 'silver' && <SilverDataMetrics />}
        {selectedLayer === 'gold' && <GoldDataMetrics />}
        {selectedLayer === 'explore' && <AtomExplorer />}
      </div>
    </Container>
  );
};

export default V2DataFlowPage;