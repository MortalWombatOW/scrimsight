import { loadFilesAtom } from '../atoms/loadFiles.ts';
import file1 from "./sampledata/Log-2023-08-28-17-05-38.txt?raw";
import file2 from "./sampledata/Log-2023-08-28-17-29-57.txt?raw";
import file3 from "./sampledata/Log-2023-08-28-17-52-17.txt?raw";
import file4 from "./sampledata/Log-2023-08-28-18-28-25.txt?raw";
import file5 from "./sampledata/Log-2023-08-28-18-40-39.txt?raw";
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { sampleDataEnabledAtom } from '../atoms/sampleDataEnabled';

const sampleFiles = [
  {
    name: 'Log-2023-08-28-17-05-38.txt',
    lastModified: new Date("2023-08-28T17:05:38.000Z").getTime(),
    text: () => Promise.resolve(file1)
  },
  {
    name: 'Log-2023-08-28-17-29-57.txt',
    lastModified: new Date("2023-08-28T17:29:57.000Z").getTime(),
    text: () => Promise.resolve(file2)
  },
  {
    name: 'Log-2023-08-28-17-52-17.txt',
    lastModified: new Date("2023-08-28T17:52:17.000Z").getTime(),
    text: () => Promise.resolve(file3)
  },
  {
    name: 'Log-2023-08-28-18-28-25.txt',
    lastModified: new Date("2023-08-28T18:28:25.000Z").getTime(),
    text: () => Promise.resolve(file4)
  },
  {
    name: 'Log-2023-08-28-18-40-39.txt',
    lastModified: new Date("2023-08-28T18:40:39.000Z").getTime(),
    text: () => Promise.resolve(file5)
  }
] as File[];

export const useLoadSampleData = (enabled: boolean) => {
  const loadData = useSetAtom(loadFilesAtom);
  const setSampleDataEnabled = useSetAtom(sampleDataEnabledAtom);
  const [hasLoaded, setHasLoaded] = useState(false);
  console.log("useLoadSampleData mounted");
  useEffect(() => {
    if (!hasLoaded && enabled) {
      // Load sample data only once
      console.log("Loading sample data");
      loadData(sampleFiles);
      setHasLoaded(true);
      setSampleDataEnabled(true);
    }
  }, [enabled, hasLoaded, loadData, setSampleDataEnabled]);
};