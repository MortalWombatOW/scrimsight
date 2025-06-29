import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamfightCard from './TeamfightCard';
import { Teamfight } from '../lib/ScrimsightDataModel';

// Mock dependencies
vi.mock('./TeamColorDot', () => ({
  default: ({ teamName, size }: { teamName: string; size: number }) => (
    <div data-testid="team-color-dot" data-team={teamName} data-size={size} />
  ),
}));

vi.mock('../icons/HeroIcon', () => ({
  default: ({ hero, size, showTooltip }: { hero: string; size: number; showTooltip?: boolean }) => (
    <div data-testid="hero-icon" data-hero={hero} data-size={size} data-tooltip={showTooltip} />
  ),
}));

vi.mock('../lib/format', () => ({
  formatDuration: vi.fn((seconds: number) => `${Math.floor(seconds)}s`),
}));

const mockTeamfight: Teamfight = {
  matchId: 'MATCH_001',
  roundIndex: 1,
  startTime: 245.5, // 4:05
  endTime: 267.8, // 4:27
  duration: 22.3,
  start: {
    team1: {
      teamName: 'Boston Uprising',
      alivePlayers: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod'],
      ultimatesReady: ['Tracer', 'Mercy', 'D.Va'],
    },
    team2: {
      teamName: 'New York Excelsior',
      alivePlayers: ['SBB', 'JJoNak', 'Meko', 'ArK', 'Libero', 'Mano'],
      ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji'],
    },
  },
  end: {
    team1: {
      teamName: 'Boston Uprising',
      alivePlayers: ['Striker', 'Kellex', 'NotE'],
      ultimatesReady: ['Tracer', 'Mercy', 'D.Va'],
      ultimatesUsed: ['D.Va'],
      kills: ['SBB', 'Libero'],
    },
    team2: {
      teamName: 'New York Excelsior',
      alivePlayers: ['JJoNak', 'ArK'],
      ultimatesReady: ['Tracer', 'Zenyatta', 'Winston', 'Genji'],
      ultimatesUsed: ['Winston', 'Genji'],
      kills: ['Mistakes', 'AimGod', 'Neko'],
    },
  },
  winner: 'New York Excelsior',
  team1KillsPerUlt: 2.0,
  team2KillsPerUlt: 1.5,
};

