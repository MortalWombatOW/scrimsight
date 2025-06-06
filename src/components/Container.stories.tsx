import Container from "./Container";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Container> = {
  component: Container,
  argTypes: {
    className: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: <p>This is content inside the container.</p>,
  },
};

export const WithCustomClass: Story = {
  args: {
    children: <p>Container with additional styling</p>,
    className: "max-w-md mx-auto",
  },
};

export const WithMultipleElements: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Container Title</h3>
        <p className="text-gray-600 mb-4">This container holds multiple elements.</p>
        <button className="bg-primary-500 text-white px-4 py-2 rounded">
          Action Button
        </button>
      </div>
    ),
  },
};

export const LargeContent: Story = {
  args: {
    children: (
      <div>
        <h2 className="text-xl font-bold mb-4">Large Content Area</h2>
        <p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p className="mb-2">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p className="mb-2">Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-100 p-3 rounded">Section 1</div>
          <div className="bg-gray-100 p-3 rounded">Section 2</div>
        </div>
      </div>
    ),
  },
};