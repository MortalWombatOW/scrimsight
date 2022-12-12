import {useEffect, useLayoutEffect, useState} from 'react';
import ResultCache from '../lib/data/ResultCache';
import {Data, Query} from '../lib/data/types';

interface UseQueriesOptions {
  runFirst?: boolean;
}

const useQueries = (
  queries: Query[],
  deps: any[],
  options: UseQueriesOptions = {},
): [{[key: string]: Data}, number, boolean] => {
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

  const numQueries = queries.length;
  const allLoaded = Object.keys(results).length === numQueries;

  return [results, computeTick, allLoaded];
};

export const useQuery = (
  query: Query,
  deps: any[],
  options: UseQueriesOptions = {},
): [Data, number] => {
  const [results, computeTick] = useQueries([query], deps, options);
  return [results[query.name], computeTick];
};

// just get existing results, don't start a query if it doesn't exist
export const useResults = (
  queryNames: string[],
): [{[key: string]: Data}, number] => {
  const [computeTick, setComputeTick] = useState<number>(0);
  const nextComputeStep = () => {
    setComputeTick((computeTick) => computeTick + 1);
  };
  queryNames.forEach((name) => {
    ResultCache.registerListener(name, nextComputeStep);
  });
  const results = queryNames
    .filter((query) => ResultCache.hasResults(query))
    .reduce((acc, query) => {
      acc[query] = ResultCache.getValueForKey(query) as Data;
      return acc;
    }, {} as {[key: string]: Data});
  return [results, computeTick];
};

export const useResult = (queryName: string): [Data, number] => {
  const [results, computeTick] = useResults([queryName]);
  return [results[queryName], computeTick];
};

export default useQueries;
