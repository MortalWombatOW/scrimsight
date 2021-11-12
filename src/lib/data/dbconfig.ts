import {IndexedDBProps} from 'react-indexed-db';

const DBConfig: IndexedDBProps = {
  name: 'scrimsight',
  version: 1,
  objectStoresMeta: [
    {
      store: 'maps',
      storeConfig: {keyPath: 'id', autoIncrement: true},
      storeSchema: [
        {name: 'id', keypath: 'id', options: {unique: true}},
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'timestamp', keypath: 'timestamp', options: {unique: false}},
      ],
    },
    {
      store: 'damage',
      storeConfig: {keyPath: 'id', autoIncrement: true},
      storeSchema: [
        {name: 'id', keypath: 'id', options: {unique: true}},
        {name: 'mapId', keypath: 'mapId', options: {unique: false}},
        {name: 'timestamp', keypath: 'timestamp', options: {unique: false}},
        {name: 'damage', keypath: 'damage', options: {unique: false}},
        {name: 'attacker', keypath: 'attacker', options: {unique: false}},
        {name: 'victim', keypath: 'victim', options: {unique: false}},
      ],
    },
  ],
};

export default DBConfig;
