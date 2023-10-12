import {useEffect, useState, useContext} from 'react';
import {DataContext} from '../lib/data/DataContext'; // Make sure to import GraphContext
import {DataNodeName} from '../lib/data/types';

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
        await dataManager.executeNode(name);
        newData[name] = dataManager.getNode(name)?.output;
      }
      setData(newData);
    };

    fetchData();
  }, [nodeNames, dataManager]);

  return data;
};

export const useDataNode = (nodeName: DataNodeName) => {
  const data = useData([nodeName]);
  return data[nodeName];
};
