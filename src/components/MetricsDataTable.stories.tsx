import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricsDataTable } from './MetricsDataTable';
import { ColumnDef } from '@tanstack/react-table';

// Mock data type
interface MockMetricData {
  playerName: string;
  eliminations: number;
  deaths: number;
  assists: number;
  damage: number;
}

// Mock data
const mockData: MockMetricData[] = [
  {
    playerName: "Player1",
    eliminations: 45,
    deaths: 18,
    assists: 32,
    damage: 12500,
  },
  {
    playerName: "Player2",
    eliminations: 38,
    deaths: 22,
    assists: 28,
    damage: 8200,
  },
  {
    playerName: "Player3",
    eliminations: 41,
    deaths: 15,
    assists: 25,
    damage: 15200,
  },
];

// Mock columns
const mockColumns: ColumnDef<MockMetricData, unknown>[] = [
  {
    accessorKey: 'playerName',
    header: 'Player',
  },
  {
    accessorKey: 'eliminations',
    header: 'Eliminations',
  },
  {
    accessorKey: 'deaths',
    header: 'Deaths',
  },
  {
    accessorKey: 'assists',
    header: 'Assists',
  },
  {
    accessorKey: 'damage',
    header: 'Damage',
  },
];

const meta: Meta<typeof MetricsDataTable> = {
  title: 'Components/MetricsDataTable',
  component: MetricsDataTable,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockData,
    columns: mockColumns as ColumnDef<unknown, unknown>[],
  },
};