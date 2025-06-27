import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Provider as JotaiProvider } from 'jotai';
import { AuthProvider } from 'react-oidc-context';
import { AppLayout } from './AppLayout';

// Mock OIDC configuration for Storybook
const oidcConfig = {
  authority: 'https://example.com',
  client_id: 'storybook-client',
  redirect_uri: 'http://localhost:6006',
  response_type: 'code',
  scope: 'openid profile',
  automaticSilentRenew: false,
  loadUserInfo: false,
};

// Decorator to provide necessary context providers
const WithProviders = (Story: React.ComponentType) => (
  <AuthProvider {...oidcConfig}>
    <JotaiProvider>
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    </JotaiProvider>
  </AuthProvider>
);

const meta: Meta<typeof AppLayout> = {
  title: 'Components/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main application layout component with navigation sidebar, header, and content area. Includes authentication state handling and data loading states.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [WithProviders],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to render in the main area',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to Scrimsight</h1>
        <p className="text-gray-600">This is the main content area of the application.</p>
      </div>
    ),
  },
};

export const WithoutChildren: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Layout without children renders an Outlet for React Router navigation.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Loading Content</h1>
        <p className="text-gray-600">This content should be hidden while data is loading.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading spinner overlay when data is not ready. Note: In Storybook, the loading state logic is simplified.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    children: (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Mobile Layout</h1>
        <p className="text-sm text-gray-600">The sidebar is collapsed on mobile devices and accessible via the hamburger menu.</p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile responsive layout with collapsible sidebar accessible via hamburger menu.',
      },
    },
  },
};

export const DesktopView: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Desktop Layout</h1>
        <p className="text-gray-600">The sidebar is always visible on desktop screens (lg and above).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-base-100 p-4 rounded-lg shadow">
            <h3 className="font-semibold">Feature 1</h3>
            <p className="text-sm text-gray-600">Sample content card</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg shadow">
            <h3 className="font-semibold">Feature 2</h3>
            <p className="text-sm text-gray-600">Another content card</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg shadow">
            <h3 className="font-semibold">Feature 3</h3>
            <p className="text-sm text-gray-600">Third content card</p>
          </div>
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Desktop layout with persistent sidebar and full content area.',
      },
    },
  },
};

export const WithRichContent: Story = {
  args: {
    children: (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Scrimsight Dashboard</h1>
          <p className="text-gray-600">Comprehensive esports analytics and match insights</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Total Scrims</div>
            <div className="stat-value text-primary">247</div>
            <div className="stat-desc">↗︎ 12% from last month</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Win Rate</div>
            <div className="stat-value text-secondary">68%</div>
            <div className="stat-desc">↗︎ 4% improvement</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Avg KDA</div>
            <div className="stat-value">2.4</div>
            <div className="stat-desc">↘︎ 0.2 from last week</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Players</div>
            <div className="stat-value">18</div>
            <div className="stat-desc">Active this season</div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Scrim completed against Team Alpha</span>
              <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">New player joined the roster</span>
              <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Match data uploaded</span>
              <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of the layout with rich dashboard content including statistics cards and activity feed.',
      },
    },
  },
};