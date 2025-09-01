import type { Meta, StoryObj } from '@storybook/react-vite';
import RoleCard from './RoleCard';
import { Role } from '../lib/ScrimsightDataModel';

const meta: Meta<typeof RoleCard> = {
  title: 'Components/RoleCard',
  component: RoleCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'select',
      options: ['tank', 'damage', 'support'] as Role[],
    },
    playtime: {
      control: { type: 'number', min: 0, max: 10000, step: 100 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Tank: Story = {
  args: {
    role: 'tank',
    playtime: 3600, // 1 hour
  },
};

export const Damage: Story = {
  args: {
    role: 'damage',
    playtime: 5400, // 1.5 hours
  },
};

export const Support: Story = {
  args: {
    role: 'support',
    playtime: 7200, // 2 hours
  },
};

export const ShortPlaytime: Story = {
  args: {
    role: 'tank',
    playtime: 600, // 10 minutes
  },
};

export const LongPlaytime: Story = {
  args: {
    role: 'damage',
    playtime: 18000, // 5 hours
  },
};