import { TimeSegmentDisplay } from "./TimeSegmentDisplay";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TimeSegmentDisplay> = {
  component: TimeSegmentDisplay,
  parameters: {
    docs: {
      description: {
        component: "TimeSegmentDisplay shows individual time segments within the timeline.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimeSegmentDisplay>;

export const Default: Story = {
  args: {
    segment: {
      matchId: "match-1",
      title: "Hanamura",
      subtitle: "Assault",
      type: "map" as const,
      startTime: 0,
      endTime: 300,
      winner: "Team Alpha",
    },
    onSelect: (start: number, end: number) => {
      console.log(`Selected time range: ${start} - ${end}`);
    },
    team1Name: "Team Alpha",
    team2Name: "Team Beta",
  },
};

// Note: This component may require timeline context to function properly