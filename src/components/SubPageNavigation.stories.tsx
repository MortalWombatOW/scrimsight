import { SubPageNavigation } from "./SubPageNavigation";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SubPageNavigation> = {
  component: SubPageNavigation,
  argTypes: {
    pages: {
      control: "object",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "SubPageNavigation provides tabbed navigation for sub-pages within a main page section.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SubPageNavigation>;

const samplePages = [
  { name: "Overview", href: "/overview" },
  { name: "Statistics", href: "/stats" },
  { name: "Timeline", href: "/timeline" },
  { name: "Players", href: "/players" },
];

export const Default: Story = {
  args: {
    pages: samplePages,
  },
};

export const FewPages: Story = {
  args: {
    pages: [
      { name: "Overview", href: "/overview" },
      { name: "Details", href: "/details" },
    ],
  },
};

export const ManyPages: Story = {
  args: {
    pages: [
      { name: "Overview", href: "/overview" },
      { name: "Statistics", href: "/stats" },
      { name: "Timeline", href: "/timeline" },
      { name: "Players", href: "/players" },
      { name: "Teams", href: "/teams" },
      { name: "Matches", href: "/matches" },
      { name: "Analysis", href: "/analysis" },
    ],
  },
};

export const SinglePage: Story = {
  args: {
    pages: [
      { name: "Overview", href: "/overview" },
    ],
  },
};

// Note: This component requires routing context to function properly
// In a real application, you would need to provide mock router context for Storybook