import alasql from 'alasql';
import {useEffect, useState} from 'react';
import memoize from '../lib/data/memoise';

const useQuery = (
  query: string,
): [{[key: string]: string | number}[], boolean, () => void] => {
  const [results, setResults] = useState<any[]>([]);
  const [running, setRunning] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const refresh = () => {
    setRefreshCount((refreshCount) => refreshCount + 1);
  };

  const runQuery = (query: string) => {
    // debugger;
    console.log('running query', query);
    // setRunning(true);
    alasql(
      'ATTACH INDEXEDDB DATABASE scrimsight; \
        USE scrimsight; ',
      [],
      () =>
        alasql.promise(query).then(function (res) {
          // if (!running) {
          //   return;
          // }
          setResults(res);
          // setRunning(false);
        }),
    );
  };

  // const memoizedQuery = memoize(runQuery);

  useEffect(() => {
    runQuery(query);
  }, []);

  return [results, running, refresh];
};

export default useQuery;
