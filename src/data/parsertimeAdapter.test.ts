import { describe, it, expect } from 'vitest';
import {
  parseCsv,
  convertKillRow,
  convertMatchStartRow,
  convertMatchEndRow,
  convertRoundStartRow,
  convertRoundEndRow,
  convertSetupCompleteRow,
  convertPlayerStatRow,
  convertHeroSpawnRow,
  convertHeroSwapRow,
  convertUltimateChargedRow,
  convertUltimateStartRow,
  convertUltimateEndRow,
  convertMercyRezRow,
  convertOffensiveAssistRow,
  convertDefensiveAssistRow,
  convertDvaRemechRow,
  groupRowsByMatch,
} from './parsertimeAdapter';
import { stringHash } from '@library';

describe('parseCsv', () => {
  it('parses a simple CSV string into row objects', () => {
    const csv = `name,age,city
Alice,30,NYC
Bob,25,LA`;
    const rows = parseCsv(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ name: 'Alice', age: '30', city: 'NYC' });
    expect(rows[1]).toEqual({ name: 'Bob', age: '25', city: 'LA' });
  });

  it('handles empty input', () => {
    expect(parseCsv('')).toEqual([]);
  });

  it('handles header-only input', () => {
    expect(parseCsv('a,b,c')).toEqual([]);
  });

  it('trims whitespace from headers and values', () => {
    const csv = ` name , age \n Alice , 30 `;
    const rows = parseCsv(csv);
    expect(rows[0]).toEqual({ name: 'Alice', age: '30' });
  });
});

describe('convertKillRow', () => {
  it('converts a kill row correctly', () => {
    const row = {
      match_time: '120.5',
      attacker_team: 'T_abc',
      attacker_name: 'P_123',
      attacker_hero: 'Tracer',
      victim_team: 'T_def',
      victim_name: 'P_456',
      victim_hero: 'Ana',
      event_ability: 'Pulse Bomb',
      event_damage: '300',
      is_critical_hit: 'False',
      is_environmental: '0',
    };
    const result = convertKillRow(row, 'match1');
    expect(result.matchId).toBe('match1');
    expect(result.type).toBe('kill');
    expect(result.matchTime).toBe(120.5);
    expect(result.attackerHero).toBe('Tracer');
    expect(result.eventDamage).toBe(300);
    expect(result.isCriticalHit).toBe(false);
    expect(result.isEnvironmental).toBe(false);
  });
});

describe('boolean parsing', () => {
  it('parses "0" as false', () => {
    const row = { match_time: '0', attacker_team: '', attacker_name: '', attacker_hero: '', victim_team: '', victim_name: '', victim_hero: '', event_ability: '', event_damage: '0', is_critical_hit: '0', is_environmental: '0' };
    const result = convertKillRow(row, 'x');
    expect(result.isCriticalHit).toBe(false);
    expect(result.isEnvironmental).toBe(false);
  });

  it('parses "1" as true', () => {
    const row = { match_time: '0', attacker_team: '', attacker_name: '', attacker_hero: '', victim_team: '', victim_name: '', victim_hero: '', event_ability: '', event_damage: '0', is_critical_hit: '1', is_environmental: '1' };
    const result = convertKillRow(row, 'x');
    expect(result.isCriticalHit).toBe(true);
    expect(result.isEnvironmental).toBe(true);
  });

  it('parses "True" as true', () => {
    const row = { match_time: '0', attacker_team: '', attacker_name: '', attacker_hero: '', victim_team: '', victim_name: '', victim_hero: '', event_ability: '', event_damage: '0', is_critical_hit: 'True', is_environmental: 'True' };
    const result = convertKillRow(row, 'x');
    expect(result.isCriticalHit).toBe(true);
    expect(result.isEnvironmental).toBe(true);
  });

  it('parses "False" as false', () => {
    const row = { match_time: '0', attacker_team: '', attacker_name: '', attacker_hero: '', victim_team: '', victim_name: '', victim_hero: '', event_ability: '', event_damage: '0', is_critical_hit: 'False', is_environmental: 'False' };
    const result = convertKillRow(row, 'x');
    expect(result.isCriticalHit).toBe(false);
    expect(result.isEnvironmental).toBe(false);
  });
});

describe('convertMatchStartRow', () => {
  it('converts correctly', () => {
    const row = { match_time: '0', map_name: 'Oasis', map_type: 'Control', team_1_name: 'T_a', team_2_name: 'T_b' };
    const result = convertMatchStartRow(row, 'm1');
    expect(result.mapName).toBe('Oasis');
    expect(result.mapType).toBe('Control');
    expect(result.team1Name).toBe('T_a');
    expect(result.team2Name).toBe('T_b');
  });
});

