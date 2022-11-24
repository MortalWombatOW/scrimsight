import alasql from 'alasql';
import {useEffect, useState} from 'react';
import memoize from '../lib/data/memoise';
import {Data} from '../lib/data/metricsv2';
import ResultCache from '../lib/data/ResultCache';

const timeQueries = true;

type Query = {
  name: string;
  query: string;
  deps?: (string | Data)[];
};

const useQueries = (
  queries: Query[],
): [{[key: string]: {[key: string]: string | number}[]}, () => void] => {
  const [computeTick, setComputeTick] = useState<number>(0);

  const nextComputeStep = () => {
    setComputeTick((computeTick) => computeTick + 1);
  };

  const hasDepsFulfilled = (query: Query) => {
    return (query.deps || []).every((dep) =>
      typeof dep == 'string'
        ? ResultCache.getValueForKey(dep) !== undefined
        : true,
    );
  };
  const hasResults = (query: Query) =>
    ResultCache.getValueForKey(query.name) !== undefined;

  const shouldRunQuery = (query: Query) =>
    hasDepsFulfilled(query) && !hasResults(query);

  const runQuery = (query: Query) => {
    const timestampStart = Date.now();
    alasql(
      'ATTACH INDEXEDDB DATABASE scrimsight; \
        USE scrimsight; ',
      [],
      () =>
        alasql
          .promise(
            query.query,
            query.deps?.map((dep) =>
              typeof dep == 'string' ? ResultCache.getValueForKey(dep) : dep,
            ) || [],
          )
          .then(function (res) {
            ResultCache.storeKeyValue(query.name, res);
          })
          .then(() => {
            nextComputeStep();
            if (timeQueries) {
              console.log(
                `query ${query.name} took ${Date.now() - timestampStart}ms`,
              );
            }
          }),
    );
  };

  useEffect(() => {
    console.log(
      'tick',
      computeTick,
      'running queries',
      queries.filter(shouldRunQuery).map((q) => q.name),
    );

    queries.filter(shouldRunQuery).forEach(runQuery);
  }, [computeTick]);

  const results = queries.reduce((acc, query) => {
    acc[query.name] = ResultCache.getValueForKey(query.name);
    return acc;
  }, {} as {[key: string]: {[key: string]: string | number}[]});

  return [results, nextComputeStep];
};

export default useQueries;
