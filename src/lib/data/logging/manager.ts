// main.ts

import { createPool } from "@post-me/mpi";
import { DataAndSpecName, DataRowBySpecName } from "./spec";
import LogWorker from "./log.worker";

function stringToUint8Array(str: string): Uint8Array {
  const utf8Encoder = new TextEncoder(); // Default is UTF-8 encoding
  const encodedString = utf8Encoder.encode(str);
  return encodedString;
}

function stringsArrayToArrayBuffer(stringsArray: string[]): ArrayBuffer {
  const concatenatedStrings = stringsArray.join('');
  const uint8Array = stringToUint8Array(concatenatedStrings);
  return uint8Array.buffer;
}


export async function parallelProcessLogLines(lines: string[], mapId: number, numWorkers: number = 4): Promise<DataAndSpecName[]> {
  // Create workers
  const workers: Worker[] = [];
  for (let i = 0; i < numWorkers; ++i) {
    workers.push(new LogWorker());
  }

  // Create a pool of mutually interconnected workers
  const workerPool = await createPool(workers);
// Pass different parameter to the parallel method based on the rank of the worker
const root = 0;
const args = (rank: number) => {
  // console.log(`Rank (args): ${rank}`);
  const argumentss = rank === root ? [lines, mapId] : [];
  // console.log(`Arguments (args):`, argumentss);
  return argumentss;
};
const transfer = (rank: number, [lines]: any) => {
  // console.log(`Rank (transfer): ${rank}`);
  // console.log(`Linesz (transfer):`, lines);
  const transferData = rank === root ? [stringsArrayToArrayBuffer(lines)] : [];
  // console.log(`Transfer data (transfer):`, transferData);
  return transferData;
};


  // Call the parallel method 'parseLogData' on the workers
  try {
    const result = await workerPool.call('parseLogData', args, transfer);
    console.log(`Result:`, result);
    // The parsed LogData is returned by the workers
    const parsedLogData: DataAndSpecName[] = result.flat().reduce((acc, val) => {
      // merge the data when the specName is the same
      const { specName, data } = val;
      const existingData = acc.find((mergedDataAndSpec: DataAndSpecName) => mergedDataAndSpec.specName === specName);
      if (existingData) {
        existingData.data.push(...data);
      } else {
        acc.push(val);
      }
      return acc;
    }, [] as DataAndSpecName[]);

    return parsedLogData;
  } catch (error) {
    console.error(error);
    throw error;
  }
  
}