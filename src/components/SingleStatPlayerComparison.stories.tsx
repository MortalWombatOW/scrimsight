import type { Meta, StoryObj } from '@storybook/react-vite';
import { SingleStatPlayerComparison } from './SingleStatPlayerComparison';

const meta: Meta<typeof SingleStatPlayerComparison> = {
  title: 'Components/SingleStatPlayerComparison',
  component: SingleStatPlayerComparison,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    matchId: 'sample-match-id',
  },
};