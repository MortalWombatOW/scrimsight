import {join} from './data';
import {extractPlayerDamage, extractPlayerHealing} from './extractors';
import {transformPlayerDamage, transformPlayerHealing} from './transformers';
import {
  Dataset,
  Metric,
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
  SimpleMetric,
} from './types';

export const metricsMap: {[key: string]: Metric} = {
  'player.damage': {
    displayName: 'Damage',
    extractor: extractPlayerDamage,
    transforms: [],
    columns: [
      {
        name: 'damage',
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
        name: 'mapId',
        type: 'number',
      },
    ],
  },
  'player.healing': {
    displayName: 'Healing',
    extractor: extractPlayerHealing,
    transforms: [transformPlayerHealing],
    columns: [
      {
        name: 'healing',
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
        name: 'mapId',
        type: 'number',
      },
    ],
  },
  // 'player.damageTaken': {
  //     displayName: 'Damage Taken',
  //     extractor: extractPlayerDamageTaken,
  //     transformer: transformPlayerDamageTaken,
  // },
  // 'player.eliminations': {
  //     displayName: 'Eliminations',
  //     extractor: extractPlayerEliminations,
  //     transformer: transformPlayerEliminations,
  // },
  // 'player.finalBlows': {
  //     displayName: 'Final Blows',
  //     extractor: extractPlayerFinalBlows,
  //     transformer: transformPlayerFinalBlows,
  // },
  // 'player.deaths': {
  //     displayName: 'Deaths',
  //     extractor: extractPlayerDeaths,
  //     transformer: transformPlayerDeaths,
  // },

  // 'player.heroes': {
  //     displayName: 'Heroes',
  //     extractor: extractPlayerHeroes,
  //     transformer: transformPlayerHeroes,
  // },

  //   'player.kills_per_death': {
  //     displayName: 'K/D',
  //     type: 'divide',
  //     numerator: 'player.eliminations',
  //     denominator: 'player.deaths',
  //     isSingleValue: true,
  //   },
  // 'player.hero_damage': {
  //   displayName: 'Hero Damage',
  //   type: 'join',
  //   from: ['player.heroes', 'player.damage'],
  //   on: 'timestamp',
  //   select: ['player', 'hero', 'damage'],
  //   columns: [
  //     {
  //       name: 'player',
  //       type: 'string',

  // },
  // 'player.hero_healing': {
  //   displayName: 'Hero Healing',
  //   type: 'join',
  //   from: ['player.heroes', 'player.healing'],
  //   on: 'timestamp',
  //   select: ['player', 'hero', 'healing'],
  // },
};

export const computeSimpleMetric = (
  metric: string,
  maps: OWMap[],
  status: PlayerStatus[],
  abilities: PlayerAbility[],
  interactions: PlayerInteraction[],
): Dataset =>
  (metricsMap[metric] as SimpleMetric).transforms.reduce(
    (dataset, transform) => transform(dataset),
    (metricsMap[metric] as SimpleMetric).extractor(
      maps,
      status,
      abilities,
      interactions,
    ),
  );

// select metrics
// each returns a dataset
// each has 1 unique column for the metric and possible columns shared with other metrics
// join all the datasets together
// on