describe('convertMatchEndRow', () => {
  it('converts correctly', () => {
    const row = { match_time: '600', round_number: '3', team_1_score: '2', team_2_score: '1' };
    const result = convertMatchEndRow(row, 'm1');
    expect(result.roundNumber).toBe(3);
    expect(result.team1Score).toBe(2);
    expect(result.team2Score).toBe(1);
  });
});

describe('convertPlayerStatRow', () => {
  it('maps scoped_shots to scopedShotsFired', () => {
    const row = {
      match_time: '300', round_number: '1', player_team: 'T_a', player_name: 'P_1',
      player_hero: 'Widowmaker', eliminations: '5', final_blows: '3', deaths: '1',
      all_damage_dealt: '10000', barrier_damage_dealt: '0', hero_damage_dealt: '8000',
      healing_dealt: '0', healing_received: '500', self_healing: '0', damage_taken: '3000',
      damage_blocked: '0', defensive_assists: '0', offensive_assists: '0',
      ultimates_earned: '2', ultimates_used: '1', multikill_best: '2', multikills: '1',
      solo_kills: '1', objective_kills: '0', environmental_kills: '0', environmental_deaths: '0',
      critical_hits: '10', critical_hit_accuracy: '0.5', scoped_accuracy: '0.6',
      scoped_critical_hit_accuracy: '0.3', scoped_critical_hit_kills: '2',
      shots_fired: '100', shots_hit: '60', shots_missed: '40',
      scoped_shots: '80', scoped_shots_hit: '48', weapon_accuracy: '0.6',
      hero_time_played: '300',
    };
    const result = convertPlayerStatRow(row, 'm1');
    expect(result.scopedShotsFired).toBe(80);
    expect(result.scopedShotsHit).toBe(48);
    expect(result.playerHero).toBe('Widowmaker');
  });
});

describe('convertHeroSpawnRow', () => {
  it('converts previous_hero "0" to empty string', () => {
    const row = { match_time: '0', player_team: 'T_a', player_name: 'P_1', player_hero: 'Tracer', previous_hero: '0', hero_time_played: '0' };
    const result = convertHeroSpawnRow(row, 'm1');
    expect(result.previousHero).toBe('');
  });

  it('preserves non-zero previous_hero', () => {
    const row = { match_time: '60', player_team: 'T_a', player_name: 'P_1', player_hero: 'Genji', previous_hero: 'Tracer', hero_time_played: '60' };
    const result = convertHeroSpawnRow(row, 'm1');
    expect(result.previousHero).toBe('Tracer');
  });
});

describe('convertMercyRezRow', () => {
  it('maps resurrecter/resurrectee fields correctly', () => {
    const row = {
      match_time: '200', resurrecter_team: 'T_a', resurrecter_player: 'P_mercy',
      resurrecter_hero: 'Mercy', resurrectee_team: 'T_a', resurrectee_player: 'P_tank',
      resurrectee_hero: 'Reinhardt',
    };
    const result = convertMercyRezRow(row, 'm1');
    expect(result.mercyTeam).toBe('T_a');
    expect(result.mercyName).toBe('P_mercy');
    expect(result.revivedName).toBe('P_tank');
    expect(result.revivedHero).toBe('Reinhardt');
    expect(result.eventAbility).toBe('Resurrect');
  });
});

describe('convertUltimateChargedRow', () => {
  it('converts hero_duplicated "0" to empty string', () => {
    const row = { match_time: '100', player_team: 'T_a', player_name: 'P_1', player_hero: 'Genji', hero_duplicated: '0', ultimate_id: '5' };
    const result = convertUltimateChargedRow(row, 'm1');
    expect(result.heroDuplicated).toBe('');
    expect(result.ultimateId).toBe(5);
  });
});

describe('matchId generation', () => {
  it('is deterministic for the same MapDataId', () => {
    const id1 = stringHash('parsertime-abc123').toString();
    const id2 = stringHash('parsertime-abc123').toString();
    expect(id1).toBe(id2);
  });

  it('differs for different MapDataIds', () => {
    const id1 = stringHash('parsertime-abc').toString();
    const id2 = stringHash('parsertime-def').toString();
    expect(id1).not.toBe(id2);
  });
});

