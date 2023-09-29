import {FileUpload, DataRow, LOG_SPEC, DataAndSpecName} from 'lib/data/types';
import {stringHash} from './../string';
import {getDB, mapExists} from './database';
import batch from 'idb-batch';

// File Utilities
const readFileAsync = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const loadFile = async (fileUpload: FileUpload): Promise<FileUpload> => {
  if (!fileUpload.file) {
    fileUpload.error = 'No file';
    return fileUpload;
  }

  try {
    const data = (await readFileAsync(fileUpload.file)) as string;
    fileUpload.data = data;
  } catch (e) {
    fileUpload.error = 'Error reading file';
    return fileUpload;
  }

  return fileUpload;
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

const parseLine = (line: string, mapId: number): DataAndSpecName => {
  const values = line.trim().split(',');
  const eventType = values[1];
  const eventSpec = LOG_SPEC[eventType];

  if (!eventSpec) {
    throw new Error(`Event spec not found for event type: ${eventType}`);
  }

  const parsedData: DataRow = [mapId, eventType];

  for (let i = 2; i < values.length; i++) {
    const fieldSpec = eventSpec.fields[i];
    if (!fieldSpec) {
      throw new Error(
        `Field spec not found for event type: ${eventType}, field index: ${i}`,
      );
    }
    parsedData.push(parseFieldValue(values[i], fieldSpec.dataType));
  }

  return {
    data: [parsedData],
    specName: eventType,
  };
};

const parseFile = async (fileUpload: FileUpload) => {
  if (!fileUpload.data) {
    fileUpload.error = 'No data';
    return;
  }

  const data = fileUpload.data;
  const hash = stringHash(data);
  const lines = data.split('\n').filter((l) => l.length > 0);
  const parsedData: DataAndSpecName[] = lines.map((line) =>
    parseLine(line, hash),
  );

  // Group by specName
  const groupedData: DataAndSpecName[] = [];
  for (const key of Object.keys(LOG_SPEC)) {
    const data = parsedData.filter((r) => r.specName === key);
    groupedData.push({
      specName: key,
      data: data.map((d) => d.data).flat(),
    });
  }

  fileUpload.events = groupedData;
  fileUpload.mapId = hash;
};

// Database Utilities
const saveFile = async (
  fileUpload: FileUpload,
  setPercent: (n: number) => void,
) => {
  if (!fileUpload.events || !fileUpload.mapId) {
    console.error('No parsed data');
    return;
  }

  const exists = await mapExists(fileUpload.mapId);
  if (exists) {
    fileUpload.error = 'Map already exists';
    setPercent(-1);
    return;
  }

  const db = getDB();
  const numKeys = Object.keys(LOG_SPEC).length;
  const startPercent = 40;
  const endPercent = 90;
  const percentPerKey = (endPercent - startPercent) / numKeys;

  let percent = startPercent;
  for (const key of Object.keys(LOG_SPEC)) {
    const eventData = fileUpload.events.find((e) => e.specName === key)?.data;
    if (!eventData || eventData.length === 0) {
      console.log('No data for', key);
      continue;
    }

    await batch(
      db,
      key,
      eventData.map((p) => ({
        type: 'add',
        value: p, // Assuming p is already in the objectified form
      })),
    );
    percent += percentPerKey;
    setPercent(percent);
  }

  await batch(db, 'maps', [
    {
      type: 'add',
      value: {
        mapId: fileUpload.mapId,
        name: fileUpload.fileName,
        fileModified: fileUpload.file!.lastModified,
      },
    },
  ]);
  setPercent(100);
};

// Main Upload Function
const uploadFile = async (
  fileUpload: FileUpload,
  setPercent: (n: number) => void,
) => {
  setPercent(0);
  await loadFile(fileUpload);
  if (fileUpload.error) {
    setPercent(-1);
    return;
  }
  setPercent(10);
  await parseFile(fileUpload);
  if (fileUpload.error) {
    setPercent(-1);
    return;
  }
  setPercent(20);
  await saveFile(fileUpload, setPercent);
  fileUpload.done = true;
};

export {uploadFile};
