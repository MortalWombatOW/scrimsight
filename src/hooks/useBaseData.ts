import {
  BaseData,
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
} from '../lib/data/types';
import useData from './useData';

const useBaseData: () => [BaseData | undefined, number] = () => {
  const [maps, mapsUpdates] = useData<OWMap>('map');
  const [interactions, updates] =
    useData<PlayerInteraction>('player_interaction');
  const [statuses, statusUpdates] = useData<PlayerStatus>('player_status');
  const [abilities, abilityUpdates] = useData<PlayerAbility>('player_ability');

  const baseData: BaseData | undefined =
    maps && interactions && statuses && abilities
      ? {
          maps,
          interactions,
          statuses,
          abilities,
        }
      : undefined;
  return [baseData, mapsUpdates + updates + statusUpdates + abilityUpdates];
};

export default useBaseData;
