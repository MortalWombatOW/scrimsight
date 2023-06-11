import {useEffect, useState, useMemo} from 'react';
import {buildQueryFromSpec} from '../pages/AnalysisPage/AnalysisPage';
import useQueries from './useQueries';

const useScrimsightEvents = (mapId: number): [object[], boolean] => {
  const [loaded, setLoaded] = useState(false);
  const [
    {
      ScrimsightEvents_players: players,
      ScrimsightEvents_damage: damage,
      ScrimsightEvents_healing: healing,
      ScrimsightEvents_kill: kill,
      ScrimsightEvents_ability_1_used: ability1,
      ScrimsightEvents_ability_2_used: ability2,
      ScrimsightEvents_defensive_assist: defensiveAssist,
      ScrimsightEvents_dva_remech: dvaRemech,
      ScrimsightEvents_dva_demech: dvaDemech,
      ScrimsightEvents_echo_duplication_start: echoDuplicationStart,
      ScrimsightEvents_echo_duplication_end: echoDuplicationEnd,
      ScrimsightEvents_hero_spawn: heroSpawn,
      ScrimsightEvents_hero_swap: heroSwap,
      ScrimsightEvents_match_start: matchStart,
      ScrimsightEvents_match_end: matchEnd,
      ScrimsightEvents_mercy_res: mercyRes,
      ScrimsightEvents_objective_captured: objectiveCaptured,
      ScrimsightEvents_offensive_assist: offensiveAssist,
      ScrimsightEvents_payload_progress: payloadProgress,
      ScrimsightEvents_point_progress: pointProgress,
      ScrimsightEvents_remech_charged: remechCharged,
      ScrimsightEvents_round_start: roundStart,
      ScrimsightEvents_round_end: roundEnd,
      ScrimsightEvents_setup_complete: setupComplete,
      ScrimsightEvents_ultimate_charged: ultimateCharged,
      ScrimsightEvents_ultimate_end: ultimateEnd,
      ScrimsightEvents_ultimate_start: ultimateStart,
    },
  ] = useQueries(
    [
      {
        name: 'ScrimsightEvents_players',
        query: `select \
          player_stat.[Player Name] as [Player Name], \
          player_stat.[Player Team] as [Player Team] \
        from player_stat \
        where player_stat.[Map ID] = ${mapId} \
        group by player_stat.[Player Name], player_stat.[Player Team] \
        order by player_stat.[Player Team] asc, player_stat.[Player Name] asc`,
      },
      {
        name: 'ScrimsightEvents_damage',
        query: buildQueryFromSpec('damage', mapId),
      },
      {
        name: 'ScrimsightEvents_healing',
        query: buildQueryFromSpec('healing', mapId),
      },
      {
        name: 'ScrimsightEvents_kill',
        query: buildQueryFromSpec('kill', mapId),
      },
      {
        name: 'ScrimsightEvents_ability_1_used',
        query: buildQueryFromSpec('ability_1_used', mapId),
      },
      {
        name: 'ScrimsightEvents_ability_2_used',
        query: buildQueryFromSpec('ability_2_used', mapId),
      },
      {
        name: 'ScrimsightEvents_defensive_assist',
        query: buildQueryFromSpec('defensive_assist', mapId),
      },
      {
        name: 'ScrimsightEvents_dva_remech',
        query: buildQueryFromSpec('dva_remech', mapId),
      },
      {
        name: 'ScrimsightEvents_dva_demech',
        query: buildQueryFromSpec('dva_demech', mapId),
      },
      {
        name: 'ScrimsightEvents_echo_duplication_start',
        query: buildQueryFromSpec('echo_duplicate_start', mapId),
      },
      {
        name: 'ScrimsightEvents_echo_duplication_end',
        query: buildQueryFromSpec('echo_duplicate_end', mapId),
      },
      {
        name: 'ScrimsightEvents_hero_spawn',
        query: buildQueryFromSpec('hero_spawn', mapId),
      },
      {
        name: 'ScrimsightEvents_hero_swap',
        query: buildQueryFromSpec('hero_swap', mapId),
      },
      {
        name: 'ScrimsightEvents_match_start',
        query: buildQueryFromSpec('match_start', mapId),
      },
      {
        name: 'ScrimsightEvents_match_end',
        query: buildQueryFromSpec('match_end', mapId),
      },
      {
        name: 'ScrimsightEvents_mercy_res',
        query: buildQueryFromSpec('mercy_rez', mapId),
      },
      {
        name: 'ScrimsightEvents_objective_captured',
        query: buildQueryFromSpec('objective_captured', mapId),
      },
      {
        name: 'ScrimsightEvents_offensive_assist',
        query: buildQueryFromSpec('offensive_assist', mapId),
      },
      {
        name: 'ScrimsightEvents_payload_progress',
        query: buildQueryFromSpec('payload_progress', mapId),
      },
      {
        name: 'ScrimsightEvents_point_progress',
        query: buildQueryFromSpec('point_progress', mapId),
      },
      {
        name: 'ScrimsightEvents_remech_charged',
        query: buildQueryFromSpec('remech_charged', mapId),
      },
      {
        name: 'ScrimsightEvents_round_start',
        query: buildQueryFromSpec('round_start', mapId),
      },
      {
        name: 'ScrimsightEvents_round_end',
        query: buildQueryFromSpec('round_end', mapId),
      },
      {
        name: 'ScrimsightEvents_setup_complete',
        query: buildQueryFromSpec('setup_complete', mapId),
      },
      {
        name: 'ScrimsightEvents_ultimate_charged',
        query: buildQueryFromSpec('ultimate_charged', mapId),
      },
      {
        name: 'ScrimsightEvents_ultimate_end',
        query: buildQueryFromSpec('ultimate_end', mapId),
      },
      {
        name: 'ScrimsightEvents_ultimate_start',
        query: buildQueryFromSpec('ultimate_start', mapId),
      },
    ],
    [mapId],
  );

  useEffect(() => {
    if (
      damage &&
      healing &&
      kill &&
      ability1 &&
      ability2 &&
      players &&
      defensiveAssist &&
      dvaRemech &&
      dvaDemech &&
      echoDuplicationStart &&
      echoDuplicationEnd &&
      heroSpawn &&
      heroSwap &&
      matchStart &&
      matchEnd &&
      mercyRes &&
      objectiveCaptured &&
      offensiveAssist &&
      payloadProgress &&
      pointProgress &&
      remechCharged &&
      roundStart &&
      roundEnd &&
      setupComplete &&
      ultimateCharged &&
      ultimateEnd &&
      ultimateStart
    ) {
      setLoaded(true);
    }
  }, [
    damage,
    healing,
    kill,
    ability1,
    ability2,
    players,
    defensiveAssist,
    dvaRemech,
    dvaDemech,
    echoDuplicationStart,
    echoDuplicationEnd,
    heroSpawn,
    heroSwap,
    matchStart,
    matchEnd,
    mercyRes,
    objectiveCaptured,
    offensiveAssist,
    payloadProgress,
    pointProgress,
    remechCharged,
    roundStart,
    roundEnd,
    setupComplete,
    ultimateCharged,
    ultimateEnd,
    ultimateStart,
  ]);

  const events: any[] = useMemo(() => {
    const evts: any[] = [];

    if (!loaded) {
      return evts;
    }
    damage.forEach((event) => {
      evts.push({
        ...event,
        'Player Name': event['Attacker Name'],
        'Player Team': event['Attacker Team'],
        'Target Name': event['Victim Name'],
        'Target Team': event['Victim Team'],
      });

      // push damage received
      evts.push({
        ...event,
        'Player Name': event['Victim Name'],
        'Player Team': event['Victim Team'],
        'Target Name': event['Attacker Name'],
        'Target Team': event['Attacker Team'],
        Type: 'damage_received',
      });
    });

    healing.forEach((event) => {
      if (event['Event Healing'] === 0) {
        return;
      }
      evts.push({
        ...event,
        'Player Name': event['Healer Name'],
        'Player Team': event['Healer Team'],
        'Target Name': event['Healee Name'],
        'Target Team': event['Healee Team'],
      });

      // push healing received
      evts.push({
        ...event,
        'Player Name': event['Healee Name'],
        'Player Team': event['Healee Team'],
        'Target Name': event['Healer Name'],
        'Target Team': event['Healer Team'],
        Type: 'healing_received',
      });
    });

    kill.forEach((event) => {
      evts.push({
        ...event,
        'Player Name': event['Attacker Name'],
        'Player Team': event['Attacker Team'],
        'Target Name': event['Victim Name'],
        'Target Team': event['Victim Team'],
      });

      // push kill received
      evts.push({
        ...event,
        'Player Name': event['Victim Name'],
        'Player Team': event['Victim Team'],
        'Target Name': event['Attacker Name'],
        'Target Team': event['Attacker Team'],
        Type: 'death',
      });
    });

    evts.push(...ability1);
    evts.push(...ability2);
    evts.push(...defensiveAssist);
    evts.push(...dvaRemech);
    evts.push(...dvaDemech);
    evts.push(...echoDuplicationStart);
    evts.push(...echoDuplicationEnd);
    evts.push(...heroSpawn);
    evts.push(...heroSwap);
    evts.push(...matchStart);
    evts.push(...matchEnd);
    evts.push(...roundStart);
    evts.push(...roundEnd);
    evts.push(...setupComplete);
    evts.push(...ultimateCharged);
    evts.push(...ultimateEnd);
    evts.push(...ultimateStart);
    evts.push(...mercyRes);
    evts.push(...objectiveCaptured);
    evts.push(...offensiveAssist);
    evts.push(...payloadProgress);
    evts.push(...pointProgress);
    evts.push(...remechCharged);

    return evts;
  }, [loaded]);

  return [events, loaded];
};

export default useScrimsightEvents;
