import {
  Extractor,
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
} from './types';

export const extractPlayerDamage: Extractor = (
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

export const extractPlayerHealing: Extractor = (
  maps: OWMap[],
  status: PlayerStatus[],
  abilities: PlayerAbility[],
  interactions: PlayerInteraction[],
) => {
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
        name: 'healing',
        type: 'number',
      },
    ],
    rows: interactions
      .filter(
        (interaction: PlayerInteraction) => interaction.type === 'healing',
      )
      .map((interaction: PlayerInteraction) => [
        interaction.mapId,
        interaction.timestamp,
        interaction.player,
        interaction.target,
        interaction.amount,
      ]),
  };
};

export const extractStatus: Extractor = (
  maps: OWMap[],
  status: PlayerStatus[],
  abilities: PlayerAbility[],
  interactions: PlayerInteraction[],
) => {
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
        name: 'x',
        type: 'number',
      },
      {
        name: 'y',
        type: 'number',
      },
      {
        name: 'z',
        type: 'number',
      },
      {
        name: 'health',
        type: 'number',
      },
      {
        name: 'ultCharge',
        type: 'number',
      },
    ],
    rows: status.map((status: PlayerStatus) => [
      status.mapId,
      status.timestamp,
      status.player,
      status.x,
      status.y,
      status.z,
      status.health,
      status.ultCharge,
    ]),
  };
};

export const extractAbilities: Extractor = (
  maps: OWMap[],
  status: PlayerStatus[],
  abilities: PlayerAbility[],
  interactions: PlayerInteraction[],
) => {
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
        name: 'ability',
        type: 'string',
      },
    ],
    rows: abilities.map((ability: PlayerAbility) => [
      ability.mapId,
      ability.timestamp,
      ability.player,
      ability.type,
    ]),
  };
};

export const extractInteractions: Extractor = (
  maps: OWMap[],
  status: PlayerStatus[],
  abilities: PlayerAbility[],
  interactions: PlayerInteraction[],
) => {
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
        name: 'type',
        type: 'string',
      },
      {
        name: 'amount',
        type: 'number',
      },
    ],
    rows: interactions.map((interaction: PlayerInteraction) => [
      interaction.mapId,
      interaction.timestamp,
      interaction.player,
      interaction.target,
      interaction.type,
      interaction.amount,
    ]),
  };
};
