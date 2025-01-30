import React from 'react';
import { HomePage } from './pages/Home';
import { QueriesPage } from 'wombat-data-framework';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';
import EventIcon from '@mui/icons-material/Event';
import Groups3Icon from '@mui/icons-material/Groups3';
import { MatchesPage } from '~/pages/Matches';
import { PlayersPage } from '~/pages/Players';
import { TeamsPage } from '~/pages/Teams';
import PersonIcon from '@mui/icons-material/Person';
import { MatchPage } from '~/pages/Match';
import { TeamPage } from '~/pages/Team';
import { PlayerPage } from '~/pages/Player';

export interface ScrimsightRoute {
  path: string[];
  component: () => JSX.Element;
  name?: string;
  hidden?: boolean;
  icon?: React.ReactNode;
}

const routes: ScrimsightRoute[] = [
  {
    path: ['/'],
    component: HomePage,
    name: 'Home',
    icon: <HomeIcon />,
  },
  {
    path: ['/matches'],
    component: MatchesPage,
    name: 'Matches',
    icon: <EventIcon />,
  },
  {
    path: ['/matches/:matchId'],
    component: MatchPage,
    name: 'Match',
    icon: <EventIcon />,
    hidden: true,
  },
  {
    path: ['/teams'],
    component: TeamsPage,
    name: 'Teams',
    icon: <Groups3Icon />,
  },
  {
    path: ['/teams/:teamId'],
    component: TeamPage,
    name: 'Team',
    icon: <Groups3Icon />,
    hidden: true,
  },
  {
    path: ['/players'],
    component: PlayersPage,
    name: 'Players',
    icon: <PersonIcon />,
  },
  {
    path: ['/players/:playerId'],
    component: PlayerPage,
    name: 'Player',
    icon: <PersonIcon />,
    hidden: true,
  },
  {
    path: ['/queries'],
    component: QueriesPage,
    name: 'Debug',
    icon: <BugReportIcon />,
  },
];

export default routes;
