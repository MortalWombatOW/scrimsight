export type DataNodeName = string;
export type NodeState = 'pending' | 'running' | 'done' | 'error';

export interface DataNodeExecution {
  duration: number;
  inputRows: number;
  outputRows: number;
}

export interface DataNodeMetadata {
  executions: DataNodeExecution[];
}

// This represents a node in the computation graph.
export interface DataNode<OutType> {
  name: DataNodeName;
  state?: NodeState;
  output?: OutType[];
  metadata?: DataNodeMetadata;
  error?: string;
}

// This represents a node that writes data to an object store.
export interface WriteNode<Type> extends DataNode<void> {
  data: Type[];
  outputObjectStore: string;
}

// This represents a node that reads data from an object store.
export interface ObjectStoreNode<OutType> extends DataNode<OutType> {
  objectStore: string;
}

// This represents a node that executes an AlaSQL query on the data from the source nodes.
export interface AlaSQLNode<OutType> extends DataNode<OutType> {
  sql: string;
  sources: DataNodeName[];
}

export function isWriteNode(node: DataNode<any>): node is WriteNode<any> {
  return 'outputObjectStore' in node;
}

export function isObjectStoreNode(
  node: DataNode<any>,
): node is ObjectStoreNode<any> {
  return 'objectStore' in node;
}

export function isAlaSQLNode(node: DataNode<any>): node is AlaSQLNode<any> {
  return 'sql' in node;
}
