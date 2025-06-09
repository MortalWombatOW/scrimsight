import type { Meta, StoryObj } from '@storybook/react-vite';
import ZeroState from './ZeroState';

const meta = {
  title: 'Components/ZeroState',
  component: ZeroState,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ZeroState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InteractiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This is the main welcome screen shown when no data is loaded. Users can drag and drop files or click to upload ScrimTime log files.',
      },
    },
  },
};