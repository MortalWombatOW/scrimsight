import { ScrimCard } from "./ScrimCard";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ScrimCard> = {
  component: ScrimCard,
  parameters: {
    docs: {
      description: {
        component: "ScrimCard displays key information about a scrim session, including teams, maps, and results.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScrimCard>;

export const Default: Story = {
  args: {
    title: "Weekend Scrim Session",
    teamNames: ["Team Alpha", "Team Beta"],
    date: "2024-01-20",
    mapsPlayed: ["King's Row", "Hanamura", "Gibraltar"],
    primaryStats: [
      { value: "2-1", label: "Final Score" },
      { value: "3", label: "Maps Played" },
    ],
    secondaryStats: [
      { value: "45 min", label: "Duration" },
      { value: "Mixed", label: "Mode" },
    ],
    linkUrl: "/scrim/sample-scrim-1",
  },
};

export const LongScrim: Story = {
  args: {
    title: "Championship Practice",
    teamNames: ["Dragons", "Phoenix", "Storm"],
    date: "2024-01-21", 
    mapsPlayed: ["King's Row", "Hanamura", "Gibraltar", "Dorado", "Temple of Anubis"],
    primaryStats: [
      { value: "3-2", label: "Final Score" },
      { value: "5", label: "Maps Played" },
    ],
    secondaryStats: [
      { value: "90 min", label: "Duration" },
      { value: "Competitive", label: "Format" },
    ],
    linkUrl: "/scrim/sample-scrim-2",
  },
};

export const QuickScrim: Story = {
  args: {
    title: "Quick Practice",
    teamNames: ["Team Gamma", "Team Delta"],
    date: "2024-01-22",
    mapsPlayed: ["King's Row"],
    primaryStats: [
      { value: "1-0", label: "Final Score" },
      { value: "1", label: "Maps Played" },
    ],
    secondaryStats: [
      { value: "15 min", label: "Duration" },
      { value: "Practice", label: "Format" },
    ],
  },
};

// Note: This component requires atom data to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content