import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import TeamHeader from './TeamHeader';

// Mock TeamColorDot component since it's not the focus of this test
vi.mock('./TeamColorDot', () => ({
  default: ({ teamName, size }: { teamName: string; size: number }) => (
    <div data-testid="team-color-dot" data-team={teamName} data-size={size} />
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('TeamHeader', () => {
  describe('basic rendering', () => {
    it('should render team name as heading', () => {
      renderWithRouter(
        <TeamHeader teamName="Boston Uprising" players={['Striker', 'Kellex']} />
      );

      const teamNameHeading = screen.getByRole('heading', { level: 2 });
      expect(teamNameHeading).toBeInTheDocument();
      expect(teamNameHeading).toHaveTextContent('Boston Uprising');
      expect(teamNameHeading).toHaveClass('text-2xl', 'font-bold', 'text-base-content');
    });

    it('should render team color dot with correct props', () => {
      renderWithRouter(
        <TeamHeader teamName="San Francisco Shock" players={['Sinatraa']} />
      );

      const colorDot = screen.getByTestId('team-color-dot');
      expect(colorDot).toBeInTheDocument();
      expect(colorDot).toHaveAttribute('data-team', 'San Francisco Shock');
      expect(colorDot).toHaveAttribute('data-size', '24');
    });

    it('should apply custom className to container', () => {
      const { container } = renderWithRouter(
        <TeamHeader 
          teamName="Test Team" 
          players={['Player1']} 
          className="custom-test-class" 
        />
      );

      const headerContainer = container.firstChild;
      expect(headerContainer).toHaveClass('custom-test-class');
      expect(headerContainer).toHaveClass('space-y-4');
    });
  });

  describe('players section', () => {
    it('should render "Players" section heading', () => {
      renderWithRouter(
        <TeamHeader teamName="Test Team" players={['Player1', 'Player2']} />
      );

      const playersHeading = screen.getByRole('heading', { level: 3 });
      expect(playersHeading).toBeInTheDocument();
      expect(playersHeading).toHaveTextContent('Players');
      expect(playersHeading).toHaveClass('text-lg', 'font-semibold', 'text-base-content/80');
    });

    it('should render all players as clickable links', () => {
      const players = ['Striker', 'Kellex', 'NotE', 'Neko'];
      renderWithRouter(
        <TeamHeader teamName="Boston Uprising" players={players} />
      );

      players.forEach(player => {
        const playerLink = screen.getByRole('link', { name: player });
        expect(playerLink).toBeInTheDocument();
        expect(playerLink).toHaveAttribute('href', `/player/${encodeURIComponent(player)}`);
      });
    });

    it('should style player links as buttons', () => {
      renderWithRouter(
        <TeamHeader teamName="Test Team" players={['Player1', 'Player2']} />
      );

      const playerLinks = screen.getAllByRole('link');
      // Filter out any non-player links (team name might be a link in some cases)
      const playerButtons = playerLinks.filter(link => 
        link.textContent === 'Player1' || link.textContent === 'Player2'
      );

      playerButtons.forEach(button => {
        expect(button).toHaveClass('btn', 'btn-sm', 'btn-outline', 'hover:btn-primary');
      });
    });

    it('should handle players with special characters in names', () => {
      const playersWithSpecialChars = ['Player/Name', 'Player & Name', 'Player%Name'];
      renderWithRouter(
        <TeamHeader teamName="Test Team" players={playersWithSpecialChars} />
      );

      playersWithSpecialChars.forEach(player => {
        const playerLink = screen.getByRole('link', { name: player });
        expect(playerLink).toHaveAttribute('href', `/player/${encodeURIComponent(player)}`);
      });
    });
  });

  describe('children content', () => {
    it('should render children content when provided', () => {
      renderWithRouter(
        <TeamHeader teamName="Test Team" players={['Player1']}>
          <div data-testid="child-content">Additional team information</div>
        </TeamHeader>
      );

      const childContent = screen.getByTestId('child-content');
      expect(childContent).toBeInTheDocument();
      expect(childContent).toHaveTextContent('Additional team information');
    });

    it('should not render children section when no children provided', () => {
      const { container } = renderWithRouter(
        <TeamHeader teamName="Test Team" players={['Player1']} />
      );

      // Should not have the children container div
      const childrenContainer = container.querySelector('.mt-4');
      expect(childrenContainer).not.toBeInTheDocument();
    });

    it('should wrap children in correct container', () => {
      const { container } = renderWithRouter(
        <TeamHeader teamName="Test Team" players={['Player1']}>
          <span>Test content</span>
        </TeamHeader>
      );

      const childrenContainer = container.querySelector('.mt-4');
      expect(childrenContainer).toBeInTheDocument();
      expect(childrenContainer).toContainElement(screen.getByText('Test content'));
    });
  });

  describe('layout and structure', () => {
    it('should render team name and color dot in flex container', () => {
      const { container } = renderWithRouter(
        <TeamHeader teamName="Test Team" players={['Player1']} />
      );

      const teamHeaderSection = container.querySelector('.flex.items-center.gap-4');
      expect(teamHeaderSection).toBeInTheDocument();
      expect(teamHeaderSection).toContainElement(screen.getByTestId('team-color-dot'));
      expect(teamHeaderSection).toContainElement(screen.getByRole('heading', { level: 2 }));
    });

    it('should render players in flex wrap container', () => {
      const { container } = renderWithRouter(
        <TeamHeader teamName="Test Team" players={['Player1', 'Player2']} />
      );

      const playersContainer = container.querySelector('.flex.flex-wrap.gap-2');
      expect(playersContainer).toBeInTheDocument();
      
      const playerLinks = screen.getAllByRole('link');
      const playerButtons = playerLinks.filter(link => 
        link.textContent === 'Player1' || link.textContent === 'Player2'
      );
      
      playerButtons.forEach(button => {
        expect(playersContainer).toContainElement(button);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty players array', () => {
      renderWithRouter(
        <TeamHeader teamName="Empty Team" players={[]} />
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Empty Team');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Players');
      
      // Should not have any player links
      const allLinks = screen.queryAllByRole('link');
      expect(allLinks).toHaveLength(0);
    });

    it('should handle single player', () => {
      renderWithRouter(
        <TeamHeader teamName="Solo Team" players={['OnlyPlayer']} />
      );

      const playerLink = screen.getByRole('link', { name: 'OnlyPlayer' });
      expect(playerLink).toBeInTheDocument();
      expect(playerLink).toHaveAttribute('href', '/player/OnlyPlayer');
    });

    it('should handle large number of players', () => {
      const manyPlayers = Array.from({ length: 20 }, (_, i) => `Player${i + 1}`);
      renderWithRouter(
        <TeamHeader teamName="Large Team" players={manyPlayers} />
      );

      // All players should be rendered as links
      manyPlayers.forEach(player => {
        const playerLink = screen.getByRole('link', { name: player });
        expect(playerLink).toBeInTheDocument();
      });
    });

    it('should handle very long team names', () => {
      const longTeamName = 'Very Long Team Name That Tests Layout And Word Wrapping Behavior';
      renderWithRouter(
        <TeamHeader teamName={longTeamName} players={['Player1']} />
      );

      const teamNameHeading = screen.getByRole('heading', { level: 2 });
      expect(teamNameHeading).toHaveTextContent(longTeamName);
    });

    it('should handle players with very long names', () => {
      const longPlayerName = 'PlayerWithVeryLongNameThatTestsLayoutBehavior';
      renderWithRouter(
        <TeamHeader teamName="Test Team" players={[longPlayerName]} />
      );

      const playerLink = screen.getByRole('link', { name: longPlayerName });
      expect(playerLink).toBeInTheDocument();
      expect(playerLink).toHaveAttribute('href', `/player/${encodeURIComponent(longPlayerName)}`);
    });
  });

  describe('default props', () => {
    it('should apply default className when none provided', () => {
      const { container } = renderWithRouter(
        <TeamHeader teamName="Test Team" players={['Player1']} />
      );

      const headerContainer = container.firstChild;
      expect(headerContainer).toHaveClass('space-y-4');
      // Should not have any extra classes beyond the default ones
      expect(headerContainer).toHaveAttribute('class', 'space-y-4 ');
    });
  });
});