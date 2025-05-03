import { describe, it, expect, vi } from 'vitest';
import { 
  calculateSilverMatches,
  calculateSilverPlaytime,
  calculateSilverPlayerRoundStats,
  calculateUnifiedInteractionEvents
} from '../../layers/silverLogic';

// Mock the hero role function
vi.mock('../../../lib/hero', () => ({
  getRoleFromHero: (hero: string): 'tank' | 'damage' | 'support' => {
    if (hero === 'D.Va' || hero === 'Reinhardt') return 'tank';
    if (hero === 'Soldier76' || hero === 'Cassidy' || hero === 'Widowmaker') return 'damage';
    if (hero === 'Mercy' || hero === 'Ana') return 'support';
    return 'damage'; // Default fallback
  }
}));

// Sample bronze data for testing
const mockBronzeData = {
  'match_start': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 0,
      event_type: 'match_start',
      mapName: 'Route 66',
      mapType: 'Escort',
      team1Name: 'Team 1',
      team2Name: 'Team 2'
    }
  ],
  'match_end': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 600,
      event_type: 'match_end',
      roundNumber: 2,
      team1Score: 3,
      team2Score: 2
    }
  ],
  'round_start': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 5,
      event_type: 'round_start',
      roundNumber: 1,
      capturingTeam: 'Team 1',
      team1Score: 0,
      team2Score: 0,
      objectiveIndex: 0
    },
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 300,
      event_type: 'round_start',
      roundNumber: 2,
      capturingTeam: 'Team 2',
      team1Score: 2,
      team2Score: 0,
      objectiveIndex: 0
    }
  ],
  'round_end': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 290,
      event_type: 'round_end',
      roundNumber: 1,
      capturingTeam: 'Team 1',
      team1Score: 2,
      team2Score: 0,
      objectiveIndex: 0,
      controlTeam1Progress: 100,
      controlTeam2Progress: 80,
      matchTimeRemaining: 300
    },
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 590,
      event_type: 'round_end',
      roundNumber: 2,
      capturingTeam: 'Team 2',
      team1Score: 3,
      team2Score: 2,
      objectiveIndex: 0,
      controlTeam1Progress: 100,
      controlTeam2Progress: 80,
      matchTimeRemaining: 0
    }
  ],
  'setup_complete': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 15,
      event_type: 'setup_complete',
      roundNumber: 1,
      matchTimeRemaining: 580
    },
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 310,
      event_type: 'setup_complete',
      roundNumber: 2,
      matchTimeRemaining: 290
    }
  ],
  'hero_spawn': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 5,
      event_type: 'hero_spawn',
      playerTeam: 'Team 1',
      playerName: 'Player1',
      playerHero: 'Soldier76',
      previousHero: '',
      heroTimePlayed: 0
    },
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 5,
      event_type: 'hero_spawn',
      playerTeam: 'Team 2',
      playerName: 'Player2',
      playerHero: 'Mercy',
      previousHero: '',
      heroTimePlayed: 0
    }
  ],
  'hero_swap': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 120,
      event_type: 'hero_swap',
      playerTeam: 'Team 1',
      playerName: 'Player1',
      playerHero: 'Cassidy',
      previousHero: 'Soldier76',
      heroTimePlayed: 115
    }
  ],
  'kill': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 60,
      event_type: 'kill',
      attackerTeam: 'Team 1',
      attackerName: 'Player1',
      attackerHero: 'Soldier76',
      victimTeam: 'Team 2',
      victimName: 'Player2',
      victimHero: 'Mercy',
      eventAbility: 'Helix Rocket',
      eventDamage: 120,
      isCriticalHit: false,
      isEnvironmental: false
    },
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 350,
      event_type: 'kill',
      attackerTeam: 'Team 2',
      attackerName: 'Player2',
      attackerHero: 'Mercy',
      victimTeam: 'Team 1',
      victimName: 'Player1',
      victimHero: 'Cassidy',
      eventAbility: 'Pistol',
      eventDamage: 100,
      isCriticalHit: false,
      isEnvironmental: false
    }
  ],
  'player_stat': [
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 290,
      event_type: 'player_stat',
      roundNumber: '1',
      playerTeam: 'Team 1',
      playerName: 'Player1',
      playerHero: 'Soldier76',
      eliminations: 1,
      finalBlows: 1,
      deaths: 0,
      allDamageDealt: 5000,
      barrierDamageDealt: 1000,
      heroDamageDealt: 4000,
      healingDealt: 0,
      healingReceived: 100,
      selfHealing: 300,
      damageTaken: 2000,
      damageBlocked: 0,
      defensiveAssists: 0,
      offensiveAssists: 0,
      ultimatesEarned: 1,
      ultimatesUsed: 1,
      multikillBest: 1,
      multikills: 0,
      soloKills: 1,
      objectiveKills: 1,
      environmentalKills: 0,
      environmentalDeaths: 0,
      criticalHits: 10,
      criticalHitAccuracy: 0.2,
      scopedAccuracy: 0,
      scopedCriticalHitAccuracy: 0,
      scopedCriticalHitKills: 0,
      shotsFired: 100,
      shotsHit: 50,
      shotsMissed: 50,
      scopedShotsFired: 0,
      scopedShotsHit: 0,
      weaponAccuracy: 0.5,
      heroTimePlayed: 290
    },
    {
      match_id: 'match1',
      source_filename: 'test.txt',
      load_timestamp: 1617235200000,
      match_time: 290,
      event_type: 'player_stat',
      roundNumber: '1',
      playerTeam: 'Team 2',
      playerName: 'Player2',
      playerHero: 'Mercy',
      eliminations: 0,
      finalBlows: 0,
      deaths: 1,
      allDamageDealt: 200,
      barrierDamageDealt: 0,
      heroDamageDealt: 200,
      healingDealt: 3000,
      healingReceived: 0,
      selfHealing: 0,
      damageTaken: 1500,
      damageBlocked: 0,
      defensiveAssists: 2,
      offensiveAssists: 1,
      ultimatesEarned: 1,
      ultimatesUsed: 0,
      multikillBest: 0,
      multikills: 0,
      soloKills: 0,
      objectiveKills: 0,
      environmentalKills: 0,
      environmentalDeaths: 0,
      criticalHits: 0,
      criticalHitAccuracy: 0,
      scopedAccuracy: 0,
      scopedCriticalHitAccuracy: 0,
      scopedCriticalHitKills: 0,
      shotsFired: 20,
      shotsHit: 10,
      shotsMissed: 10,
      scopedShotsFired: 0,
      scopedShotsHit: 0,
      weaponAccuracy: 0.5,
      heroTimePlayed: 290
    }
  ]
};

