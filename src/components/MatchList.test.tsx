import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import MatchList from './MatchList';
import { MatchRelationships } from '../lib/ScrimsightDataModel';

// Mock dependencies
vi.mock('./TeamColorDot', () => ({
  default: ({ teamName, size }: { teamName: string; size: number }) => (
    <div data-testid="team-color-dot" data-team={teamName} data-size={size} />
  ),
}));

vi.mock('./EmptyState', () => ({
  default: ({ title, description, size }: { icon: unknown; title: string; description: string; size: string }) => (
    <div data-testid="empty-state" data-title={title} data-description={description} data-size={size} />
  ),
}));

vi.mock('../lib/format', () => ({
  formatDuration: vi.fn((seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`),
  formatDate: vi.fn((date: Date) => date.toLocaleDateString()),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

const mockMatches: MatchRelationships[] = [
  {
    match: 'MATCH_001',
    scrim: 'SCRIM_001',
    teams: ['Boston Uprising', 'New York Excelsior'],
    map: "King's Row",
    date: new Date('2024-01-15T19:30:00'),
    rounds: [1, 2, 3],
    duration: 1245,
    team1Score: 3,
    team2Score: 1,
    winningTeam: 'Boston Uprising',
    gameMode: 'Hybrid',
  },
  {
    match: 'MATCH_002',
    scrim: 'SCRIM_001',
    teams: ['San Francisco Shock', 'Seoul Dynasty'],
    map: 'Lijiang Tower',
    date: new Date('2024-01-15T20:15:00'),
    rounds: [1, 2],
    duration: 892,
    team1Score: 2,
    team2Score: 0,
    winningTeam: 'San Francisco Shock',
    gameMode: 'Control',
  },
];

describe('MatchList', () => {
  describe('when matches list is empty', () => {
    it('should display empty state', () => {
      renderWithRouter(<MatchList matches={[]} />);
      
      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveAttribute('data-title', 'No matches found');
      expect(emptyState).toHaveAttribute('data-description', 'There are no matches to display');
      expect(emptyState).toHaveAttribute('data-size', 'md');
    });
  });

  describe('when matches are provided', () => {
    it('should render match grid container with correct classes', () => {
      const { container } = renderWithRouter(<MatchList matches={mockMatches} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'gap-4');
    });

    it('should apply custom className', () => {
      const { container } = renderWithRouter(<MatchList matches={mockMatches} className="custom-class" />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('custom-class');
    });

    it('should render all matches as cards', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      expect(screen.getByText('Boston Uprising')).toBeInTheDocument();
      expect(screen.getByText('New York Excelsior')).toBeInTheDocument();
      expect(screen.getByText('San Francisco Shock')).toBeInTheDocument();
      expect(screen.getByText('Seoul Dynasty')).toBeInTheDocument();
    });

    it('should render match IDs as links to match detail pages', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      const match1Link = screen.getByRole('link', { name: /match_001/i });
      expect(match1Link).toHaveAttribute('href', '/match/MATCH_001');
      
      const match2Link = screen.getByRole('link', { name: /match_002/i });
      expect(match2Link).toHaveAttribute('href', '/match/MATCH_002');
    });

    it('should render team color dots for each team', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      const colorDots = screen.getAllByTestId('team-color-dot');
      expect(colorDots).toHaveLength(4); // 2 teams per match × 2 matches
      
      // Check first match teams
      expect(colorDots[0]).toHaveAttribute('data-team', 'Boston Uprising');
      expect(colorDots[0]).toHaveAttribute('data-size', '16');
      expect(colorDots[1]).toHaveAttribute('data-team', 'New York Excelsior');
      expect(colorDots[1]).toHaveAttribute('data-size', '16');
    });

    it('should display match IDs with monospace font', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      const matchIds = screen.getAllByText(/MATCH_\d+/);
      matchIds.forEach(matchId => {
        expect(matchId).toHaveClass('font-mono');
      });
    });

    it('should display game modes as badges', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      expect(screen.getByText('Hybrid')).toBeInTheDocument();
      expect(screen.getByText('Control')).toBeInTheDocument();
      
      const badges = screen.getAllByText(/^(Hybrid|Control)$/);
      badges.forEach(badge => {
        expect(badge).toHaveClass('badge', 'badge-outline');
      });
    });

    it('should display team scores', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      // First match scores
      expect(screen.getByText('3')).toBeInTheDocument(); // Boston Uprising score
      expect(screen.getByText('1')).toBeInTheDocument(); // New York Excelsior score
      
      // Second match scores
      expect(screen.getByText('2')).toBeInTheDocument(); // San Francisco Shock score
      expect(screen.getByText('0')).toBeInTheDocument(); // Seoul Dynasty score
    });

    it('should display match details', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      // Map names
      expect(screen.getByText("King's Row")).toBeInTheDocument();
      expect(screen.getByText('Lijiang Tower')).toBeInTheDocument();
      
      // Labels
      const mapLabels = screen.getAllByText('Map:');
      expect(mapLabels).toHaveLength(2);
      
      const durationLabels = screen.getAllByText('Duration:');
      expect(durationLabels).toHaveLength(2);
      
      const dateLabels = screen.getAllByText('Date:');
      expect(dateLabels).toHaveLength(2);
    });

    it('should display winning team announcement', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      expect(screen.getByText('Boston Uprising wins')).toBeInTheDocument();
      expect(screen.getByText('San Francisco Shock wins')).toBeInTheDocument();
    });
  });

  describe('score styling', () => {
    it('should highlight winning team names', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      const bostonText = screen.getByText('Boston Uprising');
      expect(bostonText).toHaveClass('text-success');
      
      const shockText = screen.getByText('San Francisco Shock');
      expect(shockText).toHaveClass('text-success');
    });

    it('should style winning scores with success color', () => {
      const { container } = renderWithRouter(<MatchList matches={mockMatches} />);
      
      // Find score elements and check their styling
      const scoreElements = container.querySelectorAll('.text-lg.font-bold');
      
      // Boston Uprising's winning score (3)
      const winningScores = Array.from(scoreElements).filter(el => 
        el.textContent === '3' || el.textContent === '2'
      );
      
      winningScores.forEach(score => {
        expect(score).toHaveClass('text-success');
      });
    });

    it('should style losing scores with error color', () => {
      const { container } = renderWithRouter(<MatchList matches={mockMatches} />);
      
      // Find losing score elements
      const scoreElements = container.querySelectorAll('.text-lg.font-bold');
      
      // Losing scores (1 and 0)
      const losingScores = Array.from(scoreElements).filter(el => 
        el.textContent === '1' || el.textContent === '0'
      );
      
      losingScores.forEach(score => {
        expect(score).toHaveClass('text-error');
      });
    });
  });

  describe('draw matches', () => {
    it('should handle draw matches correctly', () => {
      const drawMatch: MatchRelationships[] = [{
        match: 'MATCH_DRAW',
        scrim: 'SCRIM_DRAW',
        teams: ['Team Alpha', 'Team Beta'],
        map: 'Nepal',
        date: new Date('2024-01-20T19:00:00'),
        rounds: [1, 2, 3],
        duration: 1500,
        team1Score: 2,
        team2Score: 2,
        winningTeam: 'Team Alpha', // This would be the winner in overtime or by some other criterion
        gameMode: 'Control',
      }];

      const { container } = renderWithRouter(<MatchList matches={drawMatch} />);
      
      // Both scores should have neutral styling for draws
      const scoreElements = container.querySelectorAll('.text-lg.font-bold');
      scoreElements.forEach(score => {
        if (score.textContent === '2') {
          expect(score).toHaveClass('text-base-content/70');
        }
      });
      
      // Should not show winner announcement for draws
      expect(screen.queryByText(/wins$/)).not.toBeInTheDocument();
    });
  });

  describe('card styling', () => {
    it('should apply correct card classes to match links', () => {
      const { container } = renderWithRouter(<MatchList matches={mockMatches} />);
      
      const matchLinks = container.querySelectorAll('a');
      matchLinks.forEach(link => {
        expect(link).toHaveClass('card', 'bg-base-100', 'shadow-xl', 'hover:shadow-2xl', 'transition-shadow');
      });
    });

    it('should render match details with correct text styling', () => {
      const { container } = renderWithRouter(<MatchList matches={mockMatches} />);
      
      const detailsContainers = container.querySelectorAll('.space-y-1');
      detailsContainers.forEach(details => {
        expect(details).toHaveClass('text-sm', 'text-base-content/70');
      });
    });

    it('should render winner announcements with correct styling', () => {
      const { container } = renderWithRouter(<MatchList matches={mockMatches} />);
      
      const winnerTexts = container.querySelectorAll('.text-success.text-sm.font-semibold');
      expect(winnerTexts.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle matches with special characters in IDs', () => {
      const specialMatch: MatchRelationships[] = [{
        match: 'MATCH_SPECIAL/CHARS&MORE',
        scrim: 'SCRIM_001',
        teams: ['Team A', 'Team B'],
        map: 'King\'s Row',
        date: new Date('2024-01-20T19:00:00'),
        rounds: [1],
        duration: 600,
        team1Score: 1,
        team2Score: 0,
        winningTeam: 'Team A',
        gameMode: 'Hybrid',
      }];

      renderWithRouter(<MatchList matches={specialMatch} />);
      
      const matchLink = screen.getByRole('link', { name: /match_special/i });
      expect(matchLink).toHaveAttribute('href', '/match/MATCH_SPECIAL%2FCHARS%26MORE');
    });

    it('should handle long team names gracefully', () => {
      const longNameMatch: MatchRelationships[] = [{
        match: 'MATCH_LONG',
        scrim: 'SCRIM_001',
        teams: ['Very Long Team Name That Should Not Break Layout', 'Another Very Long Team Name'],
        map: 'King\'s Row',
        date: new Date('2024-01-20T19:00:00'),
        rounds: [1],
        duration: 600,
        team1Score: 1,
        team2Score: 0,
        winningTeam: 'Very Long Team Name That Should Not Break Layout',
        gameMode: 'Hybrid',
      }];

      renderWithRouter(<MatchList matches={longNameMatch} />);
      
      expect(screen.getByText('Very Long Team Name That Should Not Break Layout')).toBeInTheDocument();
      expect(screen.getByText('Another Very Long Team Name')).toBeInTheDocument();
    });

    it('should handle matches with zero duration', () => {
      const zeroDurationMatch: MatchRelationships[] = [{
        match: 'MATCH_ZERO',
        scrim: 'SCRIM_001',
        teams: ['Team A', 'Team B'],
        map: 'King\'s Row',
        date: new Date('2024-01-20T19:00:00'),
        rounds: [1],
        duration: 0,
        team1Score: 1,
        team2Score: 0,
        winningTeam: 'Team A',
        gameMode: 'Hybrid',
      }];

      renderWithRouter(<MatchList matches={zeroDurationMatch} />);
      
      expect(screen.getByText('Duration:')).toBeInTheDocument();
      // Should still render the duration label even if duration is 0
    });
  });

  describe('format function integration', () => {
    it('should display formatted duration and date', () => {
      renderWithRouter(<MatchList matches={mockMatches} />);
      
      // Verify the formatted output is displayed (mocked to return formatted strings)
      expect(screen.getByText('20:45')).toBeInTheDocument(); // First match duration
      expect(screen.getByText('14:52')).toBeInTheDocument(); // Second match duration
      
      // Verify formatted dates are displayed
      const formattedDates = screen.getAllByText(/\d+\/\d+\/\d+/);
      expect(formattedDates.length).toBeGreaterThan(0);
    });
  });
});