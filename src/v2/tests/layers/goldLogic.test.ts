import { describe, it, expect } from 'vitest';
import { 
  resolveMetricDependencies,
  calculateAggregatedMetrics
} from '../../layers/goldLogic';
import { MetricConfig } from '../../schemas/metricsSchema';

// Sample metrics config for testing
const mockMetricsConfig: Record<string, MetricConfig> = {
  'eliminations': {
    id: 'eliminations',
    type: 'simple',
    name: 'eliminations',
    displayName: 'Eliminations',
    source: 'eliminations',
    aggregation: 'sum',
    format: 'number',
    tags: []
  },
  'deaths': {
    id: 'deaths',
    type: 'simple',
    name: 'deaths',
    displayName: 'Deaths',
    source: 'deaths',
    aggregation: 'sum',
    format: 'number',
    tags: []
  },
  'healing': {
    id: 'healing',
    type: 'simple',
    name: 'healing',
    displayName: 'Healing',
    source: 'healing_dealt',
    aggregation: 'sum',
    format: 'number',
    tags: []
  },
  'playtime': {
    id: 'playtime',
    type: 'simple',
    name: 'playtime',
    displayName: 'Playtime',
    source: 'playtime',
    aggregation: 'sum',
    format: 'time',
    tags: []
  },
  'kd_ratio': {
    id: 'kd_ratio',
    type: 'ratio',
    name: 'kd_ratio',
    displayName: 'K/D Ratio',
    numerator: 'eliminations',
    denominator: 'deaths',
    fallbackValue: 0,
    format: 'ratio',
    tags: []
  },
  'healing_per_10': {
    id: 'healing_per_10',
    type: 'per10min',
    name: 'healing_per_10',
    displayName: 'Healing per 10 min',
    source: 'healing',
    playtimeField: 'playtime',
    format: 'number',
    tags: []
  },
  'kda': {
    id: 'kda',
    type: 'derived',
    name: 'kda',
    displayName: 'KDA',
    dependencies: ['eliminations', 'deaths', 'defensive_assists', 'offensive_assists'],
    formula: '(eliminations + defensive_assists + offensive_assists) / max(deaths, 1)',
    format: 'ratio',
    tags: []
  },
  'defensive_assists': {
    id: 'defensive_assists',
    type: 'simple',
    name: 'defensive_assists',
    displayName: 'Defensive Assists',
    source: 'defensive_assists',
    aggregation: 'sum',
    format: 'number',
    tags: []
  },
  'offensive_assists': {
    id: 'offensive_assists',
    type: 'simple',
    name: 'offensive_assists',
    displayName: 'Offensive Assists',
    source: 'offensive_assists',
    aggregation: 'sum',
    format: 'number',
    tags: []
  }
};

// Sample data for testing
const mockPlayerStats = [
  {
    id: 'player1_round1',
    match_id: 'match1',
    player_name: 'Player1',
    player_team: 'Team 1',
    hero: 'Soldier76',
    player_role: 'damage',
    round_number: 1,
    eliminations: 3,
    deaths: 1,
    healing_dealt: 0,
    defensive_assists: 0,
    offensive_assists: 1,
    playtime: 300
  },
  {
    id: 'player2_round1',
    match_id: 'match1',
    player_name: 'Player2',
    player_team: 'Team 2',
    hero: 'Mercy',
    player_role: 'support',
    round_number: 1,
    eliminations: 0,
    deaths: 2,
    healing_dealt: 5000,
    defensive_assists: 3,
    offensive_assists: 0,
    playtime: 300
  },
  {
    id: 'player1_round2',
    match_id: 'match1',
    player_name: 'Player1',
    player_team: 'Team 1',
    hero: 'Cassidy',
    player_role: 'damage',
    round_number: 2,
    eliminations: 4,
    deaths: 0,
    healing_dealt: 0,
    defensive_assists: 0,
    offensive_assists: 2,
    playtime: 240
  },
  {
    id: 'player2_round2',
    match_id: 'match1',
    player_name: 'Player2',
    player_team: 'Team 2',
    hero: 'Ana',
    player_role: 'support',
    round_number: 2,
    eliminations: 1,
    deaths: 3,
    healing_dealt: 4000,
    defensive_assists: 2,
    offensive_assists: 1,
    playtime: 240
  }
];

