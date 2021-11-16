import {TableDefinition} from '../lib/data/types';
import {useState, useEffect} from 'react';
import {useIndexedDB} from 'react-indexed-db';

const useData = <T extends TableDefinition>(table: string) => {
  const {getAll} = useIndexedDB(table);
  const [data, setData] = useState<T[]>();

  useEffect(() => {
    getAll().then(setData);
  }, [getAll]);

  return data;
};
