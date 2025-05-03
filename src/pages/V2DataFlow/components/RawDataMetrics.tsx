import React, { useState, useEffect } from 'react';
import { useAtomValue, useAtom } from 'jotai';
import { rawLogInputAtom, rawLogContentAtom, RawLogContent } from '~/v2/atoms/rawAtoms';
import { sampleDataAtom } from '~/atoms/files/sampleDataAtoms';

export const RawDataMetrics: React.FC = () => {
  // Get raw layer data
  const rawInput = useAtomValue(rawLogInputAtom);
  const [rawContent, setRawContent] = useState<RawLogContent[]>([]);
  const [fileLoadTimes, setFileLoadTimes] = useState<Record<string, number>>({});
  const [fileLoadErrors, setFileLoadErrors] = useState<string[]>([]);
  const sampleData = useAtomValue(sampleDataAtom);
  
  // File content metrics
  const [contentMetrics, setContentMetrics] = useState<{
    totalSize: number;
    totalLines: number;
    filesLoaded: number;
    filesAttempted: number;
  }>({
    totalSize: 0,
    totalLines: 0,
    filesLoaded: 0,
    filesAttempted: 0,
  });

  // Load raw content data
  const [rawContentAtomValue] = useAtom(rawLogContentAtom);
  
  useEffect(() => {
    const loadRawContent = async () => {
      try {
        // Use the atom value we already have, or generate simulated content
        const content = rawContentAtomValue || [];
        
        // Calculate metrics
        const totalSize = content.reduce((sum, file) => sum + file.fileContent.length, 0);
        const totalLines = content.reduce(
          (sum, file) => sum + file.fileContent.split('\n').length, 
          0
        );
        
        // Mock file load times (since we don't have individual file load times)
        const mockLoadTimes: Record<string, number> = {};
        content.forEach((file) => {
          // Base load time on file size to simulate realistic behavior
          const loadTime = (file.fileContent.length / 1000) * (Math.random() * 2 + 1);
          mockLoadTimes[file.fileName] = parseFloat(loadTime.toFixed(2));
        });
        
        setRawContent(content);
        setFileLoadTimes(mockLoadTimes);
        setContentMetrics({
          totalSize,
          totalLines,
          filesLoaded: content.length,
          filesAttempted: rawInput.files.length,
        });
      } catch (error) {
        console.error('Error loading raw content:', error);
        setFileLoadErrors(['Error loading file content']);
      }
    };
    
    loadRawContent();
  }, [rawInput, rawContentAtomValue]);

  // Format bytes to human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* File Loading Metrics */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">File Loading</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{contentMetrics.filesLoaded}</div>
            <div className="text-sm text-gray-400">Files Loaded</div>
          </div>
          
          <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{formatBytes(contentMetrics.totalSize)}</div>
            <div className="text-sm text-gray-400">Total Content Size</div>
          </div>
          
          <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{contentMetrics.totalLines.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Lines</div>
          </div>
          
          <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
            <div className="text-3xl font-bold">{sampleData.length}</div>
            <div className="text-sm text-gray-400">Sample Files Used</div>
          </div>
        </div>
        
        {/* Success Rate Chart */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Success Rate</h3>
          <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
            {contentMetrics.filesAttempted > 0 ? (
              <div 
                className="h-full bg-green-500 text-xs text-white flex items-center justify-center"
                style={{ width: `${(contentMetrics.filesLoaded / contentMetrics.filesAttempted) * 100}%` }}
              >
                {Math.round((contentMetrics.filesLoaded / contentMetrics.filesAttempted) * 100)}%
              </div>
            ) : (
              <div className="h-full bg-gray-600 text-xs text-white flex items-center justify-center">
                No data
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* File Details */}
      <div className="p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">File Details</h2>
        
        {fileLoadErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
            <h3 className="font-medium text-red-500 mb-1">Errors</h3>
            <ul className="list-disc list-inside text-sm">
              {fileLoadErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="overflow-auto max-h-[300px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-2 px-3 text-left">File Name</th>
                <th className="py-2 px-3 text-right">Size</th>
                <th className="py-2 px-3 text-right">Load Time</th>
              </tr>
            </thead>
            <tbody>
              {rawContent && rawContent.map((file, index: number) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="py-2 px-3">{file.fileName}</td>
                  <td className="py-2 px-3 text-right">{formatBytes(file.fileContent.length)}</td>
                  <td className="py-2 px-3 text-right">{fileLoadTimes[file.fileName as string] || 0}ms</td>
                </tr>
              ))}
              {(!rawContent || rawContent.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400">
                    No files loaded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Input State */}
      <div className="col-span-1 md:col-span-2 p-4 border border-gray-700 rounded bg-base-100">
        <h2 className="text-xl font-semibold mb-4">Input State</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Raw Log Input */}
          <div>
            <h3 className="text-lg font-medium mb-2">Raw Log Input</h3>
            <div className="p-3 bg-gray-800 rounded-lg">
              <pre className="text-xs overflow-auto max-h-[200px]">
                {JSON.stringify(rawInput, null, 2)}
              </pre>
            </div>
          </div>
          
          {/* Sample Data Status */}
          <div>
            <h3 className="text-lg font-medium mb-2">Sample Data</h3>
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${sampleData.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{sampleData.length > 0 ? 'Enabled' : 'Disabled'}</span>
              </div>
              <p className="text-sm text-gray-400">
                {sampleData.length > 0 
                  ? `${sampleData.length} sample files available for use` 
                  : 'No sample data is being used'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RawDataMetrics;