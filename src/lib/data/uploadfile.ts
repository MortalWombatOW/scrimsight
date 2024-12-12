import {LOG_SPEC, DataAndSpecName} from './types';
import {stringHash} from './../string';

// File Utilities
export const readFileAsync = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Parsing Utilities
const parseFieldValue = (value: string, dataType: string) => {
  switch (dataType) {
    case 'string':
      return value;
    case 'number':
      return parseFloat(value);
    case 'boolean':
      return value.toLowerCase() === 'true';
    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }
};

const parseTimestampString = (timestampStr: string): number => {
  const timestamp = timestampStr.substring(1, timestampStr.length - 1);
  const timeParts = timestamp.split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = parseInt(timeParts[2]);
  return hours * 3600 + minutes * 60 + seconds;
};

const parseLine = (line: string, matchId: number): DataAndSpecName => {
  const values = line.trim().split(',');
  const timestampStr = values[0];
  const eventType = values[1];
  const eventSpec = LOG_SPEC[eventType];

  if (!eventSpec) {
    throw new Error(`Event spec not found for event type: ${eventType}`);
  }

  const timestamp = parseTimestampString(timestampStr);

  const parsedData: Record<string, unknown> = {
    matchId,
    type: eventType,
  };

  for (let i = 2; i < values.length; i++) {
    const fieldSpec = eventSpec.fields[i];
    if (!fieldSpec) {
      throw new Error(`Field spec not found for event type: ${eventType}, field index: ${i}`);
    }
    parsedData[fieldSpec.key] = parseFieldValue(values[i], fieldSpec.dataType);
  }

  parsedData['matchTime'] = timestamp;

  return {
    data: [parsedData],
    specName: eventType,
  };
};

export const parseFile = (fileContent: string) => {
  const hash = stringHash(fileContent);
  const lines = fileContent.split('\n').filter((l) => l.length > 0);
  const parsedData: DataAndSpecName[] = lines.map((line) => parseLine(line, hash));

  // Group by specName
  const groupedData: DataAndSpecName[] = [];
  for (const key of Object.keys(LOG_SPEC)) {
    const data = parsedData.filter((r) => r.specName === key);
    groupedData.push({
      specName: key,
      data: data.map((d) => d.data).flat(),
    });
  }

  return {
    logs: groupedData,
    matchId: hash,
  };
};
