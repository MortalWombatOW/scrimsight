import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';

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

jest.mock('../../WombatDataFramework/DataContext', () => {
  return {
    useDataManager: () => mockDataManager,
  };
});
describe('QueryBuilder', () => {
  test('should render', () => {
    render(<QueryBuilder />);
    expect(screen.getByTestId('query-builder')).toBeDefined();
  });
});