describe('Silver Layer Logic', () => {
  describe('calculateSilverMatches', () => {
    it('should transform bronze match data to silver match data', () => {
      const matches = calculateSilverMatches(mockBronzeData);
      
      expect(matches.length).toBe(1);
      expect(matches[0]).toMatchObject({
        match_id: 'match1',
        map_name: 'Route 66',
        map_type: 'Escort',
        team1_name: 'Team 1',
        team2_name: 'Team 2',
        team1_score: 3,
        team2_score: 2,
        duration: 600,
        winner: 'Team 1',
        team1_players: ['Player1'],
        team2_players: ['Player2']
      });
    });
  });
  
  describe('calculateSilverPlaytime', () => {
    it('should calculate player playtime by hero and round', () => {
      const playtimes = calculateSilverPlaytime(mockBronzeData);
      
      expect(playtimes.length).toBe(3); // 2 initial spawns + 1 swap
      
      // Check Player1's first hero (Soldier76)
      const player1Soldier = playtimes.find(p => 
        p.player_name === 'Player1' && 
        p.hero === 'Soldier76'
      );
      expect(player1Soldier).toMatchObject({
        player_name: 'Player1',
        player_team: 'Team 1',
        hero: 'Soldier76',
        round_number: 1,
        playtime: 115 // 120 - 5
      });
      
      // Check Player1's second hero (Cassidy)
      const player1Cassidy = playtimes.find(p => 
        p.player_name === 'Player1' && 
        p.hero === 'Cassidy'
      );
      expect(player1Cassidy).toMatchObject({
        player_name: 'Player1',
        player_team: 'Team 1',
        hero: 'Cassidy',
        round_number: 1,
        playtime: 170 // 290 - 120
      });
      
      // Check Player2's hero (Mercy)
      const player2Mercy = playtimes.find(p => 
        p.player_name === 'Player2' && 
        p.hero === 'Mercy'
      );
      expect(player2Mercy).toMatchObject({
        player_name: 'Player2',
        player_team: 'Team 2',
        hero: 'Mercy',
        round_number: 1,
        playtime: 285 // 290 - 5
      });
    });
  });
  
  describe('calculateSilverPlayerRoundStats', () => {
    it('should transform player stats and add role information', () => {
      const playtimes = calculateSilverPlaytime(mockBronzeData);
      const stats = calculateSilverPlayerRoundStats(mockBronzeData, playtimes);
      
      expect(stats.length).toBe(2);
      
      // Check Player1's stats
      const player1Stats = stats.find(s => s.player_name === 'Player1');
      expect(player1Stats).toMatchObject({
        player_name: 'Player1',
        player_team: 'Team 1',
        hero: 'Soldier76',
        player_role: 'damage', // Should have added role
        round_number: 1,
        eliminations: 1,
        final_blows: 1,
        deaths: 0
      });
      
      // Check Player2's stats
      const player2Stats = stats.find(s => s.player_name === 'Player2');
      expect(player2Stats).toMatchObject({
        player_name: 'Player2',
        player_team: 'Team 2',
        hero: 'Mercy',
        player_role: 'support', // Should have added role
        round_number: 1,
        healing_dealt: 3000,
        defensive_assists: 2
      });
    });
  });
  
  describe('calculateUnifiedInteractionEvents', () => {
    it('should transform kill events into unified interaction events', () => {
      const events = calculateUnifiedInteractionEvents(mockBronzeData);
      
      // Should have 4 events (2 kills = 2 outgoing + 2 incoming)
      expect(events.length).toBe(4);
      
      // Group by event type
      const killEvents = events.filter(e => e.event_type === 'kill');
      const deathEvents = events.filter(e => e.event_type === 'death');
      
      expect(killEvents.length).toBe(2);
      expect(deathEvents.length).toBe(2);
      
      // Check first kill event
      const firstKill = killEvents.find(e => e.match_time === 60);
      expect(firstKill).toMatchObject({
        event_type: 'kill',
        source_team: 'Team 1',
        source_player: 'Player1',
        source_hero: 'Soldier76',
        target_team: 'Team 2',
        target_player: 'Player2',
        target_hero: 'Mercy',
        ability: 'Helix Rocket',
        amount: 120,
        is_outgoing: true
      });
      
      // Check corresponding death event (same event, different perspective)
      const firstDeath = deathEvents.find(e => e.match_time === 60);
      expect(firstDeath).toMatchObject({
        event_type: 'death',
        source_team: 'Team 2',
        source_player: 'Player2',
        source_hero: 'Mercy',
        target_team: 'Team 1',
        target_player: 'Player1',
        target_hero: 'Soldier76',
        ability: 'Helix Rocket',
        amount: 120,
        is_outgoing: false
      });
      
      // Verify pair IDs match
      expect(firstKill?.pair_id).toBeTruthy();
      expect(firstKill?.pair_id).toBe(firstDeath?.pair_id);
    });
  });
});