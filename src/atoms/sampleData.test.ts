import { sampleDataLoaderFn } from '@atoms/sampleData';
import file1 from "@library/sampledata/Log-2023-08-28-17-05-38.txt?raw";
import file2 from "@library/sampledata/Log-2023-08-28-17-29-57.txt?raw";
import file3 from "@library/sampledata/Log-2023-08-28-17-52-17.txt?raw";
import file4 from "@library/sampledata/Log-2023-08-28-18-28-25.txt?raw";
import file5 from "@library/sampledata/Log-2023-08-28-18-40-39.txt?raw";

describe('sampleDataLoaderFn', () => {
  it('should return sample log data when enabled is true', () => {
    const result = sampleDataLoaderFn(true);
    expect(result).toHaveLength(5);

    expect(result[0].fileName).toBe('Log-2023-08-28-17-05-38.txt');
    expect(result[0].fileModified).toBe(new Date("2023-08-28T17:05:38.000Z").getTime());
    expect(result[0].fileContent).toBe(file1);

    expect(result[1].fileName).toBe('Log-2023-08-28-17-29-57.txt');
    expect(result[1].fileModified).toBe(new Date("2023-08-28T17:29:57.000Z").getTime());
    expect(result[1].fileContent).toBe(file2);

    expect(result[2].fileName).toBe('Log-2023-08-28-17-52-17.txt');
    expect(result[2].fileModified).toBe(new Date("2023-08-28T17:52:17.000Z").getTime());
    expect(result[2].fileContent).toBe(file3);

    expect(result[3].fileName).toBe('Log-2023-08-28-18-28-25.txt');
    expect(result[3].fileModified).toBe(new Date("2023-08-28T18:28:25.000Z").getTime());
    expect(result[3].fileContent).toBe(file4);

    expect(result[4].fileName).toBe('Log-2023-08-28-18-40-39.txt');
    expect(result[4].fileModified).toBe(new Date("2023-08-28T18:40:39.000Z").getTime());
    expect(result[4].fileContent).toBe(file5);
  });

  it('should return an empty array when enabled is false', () => {
    const result =  sampleDataLoaderFn(false);
    expect(result).toEqual([]);
  });
});