describe('Gold Layer Logic', () => {
  describe('resolveMetricDependencies', () => {
    it('should resolve direct dependencies for metrics', () => {
      const metrics = ['kd_ratio'];
      const resolved = resolveMetricDependencies(metrics, mockMetricsConfig);
      
      expect(resolved).toContain('kd_ratio');
      expect(resolved).toContain('eliminations');
      expect(resolved).toContain('deaths');
    });
    
    it('should resolve nested dependencies for metrics', () => {
      const metrics = ['healing_per_10'];
      const resolved = resolveMetricDependencies(metrics, mockMetricsConfig);
      
      expect(resolved).toContain('healing_per_10');
      expect(resolved).toContain('healing');
      expect(resolved).toContain('playtime');
    });
    
    it('should handle derived metrics with multiple dependencies', () => {
      const metrics = ['kda'];
      const resolved = resolveMetricDependencies(metrics, mockMetricsConfig);
      
      expect(resolved).toContain('kda');
      expect(resolved).toContain('eliminations');
      expect(resolved).toContain('deaths');
      expect(resolved).toContain('defensive_assists');
      expect(resolved).toContain('offensive_assists');
    });
  });
  
  describe('calculateAggregatedMetrics', () => {
    it('should aggregate player stats by player_name', () => {
      const result = calculateAggregatedMetrics(
        mockPlayerStats,
        {
          groupBy: ['player_name'],
          metrics: ['eliminations', 'deaths', 'healing']
        },
        mockMetricsConfig
      );
      
      expect(result.length).toBe(2);
      
      // Find Player1's stats
      const player1 = result.find(r => r.player_name === 'Player1');
      expect(player1).toBeDefined();
      expect(player1?.eliminations).toBe(7); // 3 + 4
      expect(player1?.deaths).toBe(1); // 1 + 0
      expect(player1?.healing).toBe(0); // 0 + 0
      
      // Find Player2's stats
      const player2 = result.find(r => r.player_name === 'Player2');
      expect(player2).toBeDefined();
      expect(player2?.eliminations).toBe(1); // 0 + 1
      expect(player2?.deaths).toBe(5); // 2 + 3
      expect(player2?.healing).toBe(9000); // 5000 + 4000
    });
    
    it('should calculate ratio metrics correctly', () => {
      const result = calculateAggregatedMetrics(
        mockPlayerStats,
        {
          groupBy: ['player_name'],
          metrics: ['eliminations', 'deaths', 'kd_ratio']
        },
        mockMetricsConfig
      );
      
      // Find Player1's stats
      const player1 = result.find(r => r.player_name === 'Player1');
      expect(player1?.kd_ratio).toBe(7); // 7 eliminations / 1 death
      
      // Find Player2's stats
      const player2 = result.find(r => r.player_name === 'Player2');
      expect(player2?.kd_ratio).toBe(0.2); // 1 elimination / 5 deaths
    });
    
    it('should calculate per-10-minute metrics correctly', () => {
      const result = calculateAggregatedMetrics(
        mockPlayerStats,
        {
          groupBy: ['player_name'],
          metrics: ['healing', 'playtime', 'healing_per_10']
        },
        mockMetricsConfig
      );
      
      // Find Player2's stats (only Player2 has healing)
      const player2 = result.find(r => r.player_name === 'Player2');
      expect(player2?.healing).toBe(9000);
      expect(player2?.playtime).toBe(540); // 300 + 240 seconds
      
      // 9000 healing in 540 seconds = 9000 * (10 / 9) = 10000 per 10 minutes (600 seconds)
      // 9000 * (600 / 540) = 9000 * 1.111 = 10000
      expect(player2?.healing_per_10).toBeCloseTo(10000, 0);
    });
    
    it('should handle groupBy with multiple keys', () => {
      const result = calculateAggregatedMetrics(
        mockPlayerStats,
        {
          groupBy: ['player_name', 'hero'],
          metrics: ['eliminations', 'deaths']
        },
        mockMetricsConfig
      );
      
      expect(result.length).toBe(3); // Player1 (Soldier76), Player1 (Cassidy), Player2 (Mercy + Ana)
      
      // Player1 as Soldier76
      const player1Soldier = result.find(r => 
        r.player_name === 'Player1' && r.hero === 'Soldier76'
      );
      expect(player1Soldier?.eliminations).toBe(3);
      
      // Player1 as Cassidy
      const player1Cassidy = result.find(r => 
        r.player_name === 'Player1' && r.hero === 'Cassidy'
      );
      expect(player1Cassidy?.eliminations).toBe(4);
    });
    
    it('should apply filters correctly', () => {
      const result = calculateAggregatedMetrics(
        mockPlayerStats,
        {
          groupBy: ['player_name'],
          filters: { player_role: 'support' },
          metrics: ['eliminations', 'deaths', 'healing']
        },
        mockMetricsConfig
      );
      
      expect(result.length).toBe(1); // Only Player2 is support
      expect(result[0].player_name).toBe('Player2');
      expect(result[0].healing).toBe(9000);
    });
    
    it('should calculate derived metrics correctly', () => {
      const result = calculateAggregatedMetrics(
        mockPlayerStats,
        {
          groupBy: ['player_name'],
          metrics: ['kda', 'eliminations', 'deaths', 'defensive_assists', 'offensive_assists']
        },
        mockMetricsConfig
      );
      
      // Player1 KDA: (7 elims + 0 defensive + 3 offensive) / 1 death = 10
      const player1 = result.find(r => r.player_name === 'Player1');
      expect(player1?.eliminations).toBe(7);
      expect(player1?.defensive_assists).toBe(0);
      expect(player1?.offensive_assists).toBe(3);
      expect(player1?.deaths).toBe(1);
      expect(player1?.kda).toBe(10);
      
      // Player2 KDA: (1 elim + 5 defensive + 1 offensive) / 5 deaths = 1.4
      const player2 = result.find(r => r.player_name === 'Player2');
      expect(player2?.eliminations).toBe(1);
      expect(player2?.defensive_assists).toBe(5);
      expect(player2?.offensive_assists).toBe(1);
      expect(player2?.deaths).toBe(5);
      expect(player2?.kda).toBe(1.4);
    });
  });
});