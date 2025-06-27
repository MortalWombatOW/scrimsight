import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Activity,
  Calendar,
  FileText,
  Bell,
  Filter,
  Download
} from 'lucide-react';
import ScrimsightPage from './ScrimsightPage';
import PageHeader from './PageHeader';
import PageSection from './PageSection';
import PrimaryButton from './PrimaryButton';

const meta: Meta<typeof ScrimsightPage> = {
  title: 'Components/ScrimsightPage',
  component: ScrimsightPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A page layout component that provides a flexible structure with main content area and optional sidebar. Features responsive design that hides the sidebar on smaller screens.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Main content to display in the primary content area',
      control: false,
    },
    sider: {
      description: 'Optional sidebar content (hidden on screens smaller than xl)',
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

// Sample sidebar content
const SampleSidebar = () => (
  <div className="space-y-4">
    <div className="card bg-base-200">
      <div className="card-body p-4">
        <h3 className="card-title text-sm">Quick Actions</h3>
        <div className="space-y-2">
          <button className="btn btn-sm btn-primary w-full">
            <Download size={16} />
            Export Data
          </button>
          <button className="btn btn-sm btn-outline w-full">
            <Filter size={16} />
            Filter Results
          </button>
        </div>
      </div>
    </div>
    
    <div className="card bg-base-200">
      <div className="card-body p-4">
        <h3 className="card-title text-sm">Recent Activity</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Data updated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span>New analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Report generated</span>
          </div>
        </div>
      </div>
    </div>

    <div className="card bg-base-200">
      <div className="card-body p-4">
        <h3 className="card-title text-sm">Settings</h3>
        <div className="space-y-2">
          <div className="form-control">
            <label className="label cursor-pointer py-1">
              <span className="label-text text-xs">Auto-refresh</span>
              <input type="checkbox" className="toggle toggle-xs toggle-primary" defaultChecked />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer py-1">
              <span className="label-text text-xs">Notifications</span>
              <input type="checkbox" className="toggle toggle-xs toggle-secondary" />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Sample main content
const SampleMainContent = () => (
  <div className="space-y-6">
    <PageHeader>
      <PageHeader.Icon>
        <BarChart3 size={32} />
      </PageHeader.Icon>
      <PageHeader.Title>Analytics Dashboard</PageHeader.Title>
    </PageHeader>

    <PageSection variant="card">
      <PageSection.Title>
        <Activity className="mr-2" size={20} />
        Performance Metrics
      </PageSection.Title>
      <PageSection.Description>
        Key performance indicators and system metrics for the current period.
      </PageSection.Description>
      <PageSection.Content layout="grid">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Active Users</div>
          <div className="stat-value text-primary">2.1K</div>
          <div className="stat-desc">+12% from yesterday</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Revenue</div>
          <div className="stat-value text-secondary">$45.2K</div>
          <div className="stat-desc">+8% from last week</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Conversion</div>
          <div className="stat-value">3.4%</div>
          <div className="stat-desc">+0.2% improvement</div>
        </div>
      </PageSection.Content>
    </PageSection>

    <PageSection variant="bordered">
      <PageSection.Title>
        <Users className="mr-2" size={20} />
        Team Overview
      </PageSection.Title>
      <PageSection.Content layout="stack">
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-xs">DV</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm">Development Team</h4>
              <p className="text-xs text-base-content/70">5 members active</p>
            </div>
          </div>
          <div className="badge badge-success badge-sm">Online</div>
        </div>
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-secondary text-secondary-content rounded-full w-10">
                <span className="text-xs">DS</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm">Design Team</h4>
              <p className="text-xs text-base-content/70">3 members active</p>
            </div>
          </div>
          <div className="badge badge-warning badge-sm">Away</div>
        </div>
      </PageSection.Content>
    </PageSection>
  </div>
);

// Basic Examples
export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-base-300 p-6">
      <ScrimsightPage>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Main Content Area</h1>
          <p className="text-base-content/70">
            This is the main content area. The sidebar is hidden on smaller screens and appears on xl+ screens.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Content Card 1</h2>
                <p>Sample content for the main area.</p>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Content Card 2</h2>
                <p>More sample content for the main area.</p>
              </div>
            </div>
          </div>
        </div>
      </ScrimsightPage>
    </div>
  ),
};

export const WithSidebar: Story = {
  render: () => (
    <div className="min-h-screen bg-base-300 p-6">
      <ScrimsightPage sider={<SampleSidebar />}>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Page with Sidebar</h1>
          <p className="text-base-content/70">
            This page has both main content and a sidebar. The sidebar contains quick actions, recent activity, and settings.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Chart Analysis</h2>
                <div className="bg-base-200 h-32 rounded flex items-center justify-center">
                  <BarChart3 size={48} className="text-base-content/30" />
                </div>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">User Stats</h2>
                <div className="bg-base-200 h-32 rounded flex items-center justify-center">
                  <Users size={48} className="text-base-content/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrimsightPage>
    </div>
  ),
};

export const FullDashboard: Story = {
  render: () => (
    <div className="min-h-screen bg-base-300 p-6">
      <ScrimsightPage sider={<SampleSidebar />}>
        <SampleMainContent />
      </ScrimsightPage>
    </div>
  ),
};

