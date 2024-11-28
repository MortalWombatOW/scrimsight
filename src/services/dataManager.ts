import { DataManager, IndexedDBNode, InputNode, ObjectStoreNode, AlaSQLNode, FunctionNode } from 'wombat-data-framework';
import { DATA_COLUMNS, OBJECT_STORE_NODES, ALASQL_NODES, FUNCTION_NODES, FILE_PARSING_NODES, indexedDbNode } from '../WombatDataFrameworkSchema';

export const initializeDataManager = (dataManager: DataManager) => {
  console.log('Initializing Data Manager');
  DATA_COLUMNS.forEach((col) => dataManager.registerColumn(col));

  const allNodes = [indexedDbNode, ...FILE_PARSING_NODES, ...OBJECT_STORE_NODES, ...ALASQL_NODES, ...FUNCTION_NODES];
  allNodes.forEach((node) => {
    if (node.type === 'IndexedDBNode') {
      const requiredObjectStores = allNodes.filter((n) => n.type === 'ObjectStoreNode').map((n) => (n as ObjectStoreNodeConfig).objectStore);
      const configWithObjectStores: IndexedDBNodeConfig = { ...node as IndexedDBNodeConfig, objectStores: requiredObjectStores };
      dataManager.registerNode(new IndexedDBNode(configWithObjectStores));
    }
    const nodeColumns = node.columnNames.map((name) => dataManager.getColumn(name));
    if (node.type === 'InputNode') {
      const inputNode = node as InputNodeConfig;
      dataManager.registerNode(new InputNode(inputNode.name, inputNode.displayName, inputNode.outputType, nodeColumns, inputNode.behavior));
    }
    if (node.type === 'ObjectStoreNode') {
      const objectStoreNode = node as ObjectStoreNodeConfig;
      dataManager.registerNode(new ObjectStoreNode(objectStoreNode.name, objectStoreNode.displayName, nodeColumns, objectStoreNode.objectStore, objectStoreNode.source, objectStoreNode.behavior));
    }
    if (node.type === 'AlaSQLNode') {
      const alaSQLNode = node as AlaSQLNodeConfig;
      dataManager.registerNode(new AlaSQLNode(alaSQLNode.name, alaSQLNode.displayName, alaSQLNode.sql, alaSQLNode.sources, nodeColumns));
    }
    if (node.type === 'FunctionNode') {
      const functionNode = node as FunctionNodeConfig;
      dataManager.registerNode(new FunctionNode(functionNode.name, functionNode.displayName, functionNode.transform, functionNode.sources, nodeColumns, functionNode.outputType));
    }
  });
}; 