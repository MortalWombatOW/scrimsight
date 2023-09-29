import {useEffect, useState, useContext, useMemo} from 'react';
import {Query, DataRowBySpecName} from '../lib/data/types';
import {QueryManagerContext} from '../lib/data/QueryManagerContext';

// Custom hook for compute tick
const useComputeTick = () => {
  const [computeTick, setComputeTick] = useState<number>(0);
  const nextComputeStep = () => {
    setComputeTick((prevTick) => prevTick + 1);
  };
  return [computeTick, nextComputeStep] as const;
};

// Helper function to transform query string
const transformQueryString = (query: string) => {
  return query
    .split(' ')
    .filter((s) => s.length > 0)
    .join(' ');
};

interface UseQueriesOptions {
  runFirst?: boolean;
}

const useQueries = (
  queriesRaw: Query[],
  deps: any[],
  options: UseQueriesOptions = {},
): [Record<string, object[]>, number, boolean] => {
  const queryManager = useContext(QueryManagerContext);
  const [computeTick, nextComputeStep] = useComputeTick();

  // Transform query strings
  const queries = queriesRaw.map((query) => ({
    ...query,
    query: transformQueryString(query.query),
  }));

  useEffect(() => {
    queries.forEach((query) => {
      queryManager.registerListener(query.name, () => {
        nextComputeStep();
      });
    });
    queryManager.runQueries(queries, nextComputeStep);
  }, []); // If this should depend on `queries`, add it to the dependency array

  const results = useMemo(() => {
    return queries
      .filter((query) => queryManager.hasResults(query.name))
      .reduce((acc, query) => {
        acc[query.name] = queryManager.getValueForKey(query.name);
        return acc;
      }, {} as DataRowBySpecName);
  }, [queries, queryManager, computeTick]);

  const allLoaded = useMemo(() => {
    return queries.every((query) => queryManager.hasResults(query.name));
  }, [queries, queryManager]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (allLoaded && !loaded) {
      setLoaded(true);
    }
  }, [computeTick]);

  return [results, computeTick, loaded];
};

export const useQuery = <T>(
  query: Query,
  deps: any[],
  options: UseQueriesOptions = {},
): [T[], number] => {
  const [results, computeTick, _] = useQueries([query], deps, options);
  // coerce to T[] because we know the query will return an array of T
  // will throw an error if the query returns something else
  return [(results[query.name] as unknown) as T[], computeTick];
};

export const useResults = (
  queryNames: string[],
): [DataRowBySpecName, number] => {
  const [computeTick, nextComputeStep] = useComputeTick();
  const queryManager = useContext(QueryManagerContext);

  useEffect(() => {
    queryNames.forEach((name) => {
      queryManager.registerListener(name, nextComputeStep);
    });
    // Optional: Cleanup function to unregister listeners if needed
    return () => {
      // Unregister listeners here if you have such a method
    };
  }, [queryNames]);

  const results = useMemo(() => {
    return queryNames
      .filter((query) => queryManager.hasResults(query))
      .reduce((acc, query) => {
        acc[query] = queryManager.getValueForKey(query);
        return acc;
      }, {} as DataRowBySpecName);
  }, [queryNames, queryManager, computeTick]);

  return [results, computeTick];
};

export const useResult = <T>(queryName: string): [T[], number] => {
  const [results, computeTick] = useResults([queryName]);
  return [(results[queryName] as unknown) as T[], computeTick];
};

export default useQueries;