// Different Content Types
export const SettingsPage: Story = {
  render: () => (
    <div className="min-h-screen bg-base-300 p-6">
      <ScrimsightPage
        sider={
          <div className="space-y-4">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="card-title text-sm">Navigation</h3>
                <ul className="menu menu-compact">
                  <li><a className="text-sm">General</a></li>
                  <li><a className="text-sm active">Account</a></li>
                  <li><a className="text-sm">Security</a></li>
                  <li><a className="text-sm">Notifications</a></li>
                </ul>
              </div>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <PageHeader>
            <PageHeader.Icon>
              <Settings size={32} />
            </PageHeader.Icon>
            <PageHeader.Title>Settings</PageHeader.Title>
          </PageHeader>

          <PageSection variant="card">
            <PageSection.Title>Account Settings</PageSection.Title>
            <PageSection.Content layout="stack">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input type="text" className="input input-bordered" defaultValue="john_doe" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" className="input input-bordered" defaultValue="john@example.com" />
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Enable notifications</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>
            </PageSection.Content>
          </PageSection>
        </div>
      </ScrimsightPage>
    </div>
  ),
};

export const DataAnalysis: Story = {
  render: () => (
    <div className="min-h-screen bg-base-300 p-6">
      <ScrimsightPage
        sider={
          <div className="space-y-4">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="card-title text-sm">Filters</h3>
                <div className="space-y-2">
                  <select className="select select-sm w-full">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                  <select className="select select-sm w-full">
                    <option>All Teams</option>
                    <option>Team A</option>
                    <option>Team B</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="card-title text-sm">Export</h3>
                <div className="space-y-2">
                  <button className="btn btn-sm btn-outline w-full">
                    <FileText size={16} />
                    CSV
                  </button>
                  <button className="btn btn-sm btn-outline w-full">
                    <FileText size={16} />
                    JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <PageHeader>
            <PageHeader.Icon>
              <BarChart3 size={32} />
            </PageHeader.Icon>
            <PageHeader.Title>Data Analysis</PageHeader.Title>
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card bg-base-100">
              <div className="card-body">
                <h3 className="card-title text-lg">Chart 1</h3>
                <div className="bg-base-200 h-48 rounded flex items-center justify-center">
                  <BarChart3 size={64} className="text-base-content/20" />
                </div>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h3 className="card-title text-lg">Chart 2</h3>
                <div className="bg-base-200 h-48 rounded flex items-center justify-center">
                  <Activity size={64} className="text-base-content/20" />
                </div>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h3 className="card-title text-lg">Chart 3</h3>
                <div className="bg-base-200 h-48 rounded flex items-center justify-center">
                  <Users size={64} className="text-base-content/20" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <h3 className="card-title">Detailed Analysis</h3>
              <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                      <th>Change</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Performance</td>
                      <td>87.5%</td>
                      <td className="text-success">+2.3%</td>
                      <td><div className="badge badge-success">Good</div></td>
                    </tr>
                    <tr>
                      <td>Efficiency</td>
                      <td>92.1%</td>
                      <td className="text-success">+1.8%</td>
                      <td><div className="badge badge-success">Excellent</div></td>
                    </tr>
                    <tr>
                      <td>Quality</td>
                      <td>78.9%</td>
                      <td className="text-error">-0.5%</td>
                      <td><div className="badge badge-warning">Needs Attention</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </ScrimsightPage>
    </div>
  ),
};

// Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
      <ScrimsightPage 
        className="max-w-7xl mx-auto"
        sider={
          <div className="space-y-4">
            <div className="card bg-primary/10 border border-primary/20">
              <div className="card-body p-4">
                <h3 className="card-title text-sm text-primary">Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Bell size={14} className="text-primary" />
                    <span>3 new alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-secondary" />
                    <span>Meeting in 1h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Custom Styled Page
            </h1>
            <p className="text-base-content/70 mt-2">
              This page demonstrates custom styling with gradients and themed colors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30">
              <div className="card-body">
                <h2 className="card-title text-primary">Primary Theme</h2>
                <p>Custom styled card with primary theme colors.</p>
                <div className="card-actions">
                  <PrimaryButton>Action</PrimaryButton>
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30">
              <div className="card-body">
                <h2 className="card-title text-secondary">Secondary Theme</h2>
                <p>Custom styled card with secondary theme colors.</p>
                <div className="card-actions">
                  <button className="btn btn-secondary">Action</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrimsightPage>
    </div>
  ),
};

// Mobile/Responsive Examples
export const ResponsiveDemo: Story = {
  render: () => (
    <div className="min-h-screen bg-base-300 p-4 md:p-6">
      <ScrimsightPage sider={<SampleSidebar />}>
        <div className="space-y-4 md:space-y-6">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold">Responsive Layout</h1>
            <p className="text-sm md:text-base text-base-content/70">
              Resize the viewport to see how the sidebar behaves on different screen sizes.
            </p>
          </div>
          
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Responsive Behavior</h3>
              <div className="text-xs">Sidebar is hidden on mobile/tablet (&lt; xl) and visible on desktop (xl+)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card bg-base-100 card-compact">
              <div className="card-body">
                <h2 className="card-title text-sm md:text-base">Mobile First</h2>
                <p className="text-xs md:text-sm">Optimized for mobile viewing.</p>
              </div>
            </div>
            <div className="card bg-base-100 card-compact">
              <div className="card-body">
                <h2 className="card-title text-sm md:text-base">Tablet Ready</h2>
                <p className="text-xs md:text-sm">Adapts to tablet screens.</p>
              </div>
            </div>
            <div className="card bg-base-100 card-compact">
              <div className="card-body">
                <h2 className="card-title text-sm md:text-base">Desktop Enhanced</h2>
                <p className="text-xs md:text-sm">Full experience on desktop.</p>
              </div>
            </div>
          </div>
        </div>
      </ScrimsightPage>
    </div>
  ),
};