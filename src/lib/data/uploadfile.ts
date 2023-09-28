import {
  FileUpload,
  DataRow,
  LogSpec,
  LOG_SPEC,
  DataAndSpecName,
} from 'lib/data/types';
import {stringHash} from './../string';
import {getDB, mapExists} from './database';
import batch from 'idb-batch';

const getField = (fieldName: string, specName: string, data: DataRow) => {
  const spec = LOG_SPEC[specName];
  if (!spec) {
    throw new Error(`Spec not found for spec name: ${specName}`);
  }
  const fieldIndex = spec.fields.findIndex((field) => field.name === fieldName);
  if (fieldIndex === -1) {
    throw new Error(`Field not found for field name: ${fieldName}`);
  }
  return data[fieldIndex];
};

const objectify = (data: DataRow, specName: string) => {
  const spec = LOG_SPEC[specName];
  if (!spec) {
    throw new Error(`Spec not found for spec name: ${specName}`);
  }
  const obj: Record<string, string | number | boolean> = {};
  spec.fields.forEach((field, index) => {
    const value = getField(field.name, specName, data);
    obj[field.name] = value;
  });
  return obj;
};

const loadFile = async (fileUpload: FileUpload) => {
  if (!fileUpload.file) {
    fileUpload.error = 'no file';
    return fileUpload;
  }

  try {
    const data = (await readFileAsync(fileUpload.file)) as string;
    fileUpload.data = data;
  } catch (e) {
    fileUpload.error = 'error reading file';
    return fileUpload;
  }

  return fileUpload;
};

const readFileAsync = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
};

function parseLine(line: string, mapId: number): DataAndSpecName {
  const values = line.trim().split(',');

  const eventType = values[1];
  const eventSpec = LOG_SPEC[eventType];

  if (!eventSpec) {
    console.log(line);
    throw new Error(`Event spec not found for event type: ${eventType}`);
  }
  const parsedData: DataRow = [];
  parsedData.push(mapId);
  parsedData.push(eventType);

  for (let i = 2; i < values.length; i++) {
    const fieldSpec = eventSpec.fields[i];

    if (!fieldSpec) {
      console.log(line);
      throw new Error(
        `Field spec not found for event type: ${eventType}, field index: ${i}`,
      );
    }

    let parsedValue: string | number | boolean;
    switch (fieldSpec.dataType) {
      case 'string':
        parsedValue = values[i];
        break;
      case 'number':
        parsedValue = parseFloat(values[i]);
        break;
      case 'boolean':
        parsedValue = values[i].toLowerCase() === 'true';
        break;
      default:
        throw new Error(`Unsupported data type: ${fieldSpec.dataType}`);
    }

    parsedData.push(parsedValue);
  }
  return {
    data: [parsedData],
    specName: eventType,
  };
}

export function parseLines(lines: string[], mapId: number): DataAndSpecName[] {
  return lines.map((line) => parseLine(line, mapId));
}

const parseFile = async (fileUpload: FileUpload) => {
  if (!fileUpload.data) {
    fileUpload.error = 'no data';
    return fileUpload;
  }

  const data = fileUpload.data;
  const hash = stringHash(data);

  const lines = data.split('\n').filter((l) => l.length > 0);
  const result: DataAndSpecName[] = parseLines(lines, hash);

  const groupedData: DataAndSpecName[] = [];
  for (const key of Object.keys(LOG_SPEC)) {
    const data = result.filter((r) => r.specName === key);
    groupedData.push({
      specName: key,
      data: data.map((d) => d.data).flat(),
    });
  }

  fileUpload.events = groupedData;
  fileUpload.mapId = hash;
};

const saveFile = async (
  fileUpload: FileUpload,
  setPercent: (number) => void,
) => {
  if (!fileUpload.events || !fileUpload.mapId) {
    console.error('no parsed data');
    console.log(fileUpload);
    return;
  }

  const exists = await mapExists(fileUpload.mapId);
  if (exists) {
    console.error('map already exists');
    fileUpload.error = 'map already exists';
    setPercent(-1);
    return;
  }

  const db = getDB();

  const numKeys = Object.keys(LOG_SPEC).length;
  const startPercent = 40;
  const endPercent = 90;
  const percentPerKey = (endPercent - startPercent) / numKeys;
  console.log('fileUpload', fileUpload);

  let percent = startPercent;
  for (const key of Object.keys(LOG_SPEC)) {
    const data = fileUpload.events.find((e) => e.specName === key)?.data;
    console.log('writing', key);
    if (!data || data.length === 0) {
      console.log('no data for', key);
      continue;
    }
    console.log('writing', data.length, 'items');
    await batch(
      db,
      key,
      data.map((p) => ({
        type: 'add',
        value: objectify(p, key),
      })),
    );
    percent += percentPerKey;
    setPercent(percent);
    console.log('wrote', key);
  }

  await batch(db, 'maps', [
    {
      type: 'add',
      value: {
        id: fileUpload.mapId,
        name: fileUpload.fileName,
        fileModified: fileUpload.file!.lastModified,
      },
    },
  ]);
  setPercent(100);

  console.log('wrote events', fileUpload.fileName);

  // setPercent(100);
};

const uploadFile = async (
  fileUpload: FileUpload,
  setPercent: (number) => void,
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
  console.log('uploaded file', fileUpload.fileName);
  fileUpload.done = true;
  // return fileUpload;
};

export {uploadFile};
