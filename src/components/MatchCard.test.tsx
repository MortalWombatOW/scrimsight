import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'jotai';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { MatchCard } from './MatchCard';
import { dataModelAtom } from '../atoms/scrimsight';
import { ScrimsightDataModel } from '../lib/ScrimsightDataModel';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock TeamColorDot component
vi.mock('./TeamColorDot', () => ({
  default: ({ teamName, size }: { teamName: string; size: number }) => (
    <div data-testid="team-color-dot" data-team={teamName} data-size={size} />
  ),
}));

// Mock PrimaryButton component
vi.mock('./PrimaryButton', () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button data-testid="primary-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

// Mock mapNameToFileName function
vi.mock('../lib/string', () => ({
  mapNameToFileName: vi.fn((name: string, overhead: boolean) => {
    const lower = name.toLowerCase().replaceAll(' ', '').replaceAll("'", '');
    if (overhead) {
      return `/assets/topdown/${lower}_anno.png`;
    }
    return `/assets/maps/${lower}.jpg`;
  }),
}));

const mockDataModel: ScrimsightDataModel = {
  matches: [
    {
      match: "match-1",
      scrim: "scrim-1",
      teams: ["Atlanta Reign", "Boston Uprising"] as [string, string],
      map: "King's Row",
      date: new Date("2024-01-15T14:30:00"),
      rounds: [1, 2, 3],
      duration: 720,
      team1Score: 3,
      team2Score: 1,
      winningTeam: "Atlanta Reign",
      gameMode: "Hybrid",
    },
    {
      match: "match-2",
      scrim: "scrim-1",
      teams: ["Dallas Fuel", "Houston Outlaws"] as [string, string],
      map: "Ilios",
      date: new Date("2024-01-15T15:45:00"),
      rounds: [1, 2],
      duration: 540,
      team1Score: 1,
      team2Score: 2,
      winningTeam: "Houston Outlaws",
      gameMode: "Control",
    },
    {
      match: "match-3",
      scrim: "scrim-2",
      teams: ["Florida Mayhem", "New York Excelsior"] as [string, string],
      map: "Dorado",
      date: new Date("2024-01-16T16:00:00"),
      rounds: [1, 2, 3],
      duration: 660,
      team1Score: 2,
      team2Score: 2,
      winningTeam: "",
      gameMode: "Escort",
    },
  ],
  scrims: [],
  teams: [],
  players: [],
  playerLives: [],
  teamfights: [],
  rounds: [],
  teamCompositions: [],
  playerStatBreakdown: [],
  playerStatBreakdownRanks: [],
  killCounts: [],
  ability1Used: [],
  ability2Used: [],
  damage: [],
  defensiveAssist: [],
  dvaDemech: [],
  dvaRemech: [],
  healing: [],
  heroSpawn: [],
  heroSwap: [],
  kill: [],
  matchEnd: [],
  matchStart: [],
  mercyRez: [],
  offensiveAssist: [],
  playerStat: [],
  roundEnd: [],
  roundStart: [],
  setupComplete: [],
  ultimateCharged: [],
  ultimateEnd: [],
  ultimateStart: [],
};

const renderWithProviders = (component: React.ReactElement, dataModel: ScrimsightDataModel | null = mockDataModel) => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const hydratedAtom = dataModelAtom;
    hydratedAtom.init = dataModel;
    
    return (
      <MemoryRouter>
        <Provider>
          {children}
        </Provider>
      </MemoryRouter>
    );
  };

  return render(component, { wrapper: TestWrapper });
};

