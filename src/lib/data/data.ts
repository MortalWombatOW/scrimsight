/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-self-import */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

// export const eventFields: Map<string, Array<FieldDescription>> = new Map([
//   ['raw_event', [
//     { name: 'timestamp', type: 'number', description: 'Timestamp of the event' },
//     { name: 'eventType', type: 'string', description: 'Type of the event' },
//     { name: 'value1', type: 'string', description: 'First value of the event' },
//     { name: 'value2', type: 'string', description: 'Second value of the event' },
//     { name: 'value3', type: 'string', description: 'Third value of the event' },
//   ]],
//   ['player_status', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'hero', type: 'string', description: 'The hero chosen by the player' },
//     { name: 'position', type: 'string', description: 'The position of the player' },
//   ]],
//   ['player_health', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'health', type: 'number', description: 'The current health of the player' },
//     { name: 'maxHealth', type: 'number', description: 'The maximum health of the player' },
//   ]],
//   ['player_ult', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'ultPercent', type: 'number', description: 'The current ult charge of the player' },
//   ]],
//   ['used_ability_1', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'ability', type: 'string', description: 'The type of the ability used' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'hero', type: 'string', description: 'The hero chosen by the player' },
//   ]],
//   ['used_ability_2', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'ability', type: 'string', description: 'The type of the ability used' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'hero', type: 'string', description: 'The hero chosen by the player' },
//   ]],
//   ['damage_dealt', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'damage', type: 'number', description: 'The amount of damage dealt' },
//     { name: 'target', type: 'string', description: 'The name of the player that was damaged' },
//   ]],
//   ['did_healing', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'target', type: 'string', description: 'The name of the player that was healed' },
//     { name: 'healing', type: 'number', description: 'The amount of healing done' },
//   ]],
//   ['did_elim', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'damage', type: 'number', description: 'The amount of damage dealt' },
//     { name: 'target', type: 'string', description: 'The name of the player that was killed' },
//   ]],
//   ['did_final_blow', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'damage', type: 'number', description: 'The amount of damage dealt' },
//     { name: 'target', type: 'string', description: 'The name of the player that was killed' },
//   ]],
//   ['player_team', [
//     { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//     { name: 'player', type: 'string', description: 'The name of a player' },
//     { name: 'team', type: 'string', description: 'The team of the player' },
//   ]],
//   ['used_ultimate',
//     [
//       { name: 'timestamp', type: 'number', description: 'Seconds since start of the map' },
//       { name: 'player', type: 'string', description: 'The name of a player' },
//       { name: 'hero', type: 'string', description: 'The hero chosen by the player' },
//     ]],
//   ['map', [
//     { name: 'map', type: 'string', description: 'The name of the map' },
//   ]],
// ]);

// export function createRawEventDataset(events: any[]): Dataset {
//   const dataset = new Dataset(eventFields.get('raw_event')!, events);
//   return dataset;
// }

// const getDescriptionForField = (field: string): FieldDescription | undefined => {
//   const allEventFields = Array.from(eventFields.values()).flat();
//   const fieldDescription = allEventFields.find((f) => f.name === field);
//   return fieldDescription;
// };

// export interface DatasetTransform {
//   name: string;
//   transform: (dataset: Dataset) => Dataset;
// }

// export function renameFieldsTransform(
//   renameMap: { [oldName: string]: string },
// ): DatasetTransform {
//   return {
//     name: `Rename fields ${JSON.stringify(renameMap)}`,
//     transform: (dataset) => {
//       const newFields = dataset.getFields().map((field) => {
//         if (renameMap[field.name]) {
//           const description = getDescriptionForField(renameMap[field.name]);
//           console.log(renameMap[field.name]);
//           if (description) {
//             return description;
//           }
//           return {
//             name: renameMap[field.name],
//             type: field.type,
//             description: field.description,
//           };
//         }
//         return field;
//       });
//       return new Dataset(newFields, dataset.rawData());
//     },
//   };
// }

