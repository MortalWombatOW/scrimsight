import {DataNode, DataNodeExecution} from './DataTypes';

export function getLatestExecution(
  node: DataNode<any>,
): DataNodeExecution | undefined {
  return node.metadata?.executions[node.metadata?.executions.length - 1];
}
