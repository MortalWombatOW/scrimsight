import React, {useContext, useEffect, useRef} from 'react';
import {useDataManager} from '../../lib/data/DataContext';
import {
  DataNode,
  isTransformNode,
  isJoinNode,
  isObjectStoreNode,
  isWriteNode,
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
    return 'ellipse';
  }
  if (isWriteNode(node)) {
    return 'star';
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

const DebugQueries = () => {
  const ref = useRef(null);
  const dataManager = useDataManager();
  const networkDisplay = useRef(new NetworkDisplay());

  const nodeNames = dataManager.getNodes().map((node) => node.name);

  useEffect(() => {
    for (const nodeName of nodeNames) {
      dataManager.subscribe(nodeName, () => {
        const node = dataManager.getNode(nodeName);
        networkDisplay.current.setNode(
          nodeName,
          getStateColor(node),
          getShape(node),
          getLabel(node),
        );
        dataManager.getEdges(nodeName).forEach(([fromName, toName]) => {
          console.log('edge', fromName, toName);
          networkDisplay.current.setEdge(fromName, toName);
        });
      });
    }
  }, [nodeNames]);

  useEffect(() => {
    const container = ref.current;
    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      locale: 'en',
      // layout: {
      //   hierarchical: {
      //     enabled: true,
      //     direction: 'UD',
      //     sortMethod: 'directed',
      //   },
      // },
      // physics: {
      //   barnesHut: {
      //     avoidOverlap: 1,
      //   },
      // },
      edges: {
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5,
          },
        },
      },
    };
    if (container === null) {
      return;
    }
    networkDisplay.current.initialize(container, options);
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

export default DebugQueries;
