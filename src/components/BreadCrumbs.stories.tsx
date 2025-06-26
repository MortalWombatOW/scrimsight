import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Settings, User, FileText } from 'lucide-react';
import BreadCrumbs from './BreadCrumbs';

const meta: Meta<typeof BreadCrumbs> = {
  title: 'Components/BreadCrumbs',
  component: BreadCrumbs,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="bg-base-100 p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of breadcrumb items',
    },
    className: {
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    items: [
      { label: 'Home', path: '/' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Current Page' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', path: '/', icon: <Home size={16} /> },
      { label: 'Settings', path: '/settings', icon: <Settings size={16} /> },
      { label: 'Profile', path: '/profile', icon: <User size={16} /> },
      { label: 'Edit Profile', icon: <FileText size={16} /> },
    ],
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: 'Home', path: '/' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Analytics', path: '/dashboard/analytics' },
      { label: 'Reports', path: '/dashboard/analytics/reports' },
      { label: 'Monthly Report', path: '/dashboard/analytics/reports/monthly' },
      { label: 'Current Report' },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', path: '/' },
      { label: 'Current Page' },
    ],
  },
};

export const SingleLevel: Story = {
  args: {
    items: [
      { label: 'Current Page' },
    ],
  },
};

export const GameAnalytics: Story = {
  args: {
    items: [
      { label: 'Home', path: '/' },
      { label: 'Games', path: '/games' },
      { label: 'Match Analysis', path: '/games/analysis' },
      { label: 'Player Performance' },
    ],
  },
};

export const WithCustomStyling: Story = {
  args: {
    items: [
      { label: 'Home', path: '/', icon: <Home size={16} /> },
      { label: 'Settings', path: '/settings', icon: <Settings size={16} /> },
      { label: 'Advanced Settings', icon: <Settings size={16} /> },
    ],
    className: 'text-sm',
  },
};