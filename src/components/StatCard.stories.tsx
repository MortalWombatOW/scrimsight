import { StatCard } from "./StatCard";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HealingIcon, BeamsAuraIcon, GrimReaperIcon } from "@icons";

const meta: Meta<typeof StatCard> = {
  component: StatCard,
  argTypes: {
    title: {
      control: "text",
    },
    value: {
      control: "text",
    },
    description: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    title: "Total Damage",
    value: "12,345",
  },
};

export const WithDescription: Story = {
  args: {
    title: "Healing Done",
    value: "8,750",
    description: "↗︎ 12% from last match",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Eliminations",
    value: "42",
    icon: <GrimReaperIcon size={32} />,
  },
};

export const WithIconAndDescription: Story = {
  args: {
    title: "Healing",
    value: "9,250",
    icon: <HealingIcon size={32} fill="currentColor" />,
    description: "Above team average",
  },
};

export const LargeNumber: Story = {
  args: {
    title: "Damage Blocked",
    value: "45,678",
    icon: <BeamsAuraIcon size={32} />,
    description: "Tank role performance",
  },
};

export const Percentage: Story = {
  args: {
    title: "Accuracy",
    value: "78%",
    description: "Scoped accuracy",
  },
};

export const Time: Story = {
  args: {
    title: "Objective Time",
    value: "3:45",
    description: "Time on point",
  },
};

export const NegativeTrend: Story = {
  args: {
    title: "Deaths",
    value: "7",
    description: "↘︎ 15% fewer than average",
  },
};