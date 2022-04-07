import {open} from 'idb-factory';
import Schema from 'idb-schema';

//https://github.com/treojs/idb-batch

let globalDB: IDBDatabase | undefined;

const schema = new Schema()
  .version(1)
  .addStore('map', {key: 'mapId', unique: true})
  .addIndex('byMapId', 'mapId', {unique: true})
  .addStore('player_status', {key: 'id', increment: true})
  .addStore('player_ability', {key: 'id', increment: true})
  .addStore('player_interaction', {key: 'id', increment: true});

export const setupDB = async (callback) => {
  console.log('setupDB');
  open('scrimsight', schema.version(), schema.callback()).then((db) => {
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
    const tx = db.transaction('map', 'readonly');
    const store = tx.objectStore('map');
    const req = store.get(mapId);
    req.onsuccess = () => {
      resolve(req.result !== undefined);
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
};
