import React, {useContext, useEffect, useRef} from 'react';
import {useDataManager} from '../../lib/data/DataContext';
import {
  AlaSQLNode,
  DataNode,
  ObjectStoreNode,
  WriteNode,
} from '../../lib/data/DataTypes';
import NetworkDisplay from './NetworkDisplay';
import DisplayNode from './DisplayNode';
import {useDataNode} from '../../hooks/useData';

function getStateColor(node: DataNode<any> | undefined) {
  if (!node) {
    return '#000000';
  }

  if (node.isRunning()) {
    return '#5bc0de';
  } else if (node.hasError()) {
    return '#af684c';
  } else {
    return '#3c912b';
  }
}

function getShape(node: DataNode<any> | undefined) {
  if (!node) {
    return 'box';
  }
  if (node instanceof ObjectStoreNode) {
    return 'ellipse';
  }
  if (node instanceof WriteNode) {
    return 'diamond';
  }
  if (node instanceof AlaSQLNode) {
    return 'box';
  }
  return 'box';
}

function getLabel(node: DataNode<any> | undefined) {
  if (!node) {
    return 'undefined';
  }
  const lines: string[] = [];
  lines.push(node.toString());
  lines.push(node.getMetadata()?.executions?.length.toString() ?? '0');
  return lines.join('\n');
}

function getOpacity(node: DataNode<any> | undefined) {
  if (!node) {
    return 0.1;
  }
  const execution = node.getLatestExecution();
  if (!execution) {
    return 0.3;
  }
  if (execution.getOutputRows() === 0) {
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

  const nodeNames = dataManager.getNodes().map((node) => node.getName());

  useEffect(() => {
    for (const nodeName of nodeNames) {
      updateNode(nodeName, networkDisplay.current, dataManager);
      // dataManager.subscribeFn(nodeName, () =>
      //   updateNode(nodeName, networkDisplay.current, dataManager),
      // );
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
