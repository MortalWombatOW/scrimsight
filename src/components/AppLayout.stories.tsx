import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { AppLayout } from "./AppLayout";

const meta: Meta<typeof AppLayout> = {
  title: "Components/AppLayout",
  component: AppLayout,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider
          authority="https://demo.auth.com"
          client_id="demo-client"
          redirect_uri="http://localhost:6006/callback"
          scope="openid profile"
        >
          <div className="min-h-screen bg-base-200 dark:bg-base-900">
            <Story />
          </div>
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  args: {
    children: (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 text-base-content/70">Welcome to Scrimsight</p>
        <div className="mt-8 p-6 bg-base-100 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sample Content</h2>
          <p className="text-base-content/70">
            This is the main content area. Navigate using the sidebar to see different pages.
          </p>
        </div>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <div className="space-y-8">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold">Dashboard with Long Content</h1>
          <p className="mt-4 text-base-content/70">Testing scrollable content</p>
        </div>
        
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="p-6 bg-base-100 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Content Block {i + 1}</h2>
            <p className="text-base-content/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        ))}
      </div>
    ),
  },
};

export const EmptyState: Story = {
  args: {},
};