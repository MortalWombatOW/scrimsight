/**
 * Unified metric registry for analysis/team metrics.
 *
 * Complements STAT_CONFIG (player stats) with team-level and
 * analysis metrics used across the V2 journey UI.
 */

export type MetricFormat = 'percent' | 'decimal' | 'per10' | 'time' | 'ratio';

export interface MetricDef {
  key: string;
  label: string;
  fullLabel: string;
  format: MetricFormat;
  lowerIsBetter: boolean;
  decimals: number;
  unit?: string;
}

export const METRIC_DEFS: Record<string, MetricDef> = {
  tfwr: {
    key: 'tfwr',
    label: 'TFWR',
    fullLabel: 'Teamfight Win Rate',
    format: 'percent',
    lowerIsBetter: false,
    decimals: 1,
  },
  deathsPer10: {
    key: 'deathsPer10',
    label: 'D/10',
    fullLabel: 'Deaths per 10 Minutes',
    format: 'per10',
    lowerIsBetter: true,
    decimals: 1,
    unit: '/10min',
  },
  firstPickConversion: {
    key: 'firstPickConversion',
    label: '1st Pick Conv',
    fullLabel: 'First Pick Conversion Rate',
    format: 'percent',
    lowerIsBetter: false,
    decimals: 1,
  },
  firstPickRate: {
    key: 'firstPickRate',
    label: '1st Pick%',
    fullLabel: 'First Pick Rate',
    format: 'percent',
    lowerIsBetter: false,
    decimals: 1,
  },
  dryFightWR: {
    key: 'dryFightWR',
    label: 'Dry WR',
    fullLabel: 'Dry Fight Win Rate',
    format: 'percent',
    lowerIsBetter: false,
    decimals: 1,
  },
  ultEfficiency: {
    key: 'ultEfficiency',
    label: 'Ult Eff',
    fullLabel: 'Ultimate Efficiency',
    format: 'ratio',
    lowerIsBetter: true,
    decimals: 2,
  },
  ultChargeTime: {
    key: 'ultChargeTime',
    label: 'Charge Time',
    fullLabel: 'Ult Charge Time',
    format: 'time',
    lowerIsBetter: true,
    decimals: 0,
    unit: 's',
  },
  winRate: {
    key: 'winRate',
    label: 'Win%',
    fullLabel: 'Win Rate',
    format: 'percent',
    lowerIsBetter: false,
    decimals: 1,
  },
  heroDamageDealtPer10: {
    key: 'heroDamageDealtPer10',
    label: 'DMG/10',
    fullLabel: 'Hero Damage per 10 Minutes',
    format: 'per10',
    lowerIsBetter: false,
    decimals: 0,
    unit: '/10min',
  },
  healingDealtPer10: {
    key: 'healingDealtPer10',
    label: 'Heal/10',
    fullLabel: 'Healing per 10 Minutes',
    format: 'per10',
    lowerIsBetter: false,
    decimals: 0,
    unit: '/10min',
  },
} as const;

export function getMetricDef(key: string): MetricDef | undefined {
  return METRIC_DEFS[key];
}
