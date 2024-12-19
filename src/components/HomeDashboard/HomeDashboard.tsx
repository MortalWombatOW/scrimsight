
import WidgetContainer from '../../WidgetContainer';
import WidgetProvider, { useWidgetRegistry } from '../../WidgetProvider';
import IntentControls from '~/components/ControlPanel/IntentControls';
import { Intent } from '~/Widget';
import { OverwatchHero, OverwatchMap, OverwatchMode } from '~/lib/data/hero';
import { useMemo, useState } from 'react';
import { useWombatDataNode } from 'wombat-data-framework';
import { Card, CardContent, CardHeader } from '@mui/material';
import { PLAYER_METRICS } from '~/WombatDataFrameworkSchema';


// const Outline: React.FC<{ intent: Intent }> = ({ intent }) => {
//   const widgetRegistry = useWidgetRegistry();

//   const relevantWidgets = useMemo(() => widgetRegistry.getScoredBids(intent), [widgetRegistry, intent]);

//   return <Card style={{ marginBottom: 10 }}>
//     <CardHeader title="Outline" />
//     <CardContent>
//       {relevantWidgets.map((widget) => <div>{widget.displayName}</div>)}
//     </CardContent>
//   </Card>;
// };


const HomeDashboard = () => {
  const [intent, setIntent] = useState<Intent>({});

  const [playersNode] = useWombatDataNode('unique_player_names');
  const [mapNamesNode] = useWombatDataNode('unique_map_names');
  const [matchIdsNode] = useWombatDataNode('unique_map_ids');
  const [modesNode] = useWombatDataNode('unique_game_modes');
  const [teamNamesNode] = useWombatDataNode('unique_team_names');

  const possibleValues = {
    players: playersNode?.getOutput<{ playerName: string }[]>()?.map(player => player.playerName) ?? [],
    matches: matchIdsNode?.getOutput<{ matchId: string }[]>()?.map(map => map.matchId) ?? [],
    maps: mapNamesNode?.getOutput<{ mapName: OverwatchMap }[]>()?.map(map => map.mapName) ?? [],
    modes: modesNode?.getOutput<{ mapType: OverwatchMode }[]>()?.map(mode => mode.mapType) ?? [],
    teams: teamNamesNode?.getOutput<{ teamName: string }[]>()?.map(team => team.teamName) ?? [],
    heroes: ['Ana', 'Ashe', 'Baptiste'] as OverwatchHero[],
    metrics: PLAYER_METRICS,
  };

  return (
    <WidgetProvider widgetGridWidth={300} widgetGridHeight={200}>
      <div>
        <div>
          <IntentControls intent={intent} setIntent={setIntent} possibleValues={possibleValues} size='small' />
        </div>

        <div style={{ padding: '50px' }}>
          {/* <Outline intent={intent} /> */}
          <WidgetContainer intent={intent} />
        </div>
      </div>
    </WidgetProvider>
  );
};

export default HomeDashboard;
