import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrimsMatchCard } from '@components';
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
      return <div>Match data unavailable in Storybook. This component requires loaded game data.</div>;
    }

    return (
      <React.Suspense fallback={<div>Loading match data...</div>}>
        {this.props.children}
      </React.Suspense>
    );
  }
}

const meta: Meta<typeof ScrimsMatchCard> = {
  title: 'Components/ScrimsMatchCard',
  component: ScrimsMatchCard,
  parameters: { 
    layout: 'fullscreen',
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
    matchId: "match-1",
  },
};