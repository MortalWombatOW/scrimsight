import React, { useContext, useRef } from 'react';
import DataManager from './DataManager';
import DataNodeFactory from './DataNodeFactory';
import { DATA_COLUMNS } from './DataColumn';
import { WRITE_NODES, OBJECT_STORE_NODES, ALASQL_NODES, FUNCTION_NODES } from './DataNodeDefinitions';

const DataContext = React.createContext<DataManager | null>(null);

interface DataProviderProps {
  children: React.ReactNode;
  globalTick: number;
  updateGlobalCallback: () => void;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children, globalTick, updateGlobalCallback }) => {
  const dataManagerRef = useRef(new DataManager(updateGlobalCallback));
  const dataManager = dataManagerRef.current;

  const factoryRef = useRef(new DataNodeFactory(dataManager));
  const factory = factoryRef.current;

  if (!dataManager.isSetupComplete()) {
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
    for (const node of FUNCTION_NODES) {
      dataManager.registerNode(factory.makeFunctionNode(node));
    }

    const fetchData = async () => {
      await dataManager.process();
    };

    fetchData();
    dataManager.finishSetup();
  }

  console.log('Rendering data, tick = ', dataManager.getTick());

  return <DataContext.Provider value={dataManager}>{children}</DataContext.Provider>;
};

export const useDataManager = () => {
  const dataManager = useContext(DataContext);
  if (!dataManager) {
    throw new Error('useDataManager must be used within a DataProvider');
  }
  return dataManager;
};

export { DataContext };
