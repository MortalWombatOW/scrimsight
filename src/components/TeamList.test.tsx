import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import TeamList from './TeamList';
import { TeamRelationships } from '../lib/ScrimsightDataModel';

// Mock the route utility
vi.mock('../lib/route', () => ({
  getRoute: vi.fn((path: string) => path),
}));

// Mock TeamColorDot component since it's not the focus of this test
vi.mock('./TeamColorDot', () => ({
  default: ({ teamName, size }: { teamName: string; size: number }) => (
    <div data-testid="team-color-dot" data-team={teamName} data-size={size} />
  ),
}));

// Mock EmptyState component
vi.mock('./EmptyState', () => ({
  default: ({ title, description, size }: { icon: unknown; title: string; description: string; size: string }) => (
    <div data-testid="empty-state" data-title={title} data-description={description} data-size={size} />
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

const mockTeams: TeamRelationships[] = [
  {
    team: 'Boston Uprising',
    players: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod'],
    scrims: ['SCRIM_001', 'SCRIM_002', 'SCRIM_003', 'SCRIM_004'],
  },
  {
    team: 'San Francisco Shock',
    players: ['Sinatraa', 'Moth', 'Super', 'Choihyobin', 'Architect', 'Viol2t'],
    scrims: ['SCRIM_005', 'SCRIM_006', 'SCRIM_007'],
  },
];

describe('TeamList', () => {
  describe('when teams list is empty', () => {
    it('should display empty state', () => {
      renderWithRouter(<TeamList teams={[]} />);
      
      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveAttribute('data-title', 'No teams found');
      expect(emptyState).toHaveAttribute('data-description', 'There are no teams to display');
      expect(emptyState).toHaveAttribute('data-size', 'md');
    });
  });

  describe('when teams are provided', () => {
    it('should render team grid container with correct classes', () => {
      const { container } = renderWithRouter(<TeamList teams={mockTeams} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
    });

    it('should apply custom className', () => {
      const { container } = renderWithRouter(<TeamList teams={mockTeams} className="custom-class" />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('custom-class');
    });

    it('should render all teams as cards', () => {
      renderWithRouter(<TeamList teams={mockTeams} />);
      
      expect(screen.getByText('Boston Uprising')).toBeInTheDocument();
      expect(screen.getByText('San Francisco Shock')).toBeInTheDocument();
    });

    it('should render team names as links to team detail pages', () => {
      renderWithRouter(<TeamList teams={mockTeams} />);
      
      const bostonLink = screen.getByRole('link', { name: /boston uprising/i });
      expect(bostonLink).toHaveAttribute('href', '/team/Boston%20Uprising');
      
      const shockLink = screen.getByRole('link', { name: /san francisco shock/i });
      expect(shockLink).toHaveAttribute('href', '/team/San%20Francisco%20Shock');
    });

    it('should render team color dots for each team', () => {
      renderWithRouter(<TeamList teams={mockTeams} />);
      
      const colorDots = screen.getAllByTestId('team-color-dot');
      expect(colorDots).toHaveLength(2);
      expect(colorDots[0]).toHaveAttribute('data-team', 'Boston Uprising');
      expect(colorDots[0]).toHaveAttribute('data-size', '24');
      expect(colorDots[1]).toHaveAttribute('data-team', 'San Francisco Shock');
      expect(colorDots[1]).toHaveAttribute('data-size', '24');
    });

    it('should display player count statistics', () => {
      renderWithRouter(<TeamList teams={mockTeams} />);
      
      const playerCounts = screen.getAllByText('6');
      expect(playerCounts).toHaveLength(2); // One for each team
    });

    it('should display scrims played statistics', () => {
      renderWithRouter(<TeamList teams={mockTeams} />);
      
      expect(screen.getByText('4')).toBeInTheDocument(); // Boston Uprising scrims
      expect(screen.getByText('3')).toBeInTheDocument(); // San Francisco Shock scrims
    });

    it('should display "Total Players" and "Scrims Played" labels', () => {
      renderWithRouter(<TeamList teams={mockTeams} />);
      
      const totalPlayersLabels = screen.getAllByText('Total Players');
      expect(totalPlayersLabels).toHaveLength(2);
      
      const scrimsPlayedLabels = screen.getAllByText('Scrims Played');
      expect(scrimsPlayedLabels).toHaveLength(2);
    });
  });

  describe('player badges display', () => {
    it('should show first 6 players as badges', () => {
      const teamWith6Players: TeamRelationships[] = [{
        team: 'Test Team',
        players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6'],
        scrims: ['SCRIM_001'],
      }];

      renderWithRouter(<TeamList teams={teamWith6Players} />);
      
      expect(screen.getByText('Player1')).toBeInTheDocument();
      expect(screen.getByText('Player2')).toBeInTheDocument();
      expect(screen.getByText('Player3')).toBeInTheDocument();
      expect(screen.getByText('Player4')).toBeInTheDocument();
      expect(screen.getByText('Player5')).toBeInTheDocument();
      expect(screen.getByText('Player6')).toBeInTheDocument();
    });

    it('should show "+X more" badge when team has more than 6 players', () => {
      const teamWith8Players: TeamRelationships[] = [{
        team: 'Large Team',
        players: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'],
        scrims: ['SCRIM_001'],
      }];

      renderWithRouter(<TeamList teams={teamWith8Players} />);
      
      // Should show first 6 players
      expect(screen.getByText('P1')).toBeInTheDocument();
      expect(screen.getByText('P6')).toBeInTheDocument();
      
      // Should not show players beyond 6
      expect(screen.queryByText('P7')).not.toBeInTheDocument();
      expect(screen.queryByText('P8')).not.toBeInTheDocument();
      
      // Should show +2 more badge
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('should not show "+X more" badge when team has 6 or fewer players', () => {
      const teamWith4Players: TeamRelationships[] = [{
        team: 'Small Team',
        players: ['Player1', 'Player2', 'Player3', 'Player4'],
        scrims: ['SCRIM_001'],
      }];

      renderWithRouter(<TeamList teams={teamWith4Players} />);
      
      expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
    });
  });

  describe('card styling', () => {
    it('should apply correct card classes to team links', () => {
      const { container } = renderWithRouter(<TeamList teams={mockTeams} />);
      
      const teamLinks = container.querySelectorAll('a');
      teamLinks.forEach(link => {
        expect(link).toHaveClass('card', 'bg-base-100', 'shadow-xl', 'hover:shadow-2xl', 'transition-shadow');
      });
    });

    it('should render team names with correct heading styles', () => {
      renderWithRouter(<TeamList teams={mockTeams} />);
      
      const teamNames = screen.getAllByRole('heading', { level: 3 });
      expect(teamNames).toHaveLength(2);
      teamNames.forEach(heading => {
        expect(heading).toHaveClass('card-title', 'text-lg');
      });
    });

    it('should render player badges with correct classes', () => {
      const { container } = renderWithRouter(<TeamList teams={mockTeams} />);
      
      const badges = container.querySelectorAll('.badge');
      badges.forEach(badge => {
        expect(badge).toHaveClass('badge-outline', 'badge-sm');
      });
    });

    it('should render stats with correct classes', () => {
      const { container } = renderWithRouter(<TeamList teams={mockTeams} />);
      
      const statsContainers = container.querySelectorAll('.stats');
      expect(statsContainers.length).toBeGreaterThan(0);
      statsContainers.forEach(stats => {
        expect(stats).toHaveClass('stats-vertical', 'text-xs');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle team with no players', () => {
      const teamWithNoPlayers: TeamRelationships[] = [{
        team: 'Empty Team',
        players: [],
        scrims: ['SCRIM_001'],
      }];

      renderWithRouter(<TeamList teams={teamWithNoPlayers} />);
      
      expect(screen.getByText('Empty Team')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Total players count
    });

    it('should handle team with no scrims', () => {
      const teamWithNoScrims: TeamRelationships[] = [{
        team: 'New Team',
        players: ['Player1', 'Player2'],
        scrims: [],
      }];

      renderWithRouter(<TeamList teams={teamWithNoScrims} />);
      
      expect(screen.getByText('New Team')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Scrims played count
    });

    it('should handle team names with special characters for URL encoding', () => {
      const teamWithSpecialChars: TeamRelationships[] = [{
        team: 'Team Name & Special/Chars',
        players: ['Player1'],
        scrims: ['SCRIM_001'],
      }];

      renderWithRouter(<TeamList teams={teamWithSpecialChars} />);
      
      const teamLink = screen.getByRole('link', { name: /team name & special\/chars/i });
      expect(teamLink).toHaveAttribute('href', '/team/Team%20Name%20%26%20Special%2FChars');
    });
  });
});