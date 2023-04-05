import { logSpec, LogSpec } from "./spec";
import { Communicator, joinPool } from '@post-me/mpi';
import { DataAndSpecName, DataRow } from "./spec";

declare const self: DedicatedWorkerGlobalScope;
export default {} as typeof Worker & { new (): Worker };


function parseTimestamp(timestamp: string): number {
  const cleanedTimestamp = timestamp.substring(1, timestamp.length - 1);
  const [hours, minutes, seconds] = cleanedTimestamp
    .split(":")
    .map((value) => parseInt(value, 10));
  return hours * 3600 + minutes * 60 + seconds;
}

function parseLineToLogData(line: string, mapId: number, logSpec: LogSpec): DataAndSpecName {
  const values = line.trim().split(",");

  const eventType = values[1];
  const eventSpec = logSpec[eventType];

  if (!eventSpec) {
    console.log(line);
    throw new Error(`Event spec not found for event type: ${eventType}`);
  }
  const totalTimeInSeconds = parseTimestamp(values[0]);
  const parsedData: DataRow = [];
  parsedData.push(mapId);
  parsedData.push(totalTimeInSeconds);

  for (let i = 2; i < values.length; i++) {
    const fieldSpec = eventSpec.fields[i - 2];
    let parsedValue: string | number | boolean;

    switch (fieldSpec.dataType) {
      case "string":
        parsedValue = values[i];
        break;
      case "number":
        parsedValue = parseFloat(values[i]);
        break;
      case "boolean":
        parsedValue = values[i].toLowerCase() === "true";
        break;
      default:
        throw new Error(`Unsupported data type: ${fieldSpec.dataType}`);
    }

    parsedData.push(parsedValue);
  }
  return {
    data : [parsedData],
    specName: eventType,
  };

}


const parseLogData = (communicator: Communicator) => async (lines: any, mapId: any) => {
  const root = 0;
  let subarray = await communicator.scatter(lines, root);
  const parsedLogData: DataAndSpecName[]  = subarray.filter(
    (line: unknown) => line !== undefined &&  line !== null && line !== ""
  ).map((line: unknown) =>
    parseLineToLogData(line as string, mapId as number, logSpec)
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