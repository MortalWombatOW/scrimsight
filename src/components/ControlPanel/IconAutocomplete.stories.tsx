/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import { IconAutocomplete } from './IconAutocomplete';
import React, { useState } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { Box } from '@mui/material';

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
      <Box sx={{ width: 300 }}>
        <IconAutocomplete
          {...args}
          selected={selected}
          onChange={setSelected}
        />
      </Box>
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
  args: {
    options: sampleLocations,
    onChange: (newValue: string[]) => console.log('Changed:', newValue),
    icon: <LocationOnIcon />,
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
    icon: <PersonIcon />,
    label: "Select Players",
    noOptionsText: "No players found",
  }
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [mode, setMode] = React.useState<'maps' | 'players'>('maps');
    
    const options = mode === 'maps' ? sampleLocations : samplePlayers;
    const icon = mode === 'maps' ? <LocationOnIcon /> : <PersonIcon />;
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