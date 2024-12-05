import type { Meta, StoryObj } from "@storybook/react";
import RoleIconSvg from "./RoleIconSvg";

const meta: Meta<typeof RoleIconSvg> = {
  component: RoleIconSvg,
  argTypes: {
    role: {
      control: 'select',
      options: ['tank', 'damage', 'support'],
      description: 'The role to display',
    },
    x: {
      control: { type: 'number' },
      description: 'X coordinate for the icon position',
    },
    y: {
      control: { type: 'number' },
      description: 'Y coordinate for the icon position',
    },
  },
  decorators: [
    (Story) => (
      <svg width="500" height="500" style={{ background: '#2c2c2c' }}>
        <Story />
      </svg>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RoleIconSvg>;

export const Tank: Story = {
  args: {
    role: 'tank',
    x: 50,
    y: 50,
  },
};

export const Damage: Story = {
  args: {
    role: 'damage',
    x: 50,
    y: 50,
  },
};

export const Support: Story = {
  args: {
    role: 'support',
    x: 50,
    y: 50,
  },
};

// Show all roles together
export const AllRoles: Story = {
  render: () => (
    <svg width="300" height="100" style={{ background: '#2c2c2c' }}>
      <RoleIconSvg role="tank" x={50} y={50} />
      <RoleIconSvg role="damage" x={150} y={50} />
      <RoleIconSvg role="support" x={250} y={50} />
      
      {/* Labels */}
      <text x="50" y="90" textAnchor="middle" fill="white" fontSize="14">Tank</text>
      <text x="150" y="90" textAnchor="middle" fill="white" fontSize="14">Damage</text>
      <text x="250" y="90" textAnchor="middle" fill="white" fontSize="14">Support</text>
    </svg>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All role icons displayed together with labels.',
      },
    },
  },
};

// Show different positions
export const Positions: Story = {
  render: () => (
    <svg width="200" height="200" style={{ background: '#2c2c2c' }}>
      <RoleIconSvg role="tank" x={50} y={50} />
      <RoleIconSvg role="tank" x={150} y={50} />
      <RoleIconSvg role="tank" x={50} y={150} />
      <RoleIconSvg role="tank" x={150} y={150} />
      
      {/* Position markers */}
      <text x="50" y="30" textAnchor="middle" fill="white" fontSize="12">(50,50)</text>
      <text x="150" y="30" textAnchor="middle" fill="white" fontSize="12">(150,50)</text>
      <text x="50" y="180" textAnchor="middle" fill="white" fontSize="12">(50,150)</text>
      <text x="150" y="180" textAnchor="middle" fill="white" fontSize="12">(150,150)</text>
    </svg>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how x and y coordinates affect icon positioning.',
      },
    },
  },
};

// Show with grid background for position reference
export const WithGrid: Story = {
  render: () => (
    <svg width="100" height="100" style={{ background: '#2c2c2c' }}>
      {/* Grid lines */}
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <line
            x1={i * 10}
            y1="0"
            x2={i * 10}
            y2="100"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1={i * 10}
            x2="100"
            y2={i * 10}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        </g>
      ))}
      
      {/* Center lines */}
      <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      
      <RoleIconSvg role="tank" x={50} y={50} />
    </svg>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows icon positioning with a reference grid. The grid is in 10px increments with highlighted center lines.',
      },
    },
  },
}; 