/* eslint-disable @typescript-eslint/no-empty-function */
import {DataColumn} from './DataColumn';
import {DataManager} from './DataManager';
import {AlaSQLNode, DataNodeExecution, ObjectStoreNode, WriteNode} from './DataNode';

const idColumn: DataColumn = {name: 'id', displayName: 'ID', dataType: 'number', units: 'none', description: 'An ID', formatter: (value) => String(value), comparator: (a, b) => (a as number) - (b as number)};
const numColumn: DataColumn = {name: 'num', displayName: 'Num', dataType: 'number', units: 'none', description: 'A number', formatter: (value) => String(value), comparator: (a, b) => (a as number) - (b as number)};
const strColumn: DataColumn = {name: 'str', displayName: 'Str', dataType: 'string', units: 'none', description: 'A string', formatter: (value) => String(value), comparator: (a, b) => (a as string).localeCompare(b as string)};

describe('DataManager', () => {
  test('should add a node to the graph and execute it', async () => {
    const dm = new DataManager(() => {});

    dm.registerColumn(numColumn);
    dm.addAlaSQLNode({
      name: 'a',
      displayName: 'A',
      sql: 'SELECT 1 as num',
      sources: [],
      columnNames: ['num'],
    });

    expect(dm.getNodeOrDie('a').isRunning()).toBe(false);
    expect(dm.getNodeOrDie('a').hasError()).toBe(false);
    expect(dm.getNodeOrDie('a').hasOutput()).toBe(false);

    await dm.executeNode('a');

    const output = dm.getNodeOutputOrDie('a');
    expect(output[0].num).toBe(1);

    const execution: DataNodeExecution = dm.getNodeOrDie('a').getLatestExecution();
    expect(execution.error).toBe(undefined);
    expect(execution.endTime - execution.startTime).toBeGreaterThanOrEqual(0);
    expect(execution.inputRows).toBe(0);
    expect(execution.outputRows).toBe(1);
  });

  test('basic data flow', async () => {
    const dm = new DataManager(() => {});
    dm.registerColumn(numColumn);
    dm.addAlaSQLNode({
      name: 'a',
      displayName: 'Node A',
      sql: 'SELECT 1 as num',
      sources: [],
      columnNames: ['num'],
    });
    dm.addAlaSQLNode({
      name: 'b',
      displayName: 'Node B',
      sql: 'SELECT * FROM ?',
      sources: ['a'],
      columnNames: ['num'],
    });

    await dm.process();

    expect(dm.getNodeOutputOrDie('b')).toEqual([{num: 1}]);
  });

  test('basic data flow with multiple inputs', async () => {
    const dm = new DataManager(() => {});
    dm.registerColumn(idColumn);
    dm.registerColumn(numColumn);
    dm.registerColumn(strColumn);

    dm.addAlaSQLNode({
      name: 'a',
      displayName: 'Node A',
      sql: 'SELECT 1 as id, 2 as num',
      sources: [],
      columnNames: ['id', 'num'],
    });

    dm.addAlaSQLNode({
      name: 'b',
      displayName: 'Node B',
      sql: 'SELECT 1 as id, "str" as str',
      sources: [],
      columnNames: ['id', 'str'],
    });

    dm.addAlaSQLNode({
      name: 'c',
      displayName: 'Node C',
      sql: 'SELECT * FROM ? as a JOIN ? as b ON a.id = b.id',
      sources: ['a', 'b'],
      columnNames: ['id', 'num', 'str'],
    });

    expect(dm.getNodesToExecute().length).toBe(3);
    await dm.process();
    expect(dm.getNodesToExecute().length).toBe(0);

    expect(dm.getNodeOutputOrDie('c')).toEqual([{id: 1, num: 2, str: 'str'}]);
  });

  test('change propagation', async () => {
    const dm = new DataManager(() => {});
    dm.registerColumn(numColumn);

    dm.addAlaSQLNode({
      name: 'a',
      displayName: 'Node A',
      sql: 'SELECT 1 as num',
      sources: [],
      columnNames: ['num'],
    });
    dm.addAlaSQLNode({
      name: 'b',
      displayName: 'Node B',
      sql: 'SELECT * FROM ?',
      sources: ['a'],
      columnNames: ['num'],
    });

    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual(['a', 'b']);
    await dm.process();
    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual([]);

    expect(dm.getNodeOutputOrDie('b')).toEqual([{num: 1}]);

    (dm.getNodeOrDie('a') as AlaSQLNode<{num: number}>).changeSql('SELECT 2 as num');
    dm.markNode('a');

    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual(['a', 'b']);
    await dm.process();

    expect(dm.getNodeOrDie('b').getOutput()).toEqual([{num: 2}]);
  });

  test('topological sort', async () => {
    const dm = new DataManager(() => {});
    dm.registerColumn(numColumn);

    dm.addAlaSQLNode({
      name: 'c',
      displayName: 'Node C',
      sql: 'SELECT * FROM ?',
      sources: ['b'],
      columnNames: ['num'],
    });
    dm.addAlaSQLNode({
      name: 'b',
      displayName: 'Node B',
      sql: 'SELECT * FROM ?',
      sources: ['a'],
      columnNames: ['num'],
    });
    dm.addAlaSQLNode({
      name: 'a',
      displayName: 'Node A',
      sql: 'SELECT 1 as num',
      sources: [],
      columnNames: ['num'],
    });

    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual(['a', 'b', 'c']);
    await dm.process();
    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual([]);

    expect(dm.getNodeOrDie('c').getOutput()).toEqual([{num: 1}]);
  });
});
