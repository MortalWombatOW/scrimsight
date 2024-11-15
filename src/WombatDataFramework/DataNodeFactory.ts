import {DataColumn} from './DataColumn';
import DataManager from './DataManager';
import {WriteNodeInit, WriteNode, ObjectStoreNodeInit, ObjectStoreNode, AlaSQLNodeInit, AlaSQLNode, FilterNodeInit, FilterNode, DataNodeName, FunctionNodeInit, FunctionNode} from './DataNode';

class DataNodeFactory {
  private dataManager: DataManager;
  constructor(dataManager: DataManager) {
    this.dataManager = dataManager;
  }

  public makeWriteNode(init: WriteNodeInit): WriteNode<object> {
    return new WriteNode(init.name, init.displayName, init.objectStore);
  }

  public makeObjectStoreNode(init: ObjectStoreNodeInit): ObjectStoreNode<object> {
    return new ObjectStoreNode(
      init.name,
      init.displayName,
      init.objectStore,
      init.columnNames.map((name) => this.dataManager.getColumnOrDie(name)),
    );
  }

  public makeAlaSQLNode(init: AlaSQLNodeInit): AlaSQLNode<object> {
    return new AlaSQLNode(
      init.name,
      init.displayName,
      init.sql,
      init.sources,
      init.columnNames.map((name) => this.dataManager.getColumnOrDie(name)),
    );
  }

  public makeFilterNode(init: FilterNodeInit): FilterNode<object> {
    return new FilterNode(
      init.name,
      init.displayName,
      init.filterKey,
      init.filterValue,
      init.source,
      init.columnNames.map((name) => this.dataManager.getColumnOrDie(name)),
    );
  }

  public makeFunctionNode(init: FunctionNodeInit): FunctionNode<object> {
    return new FunctionNode(
      init.name,
      init.displayName,
      init.transform,
      init.sources,
      init.columnNames.map((name) => this.dataManager.getColumnOrDie(name)),
    );
  }

  public getSharedColumns(nodes: string[]): DataColumn[] {
    if (nodes.length <= 1) {
      return [];
    }
    return nodes
      .map((node) => this.dataManager.getNodeOrDie(node).getColumns())
      .reduce((acc, columns) => {
        return acc.filter((column) => columns.includes(column));
      }, this.dataManager.getNodeOrDie(nodes[0]).getColumns());
  }

  public getJoinableNodes(nodes: string[]): string[] {
    const allNodes = this.dataManager.getNodeList(true);

    if (nodes.length <= 1) {
      return allNodes.map((node) => node.getName()).filter((node) => !nodes.includes(node));
    }

    const sharedColumns = this.getSharedColumns(nodes);

    const possibleNodes = allNodes
      .filter((node) => !nodes.includes(node.getName()))
      .filter((node) => {
        return sharedColumns.every((column) => node.getColumns().find((nodeColumn) => nodeColumn.name === column.name));
      });

    return possibleNodes.map((node) => node.getName());
  }
}

export default DataNodeFactory;
