import { SubPageNavigation } from "./SubPageNavigation";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SubPageNavigation> = {
  component: SubPageNavigation,
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

const sampleNavItems = [
  { path: "/overview", label: "Overview", end: true },
  { path: "/stats", label: "Statistics" },
  { path: "/timeline", label: "Timeline" },
  { path: "/players", label: "Players" },
];

export const Default: Story = {
  args: {
    navItems: sampleNavItems,
  },
};

export const FewPages: Story = {
  args: {
    navItems: [
      { path: "/overview", label: "Overview", end: true },
      { path: "/details", label: "Details" },
    ],
  },
};

export const ManyPages: Story = {
  args: {
    navItems: [
      { path: "/overview", label: "Overview", end: true },
      { path: "/stats", label: "Statistics" },
      { path: "/timeline", label: "Timeline" },
      { path: "/players", label: "Players" },
      { path: "/teams", label: "Teams" },
      { path: "/matches", label: "Matches" },
      { path: "/analysis", label: "Analysis" },
    ],
  },
};

export const SinglePage: Story = {
  args: {
    navItems: [
      { path: "/overview", label: "Overview", end: true },
    ],
  },
};

// Note: This component requires routing context to function properly
// In a real application, you would need to provide mock router context for Storybook