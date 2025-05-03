import { z } from 'zod';

// Base metric configuration schema with common fields
export const BaseMetricConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  format: z.enum(['number', 'percentage', 'time', 'ratio']).default('number'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  defaultFilters: z.record(z.union([z.string(), z.array(z.string())])).optional()
});

export type BaseMetricConfig = z.infer<typeof BaseMetricConfigSchema>;

// Simple metric (direct statistic like eliminations, healing, etc.)
export const SimpleMetricConfigSchema = BaseMetricConfigSchema.extend({
  type: z.literal('simple'),
  source: z.string(),
  aggregation: z.enum(['sum', 'mean', 'max', 'min', 'count']).default('sum')
});

export type SimpleMetricConfig = z.infer<typeof SimpleMetricConfigSchema>;

// Ratio metric (one stat divided by another)
export const RatioMetricConfigSchema = BaseMetricConfigSchema.extend({
  type: z.literal('ratio'),
  numerator: z.string(),
  denominator: z.string(),
  fallbackValue: z.number().default(0)
});

export type RatioMetricConfig = z.infer<typeof RatioMetricConfigSchema>;

// Per-10-minute metric (stat normalized to per-10-minute rate)
export const Per10MinMetricConfigSchema = BaseMetricConfigSchema.extend({
  type: z.literal('per10min'),
  source: z.string(),
  playtimeField: z.string().default('playtime')
});

export type Per10MinMetricConfig = z.infer<typeof Per10MinMetricConfigSchema>;

// Derived metric (custom calculation based on other metrics)
export const DerivedMetricConfigSchema = BaseMetricConfigSchema.extend({
  type: z.literal('derived'),
  dependencies: z.array(z.string()),
  formula: z.string()
});

export type DerivedMetricConfig = z.infer<typeof DerivedMetricConfigSchema>;

// Discriminated union of all metric types
export const MetricConfigSchema = z.discriminatedUnion('type', [
  SimpleMetricConfigSchema,
  RatioMetricConfigSchema,
  Per10MinMetricConfigSchema,
  DerivedMetricConfigSchema
]);

export type MetricConfig = z.infer<typeof MetricConfigSchema>;

// Schema for aggregation parameters
export const AggregationParamsSchema = z.object({
  sourceAtom: z.string(),
  groupBy: z.array(z.string()),
  filters: z.record(z.union([z.string(), z.array(z.string())])).optional(),
  metrics: z.array(z.string()),
  includeCount: z.boolean().default(true)
});

export type AggregationParams = z.infer<typeof AggregationParamsSchema>;