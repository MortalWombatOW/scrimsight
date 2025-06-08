import { PlayerCard } from "./PlayerCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PlayerCard> = {
  component: PlayerCard,
  parameters: {
    docs: {
      description: {
        component: "PlayerCard displays key information about a player, including stats and performance metrics.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PlayerCard>;

export const Default: Story = {
  args: {
    playerName: "Player1",
    teamNames: ["Team Alpha"],
    heroes: ["Tracer", "Genji"],
    primaryStats: [
      { value: "2.5", label: "K/D Ratio" },
      { value: "75%", label: "Win Rate" },
    ],
    secondaryStats: [
      { value: "1,234", label: "Eliminations" },
      { value: "15.2", label: "Avg Elims/10min" },
    ],
  },
};

export const MultiteamPlayer: Story = {
  args: {
    playerName: "VersatilePlayer",
    teamNames: ["Team Alpha", "Team Beta", "Team Gamma"],
    heroes: ["Ana", "Mercy", "Baptiste"],
    primaryStats: [
      { value: "1.8", label: "K/D Ratio" },
      { value: "68%", label: "Win Rate" },
    ],
    secondaryStats: [
      { value: "2,150", label: "Healing" },
      { value: "892", label: "Assists" },
    ],
  },
};

export const OneHeroSpecialist: Story = {
  args: {
    playerName: "Specialist",
    teamNames: ["Team Delta"],
    heroes: ["Reinhardt"],
    primaryStats: [
      { value: "1.2", label: "K/D Ratio" },
      { value: "82%", label: "Win Rate" },
    ],
    secondaryStats: [
      { value: "45,000", label: "Damage Blocked" },
      { value: "3.2", label: "Avg Deaths/10min" },
    ],
  },
};

// Note: This component requires atom data to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content