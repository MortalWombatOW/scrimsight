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

export const setupDB = async () => {
  console.log('setupDB');
  open('scrimsight', schema.version(), schema.callback()).then((db) => {
    globalDB = db;
    console.log('setupDB done');
  });
};

export const getDB = () => {
  if (!globalDB) {
    return undefined;
  }
  return globalDB;
};