describe('MatchCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when match is not found', () => {
    it('should display match not found message', () => {
      renderWithProviders(<MatchCard matchId="non-existent-match" />);
      
      expect(screen.getByText('Match not found')).toBeInTheDocument();
    });

    it('should render match not found in a card container', () => {
      const { container } = renderWithProviders(<MatchCard matchId="non-existent-match" />);
      
      const card = container.querySelector('.card.bg-base-100.shadow-xl');
      expect(card).toBeInTheDocument();
      expect(card?.querySelector('.card-body')).toBeInTheDocument();
    });
  });

  describe('when data model is null', () => {
    it('should display match not found message', () => {
      renderWithProviders(<MatchCard matchId="match-1" />, null);
      
      expect(screen.getByText('Match not found')).toBeInTheDocument();
    });
  });

  describe('when match exists', () => {
    describe('basic match information display', () => {
      it('should display team names', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        expect(screen.getByText('Atlanta Reign')).toBeInTheDocument();
        expect(screen.getByText('Boston Uprising')).toBeInTheDocument();
      });

      it('should display team scores', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const scores = screen.getAllByText(/^[0-9]+$/);
        expect(scores).toHaveLength(2);
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      it('should display map name', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        expect(screen.getByText("King's Row")).toBeInTheDocument();
      });

      it('should display game mode', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        expect(screen.getByText('Hybrid')).toBeInTheDocument();
      });

      it('should display match date', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const expectedDate = new Date("2024-01-15T14:30:00").toLocaleDateString();
        expect(screen.getByText(expectedDate)).toBeInTheDocument();
      });

      it('should display match time', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const expectedTime = new Date("2024-01-15T14:30:00").toLocaleTimeString();
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
      });

      it('should display match duration in minutes and seconds', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        // 720 seconds = 12 minutes 0 seconds
        expect(screen.getByText('12m 0s')).toBeInTheDocument();
      });

      it('should display duration correctly for non-zero seconds', () => {
        renderWithProviders(<MatchCard matchId="match-2" />);
        
        // 540 seconds = 9 minutes 0 seconds
        expect(screen.getByText('9m 0s')).toBeInTheDocument();
      });

      it('should display duration with seconds when not zero', () => {
        // Create a match with 665 seconds (11m 5s)
        const customDataModel = {
          ...mockDataModel,
          matches: [
            {
              ...mockDataModel.matches[0],
              match: "test-match",
              duration: 665,
            }
          ]
        };
        
        renderWithProviders(<MatchCard matchId="test-match" />, customDataModel);
        
        expect(screen.getByText('11m 5s')).toBeInTheDocument();
      });
    });

    describe('team color dots', () => {
      it('should render team color dots for both teams', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const colorDots = screen.getAllByTestId('team-color-dot');
        expect(colorDots).toHaveLength(2);
        expect(colorDots[0]).toHaveAttribute('data-team', 'Atlanta Reign');
        expect(colorDots[0]).toHaveAttribute('data-size', '16');
        expect(colorDots[1]).toHaveAttribute('data-team', 'Boston Uprising');
        expect(colorDots[1]).toHaveAttribute('data-size', '16');
      });
    });

    describe('match outcome display', () => {
      it('should display WIN for the winning team', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const winTexts = screen.getAllByText('WIN');
        expect(winTexts).toHaveLength(1);
      });

      it('should display LOSS for the losing team', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const lossTexts = screen.getAllByText('LOSS');
        expect(lossTexts).toHaveLength(1);
      });

      it('should display DRAW for both teams when match is a draw', () => {
        renderWithProviders(<MatchCard matchId="match-3" />);
        
        const drawTexts = screen.getAllByText('DRAW');
        expect(drawTexts).toHaveLength(2);
      });
    });

    describe('outcome styling', () => {
      it('should apply success color to winning team outcome', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const winElement = screen.getByText('WIN');
        expect(winElement).toHaveClass('text-success');
      });

      it('should apply error color to losing team outcome', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const lossElement = screen.getByText('LOSS');
        expect(lossElement).toHaveClass('text-error');
      });

      it('should apply neutral color to draw outcomes', () => {
        renderWithProviders(<MatchCard matchId="match-3" />);
        
        const drawElements = screen.getAllByText('DRAW');
        drawElements.forEach(element => {
          expect(element).toHaveClass('text-base-content/70');
        });
      });
    });

    describe('map image display', () => {
      it('should display map image with correct src and alt', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const mapImage = screen.getByRole('img', { name: "King's Row" });
        expect(mapImage).toBeInTheDocument();
        expect(mapImage).toHaveAttribute('src', "/assets/maps/kingsrow.jpg");
        expect(mapImage).toHaveAttribute('alt', "King's Row");
      });

      it('should hide image on error', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const mapImage = screen.getByRole('img', { name: "King's Row" });
        
        // Simulate image load error
        fireEvent.error(mapImage);
        
        expect(mapImage).toHaveStyle('display: none');
      });

      it('should display map name in overlay', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        // The map name appears twice - once in the overlay and once as alt text
        const mapNameElements = screen.getAllByText("King's Row");
        expect(mapNameElements.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('view match button', () => {
      it('should render primary button with correct text', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const viewButton = screen.getByTestId('primary-button');
        expect(viewButton).toBeInTheDocument();
        expect(viewButton).toHaveTextContent('View Match');
      });

      it('should navigate to match detail page when clicked', () => {
        renderWithProviders(<MatchCard matchId="match-1" />);
        
        const viewButton = screen.getByTestId('primary-button');
        fireEvent.click(viewButton);
        
        expect(mockNavigate).toHaveBeenCalledWith('/match/match-1');
      });

      it('should navigate with correct match ID for different matches', () => {
        renderWithProviders(<MatchCard matchId="match-2" />);
        
        const viewButton = screen.getByTestId('primary-button');
        fireEvent.click(viewButton);
        
        expect(mockNavigate).toHaveBeenCalledWith('/match/match-2');
      });
    });

    describe('card structure and styling', () => {
      it('should render main card container with correct classes', () => {
        const { container } = renderWithProviders(<MatchCard matchId="match-1" />);
        
        const card = container.querySelector('.card.bg-base-100.shadow-xl');
        expect(card).toBeInTheDocument();
      });

      it('should render figure element for image section', () => {
        const { container } = renderWithProviders(<MatchCard matchId="match-1" />);
        
        const figure = container.querySelector('figure.px-4.pt-4');
        expect(figure).toBeInTheDocument();
      });

      it('should render card body with proper structure', () => {
        const { container } = renderWithProviders(<MatchCard matchId="match-1" />);
        
        const cardBody = container.querySelector('.card-body');
        expect(cardBody).toBeInTheDocument();
      });

      it('should render card actions section', () => {
        const { container } = renderWithProviders(<MatchCard matchId="match-1" />);
        
        const cardActions = container.querySelector('.card-actions.justify-end.mt-4');
        expect(cardActions).toBeInTheDocument();
      });
    });
  });

  describe('edge cases and different match scenarios', () => {
    it('should handle team 2 winning scenario', () => {
      renderWithProviders(<MatchCard matchId="match-2" />);
      
      expect(screen.getByText('Dallas Fuel')).toBeInTheDocument();
      expect(screen.getByText('Houston Outlaws')).toBeInTheDocument();
      expect(screen.getByText('LOSS')).toBeInTheDocument();
      expect(screen.getByText('WIN')).toBeInTheDocument();
    });

    it('should handle different game modes', () => {
      renderWithProviders(<MatchCard matchId="match-2" />);
      
      expect(screen.getByText('Control')).toBeInTheDocument();
    });

    it('should handle different maps', () => {
      renderWithProviders(<MatchCard matchId="match-2" />);
      
      expect(screen.getByText('Ilios')).toBeInTheDocument();
    });

    it('should handle matches with different dates', () => {
      renderWithProviders(<MatchCard matchId="match-3" />);
      
      const expectedDate = new Date("2024-01-16T16:00:00").toLocaleDateString();
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });

    it('should handle empty winning team as draw', () => {
      renderWithProviders(<MatchCard matchId="match-3" />);
      
      const drawTexts = screen.getAllByText('DRAW');
      expect(drawTexts).toHaveLength(2);
      
      drawTexts.forEach(element => {
        expect(element).toHaveClass('text-base-content/70');
      });
    });

    it('should handle matches with zero scores', () => {
      const customDataModel = {
        ...mockDataModel,
        matches: [
          {
            ...mockDataModel.matches[0],
            match: "zero-score-match",
            team1Score: 0,
            team2Score: 0,
            winningTeam: "",
          }
        ]
      };
      
      renderWithProviders(<MatchCard matchId="zero-score-match" />, customDataModel);
      
      const zeroScores = screen.getAllByText('0');
      expect(zeroScores).toHaveLength(2);
      
      const drawTexts = screen.getAllByText('DRAW');
      expect(drawTexts).toHaveLength(2);
    });

    it('should handle high scores', () => {
      const customDataModel = {
        ...mockDataModel,
        matches: [
          {
            ...mockDataModel.matches[0],
            match: "high-score-match",
            team1Score: 99,
            team2Score: 87,
            winningTeam: "Atlanta Reign",
          }
        ]
      };
      
      renderWithProviders(<MatchCard matchId="high-score-match" />, customDataModel);
      
      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('87')).toBeInTheDocument();
    });
  });

  describe('navigation integration', () => {
    it('should not navigate when component mounts', () => {
      renderWithProviders(<MatchCard matchId="match-1" />);
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should only navigate when view button is explicitly clicked', () => {
      renderWithProviders(<MatchCard matchId="match-1" />);
      
      // Click somewhere else (not the button)
      fireEvent.click(screen.getByText("King's Row"));
      
      expect(mockNavigate).not.toHaveBeenCalled();
      
      // Now click the button
      fireEvent.click(screen.getByTestId('primary-button'));
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/match/match-1');
    });
  });

  describe('data model integration', () => {
    it('should find correct match from data model by ID', () => {
      renderWithProviders(<MatchCard matchId="match-2" />);
      
      // Should display match-2 data, not match-1
      expect(screen.getByText('Dallas Fuel')).toBeInTheDocument();
      expect(screen.getByText('Houston Outlaws')).toBeInTheDocument();
      expect(screen.queryByText('Atlanta Reign')).not.toBeInTheDocument();
      expect(screen.queryByText('Boston Uprising')).not.toBeInTheDocument();
    });

    it('should handle case-sensitive match ID lookup', () => {
      renderWithProviders(<MatchCard matchId="MATCH-1" />);
      
      expect(screen.getByText('Match not found')).toBeInTheDocument();
    });
  });
});