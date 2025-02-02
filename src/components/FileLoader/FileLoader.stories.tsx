import type { Meta, StoryObj } from '@storybook/react';
import { FileLoader } from './FileLoader';

const meta: Meta<typeof FileLoader> = {
  component: FileLoader,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FileLoader>;

export const Default: Story = {
  args: {},
};
