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

  // Build a graph of dependencies between queries
  const buildGraphFn = (queries: Query[]) => {
    const graph: {[key: string]: Query[]} = {};
    queries.forEach((query) => {
      graph[query.name] = [];
    });
    queries.forEach((query) => {
      if (query.deps !== undefined) {
        query.deps.forEach((dep) => {
          if (typeof dep === 'string') {
            if (graph[dep].find((q) => q.name === query.name) === undefined) {
              graph[dep].push(query);
            }
          }
        });
      }
    });

    return graph;
  };

  const buildGraph = buildGraphFn(queries);
  const hasDepsFulfilled = (query: Query) => {
    return (query.deps || []).every((dep) =>
      typeof dep == 'string' ? !ResultCache.notDone(dep) : true,
    );
  };
  const isRunning = (query: Query) =>
    ResultCache.getValueForKey(query.name) !== undefined;

  const shouldRunQuery = (query: Query) =>
    hasDepsFulfilled(query) && !isRunning(query);

  const runQuery = (query: Query) => {
    const timestampStart = Date.now();
    ResultCache.storeKeyValue(query.name, 'running');
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
            nextComputeStep();
          })
          .then(() => {
            buildGraph[query.name].forEach((dep) => {
              if (shouldRunQuery(dep)) {
                console.log('running', dep.name);
                runQuery(dep);
              } else {
                console.log('not running', dep.name);
              }
            });
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

  const results = queries
    .filter((query) => !ResultCache.notDone(query.name))
    .reduce((acc, query) => {
      acc[query.name] = ResultCache.getValueForKey(query.name) as Data;
      return acc;
    }, {} as {[key: string]: {[key: string]: string | number}[]});

  return [results, nextComputeStep];
};

export default useQueries;