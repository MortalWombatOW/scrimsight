import {DataRowBySpecName, Query} from './types';
import alasql from 'alasql';

export default class ResultCache {
  private static data: DataRowBySpecName = {};
  // reverse of deps - which queries depend on this one
  private static buildGraph: {[key: string]: Query[]} = {};

  private static listeners: {[key: string]: (() => void)[]} = {};
  private static globalListeners: (() => void)[] = [];

  static storeKeyValue(key, value) {
    // console.log('storing', key);
    this.data[key] = value;
  }

  static getValueForKey(key) {
    return this.data[key];
  }

  static registerListener(queryName: string, callback: () => void) {
    if (!this.listeners[queryName]) {
      this.listeners[queryName] = [];
    }
    this.listeners[queryName].push(callback);
  }

  static registerGlobalListener(callback: () => void) {
    this.globalListeners.push(callback);
  }

  private static callListenersForQuery(queryName: string) {
    if (this.listeners[queryName]) {
      this.listeners[queryName].forEach((callback) => callback());
    }
    this.globalListeners.forEach((callback) => callback());
  }

  private static initializeBuildGraphEntry(queryName: string) {
    this.buildGraph[queryName] = [];
  }

  private static addDependentQuery(queryName: string, query: Query) {
    this.buildGraph[queryName].push(query);
  }

  private static queryHasDependency(queryName: string, dep: string) {
    return this.buildGraph[queryName].some((q) => q.name === dep);
  }

  static notDone(key) {
    return this.data[key] === undefined || this.isRunning(key);
  }

  static hasResults(name: string) {
    return Array.isArray(this.data[name]);
  }

  static inBuildGraph(queryName: string) {
    return this.buildGraph[queryName] !== undefined;
  }

  private static isRoot(query: Query) {
    return (
      query.deps === undefined ||
      query.deps.length === 0 ||
      query.deps.every((dep) => Array.isArray(dep))
    );
  }

  static addQueryToGraph(query: Query) {
    const queryName = query.name;

    ResultCache.initializeBuildGraphEntry(queryName);

    if (ResultCache.isRoot(query)) {
      return true;
    }

    // get the deps of this query that need to be computed before the query can be run
    const deps = query.deps?.filter(
      (dep) => typeof dep == 'string',
    ) as string[];

    // check if deps are already in the graph. If there are deps missing, log an error and return false.
    const missingDeps = deps.filter((dep) => !ResultCache.inBuildGraph(dep));
    if (missingDeps.length > 0) {
      console.error(
        `Query ${queryName} has deps ${missingDeps} which are not in the graph`,
      );
      return false;
    }

    // for each dep, add this query to it's entries. if the query is already in the list, log an error and return false.
    let err: string | undefined;
    deps.forEach(function (dep) {
      if (!ResultCache.queryHasDependency(dep, queryName)) {
        ResultCache.addDependentQuery(dep, query);
      }
    });

    if (err) {
      console.error(err);
      return false;
    }

    return true;
  }

  static getDependentQueries(queryName): Query[] {
    return this.buildGraph[queryName];
  }

  static hasDepsFulfilled(query: Query) {
    return (query.deps || []).every((dep) =>
      typeof dep == 'string' ? ResultCache.hasResults(dep) : true,
    );
  }

  static isRunning(query: Query) {
    return (
      this.data[query.name] !== undefined &&
      Object.keys(this.data[query.name]).length === 0
    );
  }

  static canRunQuery(query: Query) {
    return ResultCache.hasDepsFulfilled(query) && !ResultCache.isRunning(query);
  }

  static runQueries(queries: Query[], callback: (name: string) => void) {
    if (
      queries.every(
        (q) =>
          ResultCache.inBuildGraph(q.name) || ResultCache.addQueryToGraph(q),
      )
    ) {
      queries.forEach((query) => {
        if (ResultCache.canRunQuery(query)) {
          ResultCache.callListenersForQuery(query.name);
          ResultCache.runQuery(query, () => {
            // console.log(
            //   'finished running query',
            //   query.name,
            //   'running callback',
            // );
            callback(query.name);
            ResultCache.callListenersForQuery(query.name);

            // start running queries that depend on this one
            const dependentQueries = ResultCache.getDependentQueries(
              query.name,
            );
            ResultCache.runQueries(dependentQueries, callback);
          });
        }
      });
    }
    // ResultCache.printBuildGraph();
  }

  private static runQuery(query: Query, callback: () => void) {
    const timestampStart = Date.now();
    let startTime;
    ResultCache.storeKeyValue(query.name, 'running');
    // console.log(`Running query ${query.name}`);
    alasql(
      'ATTACH INDEXEDDB DATABASE scrimsight; \
        USE scrimsight; ',
      [],
      () => {
        startTime = Date.now();
        alasql
          .promise(
            query.query,
            query.deps?.map((dep) =>
              typeof dep == 'string' ? ResultCache.getValueForKey(dep) : dep,
            ) || [],
          )
          .then(function (res) {
            ResultCache.storeKeyValue(query.name, res);
            // console.log(
            //   `Finished query ${query.name} - took ${
            //     Date.now() - timestampStart
            //   }ms`,
            //   res,
            // );
            callback();
          })
          .catch(function (err) {
            console.error(
              `Error running query ${query.name} - took ${
                Date.now() - timestampStart
              }ms`,
              err,
            );
            callback();
          });
      },
    );
  }

  private static printBuildGraph() {
    console.log('========= build graph ========');
    // find roots in the graph. These are the queries that don't appear in any value array of the buildGraph
    const roots = Object.keys(this.buildGraph).filter(
      (queryName) =>
        !Object.values(this.buildGraph).some((qs: Query[]) =>
          qs.some((q) => q.name === queryName),
        ),
    );
    // for each root, print the graph as a nested tree of queries starting from that root
    roots.forEach((root) => {
      console.log(root);
      ResultCache.printBuildGraphHelper(root, 1);
    });

    console.log('======= end build graph =======');
  }

  private static printBuildGraphHelper(queryName: string, depth: number) {
    const deps = this.buildGraph[queryName];
    deps.forEach((dep) => {
      console.log('  '.repeat(depth) + dep.name);
      ResultCache.printBuildGraphHelper(dep.name, depth + 1);
    });
  }

  static getBuildGraph() {
    return this.buildGraph;
  }
}
