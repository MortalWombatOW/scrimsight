import type { Meta, StoryObj } from '@storybook/react';
import LoadingSpinner from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-64 h-32 bg-base-200 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="w-64 h-32 bg-neutral rounded-lg">
        <Story />
      </div>
    ),
  ],
};