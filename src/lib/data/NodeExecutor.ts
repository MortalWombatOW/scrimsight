import {
  ObjectStoreNode,
  TransformNode,
  JoinNode,
  DataNodeName,
  WriteNode,
  isTransformNode,
  isJoinNode,
  isObjectStoreNode,
  isWriteNode,
  DataNodeExecution,
  DataNode,
  AlaSQLNode,
  isAlaSQLNode,
} from './types';

import {storeObjectInDatabase, getData} from './database';
import ComputationGraph from './ComputationGraph';
import alasql from 'alasql';

class NodeExecutor {
  constructor(private graph: ComputationGraph) {}

  private async handleWriteNode(
    node: WriteNode<any>,
    execution: Partial<DataNodeExecution>,
  ): Promise<void> {
    for (const item of node.data) {
      await storeObjectInDatabase(item, node.outputObjectStore);
    }
    execution.outputRows = node.data.length;
  }

  private async handleObjectStoreNode(
    node: ObjectStoreNode<any>,
    execution: Partial<DataNodeExecution>,
  ): Promise<void> {
    node.output = await getData(node.objectStore);
    execution.outputRows = node.output.length;
  }

  private handleTransformNode(
    node: TransformNode<any, any>,
    execution: Partial<DataNodeExecution>,
  ): void {
    const sourceNode = this.graph.getNode(node.source);
    if (sourceNode && sourceNode.output) {
      node.output = sourceNode.output.map(node.transform);
      execution.inputRows = sourceNode.output.length;
      execution.outputRows = node.output.length;
    }
  }

  private handleJoinNode(
    node: JoinNode<any>,
    execution: Partial<DataNodeExecution>,
  ): void {
    const sourceData: {[name: string]: any[]} = {};

    // Fetch the output data for each source node.
    for (const [sourceName] of node.sources) {
      const sourceNode = this.graph.getNode(sourceName);
      if (sourceNode && sourceNode.output) {
        sourceData[sourceName] = sourceNode.output;
      } else {
        // If the source node doesn't have output data, then the join can't be performed.
        return;
      }
    }

    // Initialize the joined output array.
    const joinedOutput: any[] = [];

    // Perform the inner join.
    // This is a naive nested-loop join for demonstration purposes.
    // It may not be suitable for large datasets.
    if (node.sources.length > 0) {
      const [firstSourceName, firstFieldName] = node.sources[0];
      for (const firstItem of sourceData[firstSourceName]) {
        let joinCandidate = {...firstItem};
        let joinable = true;
        for (let i = 1; i < node.sources.length; i++) {
          const [sourceName, fieldName] = node.sources[i];
          const match = sourceData[sourceName].find(
            (item) => item[fieldName] === firstItem[firstFieldName],
          );
          if (match) {
            joinCandidate = {...joinCandidate, ...match};
          } else {
            joinable = false;
            break;
          }
        }
        if (joinable) {
          joinedOutput.push(joinCandidate);
        }
      }
    }

    // Set the joined output as the output of this node.
    node.output = joinedOutput;
    execution.inputRows = joinedOutput.length;
    execution.outputRows = joinedOutput.length;
  }

  private async handleAlaSQLNode(
    node: AlaSQLNode<any>,
    execution: Partial<DataNodeExecution>,
  ): Promise<void> {
    const sourceNodes = node.sources.map((sourceName) =>
      this.graph.getNode(sourceName),
    );
    const sourceData = sourceNodes.map((sourceNode) => sourceNode?.output);

    sourceNodes.forEach(async (sourceNode) => {
      await alasql(`CREATE TABLE IF NOT EXISTS ${sourceNode?.name}`);
    });

    const result = await alasql(node.sql);
    node.output = result;
    console.log(result);
    execution.inputRows = sourceData.reduce(
      (sum, data) => sum + (data?.length ?? 0),
      0,
    );
    execution.outputRows = result.length;
  }

  async executeNode(name: DataNodeName): Promise<void> {
    const node = this.graph.getNode(name);
    if (!node) return;

    console.log('Executing node', name);
    node.state = 'running';

    //wait for a second to simulate a long-running task
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!node.metadata) {
      node.metadata = {
        executions: [],
      };
    }
    const execution: Partial<DataNodeExecution> = {};
    const startTime = Date.now();
    try {
      if (isWriteNode(node)) {
        await this.handleWriteNode(node, execution);
      } else if (isObjectStoreNode(node)) {
        await this.handleObjectStoreNode(node, execution);
      } else if (isTransformNode(node)) {
        this.handleTransformNode(node, execution);
      } else if (isJoinNode(node)) {
        this.handleJoinNode(node, execution);
      } else if (isAlaSQLNode(node)) {
        this.handleAlaSQLNode(node, execution);
      }

      node.state = 'done';
    } catch (error) {
      node.state = 'error';
      node.error = error;
      console.error(error);
    }
    const endTime = Date.now();
    execution.duration = endTime - startTime;
    node.metadata.executions.push(execution as DataNodeExecution);
  }
}

export default NodeExecutor;
