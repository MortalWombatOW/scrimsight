import React, { useState, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { bronzeParsedEventsAtom } from '~/v2/atoms/bronzeAtoms';
import { 
  silverMatchesAtom, 
  silverRoundsAtom, 
  silverPlaytimeAtom,
  silverPlayerRoundStatsAtom,
  silverTeamfightsAtom,
  silverUltimateCyclesAtom,
  silverPlayerLivesAtom
} from '~/v2/atoms/silverAtoms';
import { getAggregatedMetricsAtom } from '~/v2/atoms/goldAtoms';
import { metricsConfigAtom } from '~/v2/metrics/metricsConfig';
import { rawLogInputAtom, rawLogContentAtom } from '~/v2/atoms/rawAtoms';

// Define the atom structure for selection
type AtomCategory = 'raw' | 'bronze' | 'silver' | 'gold';

interface AtomOption {
  id: string;
  name: string;
  category: AtomCategory;
  atom: any;
  description: string;
}

// Used by AtomExplorer component

export const AtomExplorer: React.FC = () => {
  // Current selected atom and its data
  const [selectedAtomId, setSelectedAtomId] = useState<string>('');
  const [atomData, setAtomData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());
  const [filterText, setFilterText] = useState<string>('');
  const [currentItemCount, setCurrentItemCount] = useState<number>(0);
  const [expandedItemLimit, setExpandedItemLimit] = useState<number>(20);

  // Define default Gold Layer example parameters
  const [playerStatsParams] = useState({
    sourceAtom: 'silverPlayerRoundStats',
    groupBy: ['player', 'hero'],
    filters: {},
    metrics: ['eliminations', 'deaths', 'hero_damage', 'healing'],
    includeCount: true
  });

  // Create the atom for the default gold metrics
  const playerStatsMetricsAtom = getAggregatedMetricsAtom(playerStatsParams);

  // Define all available atoms
  const atomOptions: AtomOption[] = [
    // Raw Layer
    { 
      id: 'rawLogInput', 
      name: 'Raw Log Input', 
      category: 'raw', 
      atom: rawLogInputAtom,
      description: 'Uploaded file data before parsing' 
    },
    { 
      id: 'rawLogContent', 
      name: 'Raw Log Content', 
      category: 'raw', 
      atom: rawLogContentAtom,
      description: 'Text content from uploaded files' 
    },
    
    // Bronze Layer
    { 
      id: 'bronzeParsedEvents', 
      name: 'Bronze Parsed Events', 
      category: 'bronze',
      atom: bronzeParsedEventsAtom,
      description: 'All events parsed and validated from log files' 
    },
    
    // Silver Layer
    { 
      id: 'silverMatches', 
      name: 'Silver Matches', 
      category: 'silver', 
      atom: silverMatchesAtom,
      description: 'Match data derived from events' 
    },
    { 
      id: 'silverRounds', 
      name: 'Silver Rounds', 
      category: 'silver', 
      atom: silverRoundsAtom,
      description: 'Round data derived from events' 
    },
    { 
      id: 'silverPlaytime', 
      name: 'Silver Playtime', 
      category: 'silver', 
      atom: silverPlaytimeAtom,
      description: 'Player playtime records' 
    },
    { 
      id: 'silverPlayerRoundStats', 
      name: 'Silver Player Round Stats', 
      category: 'silver', 
      atom: silverPlayerRoundStatsAtom,
      description: 'Player statistics per round' 
    },
    { 
      id: 'silverTeamfights', 
      name: 'Silver Teamfights', 
      category: 'silver', 
      atom: silverTeamfightsAtom,
      description: 'Teamfight data derived from events' 
    },
    { 
      id: 'silverUltimateCycles', 
      name: 'Silver Ultimate Cycles', 
      category: 'silver', 
      atom: silverUltimateCyclesAtom,
      description: 'Ultimate usage cycles derived from events' 
    },
    { 
      id: 'silverPlayerLives', 
      name: 'Silver Player Lives', 
      category: 'silver', 
      atom: silverPlayerLivesAtom,
      description: 'Player life/death cycles' 
    },
    
    // Gold Layer
    { 
      id: 'metricsConfig', 
      name: 'Metrics Configuration', 
      category: 'gold', 
      atom: metricsConfigAtom,
      description: 'Configuration of available metrics' 
    },
    {
      id: 'playerHeroStats',
      name: 'Player Stats by Hero',
      category: 'gold',
      atom: playerStatsMetricsAtom,
      description: 'Aggregated player statistics grouped by hero'
    }
  ];

  // We're using useAtom to pre-load atoms within the component
  
  // Map of atom IDs to their values (populated via useAtom)
  const [rawInput] = useAtom(rawLogInputAtom);
  const [rawContent] = useAtom(rawLogContentAtom);
  const [bronzeParsedEvents] = useAtom(bronzeParsedEventsAtom);
  const [silverMatches] = useAtom(silverMatchesAtom);
  const [silverRounds] = useAtom(silverRoundsAtom);
  const [silverPlaytime] = useAtom(silverPlaytimeAtom);
  const [silverPlayerRoundStats] = useAtom(silverPlayerRoundStatsAtom);
  const [silverTeamfights] = useAtom(silverTeamfightsAtom);
  const [silverUltimateCycles] = useAtom(silverUltimateCyclesAtom);
  const [silverPlayerLives] = useAtom(silverPlayerLivesAtom);
  const [metrics] = useAtom(metricsConfigAtom);
  const [playerStats] = useAtom(playerStatsMetricsAtom);
  
  // Load atom data when selection changes
  const loadAtomData = useCallback(async (atomId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the selected atom
      const selectedOption = atomOptions.find(option => option.id === atomId);
      if (!selectedOption) {
        throw new Error('Atom not found');
      }
      
      // Get the appropriate value based on atom ID
      let atomValue;
      switch (atomId) {
        case 'rawLogInput':
          atomValue = rawInput;
          break;
        case 'rawLogContent':
          atomValue = rawContent;
          break;
        case 'bronzeParsedEvents':
          atomValue = bronzeParsedEvents;
          break;
        case 'silverMatches':
          atomValue = silverMatches;
          break;
        case 'silverRounds':
          atomValue = silverRounds;
          break;
        case 'silverPlaytime':
          atomValue = silverPlaytime;
          break;
        case 'silverPlayerRoundStats':
          atomValue = silverPlayerRoundStats;
          break;
        case 'silverTeamfights':
          atomValue = silverTeamfights;
          break;
        case 'silverUltimateCycles':
          atomValue = silverUltimateCycles;
          break;
        case 'silverPlayerLives':
          atomValue = silverPlayerLives;
          break;
        case 'metricsConfig':
          atomValue = metrics;
          break;
        case 'playerHeroStats':
          atomValue = playerStats;
          break;
        default:
          // For custom atoms, we'll show placeholder data
          atomValue = { 
            note: 'This is simulated data. Real atom values will be displayed when data is loaded.',
            atomId,
            timestamp: new Date().toISOString()
          };
      }
      
      // If the value is a promise, resolve it
      if (atomValue instanceof Promise) {
        atomValue = await atomValue;
      }
      
      // If no value is available, provide a placeholder
      if (atomValue === undefined || atomValue === null) {
        atomValue = { 
          note: 'No data available for this atom.',
          atomId,
          timestamp: new Date().toISOString()
        };
      }
      
      setAtomData(atomValue);
      
      // Count items for arrays
      if (Array.isArray(atomValue)) {
        setCurrentItemCount(atomValue.length);
      } else if (typeof atomValue === 'object' && atomValue !== null) {
        setCurrentItemCount(Object.keys(atomValue).length);
      } else {
        setCurrentItemCount(1);
      }
    } catch (err) {
      console.error('Error loading atom data:', err);
      setError(`Error loading atom data: ${(err as Error).message}`);
      setAtomData(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    atomOptions, rawInput, rawContent, bronzeParsedEvents, silverMatches, 
    silverRounds, silverPlaytime, silverPlayerRoundStats, silverTeamfights, 
    silverUltimateCycles, silverPlayerLives, metrics, playerStats
  ]);

  // Handle atom selection change
  const handleAtomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const atomId = e.target.value;
    setSelectedAtomId(atomId);
    if (atomId) {
      loadAtomData(atomId);
    } else {
      setAtomData(null);
    }
  };

  // Toggle collapsed state for a key
  const toggleCollapsed = (key: string) => {
    setCollapsedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Expand all
  const expandAll = () => {
    setCollapsedKeys(new Set());
  };

  // Collapse all
  const collapseAll = () => {
    // Create a set of all possible paths
    const allKeys = new Set<string>();
    
    const findAllKeys = (obj: any, path = '') => {
      if (Array.isArray(obj)) {
        allKeys.add(path);
        if (obj.length > 0) {
          // Add a few sample array items
          for (let i = 0; i < Math.min(5, obj.length); i++) {
            findAllKeys(obj[i], `${path}[${i}]`);
          }
        }
      } else if (obj && typeof obj === 'object') {
        allKeys.add(path);
        for (const key of Object.keys(obj)) {
          findAllKeys(obj[key], path ? `${path}.${key}` : key);
        }
      }
    };
    
    findAllKeys(atomData);
    setCollapsedKeys(allKeys);
  };

  // Filter the data by key or value
  const filterData = (data: any): any => {
    if (!filterText) return data;
    
    const filterLower = filterText.toLowerCase();
    
    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filterLower);
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value).toLowerCase().includes(filterLower);
      }
      return false;
    };
    
    const filterObject = (obj: any): any => {
      if (!obj) return obj;
      
      if (Array.isArray(obj)) {
        const filtered = obj
          .map(item => filterObject(item))
          .filter(item => item !== undefined);
        return filtered.length > 0 ? filtered : undefined;
      }
      
      if (typeof obj === 'object') {
        const result: Record<string, any> = {};
        let hasMatch = false;
        
        for (const [key, value] of Object.entries(obj)) {
          if (key.toLowerCase().includes(filterLower) || checkValue(value)) {
            result[key] = value;
            hasMatch = true;
            continue;
          }
          
          const filteredValue = filterObject(value);
          if (filteredValue !== undefined) {
            result[key] = filteredValue;
            hasMatch = true;
          }
        }
        
        return hasMatch ? result : undefined;
      }
      
      return checkValue(obj) ? obj : undefined;
    };
    
    return filterObject(data);
  };

  // Atom display components - recursive rendering
  const renderValue = (value: any, path = '', depth = 0): React.ReactNode => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (value === undefined) return <span className="text-gray-500">undefined</span>;
    
    if (typeof value === 'string') return <span className="text-green-400">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-blue-400">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-purple-400">{value ? 'true' : 'false'}</span>;
    
    if (Array.isArray(value)) {
      const isCollapsed = collapsedKeys.has(path);
      
      // Special handling for empty arrays
      if (value.length === 0) {
        return <span className="text-gray-500">[] (empty array)</span>;
      }
      
      // Check if this is a numeric array with simple values
      const isNumericArray = value.every(item => typeof item === 'number');
      const isStringArray = value.every(item => typeof item === 'string');
      
      // For arrays with numeric types, offer visualization options
      if (isNumericArray && value.length > 5 && depth < 2) {
        return (
          <div>
            <span 
              className="cursor-pointer hover:text-blue-300" 
              onClick={() => toggleCollapsed(path)}
            >
              {isCollapsed ? '▶' : '▼'} Numeric Array[{value.length}]
            </span>
            
            {!isCollapsed && (
              <div className="pl-4 border-l border-gray-700 ml-2">
                <div className="flex flex-wrap gap-1 my-2">
                  {value.slice(0, 20).map((num, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-blue-900 bg-opacity-40 rounded-sm text-xs"
                      title={`Index ${i}: ${num}`}
                    >
                      {num}
                    </span>
                  ))}
                  {value.length > 20 && <span className="text-gray-400">... {value.length - 20} more</span>}
                </div>
                
                <div className="my-2">
                  <div className="text-xs text-gray-400 mb-1">Array statistics:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-gray-800 p-1 rounded">
                      <span className="text-gray-400">Min:</span> 
                      <span className="ml-1 text-blue-300">{Math.min(...value)}</span>
                    </div>
                    <div className="bg-gray-800 p-1 rounded">
                      <span className="text-gray-400">Max:</span> 
                      <span className="ml-1 text-blue-300">{Math.max(...value)}</span>
                    </div>
                    <div className="bg-gray-800 p-1 rounded">
                      <span className="text-gray-400">Avg:</span> 
                      <span className="ml-1 text-blue-300">
                        {(value.reduce((sum, val) => sum + val, 0) / value.length).toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-gray-800 p-1 rounded">
                      <span className="text-gray-400">Sum:</span> 
                      <span className="ml-1 text-blue-300">{value.reduce((sum, val) => sum + val, 0)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  {value.slice(0, expandedItemLimit).map((item, index) => (
                    <div key={index} className="my-1">
                      <span className="text-gray-500">[{index}]:</span> {renderValue(item, `${path}[${index}]`, depth + 1)}
                    </div>
                  ))}
                  {value.length > expandedItemLimit && (
                    <div className="text-gray-400">
                      ... {value.length - expandedItemLimit} more items
                      <button 
                        className="ml-2 text-xs text-blue-400 hover:underline" 
                        onClick={() => setExpandedItemLimit(prev => prev + 50)}
                      >
                        Show more
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }
      
      // Special handling for string arrays (tags, names, etc)
      if (isStringArray && value.length > 3 && depth < 2) {
        return (
          <div>
            <span 
              className="cursor-pointer hover:text-blue-300" 
              onClick={() => toggleCollapsed(path)}
            >
              {isCollapsed ? '▶' : '▼'} String Array[{value.length}]
            </span>
            
            {!isCollapsed && (
              <div className="pl-4 border-l border-gray-700 ml-2">
                <div className="flex flex-wrap gap-1 my-2">
                  {value.slice(0, 30).map((str, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-green-900 bg-opacity-30 rounded-sm text-xs"
                      title={`Index ${i}`}
                    >
                      {str}
                    </span>
                  ))}
                  {value.length > 30 && <span className="text-gray-400">... {value.length - 30} more</span>}
                </div>
                
                <div className="mt-3">
                  {value.slice(0, expandedItemLimit).map((item, index) => (
                    <div key={index} className="my-1">
                      <span className="text-gray-500">[{index}]:</span> {renderValue(item, `${path}[${index}]`, depth + 1)}
                    </div>
                  ))}
                  {value.length > expandedItemLimit && (
                    <div className="text-gray-400">
                      ... {value.length - expandedItemLimit} more items
                      <button 
                        className="ml-2 text-xs text-blue-400 hover:underline" 
                        onClick={() => setExpandedItemLimit(prev => prev + 50)}
                      >
                        Show more
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }
      
      // Default array rendering
      return (
        <div>
          <span 
            className="cursor-pointer hover:text-blue-300" 
            onClick={() => toggleCollapsed(path)}
          >
            {isCollapsed ? '▶' : '▼'} Array[{value.length}]
          </span>
          
          {!isCollapsed && (
            <div className="pl-4 border-l border-gray-700 ml-2">
              {value.slice(0, expandedItemLimit).map((item, index) => (
                <div key={index} className="my-1">
                  <span className="text-gray-500">[{index}]:</span> {renderValue(item, `${path}[${index}]`, depth + 1)}
                </div>
              ))}
              {value.length > expandedItemLimit && (
                <div className="text-gray-400">
                  ... {value.length - expandedItemLimit} more items
                  <button 
                    className="ml-2 text-xs text-blue-400 hover:underline" 
                    onClick={() => setExpandedItemLimit(prev => prev + 50)}
                  >
                    Show more
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const isCollapsed = collapsedKeys.has(path);
      const entries = Object.entries(value);
      
      // Special handling for empty objects
      if (entries.length === 0) {
        return <span className="text-gray-500">{} (empty object)</span>;
      }
      
      // Check if this is potentially a metric object with structure for Gold metrics
      const hasMetricProps = entries.some(([key]) => 
        ['value', 'metric', 'count', 'groupBy'].includes(key)
      );
      
      if (hasMetricProps && depth < 3) {
        // Try to identify and display metric result objects nicely
        const metric = value.metric || path.split('.').pop();
        const metricValue = value.value;
        const count = value.count;
        
        if (metricValue !== undefined) {
          return (
            <div>
              <span 
                className="cursor-pointer hover:text-blue-300" 
                onClick={() => toggleCollapsed(path)}
              >
                {isCollapsed ? '▶' : '▼'} Metric: {metric || 'Unknown'} 
                {typeof metricValue === 'number' && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-800 rounded-sm text-white">
                    {metricValue.toFixed(2)}
                  </span>
                )}
                {count !== undefined && <span className="text-gray-400 text-xs ml-2">(n={count})</span>}
              </span>
              
              {!isCollapsed && (
                <div className="pl-4 border-l border-gray-700 ml-2">
                  {entries.map(([key, val]) => (
                    <div key={key} className="my-1">
                      <span className="text-yellow-400">"{key}"</span>: {renderValue(val, path ? `${path}.${key}` : key, depth + 1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
      }
      
      // Default object rendering
      return (
        <div>
          <span 
            className="cursor-pointer hover:text-blue-300" 
            onClick={() => toggleCollapsed(path)}
          >
            {isCollapsed ? '▶' : '▼'} Object{`{${entries.length}}`}
          </span>
          
          {!isCollapsed && (
            <div className="pl-4 border-l border-gray-700 ml-2">
              {entries.slice(0, expandedItemLimit).map(([key, val]) => (
                <div key={key} className="my-1">
                  <span className="text-yellow-400">"{key}"</span>: {renderValue(val, path ? `${path}.${key}` : key, depth + 1)}
                </div>
              ))}
              {entries.length > expandedItemLimit && (
                <div className="text-gray-400">
                  ... {entries.length - expandedItemLimit} more properties
                  <button 
                    className="ml-2 text-xs text-blue-400 hover:underline" 
                    onClick={() => setExpandedItemLimit(prev => prev + 50)}
                  >
                    Show more
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  // Add a dynamic query builder for Gold layer metrics
  const [customQueryParams, setCustomQueryParams] = useState({
    sourceAtom: 'silverPlayerRoundStats',
    groupBy: ['player'],
    metrics: ['eliminations', 'deaths']
  });
  
  const [customMetricsAtom, setCustomMetricsAtom] = useState<any>(null);
  const [customMetricsData, setCustomMetricsData] = useState<any>(null);
  
  // Create and update custom metrics atom when parameters change
  useEffect(() => {
    try {
      const newAtom = getAggregatedMetricsAtom({
        ...customQueryParams,
        filters: {},
        includeCount: true
      });
      setCustomMetricsAtom(newAtom);
    } catch (e) {
      console.error('Error creating custom metrics atom:', e);
    }
  }, [customQueryParams]);
  
  // Fetch data when custom atom changes
  useEffect(() => {
    if (!customMetricsAtom) return;
    
    const fetchCustomData = async () => {
      try {
        // This is just a simulation since we can't directly read atoms outside of components
        setCustomMetricsData({ type: 'Custom metrics query', params: customQueryParams });
      } catch (e) {
        console.error('Error fetching custom metrics:', e);
      }
    };
    
    fetchCustomData();
  }, [customMetricsAtom, customQueryParams]);

  // Render the atom explorer
  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {/* Atom Selection and Controls */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Atom Explorer</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Atom Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-1">Select Atom</label>
            <select 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              value={selectedAtomId}
              onChange={handleAtomSelect}
            >
              <option value="">-- Select an atom --</option>
              <optgroup label="Raw Layer">
                {atomOptions.filter(o => o.category === 'raw').map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </optgroup>
              <optgroup label="Bronze Layer">
                {atomOptions.filter(o => o.category === 'bronze').map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </optgroup>
              <optgroup label="Silver Layer">
                {atomOptions.filter(o => o.category === 'silver').map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </optgroup>
              <optgroup label="Gold Layer">
                {atomOptions.filter(o => o.category === 'gold').map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </optgroup>
            </select>
            {selectedAtomId && (
              <p className="text-sm text-gray-400 mt-1">
                {atomOptions.find(o => o.id === selectedAtomId)?.description}
              </p>
            )}
          </div>
          
          {/* Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-1">Filter Data</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              placeholder="Filter by key or value..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <p className="text-sm text-gray-400 mt-1">
              {currentItemCount} {currentItemCount === 1 ? 'item' : 'items'} 
              {filterText && ' (filtered)'}
            </p>
          </div>
        </div>
        
        {/* View Controls */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={expandAll}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Expand All
          </button>
          <button 
            onClick={collapseAll}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Collapse All
          </button>
          <button 
            onClick={() => setExpandedItemLimit(prev => prev + 100)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Show More Items
          </button>
          <button 
            onClick={() => { 
              if (selectedAtomId) {
                loadAtomData(selectedAtomId);
              }
            }}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm ml-auto"
          >
            Refresh
          </button>
        </div>
        
        {/* Direct value display for simplifying common atoms */}
        {selectedAtomId === 'rawLogInput' && (
          <div className="mb-4 p-3 bg-gray-800 rounded">
            <h3 className="text-md font-medium mb-2">Quick View</h3>
            <p>Files loaded: {rawInput.files.length}</p>
          </div>
        )}
        
        {selectedAtomId === 'metricsConfig' && (
          <div className="mb-4 p-3 bg-gray-800 rounded">
            <h3 className="text-md font-medium mb-2">Quick View</h3>
            <p>Total metrics: {Object.keys(metrics).length}</p>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <div>
                <span className="text-sm text-gray-400">Simple:</span>
                <span className="ml-2">{Object.values(metrics).filter(m => m.type === 'simple').length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Ratio:</span>
                <span className="ml-2">{Object.values(metrics).filter(m => m.type === 'ratio').length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Per10min:</span>
                <span className="ml-2">{Object.values(metrics).filter(m => m.type === 'per10min').length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Derived:</span>
                <span className="ml-2">{Object.values(metrics).filter(m => m.type === 'derived').length}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Gold Layer Query Builder */}
        <div className="mt-5 border-t border-gray-700 pt-4">
          <h3 className="text-md font-medium mb-3">Gold Layer Query Builder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Source Data</label>
              <select
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                value={customQueryParams.sourceAtom}
                onChange={(e) => setCustomQueryParams(prev => ({
                  ...prev,
                  sourceAtom: e.target.value
                }))}
              >
                <option value="silverPlayerRoundStats">Player Round Stats</option>
                <option value="silverTeamfights">Teamfights</option>
                <option value="silverUltimateCycles">Ultimate Cycles</option>
                <option value="silverPlayerLives">Player Lives</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Group By</label>
              <select
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                value={customQueryParams.groupBy[0]}
                onChange={(e) => setCustomQueryParams(prev => ({
                  ...prev,
                  groupBy: [e.target.value]
                }))}
              >
                <option value="player">Player</option>
                <option value="hero">Hero</option>
                <option value="team">Team</option>
                <option value="match">Match</option>
                <option value="round">Round</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Metrics</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {["eliminations", "deaths", "hero_damage", "healing", "kd_ratio", "final_blows"].map(metric => (
                  <label key={metric} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={customQueryParams.metrics.includes(metric)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCustomQueryParams(prev => ({
                            ...prev,
                            metrics: [...prev.metrics, metric]
                          }));
                        } else {
                          setCustomQueryParams(prev => ({
                            ...prev,
                            metrics: prev.metrics.filter(m => m !== metric)
                          }));
                        }
                      }}
                    />
                    <span className="text-sm">{metric}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <button
              className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
              onClick={() => {
                const newAtom = getAggregatedMetricsAtom({
                  ...customQueryParams,
                  filters: {},
                  includeCount: true
                });
                // Add to available atoms
                const newAtomOption = {
                  id: `custom_${Date.now()}`,
                  name: `Custom: ${customQueryParams.sourceAtom} by ${customQueryParams.groupBy.join(',')}`,
                  category: 'gold' as AtomCategory,
                  atom: newAtom,
                  description: `Custom query: ${customQueryParams.metrics.join(', ')} grouped by ${customQueryParams.groupBy.join(', ')}`
                };
                
                // Update atom options (simulated since we can't modify atomOptions directly)
                setCustomMetricsData({
                  type: 'Custom query created',
                  params: {...customQueryParams},
                  id: newAtomOption.id,
                  timestamp: new Date().toISOString()
                });
              }}
            >
              Generate Query
            </button>
          </div>
          
          {customMetricsData && (
            <div className="mt-3 p-3 bg-gray-800 rounded">
              <h4 className="text-sm font-medium mb-2">Custom Query Details</h4>
              <pre className="text-xs overflow-auto max-h-24">
                {JSON.stringify(customMetricsData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      {/* Data Viewer */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">
          Data Viewer
          {selectedAtomId && ` - ${atomOptions.find(o => o.id === selectedAtomId)?.name}`}
        </h2>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-900 bg-opacity-30 border border-red-800 rounded mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {!isLoading && !error && atomData && (
          <div className="overflow-auto max-h-[600px] font-mono text-sm p-4 bg-gray-900 rounded">
            {renderValue(filterText ? filterData(atomData) : atomData)}
          </div>
        )}
        
        {!isLoading && !error && !atomData && (
          <div className="flex justify-center items-center h-64 text-gray-400">
            {selectedAtomId 
              ? 'No data available for this atom'
              : 'Select an atom to view its data'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AtomExplorer;