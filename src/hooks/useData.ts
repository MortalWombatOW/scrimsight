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
        // console.log(`loaded ${table}`);
        if (mapId !== undefined) {
          const filtered = req.result.filter((row) => {
            return row.mapId === mapId;
          });
          setData(filtered);
        } else {
          setData(req.result);
        }
        console.log(`loaded ${table} with ${req.result.length} rows`);
        // setUpdates((updates) => updates + 1);
      };
      req.onerror = () => {
        console.log('error getting data', req.error);
      };
    }
  }, [table, mapId]);

  const filteredData: T[] | undefined = useMemo(() => {
    if (data === undefined) {
      console.log(`data is undefined, cannot filter ${table}`);
      return undefined;
    }
    setUpdates((updates) => updates + 1);
    console.log(`filtering ${table}`);

    if (!filter) {
      console.log(`no filter for ${table}`);
      console.log(data);
      return data;
    }
    return data.filter(filter);
  }, [data === undefined, filter]);

  return [data, filteredData, updates];
};

export default useData;