describe('groupRowsByMatch', () => {
  it('groups rows by MapDataId into correct MatchEvents fields', () => {
    const csvData = new Map<string, Record<string, string>[]>();

    csvData.set('MatchStart.csv', [
      { MapDataId: 'map1', scrimId: 's1', match_time: '0', map_name: 'Oasis', map_type: 'Control', team_1_name: 'A', team_2_name: 'B' },
      { MapDataId: 'map2', scrimId: 's1', match_time: '0', map_name: 'Nepal', map_type: 'Control', team_1_name: 'A', team_2_name: 'B' },
    ]);
    csvData.set('Kill.csv', [
      { MapDataId: 'map1', scrimId: 's1', match_time: '60', attacker_team: 'A', attacker_name: 'P1', attacker_hero: 'Tracer', victim_team: 'B', victim_name: 'P2', victim_hero: 'Ana', event_ability: 'Melee', event_damage: '30', is_critical_hit: '0', is_environmental: '0' },
    ]);

    const result = groupRowsByMatch(csvData);

    expect(result.size).toBe(2);

    const map1 = result.get('map1')!;
    expect(map1.scrimId).toBe('s1');
    expect(map1.events.matchStart).toHaveLength(1);
    expect(map1.events.matchStart[0].mapName).toBe('Oasis');
    expect(map1.events.kills).toHaveLength(1);

    const map2 = result.get('map2')!;
    expect(map2.events.matchStart).toHaveLength(1);
    expect(map2.events.matchStart[0].mapName).toBe('Nepal');
    expect(map2.events.kills).toHaveLength(0);
  });

  it('skips rows without MapDataId', () => {
    const csvData = new Map<string, Record<string, string>[]>();
    csvData.set('MatchStart.csv', [
      { scrimId: 's1', match_time: '0', map_name: 'Oasis', map_type: 'Control', team_1_name: 'A', team_2_name: 'B' },
    ]);

    const result = groupRowsByMatch(csvData);
    expect(result.size).toBe(0);
  });
});

describe('remaining row converters', () => {
  it('convertRoundStartRow', () => {
    const row = { match_time: '10', round_number: '2', capturing_team: 'T_a', team_1_score: '1', team_2_score: '0', objective_index: '1' };
    const result = convertRoundStartRow(row, 'm1');
    expect(result.roundNumber).toBe(2);
    expect(result.objectiveIndex).toBe(1);
  });

  it('convertRoundEndRow', () => {
    const row = { match_time: '300', round_number: '1', capturing_team: 'T_b', team_1_score: '0', team_2_score: '1', objective_index: '0', control_team_1_progress: '50', control_team_2_progress: '100', match_time_remaining: '60' };
    const result = convertRoundEndRow(row, 'm1');
    expect(result.controlTeam2Progress).toBe(100);
    expect(result.matchTimeRemaining).toBe(60);
  });

  it('convertSetupCompleteRow', () => {
    const row = { match_time: '45', round_number: '1', match_time_remaining: '300' };
    const result = convertSetupCompleteRow(row, 'm1');
    expect(result.matchTime).toBe(45);
    expect(result.matchTimeRemaining).toBe(300);
  });

  it('convertHeroSwapRow', () => {
    const row = { match_time: '100', player_team: 'T_a', player_name: 'P_1', player_hero: 'Genji', previous_hero: 'Tracer', hero_time_played: '100' };
    const result = convertHeroSwapRow(row, 'm1');
    expect(result.playerHero).toBe('Genji');
    expect(result.previousHero).toBe('Tracer');
  });

  it('convertUltimateStartRow', () => {
    const row = { match_time: '200', player_team: 'T_a', player_name: 'P_1', player_hero: 'Genji', hero_duplicated: '0', ultimate_id: '3' };
    const result = convertUltimateStartRow(row, 'm1');
    expect(result.heroDuplicated).toBe('');
    expect(result.ultimateId).toBe(3);
  });

  it('convertUltimateEndRow', () => {
    const row = { match_time: '210', player_team: 'T_a', player_name: 'P_1', player_hero: 'Genji', hero_duplicated: '0', ultimate_id: '3' };
    const result = convertUltimateEndRow(row, 'm1');
    expect(result.matchTime).toBe(210);
  });

  it('convertOffensiveAssistRow', () => {
    const row = { match_time: '150', player_team: 'T_a', player_name: 'P_1', player_hero: 'Ana', hero_duplicated: '0' };
    const result = convertOffensiveAssistRow(row, 'm1');
    expect(result.heroDuplicated).toBe('');
  });

  it('convertDefensiveAssistRow', () => {
    const row = { match_time: '155', player_team: 'T_a', player_name: 'P_1', player_hero: 'Lucio', hero_duplicated: 'Lucio' };
    const result = convertDefensiveAssistRow(row, 'm1');
    expect(result.heroDuplicated).toBe('Lucio');
  });

  it('convertDvaRemechRow', () => {
    const row = { match_time: '180', player_team: 'T_a', player_name: 'P_1', player_hero: 'D.Va', ultimate_id: '2' };
    const result = convertDvaRemechRow(row, 'm1');
    expect(result.ultimateId).toBe(2);
    expect(result.playerHero).toBe('D.Va');
  });
});
