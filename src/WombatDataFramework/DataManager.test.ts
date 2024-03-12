/* eslint-disable @typescript-eslint/no-empty-function */
import {DataManager} from './DataManager';
import {AlaSQLNode, ObjectStoreNode, WriteNode} from './DataTypes';

describe('DataManager', () => {
  test('should add a node to the graph and execute it', async () => {
    const dm = new DataManager(() => {});

    dm.setNode(new AlaSQLNode<{num: number}>('a', 'SELECT 1 as num', []));

    expect(dm.getNodeOrDie('a').isRunning()).toBe(false);
    expect(dm.getNodeOrDie('a').hasError()).toBe(false);
    expect(dm.getNodeOrDie('a').hasOutput()).toBe(false);

    await dm.executeNode('a');

    const output = dm.getNodeOutputOrDie('a');
    expect(output[0].num).toBe(1);

    const execution = dm.getNodeOrDie('a').getLatestExecution();
    expect(execution.getCompleted()).toBe(true);
    expect(execution.getError()).toBe(undefined);
    expect(execution.getDuration()).toBeGreaterThan(0);
    expect(execution.getInputRows()).toBe(0);
    expect(execution.getOutputRows()).toBe(1);
  });

  test('basic data flow', async () => {
    const dm = new DataManager(() => {});

    dm.setNodes([
      new AlaSQLNode<{num: number}>('a', 'SELECT 1 as num', []),
      new AlaSQLNode<{num: number}>('b', 'SELECT * FROM ?', ['a']),
    ]);

    await dm.process();

    expect(dm.getNodeOrDie('b').getOutput()).toEqual([{num: 1}]);
  });

  test('basic data flow with multiple inputs', async () => {
    const dm = new DataManager(() => {});

    dm.setNodes([
      new AlaSQLNode<{id: number; num: number}>(
        'a',
        'SELECT 1 as id, 2 as num',
        [],
      ),
      new AlaSQLNode<{id: number; str: number}>(
        'b',
        'SELECT 1 as id,  "test" as str',
        [],
      ),
      new AlaSQLNode<{id: number; num: number; str: number}>(
        'c',
        'SELECT * FROM ? as a JOIN ? as b ON a.id = b.id',
        ['a', 'b'],
      ),
    ]);

    expect(dm.getNodesToExecute().length).toBe(3);
    await dm.process();
    expect(dm.getNodesToExecute().length).toBe(0);

    expect(dm.getNodeOutputOrDie('c')).toEqual([{id: 1, num: 2, str: 'test'}]);
  });

  test('change propagation', async () => {
    const dm = new DataManager(() => {});

    dm.setNodes([
      new AlaSQLNode<{num: number}>('a', 'SELECT 1 as num', []),
      new AlaSQLNode<{num: number}>('b', 'SELECT * FROM ?', ['a']),
    ]);

    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual([
      'a',
      'b',
    ]);
    await dm.process();
    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual([]);

    expect(dm.getNodeOrDie('b').getOutput()).toEqual([{num: 1}]);

    (dm.getNodeOrDie('a') as AlaSQLNode<{num: number}>).changeSql(
      'SELECT 2 as num',
    );
    dm.markNode('a');

    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual([
      'a',
      'b',
    ]);
    await dm.process();

    expect(dm.getNodeOrDie('b').getOutput()).toEqual([{num: 2}]);
  });

  test('topological sort', async () => {
    const dm = new DataManager(() => {});

    dm.setNodes([
      new AlaSQLNode<{num: number}>('c', 'SELECT * FROM ?', ['b']),
      new AlaSQLNode<{num: number}>('b', 'SELECT * FROM ?', ['a']),
      new AlaSQLNode<{num: number}>('a', 'SELECT 1 as num', []),
    ]);

    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual([
      'a',
      'b',
      'c',
    ]);
    await dm.process();
    expect(dm.getNodesToExecute().map((node) => node.getName())).toEqual([]);

    expect(dm.getNodeOrDie('c').getOutput()).toEqual([{num: 1}]);
  });
});