// export function selectFieldsTransform(fields: string[]): DatasetTransform {
//   return {
//     name: `Select fields ${JSON.stringify(fields)}`,
//     transform: (dataset) => dataset.select(fields),
//   };
// }

// export function addFieldTransform(
//   field: FieldDescription,
//   data: any[],
// ): DatasetTransform {
//   return {
//     name: `Add field ${field.name}`,
//     transform: (dataset) => {
//       const newFields = dataset.getFields().concat(field);
//       const newData = dataset.rawData().map((row) => row.concat(data));
//       return new Dataset(newFields, newData);
//     },
//   };
// }

// export function addDerivedFieldTransform(
//   field: FieldDescription,
//   transform: (row: DataRow) => any,
// ): DatasetTransform {
//   return {
//     name: `Add derived field ${field.name}`,
//     transform: (dataset) => addFieldTransform(
//       field, dataset.map((row) => transform(row)),
//     ).transform(dataset),
//   };
// }

// export function summarizeTransform(
//   groupByFields: string[],
//   aggType: string,
//   aggField: string,
// ): DatasetTransform {
//   return {
//     name: `Summarize ${aggType}(${aggField}) by ${JSON.stringify(groupByFields)}`,
//     transform: (dataset) => {
//       const newFields = groupByFields.map((field) => {
//         const description = getDescriptionForField(field);
//         if (description) {
//           return description;
//         }
//         return {
//           name: field,
//           type: 'string',
//           description: 'unknown definition',
//         };
//       }).concat({
//         name: `${aggField}_${aggType}`,
//         type: 'number',
//         description: `${aggType} of ${aggField}`,
//       });
//       const newDataMap = new Map<string, any[]>();
//       const cumulativeData = new Map<string, number>();
//       dataset.map((row) => {
//         const groupByValues = groupByFields.map((field) => row.get(field));
//         const mapKey = groupByValues.join('|');
//         const aggValue: number = Number.parseFloat(row.get(aggField));
//         if (aggType === 'sum') {
//           if (newDataMap.has(mapKey)) {
//             const arr = newDataMap.get(mapKey)!;
//             arr[arr.length - 1]! = (arr[arr.length - 1]! as number) + aggValue;
//             newDataMap.set(mapKey, arr);
//           } else {
//             newDataMap.set(mapKey, [...groupByValues, aggValue]);
//           }
//         }
//         if (aggType === 'cumsum') {
//           if (newDataMap.has(mapKey)) {
//             const arr = newDataMap.get(mapKey)!;
//             const cumValue = cumulativeData.get(mapKey)!;
//             arr[arr.length - 1]! = cumValue + aggValue;
//             cumulativeData.set(mapKey, cumValue + aggValue);
//             newDataMap.set(mapKey, arr);
//           } else {
//             newDataMap.set(mapKey, [...groupByValues, aggValue]);
//             cumulativeData.set(mapKey, aggValue);
//           }
//         }
//         return row;
//       });
//       const newData = Array.from(newDataMap.values());

//       return new Dataset(newFields, newData);
//     },
//   };
// }

// export function filterTransform(
//   predicate: (row: DataRow) => boolean,
//   field: string,
//   constraint: string,
// ): DatasetTransform {
//   return {
//     name: `Filter ${field} in ${constraint}`,
//     transform: (dataset) => dataset.filter(predicate),
//   };
// }

// export function sortTransform(
//   field: string,
//   direction: 'asc' | 'desc',
// ): DatasetTransform {
//   return {
//     name: `Sort by ${field} ${direction}`,
//     transform: (dataset) => dataset.sort(field, direction),
//   };
// }

// export function applyTransforms(
//   dataset: Dataset,
//   transforms: DatasetTransform[],
// ): Dataset {
//   let newDataset = dataset;
//   for (const transform of transforms) {
//     newDataset = transform.transform(newDataset);
//   }
//   return newDataset;
// }

