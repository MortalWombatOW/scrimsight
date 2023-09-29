import {Query} from './types';
import ResultCache from './ResultCache';

export class QueryDependencyManager {
  private buildGraph: {[key: string]: Query[]} = {};

  constructor(private resultCache: ResultCache) {}

  /**
   * Initialize an entry in the build graph for a query.
   * @param queryName - The name of the query.
   */
  private initializeBuildGraphEntry(queryName: string) {
    this.buildGraph[queryName] = [];
  }

  /**
   * Check if a query has a specific dependency.
   * @param queryName - The name of the query.
   * @param dep - The name of the dependency.
   * @returns True if the query has the dependency, false otherwise.
   */
  private queryHasDependency(queryName: string, dep: string) {
    return this.buildGraph[queryName].some((q) => q.name === dep);
  }

  /**
   * Add a dependent query to a query's dependencies.
   * @param queryName - The name of the query.
   * @param query - The dependent query to add.
   */
  private addDependentQuery(queryName: string, query: Query) {
    this.buildGraph[queryName].push(query);
  }

  /**
   * Check if a query can run based on its dependencies.
   * @param query - The query to check.
   * @returns True if the query can run, false otherwise.
   */
  canRunQuery(query: Query) {
    return (query.deps || []).every((dep) =>
      typeof dep === 'string' ? this.resultCache.hasResults(dep) : true,
    );
  }

  /**
   * Add a query to the dependency graph.
   * @param query - The query to add.
   * @returns True if the query was successfully added, false otherwise.
   */
  addQueryToGraph(query: Query): boolean {
    const queryName = query.name;

    // Initialize an entry in the dependency graph for this query
    this.initializeBuildGraphEntry(queryName);

    // If the query has no dependencies, it's considered a root and can be added directly
    if (query.deps === undefined || query.deps.length === 0) {
      return true;
    }

    // Get the dependencies that are strings (ignoring any array-based dependencies for now)
    const deps = query.deps.filter(
      (dep) => typeof dep === 'string',
    ) as string[];

    // Check if all dependencies are already in the graph
    const missingDeps = deps.filter(
      (dep) => !this.buildGraph.hasOwnProperty(dep),
    );
    if (missingDeps.length > 0) {
      console.error(
        `Query ${queryName} has missing dependencies: ${missingDeps.join(
          ', ',
        )}`,
      );
      return false;
    }

    // Add this query as a dependent query to all its dependencies
    for (const dep of deps) {
      if (!this.queryHasDependency(dep, queryName)) {
        this.addDependentQuery(dep, query);
      } else {
        console.error(`Query ${queryName} is already a dependent of ${dep}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get the queries that depend on a given query.
   * @param queryName - The name of the query.
   * @returns An array of dependent queries.
   */
  getDependentQueries(queryName: string): Query[] {
    return this.buildGraph[queryName] || [];
  }

  getAllQueryNames(): string[] {
    return Object.keys(this.buildGraph);
  }

  getAllEdges(): [string, string][] {
    const edges: [string, string][] = [];
    Object.keys(this.buildGraph).forEach((queryName) => {
      this.buildGraph[queryName].forEach((dependentQuery) => {
        edges.push([queryName, dependentQuery.name]);
      });
    });
    return edges;
  }
}
