
import type { Meta, StoryObj } from '@storybook/react-vite';
import HeroCard from './HeroCard';
import { Hero } from '../lib/ScrimsightDataModel';

const meta: Meta<typeof HeroCard> = {
  title: 'Components/HeroCard',
  component: HeroCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    hero: {
      control: {
        type: 'select',
        options: ['Ana', 'Ashe', 'Baptiste', 'Bastion', 'Brigitte', 'Cassidy', 'D.Va', 'Doomfist', 'Echo', 'Genji', 'Hanzo', 'Illari', 'Junker Queen', 'Junkrat', 'Kiriko', 'Lifeweaver', 'Lúcio', 'Mei', 'Mercy', 'Moira', 'Orisa', 'Pharah', 'Reaper', 'Reinhardt', 'Roadhog', 'Sigma', 'Sojourn', 'Soldier: 76', 'Sombra', 'Symmetra', 'Torbjörn', 'Tracer', 'Widowmaker', 'Winston', 'Wrecking Ball', 'Zarya', 'Zenyatta'],
      },
    },
    playtime: { control: 'number' },
    maxPlaytime: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hero: 'Ana' as Hero,
    playtime: 3600,
    maxPlaytime: 7200,
  },
};

export const MaxPlaytime: Story = {
  args: {
    hero: 'Reinhardt' as Hero,
    playtime: 7200,
    maxPlaytime: 7200,
  },
};

export const MinPlaytime: Story = {
  args: {
    hero: 'Sojourn' as Hero,
    playtime: 100,
    maxPlaytime: 7200,
  },
};