// export const fieldTransforms: Map<string, Map<string, DatasetTransform[]>> = new Map([
//   ['raw_event', new Map([
//     ['map', [
//       filterTransform((row) => row.get('eventType') === 'map', 'eventType', 'map'),
//       selectFieldsTransform(['value1']),
//       renameFieldsTransform({ value1: 'map' }),
//     ]],
//     ['player_status', [
//       filterTransform((row) => row.get('eventType') === 'player_status', 'eventType', 'player_status'),
//       renameFieldsTransform({ value1: 'player', value2: 'hero', value3: 'position' }),
//       selectFieldsTransform(['timestamp', 'player', 'hero', 'position']),
//     ]],
//     ['player_team', [
//       filterTransform((row) => row.get('eventType') === 'player_team', 'eventType', 'player_team'),
//       renameFieldsTransform({ value1: 'player', value2: 'team' }),
//       selectFieldsTransform(['player', 'team']),
//     ]],
//     ['player_health', [
//       filterTransform((row) => row.get('eventType') === 'player_health', 'eventType', 'player_health'),
//       renameFieldsTransform({ value1: 'player', value2: 'health', value3: 'maxHealth' }),
//       selectFieldsTransform(['timestamp', 'player', 'health', 'maxHealth']),
//     ]],
//     ['player_ult', [
//       filterTransform((row) => row.get('eventType') === 'player_ult', 'eventType', 'player_ult'),
//       renameFieldsTransform({ value1: 'player', value2: 'ultPercent' }),
//       selectFieldsTransform(['timestamp', 'player', 'ultPercent']),
//     ]],
//     ['did_healing', [
//       filterTransform((row) => row.get('eventType') === 'did_healing', 'eventType', 'did_healing'),
//       renameFieldsTransform({ value1: 'player', value2: 'healing', value3: 'target' }),
//       selectFieldsTransform(['timestamp', 'player', 'healing', 'target']),
//     ]],
//     ['damage_dealt', [
//       filterTransform((row) => row.get('eventType') === 'damage_dealt', 'eventType', 'damage_dealt'),
//       renameFieldsTransform({ value1: 'player', value2: 'damage', value3: 'target' }),
//       selectFieldsTransform(['timestamp', 'player', 'damage', 'target']),
//     ]],
//     ['used_ability_1', [
//       filterTransform((row) => row.get('eventType') === 'used_ability_1', 'eventType', 'used_ability_1'),
//       renameFieldsTransform({ value1: 'player', value2: 'hero' }),
//       selectFieldsTransform(['timestamp', 'player', 'hero']),
//     ]],
//     ['used_ability_2', [
//       filterTransform((row) => row.get('eventType') === 'used_ability_2', 'eventType', 'used_ability_2'),
//       renameFieldsTransform({ value1: 'player', value2: 'hero' }),
//       selectFieldsTransform(['timestamp', 'player', 'hero']),
//     ]],
//     ['did_elim', [
//       filterTransform((row) => row.get('eventType') === 'did_elim', 'eventType', 'did_elim'),
//       renameFieldsTransform({ value1: 'player', value2: 'damage', value3: 'target' }),
//       selectFieldsTransform(['timestamp', 'player', 'damage', 'target']),
//     ]],
//     ['did_final_blow', [
//       filterTransform((row) => row.get('eventType') === 'did_final_blow', 'eventType', 'did_final_blow'),
//       renameFieldsTransform({ value1: 'player', value2: 'damage', value3: 'target' }),
//       selectFieldsTransform(['timestamp', 'player', 'damage', 'target']),
//     ]],
//     ['used_ultimate', [
//       filterTransform((row) => row.get('eventType') === 'used_ultimate', 'eventType', 'used_ultimate'),
//       renameFieldsTransform({ value1: 'player', value2: 'hero' }),
//       selectFieldsTransform(['timestamp', 'player', 'hero']),
//     ]],
//   ])],
// ]);
