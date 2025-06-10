import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopPlayersList } from './TopPlayersList';

const meta: Meta<typeof TopPlayersList> = {
  title: 'Components/TopPlayersList',
  component: TopPlayersList,
  parameters: { 
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};