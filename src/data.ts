/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

export interface FieldDescription {
  name: string;
  type: string;
  description: string;
}

export const eventFields: Map<string, Array<FieldDescription>> = new Map([
  ['raw_event', [
    { name: 'timestamp', type: 'number', description: 'Timestamp of the event' },
    { name: 'eventType', type: 'string', description: 'Type of the event' },
    { name: 'value1', type: 'string', description: 'First value of the event' },
    { name: 'value2', type: 'string', description: 'Second value of the event' },
    { name: 'value3', type: 'string', description: 'Third value of the event' },
  ]],
  ['player_status', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'hero', type: 'string', description: 'The hero chosen by the player' },
    { name: 'position', type: 'string', description: 'The position of the player' },
  ]],
  ['player_health', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'health', type: 'number', description: 'The current health of the player' },
    { name: 'maxHealth', type: 'number', description: 'The maximum health of the player' },
  ]],
  ['player_ult', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'ultPercent', type: 'number', description: 'The current ult charge of the player' },
  ]],
  ['used_ability_1', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'ability', type: 'string', description: 'The type of the ability used' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'hero', type: 'string', description: 'The hero chosen by the player' },
  ]],
  ['used_ability_2', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'ability', type: 'string', description: 'The type of the ability used' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'hero', type: 'string', description: 'The hero chosen by the player' },
  ]],
  ['damage_dealt', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'damage', type: 'number', description: 'The amount of damage dealt' },
    { name: 'targetPlayer', type: 'string', description: 'The name of the player that was damaged' },
  ]],
  ['did_healing', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'targetPlayer', type: 'string', description: 'The name of the player that was healed' },
    { name: 'healing', type: 'number', description: 'The amount of healing done' },
  ]],
  ['did_elim', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'damage', type: 'number', description: 'The amount of damage dealt' },
    { name: 'targetPlayer', type: 'string', description: 'The name of the player that was killed' },
  ]],
  ['did_final_blow', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'damage', type: 'number', description: 'The amount of damage dealt' },
    { name: 'targetPlayer', type: 'string', description: 'The name of the player that was killed' },
  ]],
  ['player_team', [
    { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
    { name: 'player', type: 'string', description: 'The name of a player' },
    { name: 'team', type: 'string', description: 'The team of the player' },
  ]],
  ['used_ultimate',
    [
      { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
      { name: 'player', type: 'string', description: 'The name of a player' },
      { name: 'hero', type: 'string', description: 'The hero chosen by the player' },
    ]],
  ['map', [
    { name: 'map', type: 'string', description: 'The name of the map' },
  ]],
]);

export class Dataset {
  private fields: FieldDescription[];

  private data: any[][];

  constructor(fields: FieldDescription[], data: any[][] = []) {
    this.fields = fields;
    this.data = data;
  }

  public getField(name: string): any[] | undefined {
    const index = this.fields.findIndex((f) => f.name === name);
    // eslint-disable-next-line no-debugger
    if (index === -1) {
      return undefined;
    }
    return this.data.map((row) => row[index]);
  }

  public rawData(): any[][] {
    return this.data;
  }

  public merge(dataset: Dataset): Dataset {
    const fieldsMatch = this.fields.every(
      (field, index) => field.name === dataset.fields[index].name,
    );
    if (!fieldsMatch) {
      throw new Error('Fields do not match');
    }
    const newData = this.data.concat(dataset.data);
    return new Dataset(this.fields, newData);
  }

  public getRow(index: number): Dataset {
    if (index >= this.data.length) {
      throw new Error('Index out of bounds');
    }
    const row = this.data[index];
    const newData = [row];
    return new Dataset(this.fields, newData);
  }

  public slice(start: number, end: number): Dataset {
    if (start >= this.data.length || end >= this.data.length
      || start > end || start < 0 || end < 0) {
      throw new Error('Index out of bounds');
    }
    const newData = this.data.slice(start, end);
    return new Dataset(this.fields, newData);
  }

  public getFields(): FieldDescription[] {
    return this.fields;
  }

  public select(fields: string[]): Dataset {
    const newFields = this.fields.filter((field) => fields.includes(field.name));
    const newData = this.data.map(
      (row) => row.filter((_, index) => fields.includes(this.fields[index].name)),
    );
    return new Dataset(newFields, newData);
  }

