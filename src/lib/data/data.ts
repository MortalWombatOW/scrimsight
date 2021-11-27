import {OWMap} from './types';

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
  const groupedMaps: {[date: string]: OWMap[]} = {};
  maps.forEach((map: OWMap) => {
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
