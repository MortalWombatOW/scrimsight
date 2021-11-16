import {IndexedDBProps} from 'react-indexed-db';
import {generateAllDbSchemas} from './types';

const DBConfig: IndexedDBProps = {
  name: 'scrimsight',
  version: 1,
  objectStoresMeta: generateAllDbSchemas(),
};

export default DBConfig;
