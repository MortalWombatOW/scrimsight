import {
  ObjectStoreNode,
  DataNodeName,
  WriteNode,
  DataNodeExecution,
  AlaSQLNode,
  isWriteNode,
  isObjectStoreNode,
  isAlaSQLNode,
} from './DataTypes';

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

  private async handleAlaSQLNode(
    node: AlaSQLNode<any>,
    execution: Partial<DataNodeExecution>,
  ): Promise<void> {
    const sourceNodes = node.sources.map((sourceName) =>
      this.graph.getNode(sourceName),
    );
    const sourceData = sourceNodes.map((sourceNode) => sourceNode?.output);

    const result = await alasql(node.sql, sourceData);
    node.output = result;
    console.log(node.name);
    console.log(result);
    execution.inputRows = sourceData.reduce(
      (sum, data) => sum + (data?.length ?? 0),
      0,
    );
    execution.outputRows = result.length;
  }

  async executeNode(name: DataNodeName): Promise<void> {
    const node = this.graph.getNode(name);
    console.group(`NodeExecutor.executeNode(${name})`);

    if (node.state === 'done' || node.state === 'running') {
      console.log('Node', name, 'already executed');
      return;
    }

    // console.log('Executing node', name);
    node.state = 'running';

    //wait for a second to simulate a long-running task
    // await new Promise((resolve) => setTimeout(resolve, 1000));

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
    // console.log(node.metadata.executions);
    console.log(`NodeExecutor.executeNode(${name}) finshed`, node);
    console.groupEnd();
    debugger;
  }
}

export default NodeExecutor;
