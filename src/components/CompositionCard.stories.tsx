import { CompositionCard } from "./CompositionCard";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof CompositionCard> = {
  component: CompositionCard,
  argTypes: {
    timePlayed: {
      control: "number",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CompositionCard>;

export const Default: Story = {
  args: {
    heroes: ["Ana", "Mercy", "Reinhardt", "Doomfist", "Tracer", "Soldier: 76"],
    timePlayed: 420000, // 7 minutes in milliseconds
  },
};

export const TankHeavy: Story = {
  args: {
    heroes: ["Reinhardt", "Zarya", "D.Va", "Mercy", "Ana", "Soldier: 76"],
    timePlayed: 180000, // 3 minutes
  },
};

export const DpsHeavy: Story = {
  args: {
    heroes: ["Tracer", "Soldier: 76", "Hanzo", "Genji", "Mercy", "Ana"],
    timePlayed: 600000, // 10 minutes
  },
};

export const SupportHeavy: Story = {
  args: {
    heroes: ["Mercy", "Ana", "Baptiste", "Lúcio", "Reinhardt", "Tracer"],
    timePlayed: 300000, // 5 minutes
  },
};

export const MinimalComposition: Story = {
  args: {
    heroes: ["Reinhardt", "Mercy", "Soldier: 76"],
    timePlayed: 60000, // 1 minute
  },
};

export const LongDuration: Story = {
  args: {
    heroes: ["D.Va", "Winston", "Tracer", "Genji", "Mercy", "Lúcio"],
    timePlayed: 1800000, // 30 minutes
  },
};