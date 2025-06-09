import { TeamCard } from "./TeamCard";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TeamCard> = {
  component: TeamCard,
  parameters: {
    docs: {
      description: {
        component: "TeamCard displays key information about a team, including players, stats, and performance metrics.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TeamCard>;

export const Default: Story = {
  args: {
    teamName: "Team Alpha",
    playerNames: ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6"],
    primaryStats: [
      { value: "75%", label: "Win Rate" },
      { value: "2.1", label: "Avg K/D" },
    ],
    secondaryStats: [
      { value: "24", label: "Games Played" },
      { value: "18", label: "Wins" },
    ],
    linkUrl: "/team/alpha",
  },
};

export const SmallTeam: Story = {
  args: {
    teamName: "Team Beta", 
    playerNames: ["Player7", "Player8", "Player9"],
    primaryStats: [
      { value: "60%", label: "Win Rate" },
      { value: "1.8", label: "Avg K/D" },
    ],
    secondaryStats: [
      { value: "15", label: "Games Played" },
      { value: "9", label: "Wins" },
    ],
    linkUrl: "/team/beta",
  },
};

export const LargeTeam: Story = {
  args: {
    teamName: "Team Gamma",
    playerNames: ["Player10", "Player11", "Player12", "Player13", "Player14", "Player15", "Player16", "Player17"],
    primaryStats: [
      { value: "85%", label: "Win Rate" },
      { value: "2.5", label: "Avg K/D" },
    ],
    secondaryStats: [
      { value: "30", label: "Games Played" },
      { value: "26", label: "Wins" },
    ],
    linkUrl: "/team/gamma",
  },
};

// Note: This component requires atom data to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content