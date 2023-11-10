import {DataManager} from './DataManager';
import {
  DataNodeName,
  FieldName,
  DataNode,
  ObjectStoreNode,
  TransformNode,
  JoinNode,
  BaseEvent,
  Ability1Used,
  Ability2Used,
  Damage,
  DefensiveAssist,
  DvaDemech,
  DvaRemech,
  EchoDuplicateEnd,
  EchoDuplicateStart,
  Healing,
  HeroSpawn,
  HeroSwap,
  Kill,
  MatchEnd,
  MatchStart,
  MercyRez,
  ObjectiveCaptured,
  OffensiveAssist,
  PayloadProgress,
  PlayerStat,
  PointProgress,
  RemechCharged,
  RoundEnd,
  RoundStart,
  SetupComplete,
  UltimateCharged,
  UltimateEnd,
  UltimateStart,
  WriteNode,
  AlaSQLNode,
} from './types';

const maps_object_store: ObjectStoreNode<any> = {
  name: 'maps_object_store',
  state: 'pending',
  objectStore: 'maps',
};

const match_start_object_store: ObjectStoreNode<MatchStart> = {
  name: 'match_start_object_store',
  state: 'pending',
  objectStore: 'match_start',
};

const match_end_object_store: ObjectStoreNode<MatchEnd> = {
  name: 'match_end_object_store',
  state: 'pending',
  objectStore: 'match_end',
};

const round_start_object_store: ObjectStoreNode<RoundStart> = {
  name: 'round_start_object_store',
  state: 'pending',
  objectStore: 'round_start',
};

const round_end_object_store: ObjectStoreNode<RoundEnd> = {
  name: 'round_end_object_store',
  state: 'pending',
  objectStore: 'round_end',
};

const setup_complete_object_store: ObjectStoreNode<SetupComplete> = {
  name: 'setup_complete_object_store',
  state: 'pending',
  objectStore: 'setup_complete',
};

const objective_captured_object_store: ObjectStoreNode<ObjectiveCaptured> = {
  name: 'objective_captured_object_store',
  state: 'pending',
  objectStore: 'objective_captured',
};

const point_progress_object_store: ObjectStoreNode<PointProgress> = {
  name: 'point_progress_object_store',
  state: 'pending',
  objectStore: 'point_progress',
};

const payload_progress_object_store: ObjectStoreNode<PayloadProgress> = {
  name: 'payload_progress_object_store',
  state: 'pending',
  objectStore: 'payload_progress',
};

const hero_spawn_object_store: ObjectStoreNode<HeroSpawn> = {
  name: 'hero_spawn_object_store',
  state: 'pending',
  objectStore: 'hero_spawn',
};

const hero_swap_object_store: ObjectStoreNode<HeroSwap> = {
  name: 'hero_swap_object_store',
  state: 'pending',
  objectStore: 'hero_swap',
};

const ability_1_used_object_store: ObjectStoreNode<Ability1Used> = {
  name: 'ability_1_used_object_store',
  state: 'pending',
  objectStore: 'ability_1_used',
};

const ability_2_used_object_store: ObjectStoreNode<Ability2Used> = {
  name: 'ability_2_used_object_store',
  state: 'pending',
  objectStore: 'ability_2_used',
};

const offensive_assist_object_store: ObjectStoreNode<OffensiveAssist> = {
  name: 'offensive_assist_object_store',
  state: 'pending',
  objectStore: 'offensive_assist',
};

const defensive_assist_object_store: ObjectStoreNode<DefensiveAssist> = {
  name: 'defensive_assist_object_store',
  state: 'pending',
  objectStore: 'defensive_assist',
};

const ultimate_charged_object_store: ObjectStoreNode<UltimateCharged> = {
  name: 'ultimate_charged_object_store',
  state: 'pending',
  objectStore: 'ultimate_charged',
};

const ultimate_start_object_store: ObjectStoreNode<UltimateStart> = {
  name: 'ultimate_start_object_store',
  state: 'pending',
  objectStore: 'ultimate_start',
};

const ultimate_end_object_store: ObjectStoreNode<UltimateEnd> = {
  name: 'ultimate_end_object_store',
  state: 'pending',
  objectStore: 'ultimate_end',
};

const kill_object_store: ObjectStoreNode<Kill> = {
  name: 'kill_object_store',
  state: 'pending',
  objectStore: 'kill',
};

const damage_object_store: ObjectStoreNode<Damage> = {
  name: 'damage_object_store',
  state: 'pending',
  objectStore: 'damage',
};

