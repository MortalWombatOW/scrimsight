import type { Meta, StoryObj } from '@storybook/react-vite';
import TeamCard from './TeamCard';

const meta: Meta<typeof TeamCard> = {
  title: 'Components/TeamCard',
  component: TeamCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    teamName: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortName: Story = {
  args: {
    teamName: 'Team Alpha',
  },
};

export const LongName: Story = {
  args: {
    teamName: 'Los Angeles Gladiators',
  },
};

export const SingleWord: Story = {
  args: {
    teamName: 'Justice',
  },
};

export const Numbers: Story = {
  args: {
    teamName: 'Team 1337',
  },
};

export const WithSpecialChars: Story = {
  args: {
    teamName: 'C9-Overwatch',
  },
};