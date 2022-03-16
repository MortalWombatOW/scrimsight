import {
  OWMap,
  PlayerInteraction,
  PlayerStatus,
  Statistic,
  TeamInfo,
} from 'lib/data/types';
import {heroNameToNormalized} from 'lib/string';

const dayMillis = 1000 * 60 * 60 * 24;

const timeFilters: {[key: string]: (map: OWMap) => boolean} = {
  Today: (map: OWMap) => map.timestamp >= Date.now() - dayMillis,
  Yesterday: (map: OWMap) => map.timestamp >= Date.now() - 2 * dayMillis,
  'Last Week': (map: OWMap) => map.timestamp >= Date.now() - 7 * dayMillis,
  'Last Month': (map: OWMap) => map.timestamp >= Date.now() - 30 * dayMillis,
  'Last Year': (map: OWMap) => map.timestamp >= Date.now() - 365 * dayMillis,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  'All Time': (map: OWMap) => true,
};

export const groupMapsByDate = (
  maps: OWMap[] | undefined,
): {[date: string]: OWMap[]} => {
  if (maps == undefined) {
    return {};
  }
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
  playerOffset: 0 | 1,
): string => {
  return map[team].filter((player: string) => map.roles[player] === role)[
    playerOffset
  ];
};

export const getMapImage = (mapName: string): string =>
  `/public/assets/maps/${mapName
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll(`'`, '')}.jpg`;

export const getHeroImage = (heroName: string): string =>
  `/public/assets/heroes/${heroNameToNormalized(heroName)}.png`;

export const getTeamInfoForMap = (
  map: OWMap,
): {top: TeamInfo; bottom: TeamInfo} => {
  const {team1, team2, team1Name, team2Name, roles, timestamp} = map;

  let topName = team1Name;
  let bottomName = team2Name;
  let topTeam = team1;
  let bottomTeam = team2;
  if (topName.localeCompare(bottomName) > 0) {
    const temp = team1;
    topTeam = team2;
    bottomTeam = temp;
    const tempName = team1Name;
    topName = team2Name;
    bottomName = tempName;
  }

  const tanks = Object.entries(roles)
    .filter(([player, role]) => role === 'tank')
    .map(([player, role]) => player);

  const dps = Object.entries(map.roles)
    .filter(([player, role]) => role === 'damage')
    .map(([player, role]) => player);

  const supports = Object.entries(map.roles)
    .filter(([player, role]) => role === 'support')
    .map(([player, role]) => player);

  const topTanks = tanks.filter((tank) => topTeam.includes(tank));
  const bottomTanks = tanks.filter((tank) => bottomTeam.includes(tank));
  const topDps = dps.filter((dps) => topTeam.includes(dps));
  const bottomDps = dps.filter((dps) => bottomTeam.includes(dps));
  const topSupports = supports.filter((support) => topTeam.includes(support));
  const bottomSupports = supports.filter((support) =>
    bottomTeam.includes(support),
  );

  return {
    top: {
      name: topName,
      tanks: topTanks,
      dps: topDps,
      supports: topSupports,
    },
    bottom: {
      name: bottomName,
      tanks: bottomTanks,
      dps: bottomDps,
      supports: bottomSupports,
    },
  };
};

export const getPlayersToTeam = (map: OWMap): {[player: string]: string} => {
  const {team1, team2} = map;
  const playersToTeam: {[player: string]: string} = {};
  team1.forEach((player) => {
    playersToTeam[player] = map.team1Name;
  });
  team2.forEach((player) => {
    playersToTeam[player] = map.team2Name;
  });
  return playersToTeam;
};

export const getInteractionStat = (
  interactions: PlayerInteraction[],
  method: 'sum' | 'count',
  statType: 'damage' | 'healing' | 'final blow',
  by: 'player' | 'timestamp' | 'target',
): Statistic =>
  interactions.reduce((acc, interaction) => {
    const {type, amount} = interaction;
    if (type !== statType) {
      return acc;
    }
    const group = interaction[by];
    if (!acc[group]) {
      acc[group] = 0;
    }
    if (method === 'sum') {
      acc[group] += amount;
    } else if (method === 'count') {
      acc[group] += 1;
    }
    return acc;
  }, {});

export const getHeroesByPlayer = (
  statuses: PlayerStatus[],
): {[player: string]: {[hero: string]: number}} => {
  const heroesByPlayer: {[player: string]: {[hero: string]: number}} = {};
  statuses.forEach((status) => {
    const {player, hero} = status;
    if (hero == '') {
      return;
    }
    if (!heroesByPlayer[player]) {
      heroesByPlayer[player] = {};
    }
    if (!heroesByPlayer[player][hero]) {
      heroesByPlayer[player][hero] = 0;
    }
    heroesByPlayer[player][hero] += 1;
  });
  return heroesByPlayer;
};

export const getMostCommonHeroes = (heroesByPlayer: {
  [player: string]: {[hero: string]: number};
}): {[player: string]: string} => {
  const mostCommonHeroes: {[player: string]: string} = {};
  Object.entries(heroesByPlayer).forEach(([player, heroes]) => {
    const sortedHeroes = Object.entries(heroes).sort((a, b) => b[1] - a[1]);
    mostCommonHeroes[player] = sortedHeroes[0][0];
  });
  return mostCommonHeroes;
};