const healing_object_store: ObjectStoreNode<Healing> = {
  name: 'healing_object_store',
  state: 'pending',
  objectStore: 'healing',
};

const mercy_rez_object_store: ObjectStoreNode<MercyRez> = {
  name: 'mercy_rez_object_store',
  state: 'pending',
  objectStore: 'mercy_rez',
};

const echo_duplicate_start_object_store: ObjectStoreNode<EchoDuplicateStart> = {
  name: 'echo_duplicate_start_object_store',
  state: 'pending',
  objectStore: 'echo_duplicate_start',
};

const echo_duplicate_end_object_store: ObjectStoreNode<EchoDuplicateEnd> = {
  name: 'echo_duplicate_end_object_store',
  state: 'pending',
  objectStore: 'echo_duplicate_end',
};

const dva_demech_object_store: ObjectStoreNode<DvaDemech> = {
  name: 'dva_demech_object_store',
  state: 'pending',
  objectStore: 'dva_demech',
};

const dva_remech_object_store: ObjectStoreNode<DvaRemech> = {
  name: 'dva_remech_object_store',
  state: 'pending',
  objectStore: 'dva_remech',
};

const remech_charged_object_store: ObjectStoreNode<RemechCharged> = {
  name: 'remech_charged_object_store',
  state: 'pending',
  objectStore: 'remech_charged',
};

const player_stat_object_store: ObjectStoreNode<PlayerStat> = {
  name: 'player_stat_object_store',
  state: 'pending',
  objectStore: 'player_stat',
};

const match_start_write_node: WriteNode<MatchStart> = {
  name: 'match_start_write_node',
  state: 'pending',
  outputObjectStore: 'match_start',
  data: [],
};

const match_end_write_node: WriteNode<MatchEnd> = {
  name: 'match_end_write_node',
  state: 'pending',
  outputObjectStore: 'match_end',
  data: [],
};

const round_start_write_node: WriteNode<RoundStart> = {
  name: 'round_start_write_node',
  state: 'pending',
  outputObjectStore: 'round_start',
  data: [],
};

const round_end_write_node: WriteNode<RoundEnd> = {
  name: 'round_end_write_node',
  state: 'pending',
  outputObjectStore: 'round_end',
  data: [],
};

const setup_complete_write_node: WriteNode<SetupComplete> = {
  name: 'setup_complete_write_node',
  state: 'pending',
  outputObjectStore: 'setup_complete',
  data: [],
};

const objective_captured_write_node: WriteNode<ObjectiveCaptured> = {
  name: 'objective_captured_write_node',
  state: 'pending',
  outputObjectStore: 'objective_captured',
  data: [],
};

const point_progress_write_node: WriteNode<PointProgress> = {
  name: 'point_progress_write_node',
  state: 'pending',
  outputObjectStore: 'point_progress',
  data: [],
};

const payload_progress_write_node: WriteNode<PayloadProgress> = {
  name: 'payload_progress_write_node',
  state: 'pending',
  outputObjectStore: 'payload_progress',
  data: [],
};

const hero_spawn_write_node: WriteNode<HeroSpawn> = {
  name: 'hero_spawn_write_node',
  state: 'pending',
  outputObjectStore: 'hero_spawn',
  data: [],
};

const hero_swap_write_node: WriteNode<HeroSwap> = {
  name: 'hero_swap_write_node',
  state: 'pending',
  outputObjectStore: 'hero_swap',
  data: [],
};

const ability_1_used_write_node: WriteNode<Ability1Used> = {
  name: 'ability_1_used_write_node',
  state: 'pending',
  outputObjectStore: 'ability_1_used',
  data: [],
};

const ability_2_used_write_node: WriteNode<Ability2Used> = {
  name: 'ability_2_used_write_node',
  state: 'pending',
  outputObjectStore: 'ability_2_used',
  data: [],
};

const offensive_assist_write_node: WriteNode<OffensiveAssist> = {
  name: 'offensive_assist_write_node',
  state: 'pending',
  outputObjectStore: 'offensive_assist',
  data: [],
};

const defensive_assist_write_node: WriteNode<DefensiveAssist> = {
  name: 'defensive_assist_write_node',
  state: 'pending',
  outputObjectStore: 'defensive_assist',
  data: [],
};

const ultimate_charged_write_node: WriteNode<UltimateCharged> = {
  name: 'ultimate_charged_write_node',
  state: 'pending',
  outputObjectStore: 'ultimate_charged',
  data: [],
};

const ultimate_start_write_node: WriteNode<UltimateStart> = {
  name: 'ultimate_start_write_node',
  state: 'pending',
  outputObjectStore: 'ultimate_start',
  data: [],
};

