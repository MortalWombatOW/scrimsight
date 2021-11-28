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
  globalDB = await open('game', schema.version(), schema.callback());
};

export const getDB = () => {
  if (!globalDB) {
    throw new Error('DB is not setup');
  }
  return globalDB;
};
