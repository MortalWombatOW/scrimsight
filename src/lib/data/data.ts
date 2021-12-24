import {
  Dataset,
  Extractor,
  Metric,
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
  Transform,
} from './types';

const dayMillis = 1000 * 60 * 60 * 24;

const timeFilters: {[key: string]: (map: OWMap) => boolean} = {
  Today: (map: OWMap) => map.timestamp >= Date.now() - dayMillis,
  Yesterday: (map: OWMap) => map.timestamp >= Date.now() - 2 * dayMillis,
  'Last Week': (map: OWMap) => map.timestamp >= Date.now() - 7 * dayMillis,
  'Last Month': (map: OWMap) => map.timestamp >= Date.now() - 30 * dayMillis,
  'Last Year': (map: OWMap) => map.timestamp >= Date.now() - 365 * dayMillis,
  'All Time': (map: OWMap) => true,
};

export const groupMapsByDate = (maps: OWMap[]): {[date: string]: OWMap[]} => {
  const sortedMaps = maps.sort((a, b) => b.timestamp - a.timestamp);
  const groupedMaps: {[date: string]: OWMap[]} = {};
  sortedMaps.forEach((map: OWMap) => {
    const firstTimeMatch = Object.keys(timeFilters).find((key: string) =>
      timeFilters[key](map),
    );
    if (firstTimeMatch) {
      if (!groupedMaps[firstTimeMatch]) {
        groupedMaps[firstTimeMatch] = [];
      }
      groupedMaps[firstTimeMatch].push(map);
    }
  });
  return groupedMaps;
};

export const getPlayer = (
  map: OWMap,
  team: 'team1' | 'team2',
  role: 'tank' | 'support' | 'damage',
  offset: 0 | 1,
): string => {
  return map[team].filter((player: string) => map.roles[player] === role)[
    offset
  ];
};

export const extractDamage: Extractor = (
  maps: OWMap[],
  status: PlayerStatus[],
  abilities: PlayerAbility[],
  interactions: PlayerInteraction[],
) => {
  // console.log(maps, status, abilities, interactions);
  return {
    columns: [
      {
        name: 'mapId',
        type: 'number',
      },
      {
        name: 'timestamp',
        type: 'number',
      },
      {
        name: 'player',
        type: 'string',
      },
      {
        name: 'target',
        type: 'string',
      },
      {
        name: 'amount',
        type: 'number',
      },
    ],
    rows: interactions
      .filter((interaction: PlayerInteraction) => interaction.type === 'damage')
      .map((interaction: PlayerInteraction) => [
        interaction.mapId,
        interaction.timestamp,
        interaction.player,
        interaction.target,
        interaction.amount,
      ]),
  };
};

export const makeAggregation = (
  by: string[],
  col: string,
  method: string,
  newName?: string,
): Transform => {
  return (dataset: Dataset): Dataset => {
    const colIdx = dataset.columns.findIndex((c: Metric) => c.name === col);
    const groupIdx = by.map((col: string) =>
      dataset.columns.findIndex((c: Metric) => c.name === col),
    );
    // console.log(groupIdx);
    const newDataset: Dataset = {
      columns: [
        ...groupIdx.map((idx: number) => dataset.columns[idx]),
        {
          name: newName || `${method} (${col})`,
          type: 'number',
        },
      ],
      rows: [],
    };

    dataset.rows.forEach((row: any[]) => {
      let groupIdxIfExists = newDataset.rows.findIndex((r: any[]) =>
        groupIdx.every((idx: number, i: number) => r[i] === row[idx]),
      );
      if (groupIdxIfExists === -1) {
        const groupCols = groupIdx.map((idx: number) => row[idx]);
        newDataset.rows.push([...groupCols, 0]);
        groupIdxIfExists = newDataset.rows.length - 1;
      }
      const groupRow = newDataset.rows[groupIdxIfExists];
      if (method === 'sum') {
        groupRow[groupRow.length - 1] += row[colIdx];
      }
    });

    return newDataset;
  };
};

export const sliceDataset = (
  dataset: Dataset,
  start: number,
  end: number,
): Dataset => {
  const newDataset: Dataset = {
    columns: dataset.columns,
    rows: dataset.rows.slice(start, end),
  };
  return newDataset;
};

// export const makeCumulative = (
//   colsToSumOver: string[],
//   colsToHoldConstant: string[],
//   col: string,
//   newName?: string,
// ): Transform => {
