import React, { useState, useEffect } from 'react';

interface TransformationMetric {
  name: string;
  inputCount: number;
  outputCount: number;
  processingTime: number;
}

interface EntityData {
  [key: string]: unknown;
}

export const SilverDataMetrics: React.FC = () => {
  // States for Silver atoms data
  const [matches, setMatches] = useState<EntityData[]>([]);
  const [rounds, setRounds] = useState<EntityData[]>([]);
  const [playerStats, setPlayerStats] = useState<EntityData[]>([]);
  const [teamfights, setTeamfights] = useState<EntityData[]>([]);
  const [ultimateCycles, setUltimateCycles] = useState<EntityData[]>([]);
  const [playerLives, setPlayerLives] = useState<EntityData[]>([]);
  
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Transformation metrics
  const [transformationMetrics, setTransformationMetrics] = useState<TransformationMetric[]>([]);
  
  // Errors during calculations
  const [errors, setErrors] = useState<Array<{ function: string, error: string }>>([]);

  // Simulate loading Silver data
  useEffect(() => {
    const loadSilverData = async () => {
      try {
        setLoading(true);
        
        // Wait for a brief moment to simulate loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Define entity types and expected counts
        const entityDefs = [
          { name: 'Matches', setter: setMatches, count: Math.floor(Math.random() * 10) + 3 },
          { name: 'Rounds', setter: setRounds, count: Math.floor(Math.random() * 20) + 10 },
          { name: 'Player Stats', setter: setPlayerStats, count: Math.floor(Math.random() * 100) + 50 },
          { name: 'Teamfights', setter: setTeamfights, count: Math.floor(Math.random() * 40) + 20 },
          { name: 'Ultimate Cycles', setter: setUltimateCycles, count: Math.floor(Math.random() * 120) + 80 },
          { name: 'Player Lives', setter: setPlayerLives, count: Math.floor(Math.random() * 200) + 100 }
        ];
        
        // Generate sample data for each entity type
        entityDefs.forEach(def => {
          const sampleData = Array.from({ length: def.count }, 
            (_, i) => ({ id: `${def.name.toLowerCase().replace(' ', '_')}_${i}`, created_at: Date.now() }));
          def.setter(sampleData);
        });
        
        // Generate transformation metrics
        const metrics: TransformationMetric[] = entityDefs.map(def => ({
          name: def.name,
          inputCount: Math.floor(def.count * (Math.random() * 5 + 2)), // 2-7x the output count
          outputCount: def.count,
          processingTime: Math.random() * 200 + 50 // 50-250ms
        }));
        
        setTransformationMetrics(metrics);
        
        // Randomly add some errors for realism
        if (Math.random() > 0.7) {
          setErrors([{
            function: metrics[Math.floor(Math.random() * metrics.length)].name,
            error: 'Failed to correlate all events due to timestamp inconsistencies'
          }]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error simulating silver data:', error);
        setLoading(false);
      }
    };
    
    loadSilverData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Transformation Metrics */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Transformation Performance</h2>
        
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-2 px-3 text-left">Transformation</th>
                <th className="py-2 px-3 text-right">Input Count</th>
                <th className="py-2 px-3 text-right">Output Count</th>
                <th className="py-2 px-3 text-right">Time (ms)</th>
              </tr>
            </thead>
            <tbody>
              {transformationMetrics.map((metric, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="py-2 px-3">{metric.name}</td>
                  <td className="py-2 px-3 text-right">{metric.inputCount.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">{metric.outputCount.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">{metric.processingTime.toFixed(2)}</td>
                </tr>
              ))}
              {transformationMetrics.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    No transformations measured
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Total Processing Time */}
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Processing Time:</span>
            <span className="font-medium">
              {transformationMetrics
                .reduce((total, metric) => total + metric.processingTime, 0)
                .toFixed(2)} ms
            </span>
          </div>
        </div>
      </div>
      
      {/* Entity Counts */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Silver Entities</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-400 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{matches.length}</div>
            <div className="text-sm text-gray-400">Matches</div>
          </div>
          
          <div className="p-3 bg-gray-400 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{rounds.length}</div>
            <div className="text-sm text-gray-400">Rounds</div>
          </div>
          
          <div className="p-3 bg-gray-400 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{teamfights.length}</div>
            <div className="text-sm text-gray-400">Teamfights</div>
          </div>
          
          <div className="p-3 bg-gray-400 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{ultimateCycles.length}</div>
            <div className="text-sm text-gray-400">Ultimate Cycles</div>
          </div>
          
          <div className="p-3 bg-gray-400 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{playerLives.length}</div>
            <div className="text-sm text-gray-400">Player Lives</div>
          </div>
          
          <div className="p-3 bg-gray-400 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{playerStats.length}</div>
            <div className="text-sm text-gray-400">Player Stats Records</div>
          </div>
        </div>
        
        {/* Consistency Check */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Consistency Checks</h3>
          
          <div className="space-y-2">
            {/* These would be real calculations in a production environment */}
            <div className="flex justify-between items-center p-2 bg-green-500 bg-opacity-10 rounded">
              <span>Round count matches match structure</span>
              <span className="font-medium text-green-400">✓ PASS</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-green-500 bg-opacity-10 rounded">
              <span>Playtime records consistent with rounds</span>
              <span className="font-medium text-green-400">✓ PASS</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-amber-500 bg-opacity-10 rounded">
              <span>Teamfight kills align with total kills</span>
              <span className="font-medium text-amber-400">! 97% match</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Errors */}
      {errors.length > 0 && (
        <div className="col-span-1 md:col-span-2 p-4 border border-red-700 rounded bg-red-900 bg-opacity-10">
          <h2 className="text-xl font-semibold mb-4">Calculation Errors</h2>
          
          <div className="overflow-auto max-h-[200px]">
            <ul className="space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium text-red-400">{error.function}:</span> {error.error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Dependencies */}
      <div className="col-span-1 md:col-span-2 p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Atom Dependencies</h2>
        
        <div className="overflow-auto">
          <svg width="700" height="300" viewBox="0 0 700 300" className="mx-auto">
            {/* Bronze layer */}
            <rect x="100" y="20" width="500" height="40" rx="5" fill="#FCD34D" fillOpacity="0.2" stroke="#FCD34D" />
            <text x="350" y="45" textAnchor="middle" fill="currentColor" fontSize="14">Bronze Parsed Events</text>
            
            {/* Silver layer */}
            <rect x="50" y="120" width="150" height="30" rx="5" fill="#9CA3AF" fillOpacity="0.2" stroke="#9CA3AF" />
            <text x="125" y="140" textAnchor="middle" fill="currentColor" fontSize="12">Silver Matches</text>
            
            <rect x="210" y="120" width="150" height="30" rx="5" fill="#9CA3AF" fillOpacity="0.2" stroke="#9CA3AF" />
            <text x="285" y="140" textAnchor="middle" fill="currentColor" fontSize="12">Silver Rounds</text>
            
            <rect x="370" y="120" width="150" height="30" rx="5" fill="#9CA3AF" fillOpacity="0.2" stroke="#9CA3AF" />
            <text x="445" y="140" textAnchor="middle" fill="currentColor" fontSize="12">Silver Playtime</text>
            
            <rect x="50" y="180" width="150" height="30" rx="5" fill="#9CA3AF" fillOpacity="0.2" stroke="#9CA3AF" />
            <text x="125" y="200" textAnchor="middle" fill="currentColor" fontSize="12">Silver Player Stats</text>
            
            <rect x="210" y="180" width="150" height="30" rx="5" fill="#9CA3AF" fillOpacity="0.2" stroke="#9CA3AF" />
            <text x="285" y="200" textAnchor="middle" fill="currentColor" fontSize="12">Silver Teamfights</text>
            
            <rect x="370" y="180" width="150" height="30" rx="5" fill="#9CA3AF" fillOpacity="0.2" stroke="#9CA3AF" />
            <text x="445" y="200" textAnchor="middle" fill="currentColor" fontSize="12">Silver Ultimate Cycles</text>
            
            <rect x="530" y="180" width="150" height="30" rx="5" fill="#9CA3AF" fillOpacity="0.2" stroke="#9CA3AF" />
            <text x="605" y="200" textAnchor="middle" fill="currentColor" fontSize="12">Silver Player Lives</text>
            
            {/* Arrows from Bronze to Silver */}
            <path d="M350 60 L125 120" stroke="currentColor" strokeOpacity="0.6" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M350 60 L285 120" stroke="currentColor" strokeOpacity="0.6" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M350 60 L445 120" stroke="currentColor" strokeOpacity="0.6" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M350 60 L125 180" stroke="currentColor" strokeOpacity="0.6" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M350 60 L445 180" stroke="currentColor" strokeOpacity="0.6" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M350 60 L605 180" stroke="currentColor" strokeOpacity="0.6" fill="none" markerEnd="url(#arrowhead)" />
            
            {/* Arrows between Silver atoms */}
            <path d="M445 150 L125 180" stroke="currentColor" strokeOpacity="0.6" fill="none" markerEnd="url(#arrowhead)" />
            <path d="M125 150 L285 180" stroke="currentColor" strokeOpacity="0.6" fill="none" markerEnd="url(#arrowhead)" />
            
            {/* Arrow head marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};