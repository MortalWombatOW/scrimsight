import {useEffect, useLayoutEffect, useState} from 'react';
import { DataRowBySpecName } from '../lib/data/logging/spec';
import ResultCache from '../lib/data/ResultCache';
import {Query} from '../lib/data/types';

interface UseQueriesOptions {
  runFirst?: boolean;
}

const useQueries = (
  queries: Query[],
  deps: any[],
  options: UseQueriesOptions = {},
): [DataRowBySpecName, number, boolean] => {
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
      acc[query.name] = ResultCache.getValueForKey(query.name);
      return acc;
    }, {} as DataRowBySpecName);

  const allLoaded = queries.every((query) =>
    ResultCache.hasResults(query.name),
  );

  return [results, computeTick, allLoaded];
};

export const useQuery = <T>(
  query: Query,
  deps: any[],
  options: UseQueriesOptions = {},
): [T[], number] => {
  const [results, computeTick] = useQueries([query], deps, options);
  // coerce to T[] because we know the query will return an array of T
  // will throw an error if the query returns something else
  return [results[query.name] as unknown as T[], computeTick];
};

// just get existing results, don't start a query if it doesn't exist
export const useResults = (
  queryNames: string[],
): [DataRowBySpecName, number] => {
  const [computeTick, setComputeTick] = useState<number>(0);
  const nextComputeStep = () => {
    setComputeTick((computeTick) => computeTick + 1);
  };
  queryNames.forEach((name) => {
    ResultCache.registerListener(name, nextComputeStep);
  });
  // const results = queryNames
  //   .filter((query) => ResultCache.hasResults(query))
  //   .reduce((acc, query) => {
  //     acc[query] = ResultCache.getValueForKey(query);
  //     return acc;
  //   }, {} as {[key: string]: Data});
  return [{}, computeTick];
};

export const useResult = <T>(queryName: string): [T[], number] => {
  const [results, computeTick] = useResults([queryName]);
  return [results[queryName] as unknown as T[], computeTick];
};

export default useQueries;