const ultimate_end_write_node: WriteNode<UltimateEnd> = {
  name: 'ultimate_end_write_node',
  state: 'pending',
  outputObjectStore: 'ultimate_end',
  data: [],
};

const kill_write_node: WriteNode<Kill> = {
  name: 'kill_write_node',
  state: 'pending',
  outputObjectStore: 'kill',
  data: [],
};

const damage_write_node: WriteNode<Damage> = {
  name: 'damage_write_node',
  state: 'pending',
  outputObjectStore: 'damage',
  data: [],
};

const healing_write_node: WriteNode<Healing> = {
  name: 'healing_write_node',
  state: 'pending',
  outputObjectStore: 'healing',
  data: [],
};

const mercy_rez_write_node: WriteNode<MercyRez> = {
  name: 'mercy_rez_write_node',
  state: 'pending',
  outputObjectStore: 'mercy_rez',
  data: [],
};

const echo_duplicate_start_write_node: WriteNode<EchoDuplicateStart> = {
  name: 'echo_duplicate_start_write_node',
  state: 'pending',
  outputObjectStore: 'echo_duplicate_start',
  data: [],
};

const echo_duplicate_end_write_node: WriteNode<EchoDuplicateEnd> = {
  name: 'echo_duplicate_end_write_node',
  state: 'pending',
  outputObjectStore: 'echo_duplicate_end',
  data: [],
};

const dva_demech_write_node: WriteNode<DvaDemech> = {
  name: 'dva_demech_write_node',
  state: 'pending',
  outputObjectStore: 'dva_demech',
  data: [],
};

const dva_remech_write_node: WriteNode<DvaRemech> = {
  name: 'dva_remech_write_node',
  state: 'pending',
  outputObjectStore: 'dva_remech',
  data: [],
};

const remech_charged_write_node: WriteNode<RemechCharged> = {
  name: 'remech_charged_write_node',
  state: 'pending',
  outputObjectStore: 'remech_charged',
  data: [],
};

const player_stat_write_node: WriteNode<PlayerStat> = {
  name: 'player_stat_write_node',
  state: 'pending',
  outputObjectStore: 'player_stat',
  data: [],
};

// Define a type for heroes played by each player
interface HeroesPlayed {
  playerName: string;
  playerTeam: string;
  heroes: Set<string>;
}

// Define the TransformNode
const heroesPlayedNode: TransformNode<PlayerStat[], HeroesPlayed[]> = {
  name: 'heroes_played',
  state: 'pending',
  transform: (data) => {
    const heroesPlayedByPlayer: {[key: string]: HeroesPlayed} = {};
    console.log('heroesPlayedByPlayer');
    console.log(data);
    data.forEach((record) => {
      const key = `${record.playerName}_${record.playerTeam}`;
      if (!heroesPlayedByPlayer[key]) {
        heroesPlayedByPlayer[key] = {
          playerName: record.playerName,
          playerTeam: record.playerTeam,
          heroes: new Set(),
        };
      }
      heroesPlayedByPlayer[key].heroes.add(record.playerHero);
    });

    console.log(heroesPlayedByPlayer);
    return Object.values(heroesPlayedByPlayer);
  },
  source: 'player_stat_object_store',
};

interface MapOverview {
  mapId: number;
  mapName: string;
  team1: string;
  team2: string;
  team1Score: number;
  team2Score: number;
  team1Players: string[];
  team2Players: string[];
  rounds: {
    roundNumber: number;
    team1Score: number;
    team2Score: number;
  }[];
}
[];

