import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Database, 
  Activity,
  TrendingUp,
  Shield,
  Target
} from 'lucide-react';
import PageHeader from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible page header component with support for icons and titles. Can be composed with PageHeader.Icon and PageHeader.Title subcomponents.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Content to display inside the header (typically Icon and Title components)',
      control: false,
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Title>Page Title</PageHeader.Title>
    </PageHeader>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <BarChart3 size={32} />
      </PageHeader.Icon>
      <PageHeader.Title>Analytics Dashboard</PageHeader.Title>
    </PageHeader>
  ),
};

// Different heading levels
export const H1Title: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <Database size={32} />
      </PageHeader.Icon>
      <PageHeader.Title as="h1">Main Dashboard</PageHeader.Title>
    </PageHeader>
  ),
};

export const H2Title: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <Users size={28} />
      </PageHeader.Icon>
      <PageHeader.Title as="h2">Team Management</PageHeader.Title>
    </PageHeader>
  ),
};

export const H3Title: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <Settings size={24} />
      </PageHeader.Icon>
      <PageHeader.Title as="h3">Settings Panel</PageHeader.Title>
    </PageHeader>
  ),
};

// Real-world Use Cases
export const AnalyticsDashboard: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <TrendingUp size={32} />
      </PageHeader.Icon>
      <PageHeader.Title>Performance Analytics</PageHeader.Title>
    </PageHeader>
  ),
};

export const UserManagement: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <Users size={32} />
      </PageHeader.Icon>
      <PageHeader.Title>User Management</PageHeader.Title>
    </PageHeader>
  ),
};

export const SystemMonitoring: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <Activity size={32} />
      </PageHeader.Icon>
      <PageHeader.Title>System Health</PageHeader.Title>
    </PageHeader>
  ),
};

export const SecuritySettings: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <Shield size={32} />
      </PageHeader.Icon>
      <PageHeader.Title>Security Configuration</PageHeader.Title>
    </PageHeader>
  ),
};

// Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <PageHeader className="bg-primary/10 rounded-lg p-4 border-l-4 border-primary">
      <PageHeader.Icon className="text-primary">
        <Target size={32} />
      </PageHeader.Icon>
      <PageHeader.Title className="text-primary">Campaign Metrics</PageHeader.Title>
    </PageHeader>
  ),
};

// Icon Only
export const IconOnly: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <BarChart3 size={32} />
      </PageHeader.Icon>
    </PageHeader>
  ),
};

// Title Only
export const TitleOnly: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Title>Simple Page Header</PageHeader.Title>
    </PageHeader>
  ),
};

// Different Icon Sizes
export const LargeIcon: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <Database size={48} />
      </PageHeader.Icon>
      <PageHeader.Title>Data Center</PageHeader.Title>
    </PageHeader>
  ),
};

export const SmallIcon: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Icon>
        <Settings size={20} />
      </PageHeader.Icon>
      <PageHeader.Title as="h3">Quick Settings</PageHeader.Title>
    </PageHeader>
  ),
};

// Layout Examples
export const InContainer: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto bg-base-200 p-6 rounded-lg">
      <PageHeader>
        <PageHeader.Icon>
          <BarChart3 size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Contained Header</PageHeader.Title>
      </PageHeader>
      <div className="mt-4 text-base-content/70">
        This header is contained within a card-like layout.
      </div>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
      <PageHeader>
        <PageHeader.Icon>
          <TrendingUp size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Full Width Header</PageHeader.Title>
      </PageHeader>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};