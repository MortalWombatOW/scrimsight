import React, { useContext, useRef } from 'react';
import DataManager from './DataManager';
import DataNodeFactory from './DataNodeFactory';
import { DataColumn } from './DataColumn';
import { WriteNodeInit, ObjectStoreNodeInit, AlaSQLNodeInit, FunctionNodeInit } from './DataNode';

const DataContext = React.createContext<DataManager | null>(null);

interface DataProviderProps {
  children: React.ReactNode;
  updateGlobalCallback: () => void;
  columns: DataColumn[];
  writeNodes: WriteNodeInit[];
  objectStoreNodes: ObjectStoreNodeInit[];
  alaSQLNodes: AlaSQLNodeInit[];
  functionNodes: FunctionNodeInit[];
}

export const DataProvider: React.FC<DataProviderProps> = ({ children, updateGlobalCallback, columns, writeNodes, objectStoreNodes, alaSQLNodes, functionNodes }) => {
  const dataManagerRef = useRef(new DataManager(updateGlobalCallback));
  const dataManager = dataManagerRef.current;

  const factoryRef = useRef(new DataNodeFactory(dataManager));
  const factory = factoryRef.current;

  if (!dataManager.isSetupComplete()) {
    for (const column of columns) {
      dataManager.registerColumn(column);
    }
    for (const node of writeNodes) {
      dataManager.registerNode(factory.makeWriteNode(node));
    }
    for (const node of objectStoreNodes) {
      dataManager.registerNode(factory.makeObjectStoreNode(node));
    }
    for (const node of alaSQLNodes) {
      dataManager.registerNode(factory.makeAlaSQLNode(node));
    }
    for (const node of functionNodes) {
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
