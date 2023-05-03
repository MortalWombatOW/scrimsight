import React from 'react';
import useQueries, {useQuery} from '~/hooks/useQueries';


const GraphicSummary = ({mapId}: {mapId: number}) => {
  const [{
    GraphicSummary_damage: damage
  }, tick] = useQueries(
    [
      {
        name: 'GraphicSummary_damage',
        query: `select \
        damage.[Attacker Name] as [Player], \
        damage.[Attacker Team] as [Team], \
        damage.[Victim Name] as [Target], \
        damage.[Victim Team] as [Target Team], \
        sum(damage.[Event Damage]) as [Damage] \
      from damage \
      where damage.[Map ID] = ${mapId} \
      group by damage.[Attacker Name], damage.[Attacker Team],\
      damage.[Victim Name], damage.[Victim Team]`,
      },
      {
        name: 'GraphicSummary_healing_' + mapId,
        query: `select \
        healing.[Healer Name] as [Player], \
        healing.[Healer Team] as [Team], \
        healing.[Healee Name] as [Target], \
        healing.[Healee Team] as [Target Team], \
        sum(healing.[Event Healing]) as [Healing] \
      from healing \
      where healing.[Map ID] = ${mapId} \
      group by healing.[Healer Name], healing.[Healer Team],\
      healing.[Healee Name], healing.[Healee Team]`,
      },
    ],
    [mapId],
  );

  return (
    <div>
      test {damage?.length}
      </div>
  );

};

export default GraphicSummary;
