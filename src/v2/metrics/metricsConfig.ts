import { atom } from 'jotai';
import { MetricConfig } from '../schemas/metricsSchema';

// Basic player statistics
const playerStatsMetrics: MetricConfig[] = [
  {
    id: 'eliminations',
    type: 'simple',
    name: 'eliminations',
    displayName: 'Eliminations',
    description: 'Total number of eliminations',
    source: 'eliminations',
    aggregation: 'sum',
    format: 'number',
    category: 'combat',
    tags: ['performance', 'offensive']
  },
  {
    id: 'final_blows',
    type: 'simple',
    name: 'final_blows',
    displayName: 'Final Blows',
    description: 'Total number of final blows',
    format: 'number',
    source: 'final_blows',
    aggregation: 'sum',
    category: 'combat',
    tags: ['performance', 'offensive']
  },
  {
    id: 'deaths',
    type: 'simple',
    name: 'deaths',
    displayName: 'Deaths',
    description: 'Total number of deaths',
    format: 'number',
    source: 'deaths',
    aggregation: 'sum',
    category: 'combat',
    tags: ['performance', 'survival']
  },
  {
    id: 'hero_damage',
    type: 'simple',
    name: 'hero_damage',
    displayName: 'Hero Damage',
    description: 'Total damage dealt to enemy heroes',
    format: 'number',
    source: 'hero_damage_dealt',
    aggregation: 'sum',
    category: 'combat',
    tags: ['performance', 'offensive']
  },
  {
    id: 'barrier_damage',
    type: 'simple',
    name: 'barrier_damage',
    displayName: 'Barrier Damage',
    description: 'Total damage dealt to barriers',
    format: 'number',
    source: 'barrier_damage_dealt',
    aggregation: 'sum',
    category: 'combat',
    tags: ['performance', 'offensive']
  },
  {
    id: 'healing',
    type: 'simple',
    name: 'healing',
    displayName: 'Healing',
    description: 'Total healing provided',
    format: 'number',
    source: 'healing_dealt',
    aggregation: 'sum',
    category: 'support',
    tags: ['performance', 'healing']
  },
  {
    id: 'damage_blocked',
    type: 'simple',
    name: 'damage_blocked',
    displayName: 'Damage Blocked',
    description: 'Total damage blocked with barriers and abilities',
    format: 'number',
    source: 'damage_blocked',
    aggregation: 'sum',
    category: 'defense',
    tags: ['performance', 'defensive']
  },
  {
    id: 'defensive_assists',
    type: 'simple',
    name: 'defensive_assists',
    displayName: 'Defensive Assists',
    description: 'Total number of defensive assists',
    format: 'number',
    source: 'defensive_assists',
    aggregation: 'sum',
    category: 'support',
    tags: ['performance', 'utility']
  },
  {
    id: 'offensive_assists',
    type: 'simple',
    name: 'offensive_assists',
    displayName: 'Offensive Assists',
    description: 'Total number of offensive assists',
    format: 'number',
    source: 'offensive_assists',
    aggregation: 'sum',
    category: 'support',
    tags: ['performance', 'utility']
  },
  {
    id: 'ultimates_used',
    type: 'simple',
    name: 'ultimates_used',
    displayName: 'Ultimates Used',
    description: 'Total number of ultimates used',
    format: 'number',
    source: 'ultimates_used',
    aggregation: 'sum',
    category: 'combat',
    tags: ['performance', 'utility']
  },
  {
    id: 'ultimates_earned',
    type: 'simple',
    name: 'ultimates_earned',
    displayName: 'Ultimates Earned',
    description: 'Total number of ultimates earned',
    format: 'number',
    source: 'ultimates_earned',
    aggregation: 'sum',
    category: 'combat',
    tags: ['performance', 'utility']
  },
  {
    id: 'multikills',
    type: 'simple',
    name: 'multikills',
    displayName: 'Multikills',
    description: 'Total number of multikills',
    format: 'number',
    source: 'multikills',
    aggregation: 'sum',
    category: 'combat',
    tags: ['performance', 'offensive']
  },
  {
    id: 'objective_kills',
    type: 'simple',
    name: 'objective_kills',
    displayName: 'Objective Kills',
    description: 'Total number of kills on the objective',
    format: 'number',
    source: 'objective_kills',
    aggregation: 'sum',
    category: 'combat',
    tags: ['performance', 'objective']
  },
  {
    id: 'playtime',
    type: 'simple',
    name: 'playtime',
    displayName: 'Playtime',
    description: 'Total time played in seconds',
    source: 'playtime',
    aggregation: 'sum',
    format: 'time',
    category: 'general',
    tags: ['participation']
  }
];

