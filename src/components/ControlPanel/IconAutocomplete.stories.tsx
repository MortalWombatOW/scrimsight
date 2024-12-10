/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import IconAutocomplete from "./IconAutocomplete";
import React from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

const meta: Meta<typeof IconAutocomplete> = {
  component: IconAutocomplete,
  argTypes: {
    options: {
      control: 'array',
      description: 'Array of available options',
    },
    selected: {
      control: 'array',
      description: 'Array of currently selected options',
    },
    onChange: {
      action: 'selection changed',
      description: 'Callback when selected options change',
    },
    icon: {
      control: 'object',
      description: 'Icon component to display in the input',
    },
    label: {
      control: 'text',
      description: 'Label text for the input field',
    },
    noOptionsText: {
      control: 'text',
      description: 'Text to display when no options match',
    },
  },
};

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

// Empty state for locations
export const EmptyLocations: Story = {
  args: {
    options: sampleLocations,
    selected: [],
    onChange: () => {},
    icon: <LocationOnIcon />,
    label: "Select Maps",
    noOptionsText: "No maps found",
  },
};

// With some location selections
export const WithLocationSelections: Story = {
  args: {
    options: sampleLocations,
    selected: ['Kings Row', 'Hanamura'],
    onChange: () => {},
    icon: <LocationOnIcon />,
    label: "Select Maps",
    noOptionsText: "No maps found",
  },
};

// Players example with PersonIcon
export const PlayersSelection: Story = {
  args: {
    options: samplePlayers,
    selected: ['Striker', 'Proper'],
    onChange: () => {},
    icon: <PersonIcon />,
    label: "Select Players",
    noOptionsText: "No players found",
  },
};

// Interactive demo with state management
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