/**
 * @jest-environment jsdom
 */

import React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import QueryBuilder from './QueryBuilder';
import DataManager from '../../WombatDataFramework/DataManager';
import DataNodeFactory from '../../WombatDataFramework/DataNodeFactory';
import {DataColumn} from '../../WombatDataFramework/DataColumn';

const mockDataManager = new DataManager(() => {});
const factory = new DataNodeFactory(mockDataManager);
const idColumn: DataColumn = {name: 'id', displayName: 'ID', dataType: 'number', units: 'none', description: 'An ID', formatter: (value) => String(value), comparator: (a, b) => (a as number) - (b as number)};
const numColumn: DataColumn = {name: 'num', displayName: 'Num', dataType: 'number', units: 'none', description: 'A number', formatter: (value) => String(value), comparator: (a, b) => (a as number) - (b as number)};
const strColumn: DataColumn = {name: 'str', displayName: 'Str', dataType: 'string', units: 'none', description: 'A string', formatter: (value) => String(value), comparator: (a, b) => (a as string).localeCompare(b as string)};

mockDataManager.registerColumn(numColumn);
mockDataManager.registerColumn(strColumn);
mockDataManager.registerColumn(idColumn);

mockDataManager.registerNode(
  factory.makeAlaSQLNode({
    name: 'node_a',
    displayName: 'Node A',
    sql: 'SELECT 2 as id, 1 as num',
    sources: [],
    columnNames: ['id', 'num'],
  }),
);
mockDataManager.registerNode(
  factory.makeAlaSQLNode({
    name: 'node_b',
    displayName: 'Node B',
    sql: 'SELECT a.num FROM ? as a',
    sources: ['a'],
    columnNames: ['num'],
  }),
);
mockDataManager.registerNode(
  factory.makeAlaSQLNode({
    name: 'node_c',
    displayName: 'Node C',
    sql: 'SELECT 2 as id, "hello" as str',
    sources: [],
    columnNames: ['id', 'str'],
  }),
);

jest.mock('../../WombatDataFramework/DataContext', () => {
  return {
    useDataManager: () => mockDataManager,
  };
});

jest.mock('./QueryBuilder.scss', () => '');

const selectFromDropdown = (labelText: string, value: string) => {
  fireEvent.mouseDown(screen.getByLabelText(labelText));
  userEvent.click(within(screen.getByRole('listbox')).getByText(value));
};

const addElement = (elementType: string) => {
  userEvent.click(screen.getByText(`Add ${elementType}`));
};

describe('QueryBuilder', () => {
  beforeEach(() => {
    render(<QueryBuilder />);
  });

  test('should render', () => {
    expect(screen.getByText('Query Builder')).toBeDefined();
  });

  test('should add a source node', async () => {
    const expectedQuery = 'SELECT FROM ? AS node_a';
    expect(screen.queryByTestId('query-string')).toBeNull();
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByTestId('query-string');
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });

  test('should add a join node', async () => {
    const expectedQuery = 'SELECT FROM ? AS node_a JOIN ? AS node_c ON node_a.id = node_c.id';
    expect(screen.queryByTestId('query-string')).toBeNull();
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByTestId('query-string');
    selectFromDropdown('Join Node', 'node_c');
    await screen.findByText(expectedQuery);
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });

  test('should add a select expression', async () => {
    const expectedQuery = 'SELECT node_a.id FROM ? AS node_a';
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByText('Select Expressions');
    userEvent.click(screen.getByText('Add Select Expression'));
    await screen.findByText(expectedQuery);
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });

  test('should add a source node', async () => {
    const expectedQuery = 'SELECT FROM ? AS node_a';
    expect(screen.queryByTestId('query-string')).toBeNull();
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByTestId('query-string');
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });

  test('should add a join node', async () => {
    const expectedQuery = 'SELECT FROM ? AS node_a JOIN ? AS node_c ON node_a.id = node_c.id';
    expect(screen.queryByTestId('query-string')).toBeNull();
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByTestId('query-string');
    selectFromDropdown('Join Node', 'node_c');
    await screen.findByText(expectedQuery);
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });

  test('should add a select expression', async () => {
    const expectedQuery = 'SELECT node_a.id FROM ? AS node_a';
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByText('Select Expressions');
    addElement('Select Expression');
    await screen.findByText(expectedQuery);
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });

  test('should add a where condition', async () => {
    const expectedQuery = "SELECT FROM ? AS node_a WHERE node_a.id = 'test'";
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByText('Where Conditions');
    addElement('Where Condition');
    await screen.findByLabelText('Column');
    selectFromDropdown('Column', 'node_a.id');
    await screen.findByLabelText('Value');
    const inputField = screen.getByLabelText('Value');
    fireEvent.change(inputField, {target: {value: 'test'}});
    await screen.findByText(expectedQuery);
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });

  test('should add a group by column', async () => {
    const expectedQuery = 'SELECT FROM ? AS node_a GROUP BY node_a.id';
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByText('Group By Columns');
    addElement('Group By Column');
    await screen.findByText(expectedQuery);
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });

  test('should add an order by column', async () => {
    const expectedQuery = 'SELECT FROM ? AS node_a ORDER BY node_a.id ASC';
    selectFromDropdown('Source Node', 'node_a');
    await screen.findByText('Order By Columns');
    addElement('Order By Column');
    await screen.findByText(expectedQuery);
    expect(screen.getByTestId('query-string')).toHaveTextContent(expectedQuery);
  });
});
