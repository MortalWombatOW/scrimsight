import {
  BaseData,
  MapEntity,
  MetricData,
  OWMap,
  PlayerAbility,
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
  'All Time': () => true,
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

export const getHeroImage = (heroName: string): string =>
  `/assets/heroes/${heroNameToNormalized(heroName)}.png`;

export const getAllPlayers = (data: BaseData) => {
  const players: string[] = [];
  data.maps.forEach((map: OWMap) => {
    players.push(...map.team1);
    players.push(...map.team2);
  });
  return Array.from(new Set(players)).sort();
};

export const getTeamInfoForMap = (
  map: OWMap,
): {top: TeamInfo; bottom: TeamInfo} => {
  const {team1, team2, team1Name, team2Name, roles} = map;

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
    .filter(([, role]) => role === 'tank')
    .map(([player]) => player);

  const dps = Object.entries(map.roles)
    .filter(([, role]) => role === 'damage')
    .map(([player]) => player);

  const supports = Object.entries(map.roles)
    .filter(([, role]) => role === 'support')
    .map(([player]) => player);

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

export const getMapEntitiesForTime = (
  entities: MapEntity[],
  time: number,
): MapEntity[] => {
  return entities.filter(
    (entity) => entity.states[time.toString()] != undefined,
  );
};

export const buildMapEntitiesFromData = (
  statuses: PlayerStatus[],
  interactions: PlayerInteraction[],
  abilities: PlayerAbility[],
): MapEntity[] => {
  const coordScale = 50;

  const entities: MapEntity[] = [];
  const getEntity = (
    id: string,
    type:
      | 'player'
      | 'damage'
      | 'healing'
      | 'final blow'
      | 'elimination'
      | 'ability',
  ): MapEntity => {
    const entity = entities.find(
      (entity) => entity.id === id && entity.entityType === type,
    );
    if (entity) {
      return entity;
    }
    const newEntity: MapEntity = {id, states: {}, entityType: type};
    entities.push(newEntity);
    return newEntity;
  };

  const heroMaxHealth: {[hero: string]: number} = {};

  statuses.forEach((status) => {
    const {player, timestamp, hero, x, y, z, health, ultCharge} = status;

    const scaledX = x * coordScale;
    const scaledY = y * coordScale;
    const scaledZ = z * coordScale;

    if (!heroMaxHealth[hero]) {
      heroMaxHealth[hero] = health;
    } else {
      if (timestamp < 120) {
        heroMaxHealth[hero] = Math.max(heroMaxHealth[hero], health);
      }
    }

    const entity = getEntity(player, 'player');
    // entity.label = player;
    // entity.clazz = hero;
    // entity.image = getHeroImage(hero);
    if (!entity.states[timestamp]) {
      entity.states[timestamp] = {
        name: player,
        hero: heroNameToNormalized(hero),
        x: scaledX,
        y: scaledY,
        z: scaledZ,
        health,
        maxHealth: heroMaxHealth[hero],
        ultCharge,
      };
    }
  });
  // console.log(heroMaxHealth);

  interactions.forEach((interaction) => {
    const {player, timestamp, target, type, amount} = interaction;
    const fromPlayer = getEntity(player, 'player');
    const toPlayer = getEntity(target, 'player');
    const fromState = fromPlayer.states[timestamp];
    const toState = toPlayer.states[timestamp];
    if (fromState && toState) {
      // const fromX = fromState.x;
      // const fromY = fromState.y;
      // const toX = toState.x;
      // const toY = toState.y;
      // const fromZ = fromState.z;
      // const toZ = toState.z;
      const edge = getEntity(
        `${player}-${target}-${type}`,
        type as 'damage' | 'healing' | 'final blow' | 'elimination',
      );
      if (!edge.states[timestamp]) {
        edge.states[timestamp] = {
          player,
          target,
          type,
          amount,
        };
      }
    }
  });
  abilities.forEach((ability) => {
    const {player, timestamp, type} = ability;
    const abilityEntity = getEntity(`${player}-${type}-ability`, 'ability');
    if (!abilityEntity.states[timestamp]) {
      abilityEntity.states[timestamp] = {
        player,
        type,
      };
    }
  });
  // console.log(entities);
  return entities;
};

export const getCameraTransformFromMapEntities = (
  entities: MapEntity[],
  time: number,
): number[] => {
  // average all the player positions
  const playerPositions = entities
    .filter((entity) => entity.entityType === 'player')
    .map((entity) => entity.states[time.toString()]);
  const avgX =
    playerPositions.reduce((acc, pos) => acc + (pos['x'] as number), 0) /
    playerPositions.length;
  const avgY =
    playerPositions.reduce((acc, pos) => acc + (pos['y'] as number), 0) /
    playerPositions.length;

  return [avgX, avgY];
  // return `translate(${-avgX * currentScale + width / 2},${
  //   -avgY * currentScale + height / 2
  // }) scale(${currentScale})`;
};

export const getMapTransform = (mapName: string): string | undefined => {
  if (mapName === "King's Row") {
    // return 'scale(1.8) translate(-4550px,2200px) rotate(280deg)';
    return 'scale(1.8) translate(-4950px,1700px) rotate(285deg)';
  }
  return undefined;
};

const heroToRole = {
  'D.Va': 'tank',
  Orisa: 'tank',
  Reinhardt: 'tank',
  Roadhog: 'tank',
  Winston: 'tank',
  Sigma: 'tank',
  'Wrecking Ball': 'tank',
  Zarya: 'tank',
  Ashe: 'damage',
  Bastion: 'damage',
  Cassidy: 'damage',
  McCree: 'damage',
  Doomfist: 'damage',
  Echo: 'damage',
  Genji: 'damage',
  Hanzo: 'damage',
  Junkrat: 'damage',
  Mei: 'damage',
  Pharah: 'damage',
  Reaper: 'damage',
  'Soldier: 76': 'damage',
  Sombra: 'damage',
  Symmetra: 'damage',
  Torbjörn: 'damage',
  Tracer: 'damage',
  Widowmaker: 'damage',
  Ana: 'support',
  Baptiste: 'support',
  Brigitte: 'support',
  Lúcio: 'support',
  Mercy: 'support',
  Moira: 'support',
  Zenyatta: 'support',
};

export const heroToRoleTable = Object.entries(heroToRole).map(
  ([hero, role]) => ({
    hero,
    role,
  }),
);

export const getRoleFromHero = (hero: string): string => {
  return heroToRole[hero] || 'new hero alert??';
};

export const timeWindowRollingAverage = (
  data: {
    time: number;
    val: number;
  }[],
  windowSize: number,
): {
  time: number;
  val: number;
}[] => {
  const rollingAverage: {
    time: number;
    val: number;
  }[] = [];

  const maxTime = Math.max(...data.map((d) => d.time));
  const minTime = Math.min(...data.map((d) => d.time));

  for (let i = 0; i < data.length; i++) {
    const {time} = data[i];
    const windowStart = Math.max(minTime, time - windowSize);
    const windowEnd = Math.min(maxTime, time + windowSize);
    const windowData = data.filter(
      (d) => d.time >= windowStart && d.time <= windowEnd,
    );
    const windowSum = windowData.reduce((acc, d) => acc + (d.val as number), 0);
    const windowAvg = windowSum / (windowEnd - windowStart + 1);
    rollingAverage.push({
      time,
      val: windowAvg,
    });
  }
  return rollingAverage;
};

export const kernelSmoothing = (
  data: {
    time: number;
    val: number;
  }[],
  distWeightFn: (dist: number) => number,
): {
  time: number;
  val: number;
}[] => {
  const smoothedData: {
    time: number;
    val: number;
  }[] = [];

  const maxTime = Math.max(...data.map((d) => d.time));
  const minTime = Math.min(...data.map((d) => d.time));

  for (let i = 0; i < data.length; i++) {
    const {time} = data[i];
    const windowStart = Math.max(minTime, time - 5);
    const windowEnd = Math.min(maxTime, time + 5);
    const windowData = data.filter(
      (d) => d.time >= windowStart && d.time <= windowEnd,
    );
    const windowWeightedSum = {
      time,
      val: windowData.reduce((acc, d) => {
        const dist = Math.abs(d.time - time);
        return acc + (d.val as number) * distWeightFn(dist);
      }, 0),
    };

    smoothedData.push(windowWeightedSum);
  }
  return smoothedData;
};

export const exponentialSmoothing = (
  data: {
    time: number;
    val: number;
  }[],
  alpha: number,
): {
  time: number;
  val: number;
}[] => {
  const fn = (dist: number) =>
    Math.pow(Math.E, -Math.pow(dist, 2) / (alpha + 1));
  return kernelSmoothing(data, fn);
};

export const cumulativeSum = (
  data: {
    time: number;
    val: number;
  }[],
): {
  time: number;
  val: number;
}[] => {
  const cumulativeData: {
    time: number;
    val: number;
  }[] = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const {time, val} = data[i];
    sum += val;
    cumulativeData.push({
      time,
      val: sum,
    });
  }
  return cumulativeData;
};

export const timeBound = (
  data: {
    time: number;
    val: number;
  }[],
  bounds: [number, number],
): {
  time: number;
  val: number;
}[] => {
  const boundedData: {
    time: number;
    val: number;
  }[] = [];
  for (let i = 0; i < data.length; i++) {
    const {time, val} = data[i];
    if (time >= bounds[0] && time <= bounds[1]) {
      boundedData.push({
        time,
        val,
      });
    }
  }
  return boundedData;
};

export function sortBy<T>(data: T[], fn: (d: T) => number): T[] {
  const sortedData = [...data];
  sortedData.sort((a, b) => fn(a) - fn(b));
  return sortedData;
}
