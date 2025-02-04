import { HomePage } from './pages/Home';
import { MatchPage } from './pages/Match';
import { MatchesPage } from './pages/Matches';
import { PlayersPage } from './pages/Players/PlayersPage';
import { TeamPage } from './pages/Team';
import { TeamsPage } from './pages/Teams';
import { AddFilesPage } from './pages/AddFiles/AddFilesPage';
import { atom } from 'jotai';
import { teamNamesAtom, matchDataAtom, uniquePlayerNamesAtom } from './atoms';
import { PlayerPage } from './pages/Player/PlayerPage';
import HomeIcon from '@mui/icons-material/Home';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonIcon from '@mui/icons-material/Person';
import { NavigationPageItem } from './lib/types/navigation';
import { Event } from '@mui/icons-material';

export interface RouteConfig {
  path: string;
  title: string;
  component: () => JSX.Element;
  hidden?: boolean;
}

const routes: RouteConfig[] = [
  {
    path: '/add-files',
    title: 'Add Files',
    component: AddFilesPage,
  },
  {
    path: '/',
    title: 'Home',
    component: HomePage,
  },
  
  {
    path: '/matches',
    title: 'Matches',
    component: MatchesPage,
  },
  {
    path: '/matches/:matchId',
    title: 'Match',
    component: MatchPage,
    hidden: true,
  },
  {
    path: '/players',
    title: 'Players',
    component: PlayersPage,
  },
  {
    path: '/players/:playerName',
    title: 'Player',
    component: PlayerPage,
    hidden: true,
  },
  {
    path: '/teams',
    title: 'Teams',
    component: TeamsPage,
  },
  {
    path: '/teams/:teamId',
    title: 'Team',
    component: TeamPage,
    hidden: true,
  },
];

// Atom to generate navigation items with dynamic children
export const navigationItemsAtom = atom(async (get) => {
  const teamNames = await get(teamNamesAtom);
  const matches = await get(matchDataAtom);
  const playerNames = await get(uniquePlayerNamesAtom);

  // Create navigation items for each route with icons
  const navigationItems: NavigationPageItem[] = routes
    .filter(route => !route.hidden)
    .map(route => {
      const baseItem: NavigationPageItem = {
        kind: 'page',
        title: route.title,
        segment: route.path === '/' ? undefined : route.path.slice(1), // Remove leading slash except for root
        pattern: route.path,
      };

      // Add icons based on the route
      switch (route.path) {
        case '/':
          return { ...baseItem, icon: <HomeIcon /> };
        case '/add-files':
          return { ...baseItem, icon: <UploadFileIcon /> };
        case '/teams':
          return { ...baseItem, icon: <GroupsIcon /> };
        case '/matches':
          return { ...baseItem, icon: <Event /> };
        case '/players':
          return { ...baseItem, icon: <PersonIcon /> };
        default:
          return baseItem;
      }
    });

  // Find the teams, matches, and players navigation items
  const teamsNav = navigationItems.find(item => item.pattern === '/teams');
  const matchesNav = navigationItems.find(item => item.pattern === '/matches');
  const playersNav = navigationItems.find(item => item.pattern === '/players');

  // Add children to teams navigation
  if (teamsNav) {
    teamsNav.children = teamNames.map(teamName => ({
      kind: 'page',
      title: teamName,
      segment: encodeURIComponent(teamName),
      pattern: `/teams/${encodeURIComponent(teamName)}`,
      icon: <GroupsIcon fontSize="small" />
    }));
  }

  // Add children to matches navigation
  if (matchesNav) {
    matchesNav.children = matches.map(match => ({
      kind: 'page',
      title: `${match.team1Name} vs ${match.team2Name}`,
      segment: match.matchId,
      pattern: `/matches/${match.matchId}`,
      icon: <SportsEsportsIcon fontSize="small" />
    }));
  }

  // Add children to players navigation
  if (playersNav) {
    playersNav.children = playerNames.map(player => ({
      kind: 'page',
      title: player.playerName,
      segment: encodeURIComponent(player.playerName),
      pattern: `/players/${encodeURIComponent(player.playerName)}`,
      icon: <PersonIcon fontSize="small" />
    }));
  }

  return navigationItems;
});

export default routes;
