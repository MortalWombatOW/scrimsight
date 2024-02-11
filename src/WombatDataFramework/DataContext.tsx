import React, {useContext, useEffect, useState} from 'react';
import {DataManager} from './DataManager';
import {NODES} from '../lib/data/NodeData';

const DataContext = React.createContext<DataManager | null>(null);

const DataProvider = ({children, globalTick, updateGlobalCallback}) => {
  const dataManager = useState(() => new DataManager(updateGlobalCallback))[0];
  dataManager.setNodes(NODES);
  useEffect(() => {
    const fetchData = async () => {
      await dataManager.process();
    };

    fetchData();
  }, [dataManager]);

  console.log('Rendering data, tick = ', globalTick);

  return (
    <DataContext.Provider value={dataManager}>{children}</DataContext.Provider>
  );
};

const useDataManager = () => {
  const dataManager = useContext(DataContext);
  if (!dataManager) {
    throw new Error('useDataManager must be used within a DataProvider');
  }
  return dataManager;
};

export {DataProvider, DataContext, useDataManager};
