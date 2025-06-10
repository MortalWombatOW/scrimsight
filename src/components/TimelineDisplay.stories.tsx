import { TimelineDisplay } from "./TimelineDisplay";
import { TimelineProvider } from "./TimelineContext";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TimelineDisplay> = {
  component: TimelineDisplay,
  parameters: {
    timeline: true, // Enable timeline context for this component
    docs: {
      description: {
        component: "TimelineDisplay provides the main timeline visualization interface.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineDisplay>;

export const Default: Story = {
  render: () => (
    <TimelineProvider matchId="mock-match-id">
      <div style={{ 
        width: '100%', 
        height: '400px', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <TimelineDisplay />
      </div>
    </TimelineProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Timeline display requires match data to render properly. In isolation, it may appear empty.",
      },
    },
  },
};

// Note: This component requires timeline context and THREE.js to function properly