  public selectDistinct(field: string): Dataset {
    const newFields = this.fields.filter((f) => f.name === field);
    const fieldIdx = this.fields.findIndex((f) => f.name === field);
    const newData = this.data.map((row) => row[fieldIdx]);
    const uniqueData = [...new Set(newData)];
    return new Dataset(newFields, uniqueData.map((_, index) => [uniqueData[index]]));
  }

  // eslint-disable-next-line generator-star-spacing
  public * getRows(): IterableIterator<Dataset> {
    const dataset = new Dataset(this.fields);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.data.length; i++) {
      dataset.data = [this.data[i]];
      yield dataset;
    }
  }

  public filter(predicate: (row: Dataset) => boolean): Dataset {
    const newDataset = new Dataset(this.fields);
    for (const row of this.getRows()) {
      if (predicate(row)) {
        newDataset.data.push(row.data);
      }
    }
    return newDataset;
  }

  public numRows(): number {
    return this.data.length;
  }

  public numFields(): number {
    return this.fields.length;
  }
}

export function createRawEventDataset(events: any[]): Dataset {
  const dataset = new Dataset(eventFields.get('raw_event')!, events);
  return dataset;
}

const getDescriptionForField = (field: string): FieldDescription | undefined => {
  const allEventFields = Array.from(eventFields.values()).flat();
  const fieldDescription = allEventFields.find((f) => f.name === field);
  return fieldDescription;
};

export interface DatasetTransform {
  name: string;
  transform: (dataset: Dataset) => Dataset;
}

export function renameFieldsTransform(
  renameMap: { [oldName: string]: string },
): DatasetTransform {
  return {
    name: 'rename_fields',
    transform: (dataset) => {
      const newFields = dataset.getFields().map((field) => {
        if (renameMap[field.name]) {
          const description = getDescriptionForField(renameMap[field.name]);
          console.log(renameMap[field.name]);
          if (description) {
            return description;
          }
          return {
            name: renameMap[field.name],
            type: field.type,
            description: field.description,
          };
        }
        return field;
      });
      return new Dataset(newFields, dataset.rawData());
    },
  };
}

export function selectFieldsTransform(fields: string[]): DatasetTransform {
  return {
    name: 'select_fields',
    transform: (dataset) => dataset.select(fields),
  };
}

export function addFieldTransform(
  field: FieldDescription,
  data: any[],
): DatasetTransform {
  return {
    name: 'add_field',
    transform: (dataset) => {
      const newFields = dataset.getFields().concat(field);
      const newData = dataset.rawData().map((row) => row.concat(data));
      return new Dataset(newFields, newData);
    },
  };
}

export function addDerivedFieldTransform(
  field: FieldDescription,
  transform: (row: Dataset) => any,
): DatasetTransform {
  return {
    name: 'add_derived_field',
    transform: (dataset) => {
      const newFieldData: any[] = [];
      for (const row of dataset.getRows()) {
        newFieldData.push(transform(row));
      }
      return addFieldTransform(field, newFieldData).transform(dataset);
    },
  };
}

export function addCumSumFieldTransform(
  field: FieldDescription,
): DatasetTransform {
  return {
    name: 'add_cum_sum_field',
    transform: (dataset) => {
      const newFieldData: any[] = [];
      let sum = 0;
      for (const row of dataset.getRows()) {
        sum += row.getField(field.name)![0];
        newFieldData.push(sum);
      }
      return addFieldTransform(field, newFieldData).transform(dataset);
    },
  };
}

export function filterTransform(
  predicate: (row: Dataset) => boolean,
): DatasetTransform {
  return {
    name: 'filter',
    transform: (dataset) => dataset.filter(predicate),
  };
}

export function applyTransforms(
  dataset: Dataset,
  transforms: DatasetTransform[],
): Dataset {
  let newDataset = dataset;
  for (const transform of transforms) {
    newDataset = transform.transform(newDataset);
  }
  return newDataset;
}

export const fieldTransforms: Map<string, Map<string, DatasetTransform[]>> = new Map([
  ['raw_event', new Map([
    ['map', [
      filterTransform((row) => row.getField('eventType')![0] === 'map'),
      selectFieldsTransform(['value1']),
      renameFieldsTransform({ value1: 'map' }),
    ]]])]]);
