import {TableDefinition} from '../lib/data/types';
import {useState, useEffect, useMemo} from 'react';
import {getDB} from '../lib/data/database';

const useData = <T extends TableDefinition>(
  table: string,
  mapId?: number,
  filter?: (row: T) => boolean,
): [T[], T[], number] => {
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [updates, setUpdates] = useState<number>(0);

  useEffect(() => {
    if (data === undefined) {
      const db = getDB();
      if (db === undefined) {
        console.log(`db is undefined, cannot fetch data for ${table}`);
        return;
      }
      const tx = db.transaction(table, 'readonly');
      const store = tx.objectStore(table);
      const req = store.getAll();
      req.onsuccess = () => {
        console.log(`loaded ${table}`);
        setData(req.result.filter((row) => row.mapId === mapId));

        // setUpdates((updates) => updates + 1);
      };
      req.onerror = () => {
        console.log('error getting data', req.error);
      };
    }
  }, [table, mapId]);

  const filteredData: T[] | undefined = useMemo(() => {
    if (data === undefined) {
      return undefined;
    }
    setUpdates((updates) => updates + 1);
    console.log(`filtering ${table}`);

    if (!filter) {
      return data;
    }
    return data.filter(filter);
  }, [data === undefined, filter]);

  return [data, filteredData, updates];
};

export default useData;
