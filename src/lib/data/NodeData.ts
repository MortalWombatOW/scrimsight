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
} from './types';

const match_start: ObjectStoreNode<MatchStart> = {
  name: 'match_start',
  state: 'pending',
  objectStore: 'match_start',
};

const match_end: ObjectStoreNode<MatchEnd> = {
  name: 'match_end',
  state: 'pending',
  objectStore: 'match_end',
};

const round_start: ObjectStoreNode<RoundStart> = {
  name: 'round_start',
  state: 'pending',
  objectStore: 'round_start',
};

const round_end: ObjectStoreNode<RoundEnd> = {
  name: 'round_end',
  state: 'pending',
  objectStore: 'round_end',
};

const setup_complete: ObjectStoreNode<SetupComplete> = {
  name: 'setup_complete',
  state: 'pending',
  objectStore: 'setup_complete',
};

const objective_captured: ObjectStoreNode<ObjectiveCaptured> = {
  name: 'objective_captured',
  state: 'pending',
  objectStore: 'objective_captured',
};

const point_progress: ObjectStoreNode<PointProgress> = {
  name: 'point_progress',
  state: 'pending',
  objectStore: 'point_progress',
};

const payload_progress: ObjectStoreNode<PayloadProgress> = {
  name: 'payload_progress',
  state: 'pending',
  objectStore: 'payload_progress',
};

const hero_spawn: ObjectStoreNode<HeroSpawn> = {
  name: 'hero_spawn',
  state: 'pending',
  objectStore: 'hero_spawn',
};

const hero_swap: ObjectStoreNode<HeroSwap> = {
  name: 'hero_swap',
  state: 'pending',
  objectStore: 'hero_swap',
};

const ability_1_used: ObjectStoreNode<Ability1Used> = {
  name: 'ability_1_used',
  state: 'pending',
  objectStore: 'ability_1_used',
};

const ability_2_used: ObjectStoreNode<Ability2Used> = {
  name: 'ability_2_used',
  state: 'pending',
  objectStore: 'ability_2_used',
};

const offensive_assist: ObjectStoreNode<OffensiveAssist> = {
  name: 'offensive_assist',
  state: 'pending',
  objectStore: 'offensive_assist',
};

const defensive_assist: ObjectStoreNode<DefensiveAssist> = {
  name: 'defensive_assist',
  state: 'pending',
  objectStore: 'defensive_assist',
};

const ultimate_charged: ObjectStoreNode<UltimateCharged> = {
  name: 'ultimate_charged',
  state: 'pending',
  objectStore: 'ultimate_charged',
};

const ultimate_start: ObjectStoreNode<UltimateStart> = {
  name: 'ultimate_start',
  state: 'pending',
  objectStore: 'ultimate_start',
};

const ultimate_end: ObjectStoreNode<UltimateEnd> = {
  name: 'ultimate_end',
  state: 'pending',
  objectStore: 'ultimate_end',
};

const kill: ObjectStoreNode<Kill> = {
  name: 'kill',
  state: 'pending',
  objectStore: 'kill',
};

const damage: ObjectStoreNode<Damage> = {
  name: 'damage',
  state: 'pending',
  objectStore: 'damage',
};

const healing: ObjectStoreNode<Healing> = {
  name: 'healing',
  state: 'pending',
  objectStore: 'healing',
};

const mercy_rez: ObjectStoreNode<MercyRez> = {
  name: 'mercy_rez',
  state: 'pending',
  objectStore: 'mercy_rez',
};

const echo_duplicate_start: ObjectStoreNode<EchoDuplicateStart> = {
  name: 'echo_duplicate_start',
  state: 'pending',
  objectStore: 'echo_duplicate_start',
};

const echo_duplicate_end: ObjectStoreNode<EchoDuplicateEnd> = {
  name: 'echo_duplicate_end',
  state: 'pending',
  objectStore: 'echo_duplicate_end',
};

const dva_demech: ObjectStoreNode<DvaDemech> = {
  name: 'dva_demech',
  state: 'pending',
  objectStore: 'dva_demech',
};

const dva_remech: ObjectStoreNode<DvaRemech> = {
  name: 'dva_remech',
  state: 'pending',
  objectStore: 'dva_remech',
};

const remech_charged: ObjectStoreNode<RemechCharged> = {
  name: 'remech_charged',
  state: 'pending',
  objectStore: 'remech_charged',
};

const player_stat: ObjectStoreNode<PlayerStat> = {
  name: 'player_stat',
  state: 'pending',
  objectStore: 'player_stat',
};

// Define a type for heroes played by each player
interface HeroesPlayed {
  playerName: string;
  playerTeam: string;
  heroes: Set<string>;
}

// Define the transform function
const computeHeroesPlayed: (data: PlayerStat[]) => HeroesPlayed[] = (data) => {
  const heroesPlayedByPlayer: {[key: string]: HeroesPlayed} = {};

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

  return Object.values(heroesPlayedByPlayer);
};

// Define the TransformNode
const heroesPlayedNode: TransformNode<PlayerStat[], HeroesPlayed[]> = {
  name: 'heroes_played',
  state: 'pending',
  transform: computeHeroesPlayed,
  source: 'player_stat',
};

export function loadNodeData(dataManager: DataManager) {
  // object store nodes
  dataManager.addNode(match_start);
  dataManager.addNode(match_end);
  dataManager.addNode(round_start);
  dataManager.addNode(round_end);
  dataManager.addNode(setup_complete);
  dataManager.addNode(objective_captured);
  dataManager.addNode(point_progress);
  dataManager.addNode(payload_progress);
  dataManager.addNode(hero_spawn);
  dataManager.addNode(hero_swap);
  dataManager.addNode(ability_1_used);
  dataManager.addNode(ability_2_used);
  dataManager.addNode(offensive_assist);
  dataManager.addNode(defensive_assist);
  dataManager.addNode(ultimate_charged);
  dataManager.addNode(ultimate_start);
  dataManager.addNode(ultimate_end);
  dataManager.addNode(kill);
  dataManager.addNode(damage);
  dataManager.addNode(healing);
  dataManager.addNode(mercy_rez);
  dataManager.addNode(echo_duplicate_start);
  dataManager.addNode(echo_duplicate_end);
  dataManager.addNode(dva_demech);
  dataManager.addNode(dva_remech);
  dataManager.addNode(remech_charged);
  dataManager.addNode(player_stat);

  // compute nodes
  dataManager.addNode(heroesPlayedNode);
}
