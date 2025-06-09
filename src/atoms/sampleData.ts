import { atom } from "jotai";
import { LogFileLoaderType, sampleDataEnabled } from "@atoms";
import file1 from "@library/sampledata/Log-2023-08-28-17-05-38.txt?raw";
import file2 from "@library/sampledata/Log-2023-08-28-17-29-57.txt?raw";
import file3 from "@library/sampledata/Log-2023-08-28-17-52-17.txt?raw";
import file4 from "@library/sampledata/Log-2023-08-28-18-28-25.txt?raw";
import file5 from "@library/sampledata/Log-2023-08-28-18-40-39.txt?raw";

export const sampleDataFn = (enabled: boolean): LogFileLoaderType => {
  if (!enabled) {
    return [];
  }
  return [
    {
      fileName: 'Log-2023-08-28-17-05-38.txt',
      fileModified: new Date("2023-08-28T17:05:38.000Z").getTime(),
      fileContent: file1,
    },
    {
      fileName: 'Log-2023-08-28-17-29-57.txt',
      fileModified: new Date("2023-08-28T17:29:57.000Z").getTime(),
      fileContent: file2,
    },
    {
      fileName: 'Log-2023-08-28-17-52-17.txt',
      fileModified: new Date("2023-08-28T17:52:17.000Z").getTime(),
      fileContent: file3,
    },
    {
      fileName: 'Log-2023-08-28-18-28-25.txt',
      fileModified: new Date("2023-08-28T18:28:25.000Z").getTime(),
      fileContent: file4,
    },
    {
      fileName: 'Log-2023-08-28-18-40-39.txt',
      fileModified: new Date("2023-08-28T18:40:39.000Z").getTime(),
      fileContent: file5,
    }
  ];
};


export default atom((get): LogFileLoaderType => {
  const enabled = get(sampleDataEnabled.atom);
  return sampleDataFn(enabled);
});
