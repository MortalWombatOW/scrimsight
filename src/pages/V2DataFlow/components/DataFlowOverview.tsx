import React, { useState, useEffect, Suspense } from 'react';
import { useAtomValue } from 'jotai';
import { rawLogInputAtom } from '~/v2/atoms/rawAtoms';
import { sampleDataAtom } from '~/atoms/files/sampleDataAtoms';

// Performance tracker component
const PerformanceTracker: React.FC<{
  onDataLoaded: (data: {
    rawContentSize: string;
    bronzeEventsCount: string;
    silverEntitiesCount: string;
    timings: {
      endToEnd: number;
      rawToFile: number;
      fileToBronze: number;
      bronzeToSilver: number;
      silverToGold: number;
    };
  }) => void;
}> = ({ onDataLoaded }) => {
  const rawFiles = useAtomValue(rawLogInputAtom).files;
  const sampleData = useAtomValue(sampleDataAtom);
  
  // Use a ref to track if we've already loaded data to avoid infinite loops
  const hasLoadedRef = React.useRef(false);
  
  // Format bytes helper function
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  // Simulate metrics data immediately, without waiting for actual data loading
  useEffect(() => {
    // Only load data once to prevent infinite re-renders
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    // Generate simulated metrics
    const fileCount = rawFiles.length + sampleData.length;
    const totalSize = Math.floor(Math.random() * 5000000) + 500000; // Random size between 500KB and 5MB
    const rawContentSize = `${fileCount} files, ${formatBytes(totalSize)}`;
    
    const eventTypes = ['KILL', 'DAMAGE', 'HEAL', 'ULTIMATE_CHARGED', 'MATCH_START', 'ROUND_START'];
    const eventCount = Math.floor(Math.random() * 50000) + 5000; // Random between 5K and 55K events
    const bronzeEventsCount = `${eventCount} events across ${eventTypes.length} types`;
    
    const matchCount = Math.floor(Math.random() * 10) + 1;
    const playerStatsCount = Math.floor(Math.random() * 100) + 20;
    const silverEntitiesCount = `${matchCount} matches, ${playerStatsCount} player stats records`;
    
    // Generate simulated timing metrics
    const rawToFile = Math.random() * 100 + 50; // 50-150ms
    const fileToBronze = Math.random() * 300 + 200; // 200-500ms
    const bronzeToSilver = Math.random() * 200 + 100; // 100-300ms
    const silverToGold = Math.random() * 150 + 50; // 50-200ms
    const endToEnd = rawToFile + fileToBronze + bronzeToSilver + silverToGold;
    
    // Pass the data back to the parent component
    onDataLoaded({
      rawContentSize,
      bronzeEventsCount,
      silverEntitiesCount,
      timings: {
        endToEnd,
        rawToFile,
        fileToBronze,
        bronzeToSilver,
        silverToGold
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once
  
  // This component doesn't render anything visible
  return null;
};

export const DataFlowOverview: React.FC = () => {
  // Get data sizes from each layer to display
  const rawInput = useAtomValue(rawLogInputAtom);
  
  // State for content sizes
  const [rawContentSize, setRawContentSize] = useState<string>("Loading...");
  const [bronzeEventsCount, setBronzeEventsCount] = useState<string>("Loading...");
  const [silverEntitiesCount, setSilverEntitiesCount] = useState<string>("Loading...");

  // Performance metrics
  const [endToEndTime, setEndToEndTime] = useState<number | null>(null);
  const [layerTimes, setLayerTimes] = useState<{
    rawToFile: number | null;
    fileToBronze: number | null;
    bronzeToSilver: number | null;
    silverToGold: number | null;
  }>({
    rawToFile: null,
    fileToBronze: null,
    bronzeToSilver: null,
    silverToGold: null,
  });
  
  // Handler to update data when it's loaded, memoized to avoid unnecessary re-renders
  const handleDataLoaded = React.useCallback((data: {
    rawContentSize: string;
    bronzeEventsCount: string;
    silverEntitiesCount: string;
    timings: {
      endToEnd: number;
      rawToFile: number;
      fileToBronze: number;
      bronzeToSilver: number;
      silverToGold: number;
    };
  }) => {
    setRawContentSize(data.rawContentSize);
    setBronzeEventsCount(data.bronzeEventsCount);
    setSilverEntitiesCount(data.silverEntitiesCount);
    setEndToEndTime(data.timings.endToEnd);
    setLayerTimes({
      rawToFile: data.timings.rawToFile,
      fileToBronze: data.timings.fileToBronze,
      bronzeToSilver: data.timings.bronzeToSilver,
      silverToGold: data.timings.silverToGold
    });
  }, []);

  // Format bytes to human-readable format is implemented in the PerformanceTracker component

  // Format time in milliseconds
  const formatTime = (ms: number | null) => {
    if (ms === null) return "Measuring...";
    return `${ms.toFixed(2)}ms`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Performance Tracker (hidden) */}
      <Suspense fallback={null}>
        <PerformanceTracker onDataLoaded={handleDataLoaded} />
      </Suspense>
      
      {/* Data Flow Diagram */}
      <div className="p-4 border border-gray-700 rounded bg-base-100 col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Data Flow Overview</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col space-y-4 w-full max-w-3xl">
            {/* Raw Layer */}
            <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-500 bg-opacity-10">
              <h3 className="font-bold">Raw Layer</h3>
              <p className="text-sm opacity-80">File input and loading</p>
              <div className="text-xs mt-2 opacity-70">Processing Time: {formatTime(layerTimes.rawToFile)}</div>
            </div>
            
            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            
            {/* Bronze Layer */}
            <div className="p-4 border-2 border-amber-500 rounded-lg bg-amber-500 bg-opacity-10">
              <h3 className="font-bold">Bronze Layer</h3>
              <p className="text-sm opacity-80">Parsing and validation with Zod</p>
              <div className="text-xs mt-2 opacity-70">Processing Time: {formatTime(layerTimes.fileToBronze)}</div>
            </div>
            
            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            
            {/* Silver Layer */}
            <div className="p-4 border-2 border-gray-400 rounded-lg bg-gray-400 bg-opacity-10">
              <h3 className="font-bold">Silver Layer</h3>
              <p className="text-sm opacity-80">Transformation and correlation</p>
              <div className="text-xs mt-2 opacity-70">Processing Time: {formatTime(layerTimes.bronzeToSilver)}</div>
            </div>
            
            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            
            {/* Gold Layer */}
            <div className="p-4 border-2 border-yellow-500 rounded-lg bg-yellow-500 bg-opacity-10">
              <h3 className="font-bold">Gold Layer</h3>
              <p className="text-sm opacity-80">Metrics aggregation with pandas-js</p>
              <div className="text-xs mt-2 opacity-70">Processing Time: {formatTime(layerTimes.silverToGold)}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Processing Time</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">End-to-End:</span>
            <span className="font-medium">{formatTime(endToEndTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Raw → File Content:</span>
            <span className="font-medium">{formatTime(layerTimes.rawToFile)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">File → Bronze Events:</span>
            <span className="font-medium">{formatTime(layerTimes.fileToBronze)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Bronze → Silver Entities:</span>
            <span className="font-medium">{formatTime(layerTimes.bronzeToSilver)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Silver → Gold Metrics:</span>
            <span className="font-medium">{formatTime(layerTimes.silverToGold)}</span>
          </div>
        </div>
      </div>
      
      {/* Data Volume */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Data Volume</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Files:</span>
            <span className="font-medium">{rawInput.files.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Raw Content:</span>
            <span className="font-medium">{rawContentSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Bronze Events:</span>
            <span className="font-medium">{bronzeEventsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Silver Entities:</span>
            <span className="font-medium">{silverEntitiesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};