import { TimelineButton } from "./TimelineButton";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TimelineButton> = {
  component: TimelineButton,
  parameters: {
    docs: {
      description: {
        component: "TimelineButton component for timeline interaction controls.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineButton>;

export const Default: Story = {
  args: {
    segment: {
      id: "teamfight-1",
      type: "teamfight" as const,
      title: "Teamfight on Point A",
      startTime: 120,
      endTime: 145,
      sortTime: 120,
      winner: "Team Alpha",
      team1Name: "Team Alpha",
      team2Name: "Team Beta",
    },
    isSelected: false,
    onClick: (start: number, end: number) => {
      console.log(`Selected timeline segment: ${start} - ${end}`);
    },
    team1Name: "Team Alpha",
    team2Name: "Team Beta",
  },
};

// Note: This component may require timeline context to function properly