// Ratio metrics
const ratioMetrics: MetricConfig[] = [
  {
    id: 'kd_ratio',
    type: 'ratio',
    name: 'kd_ratio',
    displayName: 'K/D Ratio',
    description: 'Ratio of eliminations to deaths',
    numerator: 'eliminations',
    denominator: 'deaths',
    fallbackValue: 0,
    format: 'ratio',
    category: 'combat',
    tags: ['performance', 'efficiency']
  },
  {
    id: 'fb_ratio',
    type: 'ratio',
    name: 'fb_ratio',
    displayName: 'Final Blow Ratio',
    description: 'Ratio of final blows to deaths',
    numerator: 'final_blows',
    denominator: 'deaths',
    fallbackValue: 0,
    format: 'ratio',
    category: 'combat',
    tags: ['performance', 'efficiency']
  },
  {
    id: 'first_elim_rate',
    type: 'ratio',
    name: 'first_elim_rate',
    displayName: 'First Elimination Rate',
    description: 'Percentage of fights where player gets the first elimination',
    numerator: 'first_elims',
    denominator: 'teamfights_count',
    fallbackValue: 0,
    format: 'percentage',
    category: 'combat',
    tags: ['performance', 'initiation']
  },
  {
    id: 'first_death_rate',
    type: 'ratio',
    name: 'first_death_rate',
    displayName: 'First Death Rate',
    description: 'Percentage of fights where player is the first to die',
    numerator: 'first_deaths',
    denominator: 'teamfights_count',
    fallbackValue: 0,
    format: 'percentage',
    category: 'combat',
    tags: ['performance', 'survival']
  },
  {
    id: 'weapon_accuracy',
    type: 'simple',
    name: 'weapon_accuracy',
    displayName: 'Weapon Accuracy',
    description: 'Percentage of shots that hit an enemy',
    source: 'weapon_accuracy',
    aggregation: 'mean',
    format: 'percentage',
    category: 'combat',
    tags: ['performance', 'precision']
  }
];

// Per-10-minute metrics
const per10MinMetrics: MetricConfig[] = [
  {
    id: 'elims_per_10',
    type: 'per10min',
    name: 'elims_per_10',
    displayName: 'Eliminations per 10 min',
    description: 'Average eliminations per 10 minutes',
    format: 'number',
    source: 'eliminations',
    playtimeField: 'playtime',
    category: 'combat',
    tags: ['performance', 'offensive', 'rate']
  },
  {
    id: 'deaths_per_10',
    type: 'per10min',
    name: 'deaths_per_10',
    displayName: 'Deaths per 10 min',
    description: 'Average deaths per 10 minutes',
    format: 'number',
    source: 'deaths',
    playtimeField: 'playtime',
    category: 'combat',
    tags: ['performance', 'survival', 'rate']
  },
  {
    id: 'final_blows_per_10',
    type: 'per10min',
    name: 'final_blows_per_10',
    displayName: 'Final Blows per 10 min',
    description: 'Average final blows per 10 minutes',
    format: 'number',
    source: 'final_blows',
    playtimeField: 'playtime',
    category: 'combat',
    tags: ['performance', 'offensive', 'rate']
  },
  {
    id: 'hero_damage_per_10',
    type: 'per10min',
    name: 'hero_damage_per_10',
    displayName: 'Hero Damage per 10 min',
    description: 'Average hero damage per 10 minutes',
    format: 'number',
    source: 'hero_damage',
    playtimeField: 'playtime',
    category: 'combat',
    tags: ['performance', 'offensive', 'rate']
  },
  {
    id: 'healing_per_10',
    type: 'per10min',
    name: 'healing_per_10',
    displayName: 'Healing per 10 min',
    description: 'Average healing per 10 minutes',
    format: 'number',
    source: 'healing',
    playtimeField: 'playtime',
    category: 'support',
    tags: ['performance', 'healing', 'rate']
  },
  {
    id: 'damage_blocked_per_10',
    type: 'per10min',
    name: 'damage_blocked_per_10',
    displayName: 'Damage Blocked per 10 min',
    description: 'Average damage blocked per 10 minutes',
    format: 'number',
    source: 'damage_blocked',
    playtimeField: 'playtime',
    category: 'defense',
    tags: ['performance', 'defensive', 'rate']
  }
];

// Derived metrics (basic examples)
const derivedMetrics: MetricConfig[] = [
  {
    id: 'kda',
    type: 'derived',
    name: 'kda',
    displayName: 'KDA',
    description: 'Kill/Death/Assist ratio: (Eliminations + Assists) / Deaths',
    dependencies: ['eliminations', 'deaths', 'defensive_assists', 'offensive_assists'],
    formula: '(eliminations + defensive_assists + offensive_assists) / max(deaths, 1)',
    format: 'ratio',
    category: 'combat',
    tags: ['performance', 'efficiency']
  },
  {
    id: 'teamfight_win_rate',
    type: 'derived',
    name: 'teamfight_win_rate',
    displayName: 'Teamfight Win Rate',
    description: 'Percentage of teamfights won',
    dependencies: ['teamfights_won', 'teamfights_count'],
    formula: 'teamfights_won / max(teamfights_count, 1)',
    format: 'percentage',
    category: 'teamfight',
    tags: ['performance', 'objectives']
  }
];

// Combine all metrics
export const metricConfigurations: MetricConfig[] = [
  ...playerStatsMetrics,
  ...ratioMetrics,
  ...per10MinMetrics,
  ...derivedMetrics
];

// Create an atom to provide the metric configurations
export const metricsConfigAtom = atom(() => {
  // Create a map for easier lookup by ID
  const metricsMap: Record<string, MetricConfig> = {};
  
  metricConfigurations.forEach(metric => {
    metricsMap[metric.id] = metric;
  });
  
  return metricsMap;
});