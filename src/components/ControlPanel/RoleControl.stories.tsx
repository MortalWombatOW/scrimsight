/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import RoleControl from "./RoleControl";
import { OverwatchRole } from "~/lib/data/hero";
import React from "react";

const meta: Meta<typeof RoleControl> = {
  component: RoleControl,
  argTypes: {
    selectedRoles: {
      control: 'object',
      description: 'Array of currently selected roles',
    },
    onChange: {
      action: 'roles changed',
      description: 'Callback when selected roles change',
    },
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Size variant of the control',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RoleControl>;

// Default state with no roles selected
export const NoSelection: Story = {
  args: {
    selectedRoles: [],
    onChange: () => {},
  },
};

// Show with one role selected
export const SingleRole: Story = {
  args: {
    selectedRoles: ['tank'],
    onChange: () => {},
  },
};

// Show with multiple roles selected
export const MultipleRoles: Story = {
  args: {
    selectedRoles: ['tank', 'support'],
    onChange: () => {},
  },
};

// Show with all roles selected
export const AllRoles: Story = {
  args: {
    selectedRoles: ['tank', 'damage', 'support'],
    onChange: () => {},
  },
};

// Add new stories for small variant
export const SmallNoSelection: Story = {
  args: {
    selectedRoles: [],
    onChange: () => {},
    size: 'small',
  },
};

export const SmallAllRoles: Story = {
  args: {
    selectedRoles: ['tank', 'damage', 'support'],
    onChange: () => {},
    size: 'small',
  },
};

// Interactive demo with state management
export const Interactive: Story = {
  render: () => {
    const [selectedRoles, setSelectedRoles] = React.useState<OverwatchRole[]>([]);
    const [size, setSize] = React.useState<'small' | 'large'>('large');
    
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Size: 
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value as 'small' | 'large')}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="small">Small</option>
              <option value="large">Large</option>
            </select>
          </label>
        </div>
        <RoleControl 
          selectedRoles={selectedRoles} 
          onChange={setSelectedRoles}
          size={size}
        />
        <div style={{ marginTop: '1rem', fontFamily: 'monospace' }}>
          Selected: {JSON.stringify(selectedRoles)}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive example with state management. Try selecting and deselecting roles.',
      },
    },
  },
};
