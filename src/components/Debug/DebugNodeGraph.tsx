import React, {useContext, useEffect, useRef} from 'react';
import {useDataManager} from '../../lib/data/DataContext';
import {
  DataNode,
  isTransformNode,
  isJoinNode,
  isObjectStoreNode,
  isWriteNode,
  getLatestExecution,
} from '../../lib/data/types';
import NetworkDisplay from './NetworkDisplay';

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
  if (isTransformNode(node)) {
    return 'box';
  }
  if (isJoinNode(node)) {
    return 'triangle';
  }
  if (isObjectStoreNode(node)) {
    return 'box';
  }
  if (isWriteNode(node)) {
    return 'ellipse';
  }
  return 'box';
}

function getLabel(node: DataNode<any> | undefined) {
  if (!node) {
    return 'undefined';
  }
  const lines: string[] = [];
  lines.push(node.name);
  lines.push(node.state);
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

  const nodeNames = dataManager.getNodes().map((node) => node.name);

  useEffect(() => {
    for (const nodeName of nodeNames) {
      updateNode(nodeName, networkDisplay.current, dataManager);
      dataManager.subscribe(nodeName, () =>
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
    </div>
  );
};

export default DebugNodeGraph;
