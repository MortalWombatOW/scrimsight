import {open} from 'idb-factory';
import {LOG_SPEC, Team} from './types';

//https://github.com/treojs/idb-batch

let globalDB: IDBDatabase | undefined;

// const schema = new Schema()
//   .version(1)
//   .addStore('maps', {key: 'id', increment: true})
//   .addStore('teams', {key: 'id', increment: true});

// Object.keys(logSpec).forEach((key) => {
//   schema.addStore(key, {key: 'id', increment: true});
// });

const onCompleted = (e) => {
  const db = e.target.result;
  db.createObjectStore('maps', {keyPath: 'mapId'}).createIndex(
    'mapId',
    'mapId',
    {
      unique: true,
    },
  );

  db.createObjectStore('teams', {
    keyPath: 'id',
    autoIncrement: true,
  }).createIndex('id', 'id', {unique: true});

  db.createObjectStore('vods', {
    keyPath: 'id',
    autoIncrement: true,
  }).createIndex('mapId', 'mapId', {unique: false});

  Object.keys(LOG_SPEC).forEach((key) => {
    db.createObjectStore(key, {
      keyPath: 'id',
      autoIncrement: true,
    }).createIndex('mapId', 'mapId', {unique: false});
  });
  console.log('onCompleted');
};

export const setupDB = async (callback) => {
  console.log('setupDB');
  return open('scrimsight', 1, onCompleted).then((db) => {
    globalDB = db;

    console.log('setupDB done');
    callback();
  });
};

export const getDB = () => {
  if (!globalDB) {
    return undefined;
  }
  return globalDB;
};

export const mapExists = async (mapId) => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    if (!db) {
      return false;
    }
    const tx = db.transaction('maps', 'readonly');
    const store = tx.objectStore('maps');
    const req = store.get(mapId);
    req.onsuccess = () => {
      resolve(req.result !== undefined);
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
};

export function storeObjectInDatabase<T>(
  object: T,
  storeName: string,
): Promise<void> {
  console.log('storeObjectInDatabase', object);

  const db = getDB();
  if (!db) {
    throw new Error('Database is not open!');
  }

  const store = db.transaction([storeName], 'readwrite').objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.put(object);
    request.onerror = () => reject("Couldn't write data");
    request.onsuccess = () => resolve();
  });
}

export function getData(storeName: string): Promise<object[]> {
  const db = getDB();
  if (!db) {
    throw new Error('Database is not open!');
  }

  return new Promise((resolve, reject) => {
    const store = db
      .transaction([storeName], 'readonly')
      .objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => {
      resolve(req.result);
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}
