import {useEffect, useState, useMemo} from 'react';
import {buildQueryFromSpec} from '../pages/AnalysisPage/AnalysisPage';
import useQueries from './useQueries';

const useScrimsightEvents = (mapId: number): [object[], boolean] => {
  const [results, i, loaded] = useQueries(
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
        name: `ScrimsightEvents_damage_${mapId}`,
        query: buildQueryFromSpec('damage', mapId),
      },
      {
        name: `ScrimsightEvents_healing_${mapId}`,
        query: buildQueryFromSpec('healing', mapId),
      },
      {
        name: `ScrimsightEvents_kill_${mapId}`,
        query: buildQueryFromSpec('kill', mapId),
      },
      {
        name: `ScrimsightEvents_ability_1_used_${mapId}`,
        query: buildQueryFromSpec('ability_1_used', mapId),
      },
      {
        name: `ScrimsightEvents_ability_2_used_${mapId}`,
        query: buildQueryFromSpec('ability_2_used', mapId),
      },
      {
        name: `ScrimsightEvents_defensive_assist_${mapId}`,
        query: buildQueryFromSpec('defensive_assist', mapId),
      },
      {
        name: `ScrimsightEvents_dva_remech_${mapId}`,
        query: buildQueryFromSpec('dva_remech', mapId),
      },
      {
        name: `ScrimsightEvents_dva_demech_${mapId}`,
        query: buildQueryFromSpec('dva_demech', mapId),
      },
      {
        name: `ScrimsightEvents_echo_duplication_start_${mapId}`,
        query: buildQueryFromSpec('echo_duplicate_start', mapId),
      },
      {
        name: `ScrimsightEvents_echo_duplication_end_${mapId}`,
        query: buildQueryFromSpec('echo_duplicate_end', mapId),
      },
      {
        name: `ScrimsightEvents_hero_spawn_${mapId}`,
        query: buildQueryFromSpec('hero_spawn', mapId),
      },
      {
        name: `ScrimsightEvents_hero_swap_${mapId}`,
        query: buildQueryFromSpec('hero_swap', mapId),
      },
      {
        name: `ScrimsightEvents_match_start_${mapId}`,
        query: buildQueryFromSpec('match_start', mapId),
      },
      {
        name: `ScrimsightEvents_match_end_${mapId}`,
        query: buildQueryFromSpec('match_end', mapId),
      },
      {
        name: `ScrimsightEvents_mercy_res_${mapId}`,
        query: buildQueryFromSpec('mercy_rez', mapId),
      },
      {
        name: `ScrimsightEvents_objective_captured_${mapId}`,
        query: buildQueryFromSpec('objective_captured', mapId),
      },
      {
        name: `ScrimsightEvents_offensive_assist_${mapId}`,
        query: buildQueryFromSpec('offensive_assist', mapId),
      },
      {
        name: `ScrimsightEvents_payload_progress_${mapId}`,
        query: buildQueryFromSpec('payload_progress', mapId),
      },
      {
        name: `ScrimsightEvents_point_progress_${mapId}`,
        query: buildQueryFromSpec('point_progress', mapId),
      },
      {
        name: `ScrimsightEvents_remech_charged_${mapId}`,
        query: buildQueryFromSpec('remech_charged', mapId),
      },
      {
        name: `ScrimsightEvents_round_start_${mapId}`,
        query: buildQueryFromSpec('round_start', mapId),
      },
      {
        name: `ScrimsightEvents_round_end_${mapId}`,
        query: buildQueryFromSpec('round_end', mapId),
      },
      {
        name: `ScrimsightEvents_setup_complete_${mapId}`,
        query: buildQueryFromSpec('setup_complete', mapId),
      },
      {
        name: `ScrimsightEvents_ultimate_charged_${mapId}`,
        query: buildQueryFromSpec('ultimate_charged', mapId),
      },
      {
        name: `ScrimsightEvents_ultimate_end_${mapId}`,
        query: buildQueryFromSpec('ultimate_end', mapId),
      },
      {
        name: `ScrimsightEvents_ultimate_start_${mapId}`,
        query: buildQueryFromSpec('ultimate_start', mapId),
      },
    ],
    [mapId],
  );

  const damage = results['ScrimsightEvents_damage_' + mapId];
  const healing = results['ScrimsightEvents_healing_' + mapId];
  const kill = results['ScrimsightEvents_kill_' + mapId];
  const ability1 = results['ScrimsightEvents_ability_1_used_' + mapId];
  const ability2 = results['ScrimsightEvents_ability_2_used_' + mapId];
  const defensiveAssist = results['ScrimsightEvents_defensive_assist_' + mapId];
  const dvaRemech = results['ScrimsightEvents_dva_remech_' + mapId];
  const dvaDemech = results['ScrimsightEvents_dva_demech_' + mapId];
  const echoDuplicationStart =
    results['ScrimsightEvents_echo_duplication_start_' + mapId];
  const echoDuplicationEnd =
    results['ScrimsightEvents_echo_duplication_end_' + mapId];
  const heroSpawn = results['ScrimsightEvents_hero_spawn_' + mapId];
  const heroSwap = results['ScrimsightEvents_hero_swap_' + mapId];
  const matchStart = results['ScrimsightEvents_match_start_' + mapId];
  const matchEnd = results['ScrimsightEvents_match_end_' + mapId];
  const mercyRes = results['ScrimsightEvents_mercy_res_' + mapId];
  const objectiveCaptured =
    results['ScrimsightEvents_objective_captured_' + mapId];
  const offensiveAssist = results['ScrimsightEvents_offensive_assist_' + mapId];
  const payloadProgress = results['ScrimsightEvents_payload_progress_' + mapId];
  const pointProgress = results['ScrimsightEvents_point_progress_' + mapId];
  const remechCharged = results['ScrimsightEvents_remech_charged_' + mapId];
  const roundStart = results['ScrimsightEvents_round_start_' + mapId];
  const roundEnd = results['ScrimsightEvents_round_end_' + mapId];
  const setupComplete = results['ScrimsightEvents_setup_complete_' + mapId];
  const ultimateCharged = results['ScrimsightEvents_ultimate_charged_' + mapId];
  const ultimateEnd = results['ScrimsightEvents_ultimate_end_' + mapId];
  const ultimateStart = results['ScrimsightEvents_ultimate_start_' + mapId];

  const events: any[] = useMemo(() => {
    const evts: any[] = [];

    if (!loaded) {
      return evts;
    }

    // console.log('loaded', loaded, damage, healing, kill);

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
