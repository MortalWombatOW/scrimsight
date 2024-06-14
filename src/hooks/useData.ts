import {useEffect, useState, useContext} from 'react';
import {DataContext} from '../WombatDataFramework/DataContext'; // Make sure to import GraphContext
import {DataNode, DataNodeName} from '../WombatDataFramework/DataNode';

export const useDataNode = <T extends object>(nodeName: DataNodeName): DataNode<T> | undefined => {
  const dataManager = useContext(DataContext);

  const [tick, setTick] = useState(0);

  if (!dataManager) {
    throw new Error('useDataNode must be used within a GraphProvider');
  }

  dataManager.addNodeCallback(nodeName, () => {
    setTick((tick) => tick + 1);
  });

  console.log('useDataNode', nodeName);
  return dataManager.getNode(nodeName);
};

export const useDataNodeOutput = <T extends object>(nodeName: DataNodeName, filters: object = {}): T[] => {
  const node = useDataNode<T>(nodeName);

  if (!node) {
    return [];
  }

  if (Object.keys(filters).length == 0 || !node.getOutput()) {
    return node.getOutput() || [];
  }

  return node.getOutput()!.filter((item) => {
    for (const key of Object.keys(filters)) {
      if (item[key] !== filters[key]) return false;
    }
    return true;
  });
};
