import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PlayerList from './PlayerList';
import { PlayerRelationships } from '../lib/ScrimsightDataModel';

// Mock the route utility
vi.mock('../lib/route', () => ({
  getRoute: vi.fn((path: string) => path),
}));

// Mock HeroIcon component
vi.mock('../icons/HeroIcon', () => ({
  default: ({ hero, size, showTooltip }: { hero: string; size: number; showTooltip: boolean }) => (
    <div data-testid="hero-icon" data-hero={hero} data-size={size} data-tooltip={showTooltip} />
  ),
}));

// Mock RoleIcon component
vi.mock('../icons/RoleIcon', () => ({
  default: ({ role }: { role: string }) => (
    <div data-testid="role-icon" data-role={role} />
  ),
}));

// Mock EmptyState component
vi.mock('./EmptyState', () => ({
  default: ({ title, description, size }: { icon: unknown; title: string; description: string; size: string }) => (
    <div data-testid="empty-state" data-title={title} data-description={description} data-size={size} />
  ),
}));

// Mock format utilities
vi.mock('../lib/format', () => ({
  formatDuration: vi.fn((seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`),
  listToNaturalLanguage: vi.fn((items: string[]) => items.join(', ')),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

const mockPlayers: PlayerRelationships[] = [
  {
    player: 'Striker',
    teams: ['Boston Uprising', 'San Francisco Shock'],
    scrims: ['SCRIM_001', 'SCRIM_002', 'SCRIM_003'],
    matches: ['MATCH_001', 'MATCH_002', 'MATCH_003', 'MATCH_004'],
    heroes: [
      { hero: 'Tracer', playtime: 3600 },
      { hero: 'Widowmaker', playtime: 2400 },
      { hero: 'Ashe', playtime: 1800 },
    ],
    roles: [
      { role: 'damage', playtime: 7800 },
    ],
  },
  {
    player: 'Kellex',
    teams: ['Boston Uprising'],
    scrims: ['SCRIM_001', 'SCRIM_002'],
    matches: ['MATCH_001', 'MATCH_002'],
    heroes: [
      { hero: 'Mercy', playtime: 2700 },
      { hero: 'Ana', playtime: 1800 },
      { hero: 'Zenyatta', playtime: 900 },
    ],
    roles: [
      { role: 'support', playtime: 5400 },
    ],
  },
];

describe('PlayerList', () => {
  describe('when players list is empty', () => {
    it('should display empty state', () => {
      renderWithRouter(<PlayerList players={[]} />);
      
      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveAttribute('data-title', 'No players found');
      expect(emptyState).toHaveAttribute('data-description', 'There are no players to display');
      expect(emptyState).toHaveAttribute('data-size', 'md');
    });
  });

  describe('when players are provided', () => {
    it('should render player grid container with correct classes', () => {
      const { container } = renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
    });

    it('should apply custom className', () => {
      const { container } = renderWithRouter(<PlayerList players={mockPlayers} className="custom-class" />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('custom-class');
    });

    it('should render all players as cards', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      expect(screen.getByText('Striker')).toBeInTheDocument();
      expect(screen.getByText('Kellex')).toBeInTheDocument();
    });

    it('should render player names as links to player detail pages', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const strikerLink = screen.getByRole('link', { name: /striker/i });
      expect(strikerLink).toHaveAttribute('href', '/player/Striker');
      
      const kellexLink = screen.getByRole('link', { name: /kellex/i });
      expect(kellexLink).toHaveAttribute('href', '/player/Kellex');
    });

    it('should render role icons for each player with top role', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const roleIcons = screen.getAllByTestId('role-icon');
      expect(roleIcons).toHaveLength(2);
      expect(roleIcons[0]).toHaveAttribute('data-role', 'damage');
      expect(roleIcons[1]).toHaveAttribute('data-role', 'support');
    });

    it('should display top 3 heroes for each player', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const heroIcons = screen.getAllByTestId('hero-icon');
      expect(heroIcons.length).toBeGreaterThanOrEqual(6); // At least 3 per player
      
      // Check that the expected heroes are present
      expect(heroIcons.some(icon => icon.getAttribute('data-hero') === 'Tracer')).toBe(true);
      expect(heroIcons.some(icon => icon.getAttribute('data-hero') === 'Widowmaker')).toBe(true);
      expect(heroIcons.some(icon => icon.getAttribute('data-hero') === 'Ashe')).toBe(true);
      expect(heroIcons.some(icon => icon.getAttribute('data-hero') === 'Mercy')).toBe(true);
      expect(heroIcons.some(icon => icon.getAttribute('data-hero') === 'Ana')).toBe(true);
      expect(heroIcons.some(icon => icon.getAttribute('data-hero') === 'Zenyatta')).toBe(true);
    });

    it('should display hero icons with correct size and tooltip', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const heroIcons = screen.getAllByTestId('hero-icon');
      heroIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '32');
        expect(icon).toHaveAttribute('data-tooltip', 'true');
      });
    });

    it('should display playtime statistics', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      expect(screen.getByText('130m 0s')).toBeInTheDocument(); // Striker total: 7800s
      expect(screen.getByText('90m 0s')).toBeInTheDocument(); // Kellex total: 5400s
    });

    it('should display teams for each player', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      expect(screen.getByText('Boston Uprising, San Francisco Shock')).toBeInTheDocument();
      expect(screen.getByText('Boston Uprising')).toBeInTheDocument();
    });

    it('should display scrims count statistics', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      expect(screen.getByText('3')).toBeInTheDocument(); // Striker scrims
      expect(screen.getByText('2')).toBeInTheDocument(); // Kellex scrims
    });

    it('should display "Playtime", "Teams", and "Scrims" labels', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const playtimeLabels = screen.getAllByText('Playtime');
      expect(playtimeLabels).toHaveLength(2);
      
      const teamsLabels = screen.getAllByText('Teams');
      expect(teamsLabels).toHaveLength(2);
      
      const scrimsLabels = screen.getAllByText('Scrims');
      expect(scrimsLabels).toHaveLength(2);
    });

    it('should display teams list with title attribute for truncation', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const teamsElements = screen.getAllByText('Boston Uprising, San Francisco Shock');
      expect(teamsElements[0]).toHaveAttribute('title', 'Boston Uprising, San Francisco Shock');
      expect(teamsElements[0]).toHaveClass('truncate');
    });
  });

  describe('hero sorting and display', () => {
    it('should sort heroes by playtime in descending order', () => {
      const playerWithUnsortedHeroes: PlayerRelationships[] = [{
        player: 'TestPlayer',
        teams: ['Test Team'],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [
          { hero: 'Ana', playtime: 1000 },    // Should be 3rd
          { hero: 'Mercy', playtime: 3000 },  // Should be 1st
          { hero: 'Zenyatta', playtime: 2000 }, // Should be 2nd
        ],
        roles: [{ role: 'support', playtime: 6000 }],
      }];

      renderWithRouter(<PlayerList players={playerWithUnsortedHeroes} />);
      
      const heroIcons = screen.getAllByTestId('hero-icon');
      expect(heroIcons[0]).toHaveAttribute('data-hero', 'Mercy');
      expect(heroIcons[1]).toHaveAttribute('data-hero', 'Zenyatta');
      expect(heroIcons[2]).toHaveAttribute('data-hero', 'Ana');
    });

    it('should display only top 3 heroes even when player has more', () => {
      const playerWithManyHeroes: PlayerRelationships[] = [{
        player: 'FlexPlayer',
        teams: ['Flex Team'],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [
          { hero: 'Tracer', playtime: 5000 },
          { hero: 'Genji', playtime: 4000 },
          { hero: 'Widowmaker', playtime: 3000 },
          { hero: 'Ashe', playtime: 2000 },      // Should not appear
          { hero: 'Hanzo', playtime: 1000 },    // Should not appear
        ],
        roles: [{ role: 'damage', playtime: 15000 }],
      }];

      renderWithRouter(<PlayerList players={playerWithManyHeroes} />);
      
      const heroIcons = screen.getAllByTestId('hero-icon');
      expect(heroIcons).toHaveLength(3);
      expect(heroIcons[0]).toHaveAttribute('data-hero', 'Tracer');
      expect(heroIcons[1]).toHaveAttribute('data-hero', 'Genji');
      expect(heroIcons[2]).toHaveAttribute('data-hero', 'Widowmaker');
      
      // Should not display heroes beyond top 3
      expect(heroIcons.some(icon => icon.getAttribute('data-hero') === 'Ashe')).toBe(false);
      expect(heroIcons.some(icon => icon.getAttribute('data-hero') === 'Hanzo')).toBe(false);
    });
  });

  describe('role display', () => {
    it('should display top role icon based on playtime', () => {
      const playerWithMultipleRoles: PlayerRelationships[] = [{
        player: 'FlexPlayer',
        teams: ['Multi Role Team'],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [{ hero: 'Tracer', playtime: 1000 }],
        roles: [
          { role: 'damage', playtime: 2000 },  // Should be displayed
          { role: 'support', playtime: 1000 },
          { role: 'tank', playtime: 500 },
        ],
      }];

      renderWithRouter(<PlayerList players={playerWithMultipleRoles} />);
      
      const roleIcon = screen.getByTestId('role-icon');
      expect(roleIcon).toHaveAttribute('data-role', 'damage');
    });

    it('should not display role icon when player has no roles', () => {
      const playerWithNoRoles: PlayerRelationships[] = [{
        player: 'NoRolePlayer',
        teams: ['Test Team'],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [{ hero: 'Tracer', playtime: 1000 }],
        roles: [],
      }];

      renderWithRouter(<PlayerList players={playerWithNoRoles} />);
      
      expect(screen.queryByTestId('role-icon')).not.toBeInTheDocument();
    });
  });

  describe('card styling', () => {
    it('should apply correct card classes to player links', () => {
      const { container } = renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const playerLinks = container.querySelectorAll('a');
      playerLinks.forEach(link => {
        expect(link).toHaveClass('card', 'bg-base-100', 'shadow-xl', 'hover:shadow-2xl', 'transition-shadow');
      });
    });

    it('should render player names with correct heading styles', () => {
      renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const playerNames = screen.getAllByRole('heading', { level: 3 });
      expect(playerNames).toHaveLength(2);
      playerNames.forEach(heading => {
        expect(heading).toHaveClass('card-title', 'text-lg');
      });
    });

    it('should render stats with correct classes', () => {
      const { container } = renderWithRouter(<PlayerList players={mockPlayers} />);
      
      const statsContainers = container.querySelectorAll('.stats');
      expect(statsContainers.length).toBeGreaterThan(0);
      statsContainers.forEach(stats => {
        expect(stats).toHaveClass('stats-vertical', 'text-xs');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle player with no teams', () => {
      const playerWithNoTeams: PlayerRelationships[] = [{
        player: 'Teamless Player',
        teams: [],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [{ hero: 'Tracer', playtime: 1000 }],
        roles: [{ role: 'damage', playtime: 1000 }],
      }];

      renderWithRouter(<PlayerList players={playerWithNoTeams} />);
      
      expect(screen.getByText('Teamless Player')).toBeInTheDocument();
      // Empty teams list should display empty string
      const teamsValue = screen.getByTitle('');
      expect(teamsValue).toBeInTheDocument();
    });

    it('should handle player with no scrims', () => {
      const playerWithNoScrims: PlayerRelationships[] = [{
        player: 'New Player',
        teams: ['New Team'],
        scrims: [],
        matches: [],
        heroes: [{ hero: 'Tracer', playtime: 1000 }],
        roles: [{ role: 'damage', playtime: 1000 }],
      }];

      renderWithRouter(<PlayerList players={playerWithNoScrims} />);
      
      expect(screen.getByText('New Player')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Scrims count
    });

    it('should handle player with no heroes', () => {
      const playerWithNoHeroes: PlayerRelationships[] = [{
        player: 'No Hero Player',
        teams: ['Test Team'],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [],
        roles: [{ role: 'damage', playtime: 1000 }],
      }];

      renderWithRouter(<PlayerList players={playerWithNoHeroes} />);
      
      expect(screen.getByText('No Hero Player')).toBeInTheDocument();
      expect(screen.queryByTestId('hero-icon')).not.toBeInTheDocument();
      expect(screen.getByText('0m 0s')).toBeInTheDocument(); // Zero playtime
    });

    it('should handle player names with special characters for URL encoding', () => {
      const playerWithSpecialChars: PlayerRelationships[] = [{
        player: 'Player Name & Special/Chars',
        teams: ['Test Team'],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [{ hero: 'Tracer', playtime: 1000 }],
        roles: [{ role: 'damage', playtime: 1000 }],
      }];

      renderWithRouter(<PlayerList players={playerWithSpecialChars} />);
      
      const playerLink = screen.getByRole('link', { name: /player name & special\/chars/i });
      expect(playerLink).toHaveAttribute('href', '/player/Player%20Name%20%26%20Special%2FChars');
    });

    it('should handle single team display', () => {
      const playerWithSingleTeam: PlayerRelationships[] = [{
        player: 'Single Team Player',
        teams: ['Only Team'],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [{ hero: 'Tracer', playtime: 1000 }],
        roles: [{ role: 'damage', playtime: 1000 }],
      }];

      renderWithRouter(<PlayerList players={playerWithSingleTeam} />);
      
      expect(screen.getByText('Only Team')).toBeInTheDocument();
    });

    it('should handle player with many teams', () => {
      const playerWithManyTeams: PlayerRelationships[] = [{
        player: 'Journey Player',
        teams: ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon'],
        scrims: ['SCRIM_001'],
        matches: ['MATCH_001'],
        heroes: [{ hero: 'Tracer', playtime: 1000 }],
        roles: [{ role: 'damage', playtime: 1000 }],
      }];

      renderWithRouter(<PlayerList players={playerWithManyTeams} />);
      
      expect(screen.getByText('Team Alpha, Team Beta, Team Gamma, Team Delta, Team Epsilon')).toBeInTheDocument();
    });
  });
});