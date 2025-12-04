import { useCallback, useEffect, useState } from 'react';
import { useLoadFiles } from './useRepository';

// Import sample data files
import file1 from '../lib/sampledata/Log-2023-08-28-17-05-38.txt?raw';
import file2 from '../lib/sampledata/Log-2023-08-28-17-29-57.txt?raw';
import file3 from '../lib/sampledata/Log-2023-08-28-17-52-17.txt?raw';
import file4 from '../lib/sampledata/Log-2023-08-28-18-28-25.txt?raw';
import file5 from '../lib/sampledata/Log-2023-08-28-18-40-39.txt?raw';

/**
 * Hook to manage sample data loading.
 *
 * Provides functions to enable/disable sample data and check if it's currently enabled.
 * When enabled, sample data files are automatically loaded into the repository.
 *
 * @returns Object with enabled state, toggle function, and enable function
 */
export function useSampleData() {
  const [enabled, setEnabled] = useState(() => {
    // Check localStorage for persisted state
    const stored = localStorage.getItem('sampleDataEnabled');
    return stored === 'true';
  });
  const loadFiles = useLoadFiles();

  // Persist enabled state to localStorage
  useEffect(() => {
    localStorage.setItem('sampleDataEnabled', String(enabled));
  }, [enabled]);

  // Load sample data when enabled
  useEffect(() => {
    if (enabled) {
      const sampleFiles = createSampleFiles();
      loadFiles(sampleFiles);
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

/**
 * Creates File objects from the imported sample data.
 * These files can be passed directly to the loadFiles action.
 */
function createSampleFiles(): File[] {
  const files = [
    { name: 'Log-2023-08-28-17-05-38.txt', content: file1, date: new Date('2023-08-28T17:05:38.000Z') },
    { name: 'Log-2023-08-28-17-29-57.txt', content: file2, date: new Date('2023-08-28T17:29:57.000Z') },
    { name: 'Log-2023-08-28-17-52-17.txt', content: file3, date: new Date('2023-08-28T17:52:17.000Z') },
    { name: 'Log-2023-08-28-18-28-25.txt', content: file4, date: new Date('2023-08-28T18:28:25.000Z') },
    { name: 'Log-2023-08-28-18-40-39.txt', content: file5, date: new Date('2023-08-28T18:40-39.000Z') },
  ];

  return files.map(({ name, content, date }) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], name, {
      type: 'text/plain',
      lastModified: date.getTime(),
    });
    return file;
  });
}
