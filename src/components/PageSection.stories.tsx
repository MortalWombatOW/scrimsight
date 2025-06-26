import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Database, 
  Activity,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import PageSection from './PageSection';
import PrimaryButton from './PrimaryButton';

const meta: Meta<typeof PageSection> = {
  title: 'Components/PageSection',
  component: PageSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible page section component that can be composed with Title, Description, and Content subcomponents. Supports different variants (default, card, bordered) and content layouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Content to display inside the section (typically Title, Description, and Content components)',
      control: false,
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    variant: {
      control: 'select',
      options: ['default', 'card', 'bordered'],
      description: 'Visual variant of the section',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  render: () => (
    <PageSection>
      <PageSection.Title>Section Title</PageSection.Title>
      <PageSection.Description>
        This is a basic section with a title and description.
      </PageSection.Description>
      <PageSection.Content>
        <div className="bg-base-200 p-4 rounded">
          Section content goes here.
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};

export const CardVariant: Story = {
  render: () => (
    <PageSection variant="card">
      <PageSection.Title>Card Section</PageSection.Title>
      <PageSection.Description>
        This section uses the card variant with shadow and background.
      </PageSection.Description>
      <PageSection.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-200 p-3 rounded">Item 1</div>
          <div className="bg-base-200 p-3 rounded">Item 2</div>
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};

export const BorderedVariant: Story = {
  render: () => (
    <PageSection variant="bordered">
      <PageSection.Title>Bordered Section</PageSection.Title>
      <PageSection.Description>
        This section uses the bordered variant with a subtle border.
      </PageSection.Description>
      <PageSection.Content>
        <div className="flex gap-2">
          <PrimaryButton>Action 1</PrimaryButton>
          <button className="btn btn-outline">Action 2</button>
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};

// Different Title Levels
export const H1Title: Story = {
  render: () => (
    <PageSection>
      <PageSection.Title as="h1">Main Section</PageSection.Title>
      <PageSection.Description>
        This section uses an h1 title for primary content areas.
      </PageSection.Description>
    </PageSection>
  ),
};

export const H2Title: Story = {
  render: () => (
    <PageSection>
      <PageSection.Title as="h2">Subsection</PageSection.Title>
      <PageSection.Description>
        This section uses an h2 title for secondary content areas.
      </PageSection.Description>
    </PageSection>
  ),
};

export const H3Title: Story = {
  render: () => (
    <PageSection>
      <PageSection.Title as="h3">Minor Section</PageSection.Title>
      <PageSection.Description>
        This section uses an h3 title for tertiary content areas.
      </PageSection.Description>
    </PageSection>
  ),
};

export const H4Title: Story = {
  render: () => (
    <PageSection>
      <PageSection.Title as="h4">Detail Section</PageSection.Title>
      <PageSection.Description>
        This section uses an h4 title for detailed content areas.
      </PageSection.Description>
    </PageSection>
  ),
};

// Different Content Layouts
export const GridLayout: Story = {
  render: () => (
    <PageSection variant="card">
      <PageSection.Title>
        <Database className="mr-2" size={20} />
        Data Overview
      </PageSection.Title>
      <PageSection.Description>
        Grid layout is perfect for displaying multiple items in a structured format.
      </PageSection.Description>
      <PageSection.Content layout="grid">
        <div className="bg-base-200 p-4 rounded-lg text-center">
          <BarChart3 className="mx-auto mb-2" size={24} />
          <h4 className="font-semibold">Analytics</h4>
          <p className="text-sm text-base-content/70">View reports</p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg text-center">
          <Users className="mx-auto mb-2" size={24} />
          <h4 className="font-semibold">Users</h4>
          <p className="text-sm text-base-content/70">Manage users</p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg text-center">
          <Settings className="mx-auto mb-2" size={24} />
          <h4 className="font-semibold">Settings</h4>
          <p className="text-sm text-base-content/70">Configure system</p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg text-center">
          <Activity className="mx-auto mb-2" size={24} />
          <h4 className="font-semibold">Activity</h4>
          <p className="text-sm text-base-content/70">Monitor system</p>
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};

export const FlexLayout: Story = {
  render: () => (
    <PageSection variant="bordered">
      <PageSection.Title>
        <TrendingUp className="mr-2" size={20} />
        Quick Actions
      </PageSection.Title>
      <PageSection.Description>
        Flex layout is ideal for action buttons and controls that should flow naturally.
      </PageSection.Description>
      <PageSection.Content layout="flex">
        <PrimaryButton>Primary Action</PrimaryButton>
        <button className="btn btn-outline">Secondary</button>
        <button className="btn btn-ghost">Tertiary</button>
        <div className="badge badge-primary">New</div>
        <div className="badge badge-outline">Status</div>
      </PageSection.Content>
    </PageSection>
  ),
};

export const StackLayout: Story = {
  render: () => (
    <PageSection>
      <PageSection.Title>
        <FileText className="mr-2" size={20} />
        Recent Updates
      </PageSection.Title>
      <PageSection.Description>
        Stack layout works well for lists and sequential content that should be displayed vertically.
      </PageSection.Description>
      <PageSection.Content layout="stack">
        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="flex-1">
            <h4 className="font-medium">System Update</h4>
            <p className="text-sm text-base-content/70">Updated 2 hours ago</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
          <div className="flex-1">
            <h4 className="font-medium">New User Registration</h4>
            <p className="text-sm text-base-content/70">Updated 4 hours ago</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
          <div className="flex-1">
            <h4 className="font-medium">Database Backup</h4>
            <p className="text-sm text-base-content/70">Updated 6 hours ago</p>
          </div>
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};

// Real-world Examples
export const DashboardStats: Story = {
  render: () => (
    <PageSection variant="card">
      <PageSection.Title>
        <BarChart3 className="mr-2" size={20} />
        Performance Metrics
      </PageSection.Title>
      <PageSection.Description>
        Key performance indicators for the current month.
      </PageSection.Description>
      <PageSection.Content layout="grid">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">31K</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Revenue</div>
          <div className="stat-value text-secondary">$89,400</div>
          <div className="stat-desc">12% increase</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Orders</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">90 orders today</div>
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};

export const TeamSection: Story = {
  render: () => (
    <PageSection variant="bordered">
      <PageSection.Title>
        <Users className="mr-2" size={20} />
        Team Members
      </PageSection.Title>
      <PageSection.Description>
        Manage your team members and their roles in the organization.
      </PageSection.Description>
      <PageSection.Content layout="stack">
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                <span>JD</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium">John Doe</h4>
              <p className="text-sm text-base-content/70">Administrator</p>
            </div>
          </div>
          <button className="btn btn-sm btn-outline">Edit</button>
        </div>
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                <span>JS</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium">Jane Smith</h4>
              <p className="text-sm text-base-content/70">Developer</p>
            </div>
          </div>
          <button className="btn btn-sm btn-outline">Edit</button>
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};

export const SettingsPanel: Story = {
  render: () => (
    <PageSection variant="card">
      <PageSection.Title>
        <Settings className="mr-2" size={20} />
        Application Settings
      </PageSection.Title>
      <PageSection.Description>
        Configure your application preferences and system settings.
      </PageSection.Description>
      <PageSection.Content layout="stack">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Enable notifications</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Dark mode</span>
            <input type="checkbox" className="toggle toggle-secondary" />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Auto-save</span>
            <input type="checkbox" className="toggle toggle-accent" defaultChecked />
          </label>
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};

// Multiple Sections Layout
export const MultipleSections: Story = {
  render: () => (
    <div className="space-y-6">
      <PageSection variant="card">
        <PageSection.Title>
          <Calendar className="mr-2" size={20} />
          Recent Activity
        </PageSection.Title>
        <PageSection.Content layout="stack">
          <div className="text-sm text-base-content/70">Updated dashboard layout</div>
          <div className="text-sm text-base-content/70">Added new team member</div>
          <div className="text-sm text-base-content/70">Completed system backup</div>
        </PageSection.Content>
      </PageSection>
      
      <PageSection variant="bordered">
        <PageSection.Title>
          <TrendingUp className="mr-2" size={20} />
          Quick Stats
        </PageSection.Title>
        <PageSection.Content layout="flex">
          <div className="stat">
            <div className="stat-title">Active</div>
            <div className="stat-value text-sm">89%</div>
          </div>
          <div className="stat">
            <div className="stat-title">Growth</div>
            <div className="stat-value text-sm">+12%</div>
          </div>
        </PageSection.Content>
      </PageSection>
    </div>
  ),
};

// Minimal Examples
export const TitleOnly: Story = {
  render: () => (
    <PageSection>
      <PageSection.Title>Simple Title</PageSection.Title>
    </PageSection>
  ),
};

export const TitleWithDescription: Story = {
  render: () => (
    <PageSection>
      <PageSection.Title>Section with Description</PageSection.Title>
      <PageSection.Description>
        This section only has a title and description, no additional content.
      </PageSection.Description>
    </PageSection>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <PageSection variant="card">
      <PageSection.Content>
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Content Only Section</h3>
          <p className="text-base-content/70">This section contains only content, no separate title or description.</p>
        </div>
      </PageSection.Content>
    </PageSection>
  ),
};