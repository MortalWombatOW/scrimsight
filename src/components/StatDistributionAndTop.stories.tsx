import type { Meta, StoryObj } from '@storybook/react';
import StatDistributionAndTop from './StatDistributionAndTop';

const meta: Meta<typeof StatDistributionAndTop> = {
  title: 'Components/StatDistributionAndTop',
  component: StatDistributionAndTop,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    statName: {
      control: 'text',
    },
    statValue: {
      control: 'number',
    },
    statDescription: {
      control: 'text',
    },
    higherIsBetter: {
      control: 'boolean',
    },
    precision: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRows = [
  { category: "Tank", value: 85 },
  { category: "DPS", value: 120 },
  { category: "Support", value: 95 },
  { category: "Flex", value: 75 },
  { category: "Assassin", value: 110 },
];

const largeDataset = [
  { category: "Damage Per Match", value: 2850 },
  { category: "Eliminations", value: 18 },
  { category: "Deaths", value: 8 },
  { category: "Assists", value: 12 },
  { category: "Healing Done", value: 1250 },
  { category: "Damage Blocked", value: 980 },
  { category: "Objective Time", value: 45 },
  { category: "Final Blows", value: 14 },
];

export const Default: Story = {
  args: {
    statName: "Average Hero Rating",
    statValue: 97,
    statDescription: "Average performance rating across all hero roles in competitive matches",
    rows: sampleRows,
  },
};

export const WinRateByRole: Story = {
  args: {
    statName: "Win Rate",
    statValue: 68.5,
    statDescription: "Overall win percentage in ranked competitive matches",
    rows: [
      { category: "Tank", value: 72 },
      { category: "DPS", value: 65 },
      { category: "Support", value: 71 },
      { category: "Flex", value: 69 },
    ],
    higherIsBetter: true,
    precision: 1,
  },
};

export const HigherIsBadStat: Story = {
  args: {
    statName: "Average Deaths",
    statValue: 7.2,
    statDescription: "Average number of deaths per competitive match",
    rows: [
      { category: "Tank", value: 5.8 },
      { category: "DPS", value: 8.1 },
      { category: "Support", value: 6.9 },
      { category: "Assassin", value: 9.3 },
    ],
    higherIsBetter: false,
    precision: 1,
  },
};

export const LargeNumbers: Story = {
  args: {
    statName: "Total Damage",
    statValue: 2850,
    statDescription: "Total damage dealt across all competitive matches this season",
    rows: largeDataset,
    higherIsBetter: true,
    precision: 0,
  },
};

export const SingleCategory: Story = {
  args: {
    statName: "Main Hero Performance",
    statValue: 92,
    statDescription: "Performance rating on your most played hero",
    rows: [
      { category: "Main Hero", value: 92 },
    ],
  },
};

export const ManyCategories: Story = {
  args: {
    statName: "Map Performance",
    statValue: 78.5,
    statDescription: "Average win rate across different map types",
    rows: [
      { category: "King's Row", value: 85 },
      { category: "Hanamura", value: 72 },
      { category: "Dorado", value: 88 },
      { category: "Temple of Anubis", value: 65 },
      { category: "Gibraltar", value: 91 },
      { category: "Volskaya", value: 69 },
      { category: "Route 66", value: 82 },
      { category: "Numbani", value: 77 },
      { category: "Hollywood", value: 79 },
      { category: "Ilios", value: 86 },
    ],
    higherIsBetter: true,
    precision: 0,
  },
};