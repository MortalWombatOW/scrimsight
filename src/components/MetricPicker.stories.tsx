import type { Meta, StoryObj } from '@storybook/react-vite';
import MetricPicker from './MetricPicker';
import { PlayerStatsNumericalKeys } from '../lib/ScrimsightDataModel';

const sampleMetrics: PlayerStatsNumericalKeys[] = [
  'eliminations',
  'finalBlows', 
  'deaths',
  'heroDamageDealt',
  'healingDealt',
  'eliminationsPer10Minutes',
  'weaponAccuracy'
];

const meta: Meta<typeof MetricPicker> = {
  title: 'Components/MetricPicker',
  component: MetricPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'metric-changed' },
    selected: {
      control: 'select',
      options: sampleMetrics,
    },
    metrics: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    metrics: sampleMetrics,
    selected: 'eliminations',
  },
};

export const WithManyMetrics: Story = {
  args: {
    metrics: [
      'eliminations',
      'finalBlows',
      'deaths',
      'allDamageDealt',
      'barrierDamageDealt',
      'heroDamageDealt',
      'healingDealt',
      'healingReceived',
      'selfHealing',
      'damageTaken',
      'damageBlocked',
      'eliminationsPer10Minutes',
      'finalBlowsPer10Minutes',
      'deathsPer10Minutes',
      'weaponAccuracy',
      'scopedWeaponAccuracy',
      'criticalHitRate'
    ],
    selected: 'heroDamageDealt',
  },
};

export const LongMetricName: Story = {
  args: {
    metrics: [
      'eliminationsPer10Minutes',
      'finalBlowsPer10Minutes', 
      'heroDamageDealtPer10Minutes',
      'barrierDamageDealtPer10Minutes'
    ],
    selected: 'heroDamageDealtPer10Minutes',
  },
};