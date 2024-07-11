import React, {useContext, useRef} from 'react';
import DataManager from './DataManager';
import DataNodeFactory from './DataNodeFactory';
import {DATA_COLUMNS} from './DataColumn';
import {WRITE_NODES, OBJECT_STORE_NODES, ALASQL_NODES} from './DataNodeDefinitions';
import {useDeepEffect} from '../hooks/useDeepEffect';

const DataContext = React.createContext<DataManager | null>(null);

const DataProvider = ({children, globalTick, updateGlobalCallback}) => {
  const dataManagerRef = useRef(new DataManager(updateGlobalCallback));
  const dataManager = dataManagerRef.current;

  const factoryRef = useRef(new DataNodeFactory(dataManager));
  const factory = factoryRef.current;

  useDeepEffect(() => {
    for (const column of DATA_COLUMNS) {
      dataManager.registerColumn(column);
    }
    for (const node of WRITE_NODES) {
      dataManager.registerNode(factory.makeWriteNode(node));
    }
    for (const node of OBJECT_STORE_NODES) {
      dataManager.registerNode(factory.makeObjectStoreNode(node));
    }
    for (const node of ALASQL_NODES) {
      dataManager.registerNode(factory.makeAlaSQLNode(node));
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
