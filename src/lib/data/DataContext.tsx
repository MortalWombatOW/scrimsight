import React from 'react';
import {DataManager} from './DataManager';
import {loadNodeData} from './NodeData';

const DataContext = React.createContext<DataManager | null>(null);

const DataProvider = ({children}) => {
  const dataManager = new DataManager();
  loadNodeData(dataManager);
  dataManager.getNodes().forEach((node) => {
    dataManager.executeNode(node.name);
  });
  console.log(dataManager.toString());
  return (
    <DataContext.Provider value={dataManager}>{children}</DataContext.Provider>
  );
};

const useDataManager = () => {
  const dataManager = React.useContext(DataContext);
  if (!dataManager) {
    throw new Error('useDataManager must be used within a DataProvider');
  }
  return dataManager;
};

export {DataProvider, DataContext, useDataManager};
