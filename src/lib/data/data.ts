import {MapEntity} from 'lib/data/types';
import {heroNameToNormalized} from 'lib/string';

const dayMillis = 1000 * 60 * 60 * 24;

const timeFilters: {[key: string]: (timestamp: number) => boolean} = {
  Today: (timestamp: number) => timestamp >= Date.now() - dayMillis,
  Yesterday: (timestamp: number) => timestamp >= Date.now() - 2 * dayMillis,
  'Last Week': (timestamp: number) => timestamp >= Date.now() - 7 * dayMillis,
  'Last Month': (timestamp: number) => timestamp >= Date.now() - 30 * dayMillis,
  'Last Year': (timestamp: number) => timestamp >= Date.now() - 365 * dayMillis,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  'All Time': () => true,
};

export const groupMapsByDate = (
  timestamps: number[] | undefined,
): {[date: string]: number[]} => {
  if (timestamps == undefined) {
    return {};
  }
  const sortedMaps = timestamps.sort();
  const groupedMaps: {[date: string]: number[]} = {};
  sortedMaps.forEach((map: number) => {
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
  map: number,
  team: 'team1' | 'team2',
  role: 'tank' | 'support' | 'damage',
  playerOffset: 0 | 1,
): string => {
  // return map[team].filter((player: string) => map.roles[player] === role)[
  //   playerOffset
  // ];
  return 'todo';
};

export const getHeroImage = (
  heroName: string,
  rounded: boolean = true,
): string =>
  `/assets/heroes/${rounded && 'rounded/'}${heroNameToNormalized(
    heroName,
  )}.png`;

export const getMapEntitiesForTime = (
  entities: MapEntity[],
  time: number,
): MapEntity[] => {
  return entities.filter(
    (entity) => entity.states[time.toString()] != undefined,
  );
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
