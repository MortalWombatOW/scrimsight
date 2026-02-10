import { useCallback, useEffect, useState } from 'react';
import { useLoadFiles } from './useRepository';

// Import all sample data files dynamically
const sampleFilesMap = import.meta.glob('../lib/sampledata/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * Hook to manage sample data loading.
 */
export function useSampleData() {
  const [enabled, setEnabled] = useState(false);
  const loadFiles = useLoadFiles();

  useEffect(() => {
    if (enabled) {
      const files = Object.entries(sampleFilesMap).map(([path, content]) => {
        const name = path.split('/').pop() || 'unknown.txt';
        // Extract date from filename if possible Log-YYYY-MM-DD...
        // Format: Log-2023-08-28-17-05-38.txt
        let date = new Date();
        const match = name.match(/Log-(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})/);
        if (match) {
          const parts = match[1].split('-');
          // new Date(year, monthIndex, day, hours, minutes, seconds)
          date = new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2]),
            parseInt(parts[3]),
            parseInt(parts[4]),
            parseInt(parts[5])
          );
        }

        const blob = new Blob([content], { type: 'text/plain' });
        return new File([blob], name, {
          type: 'text/plain',
          lastModified: date.getTime(),
        });
      });
      
      loadFiles(files);
    }
  }, [enabled, loadFiles]);

  const toggle = useCallback((newValue: boolean) => {
    setEnabled(newValue);
  }, []);

  const enable = useCallback(() => {
    setEnabled(true);
  }, []);

  return { enabled, toggle, enable };
}
