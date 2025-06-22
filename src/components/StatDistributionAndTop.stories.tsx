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
    statDescription: {
      control: 'text',
    },
    categoryKeys: {
      control: 'object',
    },
    rows: {
      control: 'object',
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
  { playerName: "Tank", value: 85 },
  { playerName: "DPS", value: 120 },
  { playerName: "Support", value: 95 },
  { playerName: "Flex", value: 75 },
  { playerName: "Assassin", value: 110 },
];

const largeDataset = [
  { matchId: "Damage Per Match", value: 2850 },
  { matchId: "Eliminations", value: 18 },
  { matchId: "Deaths", value: 8 },
  { matchId: "Assists", value: 12 },
  { matchId: "Healing Done", value: 1250 },
  { matchId: "Damage Blocked", value: 980 },
  { matchId: "Objective Time", value: 45 },
  { matchId: "Final Blows", value: 14 },
];

export const Default: Story = {
  args: {
    statName: "Average Hero Rating",
    statDescription: "Average performance rating across all hero roles in competitive matches",
    categoryKeys: ["playerName"],
    rows: sampleRows,
  },
};

export const WinRateByRole: Story = {
  args: {
    statName: "Win Rate",
    statDescription: "Overall win percentage in ranked competitive matches",
    categoryKeys: ["playerName"],
    rows: [
      { playerName: "Tank", value: 72 },
      { playerName: "DPS", value: 65 },
      { playerName: "Support", value: 71 },
      { playerName: "Flex", value: 69 },
    ],
    higherIsBetter: true,
    precision: 1,
  },
};

export const HigherIsBadStat: Story = {
  args: {
    statName: "Average Deaths",
    statDescription: "Average number of deaths per competitive match",
    categoryKeys: ["playerName"],
    rows: [
      { playerName: "Tank", value: 5.8 },
      { playerName: "DPS", value: 8.1 },
      { playerName: "Support", value: 6.9 },
      { playerName: "Assassin", value: 9.3 },
    ],
    higherIsBetter: false,
    precision: 1,
  },
};

export const LargeNumbers: Story = {
  args: {
    statName: "Total Damage",
    statDescription: "Total damage dealt across all competitive matches this season",
    categoryKeys: ["matchId"],
    rows: largeDataset,
    higherIsBetter: true,
    precision: 0,
  },
};

export const SingleCategory: Story = {
  args: {
    statName: "Main Hero Performance",
    statDescription: "Performance rating on your most played hero",
    categoryKeys: ["playerName"],
    rows: [
      { playerName: "Main Hero", value: 92 },
    ],
  },
};

export const ManyCategories: Story = {
  args: {
    statName: "Map Performance",
    statDescription: "Average win rate across different map types",
    categoryKeys: ["mapName"],
    rows: [
      { mapName: "King's Row", value: 85 },
      { mapName: "Hanamura", value: 72 },
      { mapName: "Dorado", value: 88 },
      { mapName: "Temple of Anubis", value: 65 },
      { mapName: "Gibraltar", value: 91 },
      { mapName: "Volskaya", value: 69 },
      { mapName: "Route 66", value: 82 },
      { mapName: "Numbani", value: 77 },
      { mapName: "Hollywood", value: 79 },
      { mapName: "Ilios", value: 86 },
    ],
    higherIsBetter: true,
    precision: 0,
  },
};