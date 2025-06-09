import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerStatsCard } from './PlayerStatsCard';
import React from 'react';

// Error boundary wrapper for components that depend on atom data
class AtomDataErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Player stats unavailable in Storybook. This component requires loaded game data.</div>;
    }

    return (
      <React.Suspense fallback={<div>Loading player stats...</div>}>
        {this.props.children}
      </React.Suspense>
    );
  }
}

const meta: Meta<typeof PlayerStatsCard> = {
  title: 'Components/PlayerStatsCard',
  component: PlayerStatsCard,
  parameters: { 
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <AtomDataErrorBoundary>
        <Story />
      </AtomDataErrorBoundary>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playerName: "Player1",
  },
};