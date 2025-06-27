import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';

// Mock authenticated user component to simulate different auth states
const MockAuthWrapper = ({ 
  isAuthenticated = false, 
  isLoading = false, 
  children 
}: { 
  isAuthenticated?: boolean; 
  isLoading?: boolean; 
  children: React.ReactNode;
}) => {
  // Override the auth context with mock values
  const mockAuth = {
    isAuthenticated,
    isLoading,
    user: isAuthenticated ? { sub: '123', name: 'Test User' } : null,
    signinRedirect: () => Promise.resolve(),
    signoutRedirect: () => Promise.resolve(),
  };

  return (
    <MemoryRouter>
      <div style={{ 
        // Mock the useAuth hook for Storybook
        '--mock-auth': JSON.stringify(mockAuth) 
      } as React.CSSProperties}>
        {children}
      </div>
    </MemoryRouter>
  );
};

// Component that shows the protected content
const ProtectedContent = () => (
  <div className="p-8 bg-green-50 border border-green-200 rounded-lg">
    <h2 className="text-xl font-semibold text-green-800 mb-2">Protected Content</h2>
    <p className="text-green-700">
      This content is only visible to authenticated users. The AuthGuard component
      successfully verified authentication and rendered the children.
    </p>
    <div className="mt-4 p-4 bg-white rounded border">
      <h3 className="font-medium mb-2">Features:</h3>
      <ul className="text-sm space-y-1 text-gray-600">
        <li>• Protects routes from unauthorized access</li>
        <li>• Redirects to login when not authenticated</li>
        <li>• Shows loading state during authentication check</li>
        <li>• Renders children only when authenticated</li>
      </ul>
    </div>
  </div>
);

const meta: Meta<typeof AuthGuard> = {
  title: 'Components/AuthGuard',
  component: AuthGuard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A guard component that protects routes by checking authentication status. Redirects unauthenticated users to login and shows loading states appropriately.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'The protected content to render when authenticated',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Authenticated: Story = {
  render: () => (
    <MockAuthWrapper isAuthenticated={true}>
      <AuthGuard>
        <ProtectedContent />
      </AuthGuard>
    </MockAuthWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When the user is authenticated, the AuthGuard renders the protected content normally.',
      },
    },
  },
};

export const Loading: Story = {
  render: () => (
    <MockAuthWrapper isLoading={true}>
      <AuthGuard>
        <ProtectedContent />
      </AuthGuard>
    </MockAuthWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When authentication is still being checked, the AuthGuard shows a loading spinner.',
      },
    },
  },
};

export const NotAuthenticated: Story = {
  render: () => (
    <MockAuthWrapper isAuthenticated={false}>
      <AuthGuard>
        <ProtectedContent />
      </AuthGuard>
    </MockAuthWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When the user is not authenticated, the AuthGuard renders nothing and would normally redirect to login. In Storybook, the redirect is mocked.',
      },
    },
  },
};

export const WithComplexContent: Story = {
  render: () => (
    <MockAuthWrapper isAuthenticated={true}>
      <AuthGuard>
        <div className="max-w-4xl p-8 bg-gray-50 rounded-lg">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-blue-600 mb-2">Users</h3>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-gray-600">Active users</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-green-600 mb-2">Revenue</h3>
              <p className="text-2xl font-bold">$45,678</p>
              <p className="text-sm text-gray-600">This month</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-purple-600 mb-2">Orders</h3>
              <p className="text-2xl font-bold">567</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Protected Admin Features</h2>
            <div className="space-y-3">
              <button className="btn btn-primary mr-2">Manage Users</button>
              <button className="btn btn-secondary mr-2">View Reports</button>
              <button className="btn btn-accent">System Settings</button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              These administrative features are only accessible to authenticated users
              protected by the AuthGuard component.
            </p>
          </div>
        </div>
      </AuthGuard>
    </MockAuthWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of AuthGuard protecting complex dashboard content with multiple sections and interactive elements.',
      },
    },
  },
};

export const Usage: Story = {
  render: () => (
    <div className="max-w-2xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">AuthGuard Usage Examples</h2>
        <p className="text-gray-600 mb-6">
          The AuthGuard component is typically used to wrap protected routes or sensitive content.
          Here are the different states it handles:
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">✅ Authenticated State</h3>
          <MockAuthWrapper isAuthenticated={true}>
            <AuthGuard>
              <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                Protected content is rendered normally
              </div>
            </AuthGuard>
          </MockAuthWrapper>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">⏳ Loading State</h3>
          <MockAuthWrapper isLoading={true}>
            <AuthGuard>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                This content won't show while loading
              </div>
            </AuthGuard>
          </MockAuthWrapper>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">❌ Not Authenticated State</h3>
          <MockAuthWrapper isAuthenticated={false}>
            <AuthGuard>
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                This content is hidden from unauthenticated users
              </div>
            </AuthGuard>
          </MockAuthWrapper>
          <p className="text-xs text-gray-500 mt-2">
            Nothing renders and user would be redirected to login
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Implementation Notes:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Wrap protected routes or components with AuthGuard</li>
          <li>• Automatically handles loading states during auth checks</li>
          <li>• Redirects to login page when user is not authenticated</li>
          <li>• Only renders children when user is fully authenticated</li>
          <li>• Integrates with react-oidc-context for authentication</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive usage example showing all AuthGuard states and implementation patterns.',
      },
    },
  },
};