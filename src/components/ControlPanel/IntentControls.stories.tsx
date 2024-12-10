/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import IntentControls from "./IntentControls";
import React from "react";
import { Intent } from "~/Widget";

const meta: Meta<typeof IntentControls> = {
  component: IntentControls,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof IntentControls>;

const samplePossibleValues = {
  players: ['Striker', 'Proper', 'Violet', 'Super', 'Smurf', 'Twilight'],
  maps: ['Kings Row', 'Hanamura', 'Route 66', 'Numbani', 'Eichenwalde'],
  mapNames: ['Dorado', 'Eichenwalde', 'Hanamura'] as OverwatchMap[],
  modes: ['Control', 'Escort', 'Hybrid'] as OverwatchMode[],
  teams: ['San Francisco Shock', 'Seoul Dynasty', 'Shanghai Dragons'],
  heroes: ['Ana', 'Ashe', 'Baptiste'] as OverwatchHero[],
  metrics: ['Damage Done', 'Healing Done', 'Eliminations'],
};

// Empty state
export const Empty: Story = {
  args: {
    intent: {},
    possibleValues: samplePossibleValues,
  },
};

// Filled state
export const Filled: Story = {
  args: {
    intent: {
      playerName: ['Striker', 'Proper'],
      playerRole: ['tank', 'support'],
      mapId: ['Kings Row'],
      team: ['San Francisco Shock'],
      hero: ['Ana'],
      metric: ['Damage Done'],
      time: [3600, 7200],
      date: ['2024-01-01', '2024-01-31'],
    },
    possibleValues: samplePossibleValues,
  },
};

// Small empty state
export const SmallEmpty: Story = {
  args: {
    intent: {},
    possibleValues: samplePossibleValues,
    size: 'small',
  },
};

// Small filled state
export const SmallFilled: Story = {
  args: {
    intent: {
      playerName: ['Striker', 'Proper'],
      playerRole: ['tank', 'support'],
      mapId: ['Kings Row'],
      team: ['San Francisco Shock'],
      hero: ['Ana'],
      metric: ['Damage Done'],
    },
    possibleValues: samplePossibleValues,
    size: 'small',
  },
};

// Large empty state
export const LargeEmpty: Story = {
  args: {
    intent: {},
    possibleValues: samplePossibleValues,
    size: 'large',
  },
};

// Large filled state
export const LargeFilled: Story = {
  args: {
    intent: {
      playerName: ['Striker', 'Proper'],
      playerRole: ['tank', 'support'],
      mapId: ['Kings Row'],
      team: ['San Francisco Shock'],
      hero: ['Ana'],
      metric: ['Damage Done'],
      time: [3600, 7200],
      date: ['2024-01-01', '2024-01-31'],
    },
    possibleValues: samplePossibleValues,
    size: 'large',
  },
};

// Interactive demo with size toggle
export const Interactive: Story = {
  render: () => {
    const [intent, setIntent] = React.useState<Intent>({});
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
        <IntentControls
          intent={intent}
          onChange={setIntent}
          possibleValues={samplePossibleValues}
          size={size}
        />
        <div style={{ marginTop: '2rem', padding: '1rem' }}>
          <pre>{JSON.stringify(intent, null, 2)}</pre>
        </div>
      </div>
    );
  },
}; 