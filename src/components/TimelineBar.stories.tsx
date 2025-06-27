import type { Meta, StoryObj } from "@storybook/react-vite";
import { Zap, Shield, Sword, Heart, Clock } from "lucide-react";
import TimelineBar from "./TimelineBar";

const meta: Meta<typeof TimelineBar> = {
  title: "Components/TimelineBar",
  component: TimelineBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    total: {
      control: "number",
      description: "Total duration of the timeline",
    },
    onSegmentClick: {
      action: "segment-clicked",
      description: "Callback when a segment is clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FightTimeline: Story = {
  args: {
    total: 300,
    segments: [
      {
        id: "engagement-1",
        start: 0,
        end: 45,
        color: "#ef4444",
        icon: <Sword size={32} />,
      },
      {
        id: "downtime-1",
        start: 45,
        end: 90,
        color: "#6b7280",
      },
      {
        id: "engagement-2",
        start: 90,
        end: 180,
        color: "#ef4444",
        icon: <Sword size={32} />,
      },
      {
        id: "downtime-2",
        start: 180,
        end: 210,
        color: "#6b7280",
      },
      {
        id: "final-fight",
        start: 210,
        end: 300,
        color: "#dc2626",
        icon: <Sword size={32} />,
      },
    ],
  },
};

export const HeroLifespan: Story = {
  args: {
    total: 600,
    segments: [
      {
        id: "alive-1",
        start: 0,
        end: 120,
        color: "#22c55e",
        icon: <Heart size={32} />,
      },
      {
        id: "dead-1",
        start: 120,
        end: 150,
        color: "#374151",
      },
      {
        id: "alive-2",
        start: 150,
        end: 380,
        color: "#22c55e",
        icon: <Heart size={32} />,
      },
      {
        id: "dead-2",
        start: 380,
        end: 420,
        color: "#374151",
      },
      {
        id: "alive-3",
        start: 420,
        end: 600,
        color: "#22c55e",
        icon: <Heart size={32} />,
      },
    ],
  },
};

export const UltimateUsage: Story = {
  args: {
    total: 480,
    segments: [
      {
        id: "ult-1",
        start: 60,
        end: 70,
        color: "#8b5cf6",
        icon: <Zap size={32} />,
      },
      {
        id: "ult-2",
        start: 180,
        end: 190,
        color: "#8b5cf6",
        icon: <Zap size={32} />,
      },
      {
        id: "ult-3",
        start: 300,
        end: 310,
        color: "#8b5cf6",
        icon: <Zap size={32} />,
      },
      {
        id: "ult-4",
        start: 420,
        end: 430,
        color: "#8b5cf6",
        icon: <Zap size={32} />,
      },
    ],
  },
};

export const DefensiveAbilities: Story = {
  args: {
    total: 360,
    segments: [
      {
        id: "shield-1",
        start: 30,
        end: 45,
        color: "#3b82f6",
        icon: <Shield size={32} />,
      },
      {
        id: "shield-2",
        start: 90,
        end: 105,
        color: "#3b82f6",
        icon: <Shield size={32} />,
      },
      {
        id: "shield-3",
        start: 150,
        end: 165,
        color: "#3b82f6",
        icon: <Shield size={32} />,
      },
      {
        id: "shield-4",
        start: 210,
        end: 240,
        color: "#3b82f6",
        icon: <Shield size={32} />,
      },
      {
        id: "shield-5",
        start: 300,
        end: 315,
        color: "#3b82f6",
        icon: <Shield size={32} />,
      },
    ],
  },
};

export const SingleSegment: Story = {
  args: {
    total: 100,
    segments: [
      {
        id: "full-duration",
        start: 0,
        end: 100,
        color: "#10b981",
        icon: <Clock size={32} />,
      },
    ],
  },
};

export const ManySmallSegments: Story = {
  args: {
    total: 200,
    segments: Array.from({ length: 20 }, (_, i) => ({
      id: `segment-${i}`,
      start: i * 10,
      end: (i + 1) * 10,
      color: i % 2 === 0 ? "#f59e0b" : "#ef4444",
    })),
  },
};

export const OverlappingTimelines: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-base-content mb-2">
          Hero Health
        </h3>
        <TimelineBar
          total={300}
          segments={[
            {
              id: "alive-1",
              start: 0,
              end: 80,
              color: "#22c55e",
              icon: <Heart size={32} />,
            },
            { id: "dead-1", start: 80, end: 100, color: "#374151" },
            {
              id: "alive-2",
              start: 100,
              end: 220,
              color: "#22c55e",
              icon: <Heart size={32} />,
            },
            { id: "dead-2", start: 220, end: 250, color: "#374151" },
            {
              id: "alive-3",
              start: 250,
              end: 300,
              color: "#22c55e",
              icon: <Heart size={32} />,
            },
          ]}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-base-content mb-2">
          Ultimate Usage
        </h3>
        <TimelineBar
          total={300}
          segments={[
            {
              id: "ult-1",
              start: 40,
              end: 50,
              color: "#8b5cf6",
              icon: <Zap size={32} />,
            },
            {
              id: "ult-2",
              start: 120,
              end: 130,
              color: "#8b5cf6",
              icon: <Zap size={32} />,
            },
            {
              id: "ult-3",
              start: 200,
              end: 210,
              color: "#8b5cf6",
              icon: <Zap size={32} />,
            },
            {
              id: "ult-4",
              start: 280,
              end: 290,
              color: "#8b5cf6",
              icon: <Zap size={32} />,
            },
          ]}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-base-content mb-2">
          Team Fights
        </h3>
        <TimelineBar
          total={300}
          segments={[
            {
              id: "fight-1",
              start: 20,
              end: 60,
              color: "#ef4444",
              icon: <Sword size={32} />,
            },
            {
              id: "fight-2",
              start: 140,
              end: 190,
              color: "#ef4444",
              icon: <Sword size={32} />,
            },
            {
              id: "fight-3",
              start: 260,
              end: 300,
              color: "#dc2626",
              icon: <Sword size={32} />,
            },
          ]}
        />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    total: 240,
    segments: [
      {
        id: "phase-1",
        start: 0,
        end: 80,
        color: "#22c55e",
        icon: <Clock size={32} />,
      },
      {
        id: "phase-2",
        start: 80,
        end: 160,
        color: "#f59e0b",
        icon: <Zap size={32} />,
      },
      {
        id: "phase-3",
        start: 160,
        end: 240,
        color: "#ef4444",
        icon: <Sword size={32} />,
      },
    ],
    onSegmentClick: (id: string) => {
      alert(`Clicked segment: ${id}`);
    },
  },
};

export const LongTimeline: Story = {
  args: {
    total: 1800,
    segments: [
      { id: "prep", start: 0, end: 300, color: "#6b7280" },
      {
        id: "early-game",
        start: 300,
        end: 600,
        color: "#22c55e",
        icon: <Clock size={32} />,
      },
      {
        id: "mid-game",
        start: 600,
        end: 1200,
        color: "#f59e0b",
        icon: <Zap size={32} />,
      },
      {
        id: "late-game",
        start: 1200,
        end: 1800,
        color: "#ef4444",
        icon: <Sword size={32} />,
      },
    ],
  },
};
