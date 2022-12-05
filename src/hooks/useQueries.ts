import {useEffect, useLayoutEffect, useState} from 'react';
import memoize from '../lib/data/memoise';
import ResultCache from '../lib/data/ResultCache';
import {Data, Query} from '../lib/data/types';

interface UseQueriesOptions {
  runFirst?: boolean;
}

const useQueries = (
  queries: Query[],
  deps: any[],
  options: UseQueriesOptions = {},
): [{[key: string]: {[key: string]: string | number}[]}, number] => {
  const [computeTick, setComputeTick] = useState<number>(0);

  const nextComputeStep = (name: string) => {
    console.log('incrementing tick due to change in', name);
    console.log('nextComputeStep', computeTick);
    setComputeTick((computeTick) => computeTick + 1);
  };

  // useEffect(() => {
  //   nextComputeStep();
  // }, deps);

  const runFirst = options.runFirst ?? false;
  const effectFn = runFirst ? useLayoutEffect : useEffect;

  effectFn(() => {
    ResultCache.runQueries(queries, nextComputeStep);
  }, deps);

  const results = queries
    .filter((query) => ResultCache.hasResults(query.name))
    .reduce((acc, query) => {
      acc[query.name] = ResultCache.getValueForKey(query.name) as Data;
      return acc;
    }, {} as {[key: string]: {[key: string]: string | number}[]});

  return [results, computeTick];
};

export default useQueries;
