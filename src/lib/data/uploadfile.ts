import {isNumeric} from '../string';
import {
  FileUpload,
} from 'lib/data/types';
import {stringHash} from './../string';
import {getRoleFromHero} from './data';
import {getDB, mapExists} from './database';
import batch from 'idb-batch';
import { parallelProcessLogLines } from './logging/manager';
import { DataAndSpecName, logSpec, objectify } from './logging/spec';
import { parseLines } from '~/lib/data/logging/parseLine';

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

const parseFile = async (fileUpload: FileUpload) => {
  if (!fileUpload.data) {
    fileUpload.error = 'no data';
    return fileUpload;
  }

  const data = fileUpload.data;
  const hash = stringHash(data);
 
  const lines = data.split('\n').filter((l) => l.length > 0);
  // const result = await parallelProcessLogLines(lines, hash);
  const result: DataAndSpecName[] = parseLines(lines, hash, logSpec);

  const groupedData: DataAndSpecName[] = [];
  for (const key of Object.keys(logSpec)) {
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
  if (
    !fileUpload.events ||
    !fileUpload.mapId
  ) {
    console.error('no parsed data');
    console.log (fileUpload);
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

  const numKeys = Object.keys(logSpec).length;
  const startPercent = 40;
  const endPercent = 90;
  const percentPerKey = (endPercent - startPercent) / numKeys;
  console.log('fileUpload', fileUpload);

  let percent = startPercent;
  for (const key of Object.keys(logSpec)) {
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
        value: objectify(p, key)
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
      }
    },
  ]);
  setPercent(100);
  // setPercent(50);

  // console.log('wrote map', fileUpload.fileName);
  // await batch(
  //   db,
  //   'player_ability',
  //   fileUpload.playerAbilities.map((p) => ({
  //     type: 'add',
  //     value: p,
  //   })),
  // );
  // setPercent(65);
  // console.log('wrote player abilities', fileUpload.fileName);
  // await batch(
  //   db,
  //   'player_interaction',
  //   fileUpload.playerInteractions.map((p) => ({
  //     type: 'add',
  //     value: p,
  //   })),
  // );
  // setPercent(80);
  // console.log('wrote player interactions', fileUpload.fileName);
  // await batch(
  //   db,
  //   'player_status',
  //   fileUpload.playerStatus.map((p) => ({
  //     type: 'add',
  //     value: p,
  //   })),
  // );
  // console.log('wrote player status', fileUpload.fileName);

  // write to db on objectStore = specName
  // group by specName
   

    
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
