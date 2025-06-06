import { CardBase, CardBaseFact } from "./CardBase";
import type { Meta, StoryObj } from "@storybook/react";
import { HealingIcon } from "@icons";

const meta: Meta<typeof CardBase> = {
  component: CardBase,
  argTypes: {
    to: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardBase>;

export const Default: Story = {
  args: {
    title: "Sample Card",
    children: (
      <div className="space-y-2">
        <CardBaseFact value="1,234" label="Total Damage" />
        <CardBaseFact value="567" label="Healing Done" />
        <CardBaseFact value="89%" label="Accuracy" />
      </div>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    title: "Player Stats",
    icon: <HealingIcon size={24} fill="currentColor" />,
    children: (
      <div className="space-y-2">
        <CardBaseFact value="2,500" label="Eliminations" />
        <CardBaseFact value="1,800" label="Healing" />
        <CardBaseFact value="3:45" label="Objective Time" />
      </div>
    ),
  },
};

export const WithLink: Story = {
  args: {
    title: "Match Details",
    to: "/match/123",
    children: (
      <div className="space-y-2">
        <CardBaseFact value="Victory" label="Result" />
        <CardBaseFact value="2-1" label="Score" />
        <CardBaseFact value="15:30" label="Duration" />
      </div>
    ),
  },
};

export const LargeContent: Story = {
  args: {
    title: "Detailed Statistics",
    children: (
      <div className="grid grid-cols-2 gap-4">
        <CardBaseFact value="5,678" label="Damage Done" />
        <CardBaseFact value="3,421" label="Damage Blocked" />
        <CardBaseFact value="2,109" label="Healing Done" />
        <CardBaseFact value="876" label="Environmental Kills" />
        <CardBaseFact value="12" label="Eliminations" />
        <CardBaseFact value="3" label="Deaths" />
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