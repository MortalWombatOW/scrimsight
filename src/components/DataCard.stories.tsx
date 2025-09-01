import type { Meta, StoryObj } from '@storybook/react-vite';
import DataCard from './DataCard';

const meta: Meta<typeof DataCard> = {
  title: 'Components/DataCard',
  component: DataCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'number', min: 100, max: 500, step: 10 },
    },
    height: {
      control: { type: 'number', min: 50, max: 300, step: 10 },
    },
    backgroundColor: {
      control: 'color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 200,
    height: 120,
    children: (
      <div className="text-center">
        <div className="text-2xl font-bold">42</div>
        <div className="text-sm opacity-80">Sample Metric</div>
      </div>
    ),
  },
};

export const WithBackground: Story = {
  args: {
    width: 250,
    height: 150,
    background: (
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
    ),
    children: (
      <div className="text-center z-10">
        <div className="text-3xl font-bold">1,337</div>
        <div className="text-sm opacity-90">Total Score</div>
      </div>
    ),
  },
};

export const CustomColor: Story = {
  args: {
    width: 180,
    height: 100,
    backgroundColor: '#059669',
    children: (
      <div className="text-center">
        <div className="text-xl font-bold">95%</div>
        <div className="text-xs opacity-80">Win Rate</div>
      </div>
    ),
  },
};