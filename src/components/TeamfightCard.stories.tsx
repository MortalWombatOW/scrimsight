import type { Meta, StoryObj } from '@storybook/react-vite';
import TeamfightCard from './TeamfightCard';
import { Teamfight } from '../lib/ScrimsightDataModel';

const meta: Meta<typeof TeamfightCard> = {
  title: 'Components/TeamfightCard',
  component: TeamfightCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    teamfight: {
      control: 'object',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTeamfight: Teamfight = {
  matchId: 'MATCH_001',
  roundIndex: 1,
  startTime: 245.5, // 4:05 into the match
  endTime: 267.8, // 4:27 into the match
  duration: 22.3, // 22.3 seconds
  start: {
    team1: {
      teamName: 'Boston Uprising',
      alivePlayers: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod'],
      ultimatesReady: ['Tracer', 'Mercy', 'D.Va'],
    },
    team2: {
      teamName: 'New York Excelsior',
      alivePlayers: ['SBB', 'JJoNak', 'Meko', 'ArK', 'Libero', 'Mano'],
      ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji'],
    },
  },
  end: {
    team1: {
      teamName: 'Boston Uprising',
      alivePlayers: ['Striker', 'Kellex', 'NotE'],
      ultimatesReady: ['Tracer', 'Mercy', 'D.Va'],
      ultimatesUsed: ['D.Va'],
      kills: ['SBB', 'Libero'],
    },
    team2: {
      teamName: 'New York Excelsior',
      alivePlayers: ['JJoNak', 'ArK'],
      ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji'],
      ultimatesUsed: ['Winston', 'Genji'],
      kills: ['Mistakes', 'AimGod', 'Neko'],
    },
  },
  winner: 'New York Excelsior',
  team1KillsPerUlt: 2.0,
  team2KillsPerUlt: 1.5,
};

export const Default: Story = {
  args: {
    teamfight: mockTeamfight,
  },
};

export const Team1Wins: Story = {
  args: {
    teamfight: {
      ...mockTeamfight,
      winner: 'Boston Uprising',
      end: {
        team1: {
          teamName: 'Boston Uprising',
          alivePlayers: ['Striker', 'Kellex', 'NotE', 'Neko'],
          ultimatesReady: ['Tracer', 'Mercy', 'D.Va'],
          ultimatesUsed: ['D.Va', 'Mercy'],
          kills: ['SBB', 'Libero', 'Mano'],
        },
        team2: {
          teamName: 'New York Excelsior',
          alivePlayers: ['JJoNak'],
          ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji'],
          ultimatesUsed: ['Winston'],
          kills: ['Mistakes', 'AimGod'],
        },
      },
      team1KillsPerUlt: 1.5,
      team2KillsPerUlt: 2.0,
    },
  },
};

export const QuickFight: Story = {
  args: {
    teamfight: {
      ...mockTeamfight,
      startTime: 180.2,
      endTime: 187.9,
      duration: 7.7,
      end: {
        team1: {
          teamName: 'Boston Uprising',
          alivePlayers: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes'],
          ultimatesReady: ['Tracer', 'Mercy', 'D.Va'],
          ultimatesUsed: [],
          kills: ['SBB'],
        },
        team2: {
          teamName: 'New York Excelsior',
          alivePlayers: [],
          ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji'],
          ultimatesUsed: [],
          kills: ['AimGod'],
        },
      },
      winner: 'Boston Uprising',
      team1KillsPerUlt: 0,
      team2KillsPerUlt: 0,
    },
  },
};

export const LongFight: Story = {
  args: {
    teamfight: {
      ...mockTeamfight,
      startTime: 567.1,
      endTime: 612.8,
      duration: 45.7,
      start: {
        team1: {
          teamName: 'Boston Uprising',
          alivePlayers: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod'],
          ultimatesReady: ['Tracer', 'Mercy', 'D.Va', 'Widowmaker', 'Ana'],
        },
        team2: {
          teamName: 'New York Excelsior',
          alivePlayers: ['SBB', 'JJoNak', 'Meko', 'ArK', 'Libero', 'Mano'],
          ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji', 'Lucio'],
        },
      },
      end: {
        team1: {
          teamName: 'Boston Uprising',
          alivePlayers: ['Striker', 'Kellex'],
          ultimatesReady: ['Tracer', 'Mercy', 'D.Va', 'Widowmaker', 'Ana'],
          ultimatesUsed: ['D.Va', 'Ana', 'Widowmaker'],
          kills: ['SBB', 'Libero', 'Mano', 'ArK'],
        },
        team2: {
          teamName: 'New York Excelsior',
          alivePlayers: ['JJoNak', 'Meko'],
          ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji', 'Lucio'],
          ultimatesUsed: ['Winston', 'Genji', 'Zenyatta', 'Lucio'],
          kills: ['Mistakes', 'AimGod', 'NotE', 'Neko'],
        },
      },
      winner: 'Boston Uprising',
      team1KillsPerUlt: 1.33,
      team2KillsPerUlt: 1.0,
    },
  },
};

export const NoUltimates: Story = {
  args: {
    teamfight: {
      ...mockTeamfight,
      start: {
        team1: {
          teamName: 'Boston Uprising',
          alivePlayers: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod'],
          ultimatesReady: [],
        },
        team2: {
          teamName: 'New York Excelsior',
          alivePlayers: ['SBB', 'JJoNak', 'Meko', 'ArK', 'Libero', 'Mano'],
          ultimatesReady: [],
        },
      },
      end: {
        team1: {
          teamName: 'Boston Uprising',
          alivePlayers: ['Striker', 'Kellex', 'NotE'],
          ultimatesReady: [],
          ultimatesUsed: [],
          kills: ['SBB', 'Libero'],
        },
        team2: {
          teamName: 'New York Excelsior',
          alivePlayers: ['JJoNak', 'ArK'],
          ultimatesReady: [],
          ultimatesUsed: [],
          kills: ['Mistakes', 'AimGod', 'Neko'],
        },
      },
      team1KillsPerUlt: 0,
      team2KillsPerUlt: 0,
    },
  },
};

export const ManyUltimates: Story = {
  args: {
    teamfight: {
      ...mockTeamfight,
      start: {
        team1: {
          teamName: 'Boston Uprising',
          alivePlayers: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod'],
          ultimatesReady: ['Tracer', 'Mercy', 'D.Va', 'Ana', 'Widowmaker', 'Reinhardt'],
        },
        team2: {
          teamName: 'New York Excelsior',
          alivePlayers: ['SBB', 'JJoNak', 'Meko', 'ArK', 'Libero', 'Mano'],
          ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji', 'Lucio', 'Pharah'],
        },
      },
      end: {
        team1: {
          teamName: 'Boston Uprising',
          alivePlayers: ['Striker', 'Kellex', 'NotE'],
          ultimatesReady: ['Tracer', 'Mercy', 'D.Va', 'Ana', 'Widowmaker', 'Reinhardt'],
          ultimatesUsed: ['D.Va', 'Ana', 'Widowmaker', 'Reinhardt'],
          kills: ['SBB', 'Libero'],
        },
        team2: {
          teamName: 'New York Excelsior',
          alivePlayers: ['JJoNak', 'ArK'],
          ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji', 'Lucio', 'Pharah'],
          ultimatesUsed: ['Winston', 'Genji', 'Zenyatta', 'Lucio', 'Pharah'],
          kills: ['Mistakes', 'AimGod', 'Neko'],
        },
      },
      team1KillsPerUlt: 0.5,
      team2KillsPerUlt: 0.6,
    },
  },
};