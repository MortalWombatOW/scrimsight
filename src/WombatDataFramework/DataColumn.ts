import {format} from '../lib/format';
import {DataUnit, DataBasicUnit, DataRatioUnit} from './DataUnits';

export type DataColumnTypeInput = 'string' | 'number' | 'boolean';

export type DataColumnType = string | number | boolean;

export interface DataColumn {
  name: string;
  displayName: string;
  description: string;
  units: DataUnit;
  dataType: DataColumnTypeInput;
  formatter: (data: DataColumnType) => string;
  comparator: (a: DataColumnType, b: DataColumnType) => number;
}

export function makeDataColumn(
  name: string,
  displayName: string,
  description: string,
  units: DataUnit,
  dataType: DataColumnTypeInput,
  formatter: (data: DataColumnType) => string,
  comparator: (a: DataColumnType, b: DataColumnType) => number,
): DataColumn {
  return {
    name,
    displayName,
    description,
    units,
    dataType,
    formatter,
    comparator,
  };
}

export function makeRatioUnits(numerator: DataBasicUnit, denominator: DataBasicUnit): DataRatioUnit {
  return {numerator, denominator};
}

// common formatters and comparators
export const stringFormatter = (data: DataColumnType) => data.toString();
export const stringComparator = (a: DataColumnType, b: DataColumnType) => a.toString().localeCompare(b.toString());

export const numberFormatter = (data: DataColumnType) => format(data as number);
export const percentFormatter = (data: DataColumnType) => `${data}%`;
export const numberComparator = (a: DataColumnType, b: DataColumnType) => (a as number) - (b as number);

export const booleanFormatter = (data: DataColumnType) => ((data as boolean) ? 'Yes' : 'No');
export const booleanComparator = (a: DataColumnType, b: DataColumnType) => {
  if (a === b) {
    return 0;
  }
  if (a) {
    return 1;
  }
  return -1;
};


