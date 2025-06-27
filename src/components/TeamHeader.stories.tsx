import type { Meta, StoryObj } from '@storybook/react-vite';
import TeamHeader from './TeamHeader';

const meta: Meta<typeof TeamHeader> = {
  title: 'Components/TeamHeader',
  component: TeamHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    teamName: {
      control: 'text',
    },
    players: {
      control: 'object',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    teamName: 'Boston Uprising',
    players: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod'],
  },
};

export const SmallTeam: Story = {
  args: {
    teamName: 'Team Alpha',
    players: ['Player1', 'Player2', 'Player3'],
  },
};

export const LargeTeam: Story = {
  args: {
    teamName: 'Overwatch League All-Stars',
    players: [
      'Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod',
      'Carpe', 'Alarm', 'Poko', 'FunnyAstro', 'EQO', 'Hotba',
      'Profit', 'Tobi', 'Zunba', 'ryujehong', 'Fleta', 'Miro'
    ],
  },
};

export const WithLongTeamName: Story = {
  args: {
    teamName: 'Very Long Team Name That Tests Layout',
    players: ['PlayerWithLongName', 'AnotherPlayerWithVeryLongName', 'ShortName'],
  },
};

export const SinglePlayer: Story = {
  args: {
    teamName: 'Solo Squad',
    players: ['OnlyPlayer'],
  },
};