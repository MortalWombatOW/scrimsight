import {useEffect, useState, useContext} from 'react';
import {DataContext} from '../WombatDataFramework/DataContext'; // Make sure to import GraphContext
import {DataNode, DataNodeName} from '../WombatDataFramework/DataTypes';

export const useData = (nodeNames: DataNodeName[]) => {
  const dataManager = useContext(DataContext);
  const [data, setData] = useState<{[name: string]: any[] | undefined}>({});

  if (!dataManager) {
    throw new Error('useData must be used within a GraphProvider');
  }

  useEffect(() => {
    const fetchData = async () => {
      const newData: {[name: string]: any[] | undefined} = {};
      for (const name of nodeNames) {
        newData[name] = dataManager.getNodeOutputOrDie(name);
      }
      setData(newData);
    };

    fetchData();
  }, [nodeNames, dataManager]);

  return data;
};

export const useDataNodes = (
  nodes: DataNode<any>[],
): {[name: string]: any[] | undefined} => {
  const dataManager = useContext(DataContext);
  const [data, setData] = useState<{[name: string]: any[] | undefined}>({});
  const [tick, setTick] = useState(0);

  if (!dataManager) {
    throw new Error('useDataNodes must be used within a GraphProvider');
  }

  useEffect(() => {
    dataManager.setNodes(nodes);
    for (const node of nodes) {
      dataManager.addNodeCallback(node.getName(), () => {
        setTick((tick) => tick + 1);
      });
    }
    dataManager.process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const newData: {[name: string]: any[] | undefined} = {};
      for (const node of nodes) {
        newData[node.getName()] = dataManager
          .getNodeOrDie(node.getName())
          .getOutput();
      }
      setData(newData);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  return data;
};

export const useDataNode = <T>(nodeName: DataNodeName): DataNode<T> => {
  const dataManager = useContext(DataContext);

  const [tick, setTick] = useState(0);

  if (!dataManager) {
    throw new Error('useDataNode must be used within a GraphProvider');
  }

  dataManager.addNodeCallback(nodeName, () => {
    setTick((tick) => tick + 1);
  });

  console.log('useDataNode', nodeName);
  return dataManager.getNodeOrDie(nodeName);
};

export const useDataNodeOutput = <T>(
  nodeName: DataNodeName,
  filters: object = {},
): T[] => {
  const node = useDataNode<T>(nodeName);

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
