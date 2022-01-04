import {Dataset, Column, Transform} from '../../lib/data/types';

export const transformPlayerDamage: Transform = (dataset: Dataset): Dataset => {
  const colIdx = dataset.columns.findIndex((c: Column) => c.name === 'amount');
  const newDataset: Dataset = {
    columns: [
      ...dataset.columns,
      {
        name: 'damage',
        type: 'number',
      },
    ],
    rows: [],
  };

  dataset.rows.forEach((row: any[]) => {
    let groupIdxIfExists = newDataset.rows.findIndex(
      (r: any[]) => r[0] === row[0],
    );
    if (groupIdxIfExists === -1) {
      newDataset.rows.push([...row, 0]);
      groupIdxIfExists = newDataset.rows.length - 1;
    }
    const groupRow = newDataset.rows[groupIdxIfExists];
    groupRow[groupRow.length - 1] += row[colIdx];
  });

  return newDataset;
};

export const transformPlayerHealing: Transform = (
  dataset: Dataset,
): Dataset => {
  const colIdx = dataset.columns.findIndex((c: Column) => c.name === 'healing');
  const newDataset: Dataset = {
    columns: [
      ...dataset.columns,
      {
        name: 'healing',
        type: 'number',
      },
    ],
    rows: [],
  };

  dataset.rows.forEach((row: any[]) => {
    let groupIdxIfExists = newDataset.rows.findIndex(
      (r: any[]) => r[0] === row[0],
    );
    if (groupIdxIfExists === -1) {
      newDataset.rows.push([...row, 0]);
      groupIdxIfExists = newDataset.rows.length - 1;
    }
    const groupRow = newDataset.rows[groupIdxIfExists];
    groupRow[groupRow.length - 1] += row[colIdx];
  });

  return newDataset;
};

export const transformPlayerDamageTaken: Transform = (
  dataset: Dataset,
): Dataset => {
  const colIdx = dataset.columns.findIndex(
    (c: Column) => c.name === 'damage_taken',
  );
  const newDataset: Dataset = {
    columns: [
      ...dataset.columns,
      {
        name: 'damage_taken_per_second',
        type: 'number',
      },
    ],
    rows: [],
  };

  dataset.rows.forEach((row: any[]) => {
    let groupIdxIfExists = newDataset.rows.findIndex(
      (r: any[]) => r[0] === row[0],
    );
    if (groupIdxIfExists === -1) {
      newDataset.rows.push([...row, 0]);
      groupIdxIfExists = newDataset.rows.length - 1;
    }
    const groupRow = newDataset.rows[groupIdxIfExists];
    groupRow[groupRow.length - 1] += row[colIdx];
  });

  return newDataset;
};

export const transformPlayerHealingTaken: Transform = (
  dataset: Dataset,
): Dataset => {
  const colIdx = dataset.columns.findIndex(
    (c: Column) => c.name === 'healing_taken',
  );
  const newDataset: Dataset = {
    columns: [
      ...dataset.columns,
      {
        name: 'healing_taken_per_second',
        type: 'number',
      },
    ],
    rows: [],
  };

  dataset.rows.forEach((row: any[]) => {
    let groupIdxIfExists = newDataset.rows.findIndex(
      (r: any[]) => r[0] === row[0],
    );
    if (groupIdxIfExists === -1) {
      newDataset.rows.push([...row, 0]);
      groupIdxIfExists = newDataset.rows.length - 1;
    }
    const groupRow = newDataset.rows[groupIdxIfExists];
    groupRow[groupRow.length - 1] += row[colIdx];
  });

  return newDataset;
};
