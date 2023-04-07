import { logSpec, LogSpec } from "./spec";
import { Communicator, joinPool } from '@post-me/mpi';
import { DataAndSpecName, DataRow } from "./spec";
import { parseLine } from "~/lib/data/logging/parseLine";

declare const self: DedicatedWorkerGlobalScope;
export default {} as typeof Worker & { new (): Worker };

const parseLogData = (communicator: Communicator) => async (lines: any, mapId: any) => {
  const root = 0;
  let subarray = await communicator.scatter(lines, root);
  const parsedLogData: DataAndSpecName[]  = subarray.filter(
    (line: unknown) => line !== undefined &&  line !== null && line !== ""
  ).map((line: unknown) =>
    parseLine(line as string, mapId as number, logSpec)
  );

  // merge the data when the specName is the same
  const mergedData: DataAndSpecName[] = [];
  parsedLogData.forEach((dataAndSpec: DataAndSpecName) => {
    const { specName, data } = dataAndSpec;
    const existingData = mergedData.find((mergedDataAndSpec: DataAndSpecName) => mergedDataAndSpec.specName === specName);
    if (existingData) {
      existingData.data.push(...data);
    } else {
      mergedData.push(dataAndSpec);
    }
  });

  return mergedData;
    
  // const result = await communicator.gather(parsedLogData, root);

  // return result;
};

(async () => {
  const connection = await joinPool(self);
  connection.registerMethods({ parseLogData });
})();