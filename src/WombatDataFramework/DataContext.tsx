import React, {useContext, useEffect, useState} from 'react';
import {DataManager} from './DataManager';
import {DATA_COLUMNS} from './DataColumn';
import {WRITE_NODES, OBJECT_STORE_NODES, ALASQL_NODES} from './DataNodeDefinitions';

const DataContext = React.createContext<DataManager | null>(null);

const DataProvider = ({children, globalTick, updateGlobalCallback}) => {
  const dataManager = useState(() => new DataManager(updateGlobalCallback))[0];

  useEffect(() => {
    for (const column of DATA_COLUMNS) {
      dataManager.registerColumn(column);
    }
    for (const node of WRITE_NODES) {
      dataManager.addWriteNode(node);
    }
    for (const node of OBJECT_STORE_NODES) {
      dataManager.addObjectStoreNode(node);
    }
    for (const node of ALASQL_NODES) {
      dataManager.addAlaSQLNode(node);
    }

    const fetchData = async () => {
      await dataManager.process();
    };

    fetchData();
  }, [dataManager]);

  console.log('Rendering data, tick = ', globalTick);

  return <DataContext.Provider value={dataManager}>{children}</DataContext.Provider>;
};

const useDataManager = (callback?: [string, () => void]) => {
  const dataManager = useContext(DataContext);
  if (!dataManager) {
    throw new Error('useDataManager must be used within a DataProvider');
  }
  if (callback) {
    dataManager.registerGlobalCallback(callback);
  }
  return dataManager;
};

export {DataProvider, DataContext, useDataManager};
