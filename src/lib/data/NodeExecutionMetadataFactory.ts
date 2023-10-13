import {DataNode, DataNodeExecution} from './types';

class NodeExecutionMetadataFactory {
  private metadata: Partial<DataNodeExecution>;
  private startTime: number;

  start(): void {
    this.startTime = Date.now();
    this.metadata = {};
  }

  setOutputRows(outputRows: number): void {
    this.metadata.outputRows = outputRows;
  }
  setInputRows(inputRows: number): void {
    this.metadata.inputRows = inputRows;
  }

  finish(node: DataNode<any>): void {
    this.metadata.duration = Date.now() - this.startTime;
    if (!node.metadata) {
      node.metadata = {
        executions: [],
      };
    }
    node.metadata.executions.push(this.metadata as DataNodeExecution);
  }
}

export default NodeExecutionMetadataFactory;
