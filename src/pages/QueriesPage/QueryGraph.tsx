import React, {useEffect, useRef} from 'react';
import {useDataManager} from '../../WombatDataFramework/DataContext';
import {DataNode} from '../../WombatDataFramework/DataNode';
import NetworkDisplay from './NetworkDisplay';
import {DataManager} from '../../WombatDataFramework/DataManager';

function getStateColor(node: DataNode<any> | undefined) {
  if (!node) {
    return '#000000';
  }

  if (node.isRunning()) {
    return '#5bc0de';
  }
  if (node.hasError()) {
    return '#af684c';
  }
  if (!node.hasOutput()) {
    return '#999999';
  }

  return '#3c912b';
}

function getShape(node: DataNode<any> | undefined) {
  return 'box';
}

function getLabel(node: DataNode<any> | undefined) {
  if (!node) {
    return 'undefined';
  }
  const lines: string[] = [];
  lines.push(node.getDisplayName());
  return lines.join('\n');
}

function getOpacity(node: DataNode<any> | undefined) {
  // if (!node) {
  //   return 0.1;
  // }
  // const execution = node.getExecutionCount();
  // if (execution === 0) {
  //   return 0.3;
  // }
  // if (!node.hasOutput()) {
  //   // console.log('opacity', node.name, node);
  //   return 0.5;
  // }

  return 1;
}

function getSize(node: DataNode<any> | undefined) {
  if (!node || !node?.getOutput() || node.getOutput()!.length === 0) {
    return 10;
  }
  // scales up to max 30 logarithmically with the number of rows

  return Math.min(30, 10 + Math.log(node.getOutput()!.length));
}

function updateNode(nodeName: string, networkDisplay: NetworkDisplay, dataManager: DataManager) {
  const node = dataManager.getNodeOrDie(nodeName);

  networkDisplay.setNode(nodeName, getStateColor(node), getShape(node), getLabel(node), getOpacity(node), getSize(node));
  dataManager.nodesDependingOn(nodeName).forEach((fromName) => {
    networkDisplay.setEdge(nodeName, fromName);
  });
  // console.log('Updated node', node);
}

interface QueryGraphProps {
  width: number;
  height: number;
  setSelectedNode: (node: string) => void;
}

const QueryGraph = ({width, height, setSelectedNode}: QueryGraphProps) => {
  const ref = useRef(null);
  const dataManager = useDataManager();
  const networkDisplay = useRef(new NetworkDisplay());

  const nodeNames = dataManager.getNodeNames();
  console.log('Node names', nodeNames);

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
    networkDisplay.current.initialize(container, setSelectedNode);
  }, []);

  return (
    <div>
      <div
        ref={ref}
        style={{
          height,
          width,
        }}></div>
    </div>
  );
};

export default QueryGraph;
