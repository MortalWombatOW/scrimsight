import {isNumeric} from '../string';
import {
  FileUpload,
} from 'lib/data/types';
import {stringHash} from './../string';
import {getRoleFromHero} from './data';
import {getDB, mapExists} from './database';
import batch from 'idb-batch';
import { parallelProcessLogLines } from './logging/manager';
import { DataRow } from './logging/spec';

type GroupedData = {
  [key: string]: DataRow[];
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

const parseFile = async (fileUpload: FileUpload) => {
  if (!fileUpload.data) {
    fileUpload.error = 'no data';
    return fileUpload;
  }

  const data = fileUpload.data;
  const hash = stringHash(data);

  const lines = data.split('\n');
  const result = await parallelProcessLogLines(lines, hash);

  fileUpload.events = result;
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

  // await batch(db, 'map', [
  //   {
  //     type: 'add',
  //     value: fileUpload
  //   },
  // ]);
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
   const groupedData = fileUpload.events.reduce((acc: GroupedData, event) => {
    const specName = event.specName;
    if (!acc[specName]) {
      acc[specName] = [];
    }
    acc[specName].push(...event.data);
    return acc;
  }, {});

    
  console.log('wrote events', fileUpload.fileName);
    
  setPercent(100);
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
