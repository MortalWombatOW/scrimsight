import React, {useContext, useEffect, useRef} from 'react';
import {useDataManager} from '../../lib/data/DataContext';
import {
  DataNode,
  isAlaSQLNode,
  isObjectStoreNode,
  isWriteNode,
} from '../../lib/data/DataTypes';
import NetworkDisplay from './NetworkDisplay';
import DisplayNode from './DisplayNode';
import {useDataNode} from '../../hooks/useData';
import {getLatestExecution} from '../../lib/data/NodeUtils';

function getStateColor(node: DataNode<any> | undefined) {
  if (!node) {
    return '#000000';
  }

  const state = node.state;
  switch (state) {
    case 'pending':
      return '#f0ad4e';
    case 'running':
      return '#5bc0de';
    case 'done':
      return '#3c912b';
    case 'error':
      return '#af684c';
    default:
      return '#000000';
  }
}

function getShape(node: DataNode<any> | undefined) {
  if (!node) {
    return 'box';
  }
  if (isObjectStoreNode(node)) {
    return 'ellipse';
  }
  if (isWriteNode(node)) {
    return 'diamond';
  }
  if (isAlaSQLNode(node)) {
    return 'box';
  }
  return 'box';
}

function getLabel(node: DataNode<any> | undefined) {
  if (!node) {
    return 'undefined';
  }
  const lines: string[] = [];
  lines.push(node.name);
  lines.push(node.state!);
  lines.push(node.metadata?.executions?.length.toString() ?? '0');
  return lines.join('\n');
}

function getOpacity(node: DataNode<any> | undefined) {
  if (!node) {
    return 0.1;
  }
  const execution = getLatestExecution(node);
  if (!execution) {
    return 0.3;
  }
  const outputRows = execution.outputRows;
  if (outputRows === 0) {
    // console.log('opacity', node.name, node);
    return 0.5;
  }

  return 1;
}

function updateNode(
  nodeName: string,
  networkDisplay: NetworkDisplay,
  dataManager: any,
) {
  const node = dataManager.getNode(nodeName);

  networkDisplay.setNode(
    nodeName,
    getStateColor(node),
    getShape(node),
    getLabel(node),
    getOpacity(node),
  );
  dataManager.getEdges(nodeName).forEach(([fromName, toName]) => {
    networkDisplay.setEdge(fromName, toName);
  });
  // console.log('Updated node', node);
}

const DebugNodeGraph = () => {
  const ref = useRef(null);
  const dataManager = useDataManager();
  const networkDisplay = useRef(new NetworkDisplay());
  const node = useDataNode('match_end_object_store');
  const node2 = useDataNode('map_overview');

  const nodeNames = dataManager.getNodes().map((node) => node.name);

  useEffect(() => {
    for (const nodeName of nodeNames) {
      updateNode(nodeName, networkDisplay.current, dataManager);
      dataManager.subscribeFn(nodeName, () =>
        updateNode(nodeName, networkDisplay.current, dataManager),
      );
    }
  }, [nodeNames]);

  useEffect(() => {
    const container = ref.current;
    if (container === null) {
      return;
    }
    networkDisplay.current.initialize(container);
  }, []);

  return (
    <div>
      <div
        ref={ref}
        style={{
          height: 500,
          border: '1px solid lightgray',
        }}></div>
      {/* <DisplayNode node={node!} />
      <DisplayNode node={node2!} /> */}
    </div>
  );
};

export default DebugNodeGraph;
