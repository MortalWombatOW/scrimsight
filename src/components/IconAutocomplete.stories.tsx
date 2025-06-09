
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconAutocomplete } from './IconAutocomplete';
import React, { useState } from "react";
// Removed MUI imports: LocationOnIcon, PersonIcon, Box

const meta = {
  component: IconAutocomplete,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    options: {
      description: 'Array of options to display',
    },
  },
} satisfies Meta<typeof IconAutocomplete>;

export default meta;

type Story = StoryObj<typeof IconAutocomplete>;

const sampleLocations = [
  'Kings Row',
  'Hanamura',
  'Route 66',
  'Numbani',
  'Eichenwalde',
];

const samplePlayers = [
  'Striker',
  'Proper',
  'Violet',
  'Super',
  'Smurf',
  'Twilight',
];

const Template: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div style={{ width: 300 }}> {/* Replaced Box with div */}
        <IconAutocomplete
          {...args}
          selected={selected}
          onChange={setSelected}
        />
      </div> // Closing div
    );
  }
};

export const Default: Story = {
  ...Template,
  args: {
    options: ['Kings Row', 'Hanamura', 'Numbani'],
  }
};

export const EmptyLocations: Story = {
  ...Template,
  args: {
    options: sampleLocations,
    icon: null, // Replaced LocationOnIcon
    label: "Select Maps",
    noOptionsText: "No maps found",
  },
};

export const WithLocationSelections: Story = {
  ...Template,
  args: {
    options: ['Kings Row', 'Hanamura', 'Numbani'],
    selected: ['Kings Row', 'Hanamura'],
  }
};

export const PlayersSelection: Story = {
  ...Template,
  args: {
    options: samplePlayers,
    selected: ['Striker', 'Proper'],
    icon: null, // Replaced PersonIcon
    label: "Select Players",
    noOptionsText: "No players found",
  }
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [mode, setMode] = React.useState<'maps' | 'players'>('maps');
    
    const options = mode === 'maps' ? sampleLocations : samplePlayers;
    const icon = null; // Replaced MUI icons
    const label = mode === 'maps' ? "Select Maps" : "Select Players";
    const noOptionsText = mode === 'maps' ? "No maps found" : "No players found";
    
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Mode: 
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as 'maps' | 'players')}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="maps">Maps</option>
              <option value="players">Players</option>
            </select>
          </label>
        </div>
        <IconAutocomplete 
          options={options}
          selected={selected}
          onChange={setSelected}
          icon={icon}
          label={label}
          noOptionsText={noOptionsText}
        />
        <div style={{ marginTop: '1rem', fontFamily: 'monospace' }}>
          Selected: {JSON.stringify(selected)}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive example with state management. Switch between maps and players mode.',
      },
    },
  },
};
