import React, { useState, useEffect } from 'react';

interface EventTypeMetrics {
  eventType: string;
  count: number;
  validationFailures: number;
  parsingFailures: number;
}

export const BronzeDataMetrics: React.FC = () => {
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Metrics
  const [metrics, setMetrics] = useState<{
    totalLinesProcessed: number;
    successfulParseCount: number;
    failedParseCount: number;
    validationFailures: number;
    processingTime: number;
    eventsByType: EventTypeMetrics[];
    parsingErrors: Array<{ line: string; error: string }>;
    validationErrors: Array<{ eventType: string; error: string }>;
  }>({
    totalLinesProcessed: 0,
    successfulParseCount: 0,
    failedParseCount: 0,
    validationFailures: 0,
    processingTime: 0,
    eventsByType: [],
    parsingErrors: [],
    validationErrors: [],
  });

  // Simulate bronze data metrics
  useEffect(() => {
    const loadBronzeData = async () => {
      try {
        setLoading(true);
        
        // Wait for a brief moment to simulate loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate data processing metrics
        const totalLines = Math.floor(Math.random() * 50000) + 10000;
        const successfulParses = Math.floor(totalLines * (0.9 + Math.random() * 0.09));
        const failedParses = totalLines - successfulParses;
        
        // Generate simulated event types
        const eventTypes = [
          'MATCH_START', 'MATCH_END', 'ROUND_START', 'ROUND_END', 
          'KILL', 'DAMAGE', 'HEALING', 'OBJECTIVE_CAPTURED',
          'ULTIMATE_CHARGED', 'ULTIMATE_USED', 'HERO_SPAWN', 'HERO_SWAP'
        ];
        
        // Generate event metrics
        const eventsByType: EventTypeMetrics[] = eventTypes.map(eventType => ({
          eventType,
          count: Math.floor(Math.random() * 5000) + 500,
          validationFailures: Math.floor(Math.random() * 5),
          parsingFailures: Math.floor(Math.random() * 3),
        }));
        
        // Sort by count descending
        eventsByType.sort((a, b) => b.count - a.count);
        
        // Generate simulated parsing errors with correct timestamp format
        const parsingErrors = Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => {
          // Create proper formatted timestamp - OW logs use [HH:MM:SS] format
          const timestamp = `[${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}]`;
          
          // For timestamp errors, use malformed timestamps
          const errorType = i % 2 === 0 ? 'timestamp' : 'event type';
          const malformedLine = errorType === 'timestamp' 
            ? `(${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}),${eventTypes[i % eventTypes.length]},player${i % 10 + 1},player${(i + 5) % 10 + 1},...` 
            : `${timestamp},UNKNOWN_EVENT,player${i % 10 + 1},player${(i + 5) % 10 + 1},...`;
          
          return {
            line: malformedLine,
            error: `Error parsing ${errorType}`
          };
        });
        
        // Generate simulated validation errors
        const validationErrors = Array.from({ length: 3 }, (_, i) => {
          const eventTypes = ['MATCH_START', 'MATCH_END', 'ROUND_START']; // Specific event types as shown in the example
          const fieldNames = ['player_name', 'hero', 'team']; // Specific field names as shown in the example
          const errorTypes = ['required', 'invalid format', 'wrong type']; // Specific error types as shown in the example
          
          return {
            eventType: eventTypes[i],
            error: `Field "${fieldNames[i]}" is ${errorTypes[i]}`
          };
        });
        
        // Update the metrics state
        setMetrics({
          totalLinesProcessed: totalLines,
          successfulParseCount: successfulParses,
          failedParseCount: failedParses,
          validationFailures: validationErrors.length,
          processingTime: Math.random() * 500 + 200, // 200-700ms
          eventsByType,
          parsingErrors,
          validationErrors,
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error simulating bronze data:', error);
        setLoading(false);
      }
    };
    
    loadBronzeData();
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
      {/* Processing Summary */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Processing Summary</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-amber-500 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{metrics.totalLinesProcessed.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Lines Processed</div>
          </div>
          
          <div className="p-3 bg-amber-500 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{metrics.processingTime.toFixed(2)}ms</div>
            <div className="text-sm text-gray-400">Processing Time</div>
          </div>
          
          <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{metrics.successfulParseCount.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Successful Parses</div>
          </div>
          
          <div className="p-3 bg-red-500 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{metrics.failedParseCount.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Failed Parses</div>
          </div>
        </div>
        
        {/* Validation Statistics */}
        <div>
          <h3 className="text-lg font-medium mb-2">Validation</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-gray-400">Success Rate:</span>
            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
              {metrics.totalLinesProcessed > 0 ? (
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${(metrics.successfulParseCount / metrics.totalLinesProcessed) * 100}%` }}
                ></div>
              ) : (
                <div className="h-full bg-gray-600"></div>
              )}
            </div>
            <span>{metrics.totalLinesProcessed > 0 
              ? `${Math.round((metrics.successfulParseCount / metrics.totalLinesProcessed) * 100)}%` 
              : '0%'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Validation Failures:</span>
            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500"
                style={{ width: `${(metrics.validationFailures / Math.max(metrics.successfulParseCount, 1)) * 100}%` }}
              ></div>
            </div>
            <span>{metrics.validationFailures}</span>
          </div>
        </div>
      </div>
      
      {/* Event Types Breakdown */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Events by Type</h2>
        
        <div className="overflow-auto max-h-[300px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-2 px-3 text-left">Event Type</th>
                <th className="py-2 px-3 text-right">Count</th>
                <th className="py-2 px-3 text-right">Parse Fail</th>
                <th className="py-2 px-3 text-right">Valid Fail</th>
              </tr>
            </thead>
            <tbody>
              {metrics.eventsByType.map((event, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="py-2 px-3">{event.eventType}</td>
                  <td className="py-2 px-3 text-right">{event.count.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">{event.parsingFailures}</td>
                  <td className="py-2 px-3 text-right">{event.validationFailures}</td>
                </tr>
              ))}
              {metrics.eventsByType.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    No events processed
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Errors and Warnings */}
      <div className="col-span-1 md:col-span-2 p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Errors and Warnings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parsing Errors */}
          <div>
            <h3 className="text-lg font-medium mb-2">Parsing Errors</h3>
            <div className="bg-red-900 bg-opacity-20 rounded-lg p-3 overflow-auto max-h-[200px]">
              {metrics.parsingErrors.length > 0 ? (
                <ul className="space-y-2">
                  {metrics.parsingErrors.map((error, index) => (
                    <li key={index} className="text-xs">
                      <div className="font-mono text-red-400">{error.line}</div>
                      <div className="text-red-300 ml-2">    → {error.error}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No parsing errors</p>
              )}
            </div>
          </div>
          
          {/* Validation Errors */}
          <div>
            <h3 className="text-lg font-medium mb-2">Validation Errors</h3>
            <div className="bg-amber-900 bg-opacity-20 rounded-lg p-3 overflow-auto max-h-[200px]">
              {metrics.validationErrors.length > 0 ? (
                <ul className="space-y-2">
                  {metrics.validationErrors.map((error, index) => (
                    <li key={index} className="text-xs">
                      <div className="font-medium text-amber-400">Event Type: {error.eventType}</div>
                      <div className="text-amber-300 ml-2">    → {error.error}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No validation errors</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};