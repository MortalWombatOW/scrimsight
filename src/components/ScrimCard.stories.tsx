import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'jotai';
import { dataModelAtom } from '../atoms/scrimsight';
import ScrimCard from './ScrimCard';
import { ScrimsightDataModel } from '../lib/ScrimsightDataModel';

const mockDataModel: ScrimsightDataModel = {
  scrims: [
    {
      scrim: 'scrim-1',
      teams: ['Team Alpha', 'Team Beta'],
      matches: ['match-1', 'match-2', 'match-3'],
      date: new Date('2024-01-15T19:30:00'),
      team1MatchesWon: 2,
      team2MatchesWon: 1,
    },
    {
      scrim: 'scrim-2',
      teams: ['Phoenix Gaming', 'Thunder Squad'],
      matches: ['match-4', 'match-5'],
      date: new Date('2024-01-16T20:15:00'),
      team1MatchesWon: 1,
      team2MatchesWon: 2,
    },
    {
      scrim: 'scrim-3',
      teams: ['Red Hawks', 'Blue Storm'],
      matches: ['match-6', 'match-7', 'match-8'],
      date: new Date('2024-01-17T18:45:00'),
      team1MatchesWon: 1,
      team2MatchesWon: 1,
    },
  ],
  matches: [],
  teams: [],
  players: [],
  matchStart: [],
  matchEnd: [],
  roundStart: [],
  roundEnd: [],
  heroSpawn: [],
  heroSwap: [],
  kill: [],
  damage: [],
  healing: [],
  ultimateCharged: [],
  ultimateStart: [],
  ultimateEnd: [],
  defensiveAssist: [],
  offensiveAssist: [],
  echo: [],
  mercy: [],
  playerStat: [],
  playerLives: [],
  teamfights: [],
  rounds: [],
  playerStatBreakdown: {
    total: {} as any,
    byPlayer: {},
    byTeam: {},
    byTeamAndPlayer: {},
    byPlayerAndHero: {},
    byRole: {},
    byHero: {},
    byTeamAndMatch: {},
  },
};

const meta: Meta<typeof ScrimCard> = {
  title: 'Components/ScrimCard',
  component: ScrimCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => {
      const hydratedAtom = dataModelAtom;
      hydratedAtom.init = mockDataModel;
      
      return (
        <Provider>
          <div className="w-80">
            <Story {...args} />
          </div>
        </Provider>
      );
    },
  ],
  argTypes: {
    scrimId: {
      control: 'text',
      description: 'The ID of the scrim to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TeamAlphaWins: Story = {
  args: {
    scrimId: 'scrim-1',
  },
};

export const ThunderSquadWins: Story = {
  args: {
    scrimId: 'scrim-2',
  },
};

export const TiedScrim: Story = {
  args: {
    scrimId: 'scrim-3',
  },
};

export const ScrimNotFound: Story = {
  args: {
    scrimId: 'nonexistent-scrim',
  },
};