import {
  DataNode,
  ObjectStoreNode,
  TransformNode,
  JoinNode,
  DataNodeName,
  WriteNode,
} from './types';

import {storeObjectInDatabase, getData} from './database';
import ComputationGraph from './ComputationGraph';
import PubSub from './PubSub';

class NodeExecutor {
  constructor(private pubSub: PubSub, graph: ComputationGraph) {
    this.initializeSubscriptions(graph);
  }
  private async handleWriteNode(node: WriteNode<any>): Promise<void> {
    for (const item of node.data) {
      await storeObjectInDatabase(item, node.outputObjectStore);
    }
  }

  private async handleObjectStoreNode(
    node: ObjectStoreNode<any>,
  ): Promise<void> {
    node.output = await getData(node.objectStore);
  }

  private handleTransformNode(
    node: TransformNode<any, any>,
    computationGraph: ComputationGraph,
  ): void {
    const sourceNode = computationGraph.getNode(node.source);
    if (sourceNode && sourceNode.output) {
      node.output = sourceNode.output.map(node.transform);
    }
  }

  private handleJoinNode(
    node: JoinNode<any>,
    computationGraph: ComputationGraph,
  ): void {
    const sourceData: {[name: string]: any[]} = {};

    // Fetch the output data for each source node.
    for (const [sourceName] of node.sources) {
      const sourceNode = computationGraph.getNode(sourceName);
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
  }

  private initializeSubscriptions(computationGraph: ComputationGraph): void {
    for (const node of computationGraph.getNodes()) {
      if ('source' in node) {
        this.pubSub.subscribe(
          (node as TransformNode<any, any>).source as DataNodeName,
          () => this.executeNode(node.name, computationGraph),
        );
      } else if ('sources' in node) {
        ((node as JoinNode<any>).sources as [DataNodeName, string][]).forEach(
          ([sourceName]) => {
            this.pubSub.subscribe(sourceName, () =>
              this.executeNode(node.name, computationGraph),
            );
          },
        );
      } else if ('objectStore' in node) {
        this.pubSub.subscribe(
          (node as ObjectStoreNode<any>).objectStore as DataNodeName,
          () => this.executeNode(node.name, computationGraph),
        );
      } else if ('outputObjectStore' in node) {
        this.pubSub.subscribe(
          (node as WriteNode<any>).outputObjectStore as DataNodeName,
          () => this.executeNode(node.name, computationGraph),
        );
      }
    }
  }

  async executeNode(
    name: DataNodeName,
    computationGraph: ComputationGraph,
  ): Promise<void> {
    const node = computationGraph.getNode(name);
    if (!node) return;

    node.state = 'running';

    try {
      if ('data' in node && 'objectStore' in node) {
        console.warn(
          'if node.output is undefined, then the node is a WriteNode with generic type ???',
        );
        await this.handleWriteNode((node as unknown) as WriteNode<any>);
      } else if ('objectStore' in node) {
        await this.handleObjectStoreNode(node as ObjectStoreNode<any>);
      } else if ('transform' in node && 'source' in node) {
        this.handleTransformNode(
          (node as unknown) as TransformNode<any, any>,
          computationGraph,
        );
      } else if ('sources' in node) {
        this.handleJoinNode(
          (node as unknown) as JoinNode<any>,
          computationGraph,
        );
      }

      node.state = 'done';
      this.pubSub.publish(name, node.output);
    } catch (error) {
      node.state = 'error';
    }
  }
}

export default NodeExecutor;
