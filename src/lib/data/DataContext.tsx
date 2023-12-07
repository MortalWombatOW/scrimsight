import React, {useContext, useEffect, useState} from 'react';
import {DataManager} from './DataManager';
import {NODES} from './NodeData';

const DataContext = React.createContext<DataManager | null>(null);

const DataProvider = ({children, tick, updateCallback}) => {
  const dataManager = useState(() => new DataManager(NODES, updateCallback))[0];

  useEffect(() => {
    const fetchData = async () => {
      console.log('Processing data, tick = ', tick);
      await dataManager.process();
    };

    fetchData();
  }, [dataManager]);

  console.log('Rendering data, tick = ', tick);

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
