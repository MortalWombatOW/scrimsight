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
    heroes: ["ana", "mercy", "reinhardt", "doomfist", "tracer", "soldier76"],
    timePlayed: 420000, // 7 minutes in milliseconds
  },
};

export const TankHeavy: Story = {
  args: {
    heroes: ["reinhardt", "zarya", "dva", "mercy", "ana", "soldier76"],
    timePlayed: 180000, // 3 minutes
  },
};

export const DpsHeavy: Story = {
  args: {
    heroes: ["tracer", "soldier76", "hanzo", "genji", "mercy", "ana"],
    timePlayed: 600000, // 10 minutes
  },
};

export const SupportHeavy: Story = {
  args: {
    heroes: ["mercy", "ana", "baptiste", "lucio", "reinhardt", "tracer"],
    timePlayed: 300000, // 5 minutes
  },
};

export const MinimalComposition: Story = {
  args: {
    heroes: ["reinhardt", "mercy", "soldier76"],
    timePlayed: 60000, // 1 minute
  },
};

export const LongDuration: Story = {
  args: {
    heroes: ["dva", "winston", "tracer", "genji", "mercy", "lucio"],
    timePlayed: 1800000, // 30 minutes
  },
};