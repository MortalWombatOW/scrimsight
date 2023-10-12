import React from 'react';
import {DataManager} from './DataManager';
import {loadNodeData} from './NodeData';

const DataContext = React.createContext<DataManager | null>(null);

const DataProvider = ({children}) => {
  const dataManager = new DataManager();
  loadNodeData(dataManager);
  return (
    <DataContext.Provider value={dataManager}>{children}</DataContext.Provider>
  );
};

export {DataProvider, DataContext};
