import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchHeader from './MatchHeader';
import { MatchID, MapName, GameMode, TeamName } from '../lib/ScrimsightDataModel';

// Mock TeamColorDot component since it's not the focus of this test
vi.mock('./TeamColorDot', () => ({
  default: ({ teamName, size }: { teamName: string; size: number }) => (
    <div data-testid="team-color-dot" data-team={teamName} data-size={size} />
  ),
}));

const createMatchHeaderProps = (overrides: Partial<{
  matchId: MatchID;
  mapName: MapName;
  gameMode: GameMode;
  team1Name: TeamName;
  team2Name: TeamName;
  winningTeam: TeamName;
  team1Score: number;
  team2Score: number;
  className?: string;
}> = {}) => ({
  matchId: 'MATCH_2024_001' as MatchID,
  mapName: "King's Row" as MapName,
  gameMode: 'Hybrid' as GameMode,
  team1Name: 'Boston Uprising' as TeamName,
  team2Name: 'New York Excelsior' as TeamName,
  winningTeam: 'Boston Uprising' as TeamName,
  team1Score: 3,
  team2Score: 1,
  ...overrides,
});

describe('MatchHeader', () => {
  describe('basic rendering', () => {
    it('should render match metadata correctly', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('MATCH_2024_001')).toBeInTheDocument();
      expect(screen.getByText("King's Row")).toBeInTheDocument();
      expect(screen.getByText('Hybrid')).toBeInTheDocument();
    });

    it('should apply custom className to root container', () => {
      const props = createMatchHeaderProps({ className: 'custom-match-header' });
      const { container } = render(<MatchHeader {...props} />);
      
      const rootElement = container.firstChild as HTMLElement;
      expect(rootElement).toHaveClass('custom-match-header');
    });

    it('should render match ID with monospace font styling', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      const matchIdElement = screen.getByText('MATCH_2024_001');
      expect(matchIdElement).toHaveClass('font-mono', 'text-sm');
    });

    it('should render game mode as a badge', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      const gameModeElement = screen.getByText('Hybrid');
      expect(gameModeElement).toHaveClass('badge', 'badge-outline');
    });
  });

  describe('team display', () => {
    it('should render both team names', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('Boston Uprising')).toBeInTheDocument();
      expect(screen.getByText('New York Excelsior')).toBeInTheDocument();
    });

    it('should render team color dots for both teams', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      const colorDots = screen.getAllByTestId('team-color-dot');
      expect(colorDots).toHaveLength(2);
      expect(colorDots[0]).toHaveAttribute('data-team', 'Boston Uprising');
      expect(colorDots[0]).toHaveAttribute('data-size', '20');
      expect(colorDots[1]).toHaveAttribute('data-team', 'New York Excelsior');
      expect(colorDots[1]).toHaveAttribute('data-size', '20');
    });

    it('should render team names with correct typography classes', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      const team1Element = screen.getByText('Boston Uprising');
      const team2Element = screen.getByText('New York Excelsior');
      
      expect(team1Element).toHaveClass('text-xl', 'font-semibold');
      expect(team2Element).toHaveClass('text-xl', 'font-semibold');
    });
  });

  describe('score display', () => {
    it('should render both team scores', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      const scores = screen.getAllByText(/^[0-9]+$/);
      expect(scores).toHaveLength(2);
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should style scores with correct typography classes', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      const team1Score = screen.getByText('3');
      const team2Score = screen.getByText('1');
      
      expect(team1Score).toHaveClass('text-2xl', 'font-bold');
      expect(team2Score).toHaveClass('text-2xl', 'font-bold');
    });
  });

  describe('winning team behavior', () => {
    it('should highlight winning team name with success color', () => {
      const props = createMatchHeaderProps({
        team1Name: 'Boston Uprising' as TeamName,
        team2Name: 'New York Excelsior' as TeamName,
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      const winningTeamElement = screen.getByText('Boston Uprising');
      const losingTeamElement = screen.getByText('New York Excelsior');
      
      expect(winningTeamElement).toHaveClass('text-success');
      expect(losingTeamElement).not.toHaveClass('text-success');
    });

    it('should highlight winning team score with success color', () => {
      const props = createMatchHeaderProps({
        team1Score: 3,
        team2Score: 1,
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      const winningScore = screen.getByText('3');
      const losingScore = screen.getByText('1');
      
      expect(winningScore).toHaveClass('text-success');
      expect(losingScore).toHaveClass('text-error');
    });

    it('should display "X wins!" message for winning team', () => {
      const props = createMatchHeaderProps({
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('Boston Uprising wins!')).toBeInTheDocument();
    });

    it('should style winning message with success color and correct typography', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      const winMessage = screen.getByText('Boston Uprising wins!');
      expect(winMessage).toHaveClass('text-success', 'font-semibold');
    });
  })

  describe('draw scenarios', () => {
    it('should not show winning message when scores are tied', () => {
      const props = createMatchHeaderProps({
        team1Score: 2,
        team2Score: 2,
        winningTeam: 'Boston Uprising' as TeamName, // winningTeam prop still provided but ignored
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.queryByText(/wins!/)).not.toBeInTheDocument();
    });

    it('should style team names based on winningTeam prop even in tied scores', () => {
      // This test reflects actual component behavior - team names are styled based on
      // winningTeam prop regardless of score tie. The "draw" logic only affects
      // score colors and winning message display.
      const props = createMatchHeaderProps({
        team1Score: 2,
        team2Score: 2,
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      const team1Element = screen.getByText('Boston Uprising');
      const team2Element = screen.getByText('New York Excelsior');
      
      // Team1 still gets success color because winningTeam matches
      expect(team1Element).toHaveClass('text-success');
      expect(team2Element).not.toHaveClass('text-success');
    });

    it('should not highlight any team names when winningTeam does not match either team in a draw', () => {
      const props = createMatchHeaderProps({
        team1Score: 2,
        team2Score: 2,
        winningTeam: 'Non-existent Team' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      const team1Element = screen.getByText('Boston Uprising');
      const team2Element = screen.getByText('New York Excelsior');
      
      expect(team1Element).not.toHaveClass('text-success');
      expect(team2Element).not.toHaveClass('text-success');
    });

    it('should style both scores with neutral color in a draw', () => {
      const props = createMatchHeaderProps({
        team1Score: 2,
        team2Score: 2,
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      const scores = screen.getAllByText('2');
      expect(scores).toHaveLength(2);
      scores.forEach(score => {
        expect(score).toHaveClass('text-base-content/70');
        expect(score).not.toHaveClass('text-success');
        expect(score).not.toHaveClass('text-error');
      });
    });
  });

  describe('different game scenarios', () => {
    it('should handle team 2 wins scenario', () => {
      const props = createMatchHeaderProps({
        team1Name: 'Seoul Dynasty' as TeamName,
        team2Name: 'San Francisco Shock' as TeamName,
        winningTeam: 'San Francisco Shock' as TeamName,
        team1Score: 1,
        team2Score: 2,
      });
      render(<MatchHeader {...props} />);
      
      const winningTeamElement = screen.getByText('San Francisco Shock');
      const losingTeamElement = screen.getByText('Seoul Dynasty');
      
      expect(winningTeamElement).toHaveClass('text-success');
      expect(losingTeamElement).not.toHaveClass('text-success');
      expect(screen.getByText('San Francisco Shock wins!')).toBeInTheDocument();
    });

    it('should handle close match scores', () => {
      const props = createMatchHeaderProps({
        team1Score: 6,
        team2Score: 5,
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Boston Uprising wins!')).toBeInTheDocument();
    });

    it('should handle blowout scores', () => {
      const props = createMatchHeaderProps({
        team1Score: 3,
        team2Score: 0,
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('different game modes and maps', () => {
    it('should render Control game mode', () => {
      const props = createMatchHeaderProps({
        mapName: 'Lijiang Tower' as MapName,
        gameMode: 'Control' as GameMode,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('Lijiang Tower')).toBeInTheDocument();
      expect(screen.getByText('Control')).toBeInTheDocument();
    });

    it('should render Escort game mode', () => {
      const props = createMatchHeaderProps({
        mapName: 'Dorado' as MapName,
        gameMode: 'Escort' as GameMode,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('Dorado')).toBeInTheDocument();
      expect(screen.getByText('Escort')).toBeInTheDocument();
    });

    it('should render Assault game mode', () => {
      const props = createMatchHeaderProps({
        mapName: 'Temple of Anubis' as MapName,
        gameMode: 'Assault' as GameMode,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('Temple of Anubis')).toBeInTheDocument();
      expect(screen.getByText('Assault')).toBeInTheDocument();
    });
  });

  describe('children rendering', () => {
    it('should render children when provided', () => {
      const props = createMatchHeaderProps();
      render(
        <MatchHeader {...props}>
          <div data-testid="child-content">Additional match details</div>
        </MatchHeader>
      );
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Additional match details')).toBeInTheDocument();
    });

    it('should not render children container when no children provided', () => {
      const props = createMatchHeaderProps();
      const { container } = render(<MatchHeader {...props} />);
      
      // The children container should not be rendered
      const childrenContainer = container.querySelector('.mt-4');
      expect(childrenContainer).not.toBeInTheDocument();
    });

    it('should apply correct spacing to children container', () => {
      const props = createMatchHeaderProps();
      const { container } = render(
        <MatchHeader {...props}>
          <div>Child content</div>
        </MatchHeader>
      );
      
      const childrenContainer = container.querySelector('.mt-4');
      expect(childrenContainer).toBeInTheDocument();
      expect(childrenContainer).toHaveClass('mt-4');
    });
  });

  describe('layout and spacing', () => {
    it('should apply correct spacing classes to root container', () => {
      const props = createMatchHeaderProps();
      const { container } = render(<MatchHeader {...props} />);
      
      const rootElement = container.firstChild as HTMLElement;
      expect(rootElement).toHaveClass('space-y-4');
    });

    it('should apply correct spacing to metadata section', () => {
      const props = createMatchHeaderProps();
      const { container } = render(<MatchHeader {...props} />);
      
      const metadataSection = container.querySelector('.space-y-2');
      expect(metadataSection).toBeInTheDocument();
    });

    it('should apply correct spacing to teams section', () => {
      const props = createMatchHeaderProps();
      const { container } = render(<MatchHeader {...props} />);
      
      const teamsSection = container.querySelector('.space-y-3');
      expect(teamsSection).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should be accessible with proper semantic structure', () => {
      const props = createMatchHeaderProps();
      render(<MatchHeader {...props} />);
      
      // The component should be readable by screen readers
      expect(screen.getByText('MATCH_2024_001')).toBeInTheDocument();
      expect(screen.getByText('Boston Uprising')).toBeInTheDocument();
      expect(screen.getByText('New York Excelsior')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should maintain proper text contrast classes', () => {
      const props = createMatchHeaderProps();
      const { container } = render(<MatchHeader {...props} />);
      
      const metadataElements = container.querySelector('.text-base-content\\/70');
      expect(metadataElements).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle zero scores', () => {
      const props = createMatchHeaderProps({
        team1Score: 0,
        team2Score: 0,
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      const scores = screen.getAllByText('0');
      expect(scores).toHaveLength(2);
      expect(screen.queryByText(/wins!/)).not.toBeInTheDocument(); // Draw scenario
    });

    it('should handle large score differences', () => {
      const props = createMatchHeaderProps({
        team1Score: 100,
        team2Score: 0,
        winningTeam: 'Boston Uprising' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Boston Uprising wins!')).toBeInTheDocument();
    });

    it('should handle team names with special characters', () => {
      const props = createMatchHeaderProps({
        team1Name: "Team O'Malley & Co." as TeamName,
        team2Name: 'Team "Quotes" United' as TeamName,
        winningTeam: "Team O'Malley & Co." as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText("Team O'Malley & Co.")).toBeInTheDocument();
      expect(screen.getByText('Team "Quotes" United')).toBeInTheDocument();
      expect(screen.getByText("Team O'Malley & Co. wins!")).toBeInTheDocument();
    });

    it('should handle long team names without breaking layout', () => {
      const props = createMatchHeaderProps({
        team1Name: 'Very Long Team Name That Should Not Break The Layout' as TeamName,
        team2Name: 'Another Extremely Long Team Name For Testing Purposes' as TeamName,
        winningTeam: 'Very Long Team Name That Should Not Break The Layout' as TeamName,
      });
      render(<MatchHeader {...props} />);
      
      expect(screen.getByText('Very Long Team Name That Should Not Break The Layout')).toBeInTheDocument();
      expect(screen.getByText('Another Extremely Long Team Name For Testing Purposes')).toBeInTheDocument();
    });
  });
});