const mapOverviewNode: DataNode<any> =
  // {
  //   name: 'map_overview_join_node',
  //   state: 'pending',
  //   sources: [
  //     ['match_start_object_store', 'mapId'],
  //     ['match_end_object_store', 'mapId'],
  //     ['round_start_object_store', 'mapId'],
  //     ['round_end_object_store', 'mapId'],
  //   ],
  // } as JoinNode<any>,
  // {
  //   name: 'map_overview_transform_node',
  //   state: 'pending',
  //   transform: (data) => {
  //     const mapOverview: MapOverview = {
  //       mapId: data[0].mapId,
  //       mapName: data[0].mapName,
  //       team1: data[0].team1,
  //       team2: data[0].team2,
  //       team1Score: 0,
  //       team2Score: 0,
  //       team1Players: [],
  //       team2Players: [],
  //       rounds: [],
  //     };
  //     data.forEach((record) => {
  //       if (record.roundNumber) {
  //         mapOverview.rounds.push({
  //           roundNumber: record.roundNumber,
  //           team1Score: record.team1Score,
  //           team2Score: record.team2Score,
  //         });
  //       }
  //       if (record.team1Score) {
  //         mapOverview.team1Score = record.team1Score;
  //       }
  //       if (record.team2Score) {
  //         mapOverview.team2Score = record.team2Score;
  //       }
  //       if (record.playerTeam === mapOverview.team1) {
  //         mapOverview.team1Players.push(record.playerName);
  //       } else if (record.playerTeam === mapOverview.team2) {
  //         mapOverview.team2Players.push(record.playerName);
  //       }
  //     });
  //     return mapOverview;
  //   },
  // } as TransformNode<any, any>,
  {
    name: 'map_overview_alasql',
    state: 'pending',
    sql: `
      SELECT
          match_start.mapId,
          match_end.mapId,
          match_start.mapName,
          match_start.team1Name,
          match_start.team2Name,
          match_end.team1Score,
          match_end.team2Score,
          maps.name,
          maps.fileModified

      FROM ? as match_start JOIN ? as match_end 
      ON match_start.mapId = match_end.mapId 
      JOIN ? as maps ON match_start.mapId = maps.mapId
      `,
    sources: [
      'match_start_object_store',
      'match_end_object_store',
      'maps_object_store',
    ],
  } as AlaSQLNode<any>;

export function loadNodeData(dataManager: DataManager) {
  // object store nodes
  dataManager.addNode(maps_object_store);
  dataManager.addNode(match_start_object_store);
  dataManager.addNode(match_end_object_store);
  dataManager.addNode(round_start_object_store);
  dataManager.addNode(round_end_object_store);
  dataManager.addNode(setup_complete_object_store);
  dataManager.addNode(objective_captured_object_store);
  dataManager.addNode(point_progress_object_store);
  dataManager.addNode(payload_progress_object_store);
  dataManager.addNode(hero_spawn_object_store);
  dataManager.addNode(hero_swap_object_store);
  dataManager.addNode(ability_1_used_object_store);
  dataManager.addNode(ability_2_used_object_store);
  dataManager.addNode(offensive_assist_object_store);
  dataManager.addNode(defensive_assist_object_store);
  dataManager.addNode(ultimate_charged_object_store);
  dataManager.addNode(ultimate_start_object_store);
  dataManager.addNode(ultimate_end_object_store);
  dataManager.addNode(kill_object_store);
  dataManager.addNode(damage_object_store);
  dataManager.addNode(healing_object_store);
  dataManager.addNode(mercy_rez_object_store);
  dataManager.addNode(echo_duplicate_start_object_store);
  dataManager.addNode(echo_duplicate_end_object_store);
  dataManager.addNode(dva_demech_object_store);
  dataManager.addNode(dva_remech_object_store);
  dataManager.addNode(remech_charged_object_store);
  dataManager.addNode(player_stat_object_store);

  // write nodes
  dataManager.addNode(match_start_write_node);
  dataManager.addNode(match_end_write_node);
  dataManager.addNode(round_start_write_node);
  dataManager.addNode(round_end_write_node);
  dataManager.addNode(setup_complete_write_node);
  dataManager.addNode(objective_captured_write_node);
  dataManager.addNode(point_progress_write_node);
  dataManager.addNode(payload_progress_write_node);
  dataManager.addNode(hero_spawn_write_node);
  dataManager.addNode(hero_swap_write_node);
  dataManager.addNode(ability_1_used_write_node);
  dataManager.addNode(ability_2_used_write_node);
  dataManager.addNode(offensive_assist_write_node);
  dataManager.addNode(defensive_assist_write_node);
  dataManager.addNode(ultimate_charged_write_node);
  dataManager.addNode(ultimate_start_write_node);
  dataManager.addNode(ultimate_end_write_node);
  dataManager.addNode(kill_write_node);
  dataManager.addNode(damage_write_node);
  dataManager.addNode(healing_write_node);
  dataManager.addNode(mercy_rez_write_node);
  dataManager.addNode(echo_duplicate_start_write_node);
  dataManager.addNode(echo_duplicate_end_write_node);
  dataManager.addNode(dva_demech_write_node);
  dataManager.addNode(dva_remech_write_node);
  dataManager.addNode(remech_charged_write_node);
  dataManager.addNode(player_stat_write_node);

  // compute nodes
  // dataManager.addNode(heroesPlayedNode);
  dataManager.addNode(mapOverviewNode);

  // dataManager.executeNode('map_overview_alasql');
}
