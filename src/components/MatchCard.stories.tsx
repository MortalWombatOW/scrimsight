import { MatchCard } from "./MatchCard";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof MatchCard> = {
  component: MatchCard,
  parameters: {
    docs: {
      description: {
        component: "MatchCard displays key information about a match, including teams, result, and duration.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MatchCard>;

export const Default: Story = {
  args: {
    title: "King's Row Match",
    teamNames: ["Team Alpha", "Team Beta"],
    date: "2024-01-15",
    mapName: "King's Row",
    primaryStats: [
      { value: "2-1", label: "Score" },
      { value: "Victory", label: "Result" },
    ],
    secondaryStats: [
      { value: "15:30", label: "Duration" },
      { value: "Escort", label: "Mode" },
    ],
    linkUrl: "/match/sample-match-1",
  },
};

export const AlternateMatch: Story = {
  args: {
    title: "Hanamura Clash",
    teamNames: ["Dragons", "Phoenix"],
    date: "2024-01-16",
    mapName: "Hanamura",
    primaryStats: [
      { value: "0-2", label: "Score" },
      { value: "Defeat", label: "Result" },
    ],
    secondaryStats: [
      { value: "12:45", label: "Duration" },
      { value: "Assault", label: "Mode" },
    ],
    linkUrl: "/match/sample-match-2",
  },
};

export const WithoutLink: Story = {
  args: {
    title: "Gibraltar Defense",
    teamNames: ["Storm", "Thunder"],
    date: "2024-01-17",
    mapName: "Watchpoint: Gibraltar",
    primaryStats: [
      { value: "1-1", label: "Score" },
      { value: "Draw", label: "Result" },
    ],
    secondaryStats: [
      { value: "20:00", label: "Duration" },
      { value: "Escort", label: "Mode" },
    ],
  },
};

// Note: This component requires atom data to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content