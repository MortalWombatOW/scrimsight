import {TableDefinition} from '../lib/data/types';
import {useState, useEffect, useMemo} from 'react';
import {getDB} from '../lib/data/database';

const useData = <T extends TableDefinition>(
  table: string,
  mapId?: number,
): [T[] | undefined, number] => {
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [updates, setUpdates] = useState<number>(0);
  console.log('useData', table, mapId);
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
        const data = req.result as T[];
        console.log(data);
        if (mapId !== undefined) {
          const filtered = data.filter((row) => {
            return row.mapId === mapId;
          });
          setData(filtered);
        } else {
          setData(data);
        }
        // console.log(`loaded ${table} with ${dat.length} rows`);
        setUpdates((updates) => updates + 1);
      };
      req.onerror = () => {
        console.log('error getting data', req.error);
      };
    }
  }, [table, mapId]);

  return [data, updates];
};

export default useData;
