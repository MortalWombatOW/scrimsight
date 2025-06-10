import type { Meta, StoryObj } from '@storybook/react-vite';
import { TeamStatsComparison } from './TeamStatsComparison';
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

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Team stats unavailable in Storybook. This component requires loaded game data.</div>;
    }

    return (
      <React.Suspense fallback={<div>Loading team stats...</div>}>
        {this.props.children}
      </React.Suspense>
    );
  }
}

const meta: Meta<typeof TeamStatsComparison> = {
  title: 'Components/TeamStatsComparison',
  component: TeamStatsComparison,
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
    matchId: 'sample-match-id',
  },
};