describe('TeamfightCard', () => {
  describe('basic rendering', () => {
    it('should render teamfight card with correct structure', () => {
      const { container } = render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bg-base-100', 'shadow-md', 'border-l-4');
    });

    it('should apply custom className to card', () => {
      const { container } = render(
        <TeamfightCard teamfight={mockTeamfight} className="custom-test-class" />
      );
      
      const card = container.querySelector('.card');
      expect(card).toHaveClass('custom-test-class');
    });
  });

  describe('header information', () => {
    it('should display formatted time range', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      expect(screen.getByText('4:05 - 4:27')).toBeInTheDocument();
    });

    it('should display formatted duration', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      expect(screen.getByText('(22s)')).toBeInTheDocument();
    });

    it('should display round index', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      expect(screen.getByText('Round 1')).toBeInTheDocument();
    });

    it('should format minutes and seconds correctly with zero padding', () => {
      const teamfightWithSingleDigitSeconds: Teamfight = {
        ...mockTeamfight,
        startTime: 65, // 1:05
        endTime: 72, // 1:12
      };
      
      render(<TeamfightCard teamfight={teamfightWithSingleDigitSeconds} />);
      
      expect(screen.getByText('1:05 - 1:12')).toBeInTheDocument();
    });
  });

  describe('winner indication', () => {
    it('should highlight team1 as winner when they win', () => {
      const team1WinsTeamfight: Teamfight = {
        ...mockTeamfight,
        winner: 'Boston Uprising',
      };
      
      const { container } = render(<TeamfightCard teamfight={team1WinsTeamfight} />);
      
      const card = container.querySelector('.card');
      expect(card).toHaveClass('border-l-success');
      
      expect(screen.getByText('WINNER')).toBeInTheDocument();
      
      const winnerSection = container.querySelector('[class*="bg-success/10"]');
      expect(winnerSection).toBeInTheDocument();
    });

    it('should highlight team2 as winner when they win', () => {
      const { container } = render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const card = container.querySelector('.card');
      expect(card).toHaveClass('border-l-error');
      
      expect(screen.getByText('WINNER')).toBeInTheDocument();
    });

    it('should use neutral styling when no winner', () => {
      const noWinnerTeamfight: Teamfight = {
        ...mockTeamfight,
        winner: '',
      };
      
      const { container } = render(<TeamfightCard teamfight={noWinnerTeamfight} />);
      
      const card = container.querySelector('.card');
      expect(card).toHaveClass('border-l-base-content/20');
    });
  });

  describe('team information', () => {
    it('should render both team names', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      expect(screen.getByText('Boston Uprising')).toBeInTheDocument();
      expect(screen.getByText('New York Excelsior')).toBeInTheDocument();
    });

    it('should render team color dots for both teams', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const colorDots = screen.getAllByTestId('team-color-dot');
      expect(colorDots).toHaveLength(2);
      expect(colorDots[0]).toHaveAttribute('data-team', 'Boston Uprising');
      expect(colorDots[0]).toHaveAttribute('data-size', '16');
      expect(colorDots[1]).toHaveAttribute('data-team', 'New York Excelsior');
      expect(colorDots[1]).toHaveAttribute('data-size', '16');
    });

    it('should display alive players count for both teams', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      expect(screen.getByText('3 alive')).toBeInTheDocument(); // Team 1
      expect(screen.getByText('2 alive')).toBeInTheDocument(); // Team 2
    });

    it('should display kills count for both teams', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      expect(screen.getByText('2 kills')).toBeInTheDocument(); // Team 1
      expect(screen.getByText('3 kills')).toBeInTheDocument(); // Team 2
    });
  });

  describe('ultimates ready section', () => {
    it('should display ultimates ready for both teams', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const ultsReadyLabels = screen.getAllByText('Ults ready:');
      expect(ultsReadyLabels).toHaveLength(2);
    });

    it('should render hero icons for ultimates ready', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const heroIcons = screen.getAllByTestId('hero-icon');
      const ultsReadyIcons = heroIcons.filter(icon => 
        ['Tracer', 'Mercy', 'D.Va', 'Zenyatta', 'Winston', 'Genji'].includes(
          icon.getAttribute('data-hero') || ''
        )
      );
      
      expect(ultsReadyIcons.length).toBeGreaterThan(0);
      ultsReadyIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '20');
        expect(icon).toHaveAttribute('data-tooltip', 'true');
      });
    });

    it('should show +X more when more than 3 ultimates ready', () => {
      const teamfightWithManyUlts: Teamfight = {
        ...mockTeamfight,
        start: {
          team1: {
            ...mockTeamfight.start.team1,
            ultimatesReady: ['Tracer', 'Mercy', 'D.Va', 'Ana', 'Widowmaker'],
          },
          team2: {
            ...mockTeamfight.start.team2,
            ultimatesReady: [],
          },
        },
        end: {
          team1: {
            ...mockTeamfight.end.team1,
            ultimatesReady: ['Tracer', 'Mercy', 'D.Va', 'Ana', 'Widowmaker'],
            ultimatesUsed: ['D.Va'],
          },
          team2: {
            ...mockTeamfight.end.team2,
            ultimatesReady: [],
            ultimatesUsed: [],
          },
        },
      };
      
      render(<TeamfightCard teamfight={teamfightWithManyUlts} />);
      
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('should not display ultimates ready section when empty', () => {
      const teamfightNoUlts: Teamfight = {
        ...mockTeamfight,
        start: {
          team1: {
            ...mockTeamfight.start.team1,
            ultimatesReady: [],
          },
          team2: {
            ...mockTeamfight.start.team2,
            ultimatesReady: [],
          },
        },
      };
      
      render(<TeamfightCard teamfight={teamfightNoUlts} />);
      
      expect(screen.queryByText('Ults ready:')).not.toBeInTheDocument();
    });
  });

  describe('ultimates used section', () => {
    it('should display ultimates used for both teams', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const ultsUsedLabels = screen.getAllByText('Ults used:');
      expect(ultsUsedLabels).toHaveLength(2);
    });

    it('should render hero icons for ultimates used', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const heroIcons = screen.getAllByTestId('hero-icon');
      const ultsUsedIcons = heroIcons.filter(icon => 
        ['D.Va', 'Winston', 'Genji'].includes(icon.getAttribute('data-hero') || '')
      );
      
      expect(ultsUsedIcons.length).toBeGreaterThan(0);
    });

    it('should show +X more when more than 3 ultimates used', () => {
      const teamfightWithManyUsedUlts: Teamfight = {
        ...mockTeamfight,
        start: {
          team1: {
            ...mockTeamfight.start.team1,
            ultimatesReady: [],
          },
          team2: {
            ...mockTeamfight.start.team2,
            ultimatesReady: [],
          },
        },
        end: {
          team1: {
            ...mockTeamfight.end.team1,
            ultimatesReady: [],
            ultimatesUsed: ['D.Va', 'Ana', 'Widowmaker', 'Reinhardt'],
          },
          team2: {
            ...mockTeamfight.end.team2,
            ultimatesReady: [],
            ultimatesUsed: [],
          },
        },
      };
      
      render(<TeamfightCard teamfight={teamfightWithManyUsedUlts} />);
      
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('should not display ultimates used section when empty', () => {
      const teamfightNoUsedUlts: Teamfight = {
        ...mockTeamfight,
        end: {
          team1: {
            ...mockTeamfight.end.team1,
            ultimatesUsed: [],
          },
          team2: {
            ...mockTeamfight.end.team2,
            ultimatesUsed: [],
          },
        },
      };
      
      render(<TeamfightCard teamfight={teamfightNoUsedUlts} />);
      
      expect(screen.queryByText('Ults used:')).not.toBeInTheDocument();
    });
  });

  describe('efficiency stats', () => {
    it('should display kills per ultimate stats when data available', () => {
      render(<TeamfightCard teamfight={mockTeamfight} />);
      
      expect(screen.getByText('Kills/Ult: 2.0 vs 1.5')).toBeInTheDocument();
    });

    it('should not display efficiency stats when both teams have 0 kills per ult', () => {
      const teamfightNoEfficiency: Teamfight = {
        ...mockTeamfight,
        team1KillsPerUlt: 0,
        team2KillsPerUlt: 0,
      };
      
      render(<TeamfightCard teamfight={teamfightNoEfficiency} />);
      
      expect(screen.queryByText(/Kills\/Ult:/)).not.toBeInTheDocument();
    });

    it('should display efficiency stats when only one team has kills per ult', () => {
      const teamfightPartialEfficiency: Teamfight = {
        ...mockTeamfight,
        team1KillsPerUlt: 1.5,
        team2KillsPerUlt: 0,
      };
      
      render(<TeamfightCard teamfight={teamfightPartialEfficiency} />);
      
      expect(screen.getByText('Kills/Ult: 1.5 vs 0.0')).toBeInTheDocument();
    });

    it('should format kills per ult to one decimal place', () => {
      const teamfightPreciseEfficiency: Teamfight = {
        ...mockTeamfight,
        team1KillsPerUlt: 1.3333,
        team2KillsPerUlt: 2.6666,
      };
      
      render(<TeamfightCard teamfight={teamfightPreciseEfficiency} />);
      
      expect(screen.getByText('Kills/Ult: 1.3 vs 2.7')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle teamfight at start of match (0 seconds)', () => {
      const earlyTeamfight: Teamfight = {
        ...mockTeamfight,
        startTime: 0,
        endTime: 15,
      };
      
      render(<TeamfightCard teamfight={earlyTeamfight} />);
      
      expect(screen.getByText('0:00 - 0:15')).toBeInTheDocument();
    });

    it('should handle very long teamfight times', () => {
      const longTeamfight: Teamfight = {
        ...mockTeamfight,
        startTime: 3665, // 61:05
        endTime: 3720, // 62:00
      };
      
      render(<TeamfightCard teamfight={longTeamfight} />);
      
      expect(screen.getByText('61:05 - 62:00')).toBeInTheDocument();
    });

    it('should handle teams with no alive players', () => {
      const noAlivePlayers: Teamfight = {
        ...mockTeamfight,
        end: {
          team1: {
            ...mockTeamfight.end.team1,
            alivePlayers: [],
          },
          team2: {
            ...mockTeamfight.end.team2,
            alivePlayers: [],
          },
        },
      };
      
      render(<TeamfightCard teamfight={noAlivePlayers} />);
      
      const aliveTexts = screen.getAllByText('0 alive');
      expect(aliveTexts).toHaveLength(2); // One for each team
    });

    it('should handle teams with no kills', () => {
      const noKills: Teamfight = {
        ...mockTeamfight,
        end: {
          team1: {
            ...mockTeamfight.end.team1,
            kills: [],
          },
          team2: {
            ...mockTeamfight.end.team2,
            kills: [],
          },
        },
      };
      
      render(<TeamfightCard teamfight={noKills} />);
      
      const killsText = screen.getAllByText('0 kills');
      expect(killsText).toHaveLength(2);
    });

    it('should handle very high round index', () => {
      const highRoundTeamfight: Teamfight = {
        ...mockTeamfight,
        roundIndex: 99,
      };
      
      render(<TeamfightCard teamfight={highRoundTeamfight} />);
      
      expect(screen.getByText('Round 99')).toBeInTheDocument();
    });
  });

  describe('styling and layout', () => {
    it('should apply winner styling to team name', () => {
      const { container } = render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const winnerTeamName = screen.getByText('New York Excelsior');
      expect(winnerTeamName).toHaveClass('text-success');
    });

    it('should not apply winner styling to losing team name', () => {
      const { container } = render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const losingTeamName = screen.getByText('Boston Uprising');
      expect(losingTeamName).not.toHaveClass('text-success');
    });

    it('should render round badge with correct styling', () => {
      const { container } = render(<TeamfightCard teamfight={mockTeamfight} />);
      
      const roundBadge = container.querySelector('.badge');
      expect(roundBadge).toBeInTheDocument();
      expect(roundBadge).toHaveClass('badge-sm');
    });
  });
});