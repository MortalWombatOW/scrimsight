import { CardBase, CardBaseFact } from "./CardBase";
import type { Meta, StoryObj } from "@storybook/react";
import { HealingIcon } from "@icons";

const meta: Meta<typeof CardBase> = {
  component: CardBase,
  argTypes: {
    linkUrl: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardBase>;

export const Default: Story = {
  args: {
    title: "Sample Card",
    primaryStats: [
      { value: "1,234", label: "Total Damage" },
      { value: "567", label: "Healing Done" },
    ],
    secondaryStats: [
      { value: "89%", label: "Accuracy" },
    ],
    info: (
      <div className="space-y-2">
        <CardBaseFact value="Team Alpha" label="Team" />
        <CardBaseFact value="DPS" label="Role" />
      </div>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    title: "Player Stats",
    icon: <HealingIcon size={24} fill="currentColor" />,
    primaryStats: [
      { value: "2,500", label: "Eliminations" },
      { value: "1,800", label: "Healing" },
    ],
    secondaryStats: [
      { value: "3:45", label: "Objective Time" },
    ],
    info: (
      <div className="space-y-2">
        <CardBaseFact value="Support" label="Role" />
        <CardBaseFact value="Mercy" label="Hero" />
      </div>
    ),
  },
};

export const WithLink: Story = {
  args: {
    title: "Match Details",
    linkUrl: "/match/123",
    linkText: "View Details",
    primaryStats: [
      { value: "Victory", label: "Result" },
      { value: "2-1", label: "Score" },
    ],
    secondaryStats: [
      { value: "15:30", label: "Duration" },
    ],
    info: (
      <div className="space-y-2">
        <CardBaseFact value="King's Row" label="Map" />
        <CardBaseFact value="Escort" label="Mode" />
      </div>
    ),
  },
};

export const LargeContent: Story = {
  args: {
    title: "Detailed Statistics",
    primaryStats: [
      { value: "5,678", label: "Damage Done" },
      { value: "3,421", label: "Damage Blocked" },
    ],
    secondaryStats: [
      { value: "2,109", label: "Healing Done" },
      { value: "876", label: "Environmental Kills" },
      { value: "12", label: "Eliminations" },
      { value: "3", label: "Deaths" },
    ],
    info: (
      <div className="space-y-2">
        <CardBaseFact value="Reinhardt" label="Hero" />
        <CardBaseFact value="Tank" label="Role" />
      </div>
    ),
  },
};

export const FactComponent: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-base-100 rounded-lg max-w-sm">
      <h3 className="text-lg font-semibold">CardBaseFact Examples</h3>
      <CardBaseFact value="100%" label="Win Rate" />
      <CardBaseFact value="2.5" label="K/D Ratio" />
      <CardBaseFact value="Diamond" label="Rank" />
    </div>
  ),
};