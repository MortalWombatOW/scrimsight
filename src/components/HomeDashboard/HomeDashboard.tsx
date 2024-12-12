
import WidgetContainer from '../../WidgetContainer';
import WidgetProvider from '../../WidgetProvider';
import IntentControls from '~/components/ControlPanel/IntentControls';
import { Intent } from '~/Widget';
import { OverwatchHero, OverwatchMap, OverwatchMode } from '~/lib/data/hero';
import { useState } from 'react';
import { useWombatDataNode } from 'wombat-data-framework';
const HomeDashboard = () => {
  const [intent, setIntent] = useState<Intent>({});

  const [playersNode] = useWombatDataNode('unique_player_names');
  const [mapNamesNode] = useWombatDataNode('unique_map_names');
  const [mapIdsNode] = useWombatDataNode('unique_map_ids');
  const [modesNode] = useWombatDataNode('unique_game_modes');
  const [teamNamesNode] = useWombatDataNode('unique_team_names');


  const possibleValues = {
    players: playersNode?.getOutput<{playerName: string}[]>()?.map(player => player.playerName) ?? [],
    maps: mapIdsNode?.getOutput<{mapId: string}[]>()?.map(map => map.mapId) ?? [],
    mapNames: mapNamesNode?.getOutput<{mapName: OverwatchMap}[]>()?.map(map => map.mapName) ?? [],
    modes: modesNode?.getOutput<{mapType: OverwatchMode}[]>()?.map(mode => mode.mapType) ?? [],
    teams: teamNamesNode?.getOutput<{teamName: string}[]>()?.map(team => team.teamName) ?? [],
    heroes: ['Ana', 'Ashe', 'Baptiste'] as OverwatchHero[],
    metrics: ['Damage Done', 'Healing Done', 'Eliminations'],
  };

  return (
    <WidgetProvider>
      <div>
        <div>
          <IntentControls intent={intent} setIntent={setIntent} possibleValues={possibleValues} size='small' />
        </div>
        <div>      
           {JSON.stringify(intent)}
        </div>
        <div style={{padding: '50px'}}>
          <WidgetContainer intent={intent} />
      </div>
      </div>
    </WidgetProvider>
  );
};

export default HomeDashboard;
