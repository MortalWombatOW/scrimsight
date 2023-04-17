import { DataAndSpecName, DataRow, LogSpec } from "~/lib/data/logging/spec";

function parseTimestamp(timestamp: string): number {
  const cleanedTimestamp = timestamp.substring(1, timestamp.length - 1);
  const [hours, minutes, seconds] = cleanedTimestamp
    .split(":")
    .map((value) => parseInt(value, 10));
  return hours * 3600 + minutes * 60 + seconds;
}

export function parseLine(line: string, mapId: number, logSpec: LogSpec): DataAndSpecName {
  const values = line.trim().split(",");

  const eventType = values[1];
  const eventSpec = logSpec[eventType];

  if (!eventSpec) {
    console.log(line);
    throw new Error(`Event spec not found for event type: ${eventType}`);
  }
  const parsedData: DataRow = [];
  parsedData.push(mapId);
  parsedData.push(eventType);

  for (let i = 2; i < values.length; i++) {
    const fieldSpec = eventSpec.fields[i];
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

export function parseLines(lines: string[], mapId: number, logSpec: LogSpec): DataAndSpecName[] {
  return lines.map((line) => parseLine(line, mapId, logSpec));
}