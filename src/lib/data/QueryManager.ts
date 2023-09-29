import {Query} from './types';
import ResultCache from './ResultCache';
import {QueryDependencyManager} from './QueryDependencyManager';
import {QueryExecutor} from './QueryExecutor';
import {QueryListenerManager} from './QueryListenerManager';

export class QueryManager {
  private resultCache: ResultCache;
  private queryDependencyManager: QueryDependencyManager;
  private queryExecutor: QueryExecutor;
  private queryListenerManager: QueryListenerManager;
  constructor() {
    this.resultCache = new ResultCache();
    this.queryDependencyManager = new QueryDependencyManager(this.resultCache);
    this.queryExecutor = new QueryExecutor(this.resultCache);
    this.queryListenerManager = new QueryListenerManager();
  }

  /**
   * Run a batch of queries.
   * @param queries - The queries to run.
   * @param callback - A callback function to call after each query execution.
   */
  runQueries(queries: Query[], callback: (name: string) => void) {
    queries.forEach((query) => {
      if (this.queryDependencyManager.canRunQuery(query)) {
        this.queryExecutor.runQuery(query, () => {
          callback(query.name);
          this.queryListenerManager.notifyListeners(query.name);

          // start running queries that depend on this one
          const dependentQueries = this.queryDependencyManager.getDependentQueries(
            query.name,
          );
          this.runQueries(dependentQueries, callback);
        });
      }
    });
  }

  /**
   * Add a new query to the dependency graph.
   * @param query - The query to add.
   */
  addQueryToGraph(query: Query) {
    this.queryDependencyManager.addQueryToGraph(query);
  }

  hasResults(queryName: string): boolean {
    return this.resultCache.hasResults(queryName);
  }

  getValueForKey(queryName: string): any {
    return this.resultCache.getValueForKey(queryName);
  }

  registerListener(queryName: string, callback: () => void) {
    this.queryListenerManager.registerListener(queryName, callback);
  }

  registerGlobalListener(callback: () => void) {
    this.queryListenerManager.registerGlobalListener(callback);
  }

  getAllQueryNames(): string[] {
    return this.queryDependencyManager.getAllQueryNames();
  }

  getAllEdges(): [string, string][] {
    return this.queryDependencyManager.getAllEdges();
  }
}
