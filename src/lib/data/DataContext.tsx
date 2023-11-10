import React, {useContext, useEffect, useState} from 'react';
import {DataManager} from './DataManager';
import {loadNodeData} from './NodeData';

const DataContext = React.createContext<DataManager | null>(null);

const DataProvider = ({children}) => {
  const dataManager = new DataManager();

  const [tick, setTick] = useState(0);
  const incrementTick = () => setTick((tick) => tick + 1);
  dataManager.subscribeAll(incrementTick);

  // useEffect(() => {
  loadNodeData(dataManager);
  // }, [tick]);

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
