import type { Meta, StoryObj } from '@storybook/react';
import { TeamsFilter } from './TeamsFilter';

const meta: Meta<typeof TeamsFilter> = {
  title: 'Components/TeamsFilter',
  component: TeamsFilter,
  parameters: { 
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchQuery: '',
    onSearchChange: () => {},
    sortBy: 'name',
    onSortChange: () => {},
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchQuery: 'Team Alpha',
    onSearchChange: () => {},
    sortBy: 'wins',
    onSortChange: () => {},
  },
};