import { Layout } from "./Layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Layout> = {
  component: Layout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "Layout component provides the main application structure with navigation, header, and content areas.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Page Content</h1>
        <p>This is where page content would appear within the layout.</p>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">Long Content Example</h1>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="text-gray-600">
            This is paragraph {i + 1} to demonstrate how the layout handles longer content that might require scrolling.
          </p>
        ))}
      </div>
    ),
  },
};

export const EmptyContent: Story = {
  args: {
    children: null,
  },
};

// Note: This component requires authentication context and routing to function properly
// In a real application, you would need to provide mock auth context for Storybook