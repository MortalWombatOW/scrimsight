import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardStat from './CardStat';

// Mock ValueDelta component since it's not the focus of this test
vi.mock('./ValueDelta', () => ({
  default: ({ value, baseline, higherIsBetter, precision, rank, totalCount, size }: {
    value: number;
    baseline: number;
    higherIsBetter: boolean;
    precision: number;
    rank: number;
    totalCount: number;
    size: "large" | "small";
  }) => (
    <div 
      data-testid="value-delta" 
      data-value={value}
      data-baseline={baseline}
      data-higher-is-better={higherIsBetter}
      data-precision={precision}
      data-rank={rank}
      data-total-count={totalCount}
      data-size={size}
    />
  ),
}));

// Mock ScrimsightDataModel to provide ranking directions
vi.mock('../lib/ScrimsightDataModel', () => ({
  PLAYER_STAT_RANKING_DIRECTIONS: {
    eliminations: 'higher',
    deaths: 'lower',
    weaponAccuracy: 'higher',
    heroDamageDealt: 'higher',
    ultimateChargeTime: 'lower',
  },
}));

describe('CardStat', () => {
  describe('basic rendering', () => {
    it('should render label and value', () => {
      render(<CardStat label="Total Users" value="1,234" />);
      
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('should render with neutral severity by default', () => {
      const { container } = render(<CardStat label="Test" value="123" />);
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('border-l-4', 'border-l-info-content');
    });

    it('should render with large size by default', () => {
      const { container } = render(<CardStat label="Test" value="123" />);
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('p-4');
      
      const label = screen.getByText('Test');
      expect(label).toHaveClass('text-sm');
      
      const value = screen.getByText('123');
      expect(value).toHaveClass('text-2xl', 'font-semibold');
    });

    it('should apply tooltip when provided', () => {
      const { container } = render(
        <CardStat 
          label="Revenue" 
          value="$12,345" 
          tooltip="Monthly recurring revenue from all active subscriptions"
        />
      );
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveAttribute('title', 'Monthly recurring revenue from all active subscriptions');
    });

    it('should render with w-fit class for responsive width', () => {
      const { container } = render(<CardStat label="Test" value="123" />);
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('w-fit');
    });
  });

  describe('severity styling', () => {
    it('should apply good severity border styling', () => {
      const { container } = render(
        <CardStat label="Success Rate" value="98.5%" severity="good" />
      );
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('border-l-4', 'border-l-success');
    });

    it('should apply bad severity border styling', () => {
      const { container } = render(
        <CardStat label="Error Rate" value="2.1%" severity="bad" />
      );
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('border-l-4', 'border-l-error');
    });

    it('should apply neutral severity border styling', () => {
      const { container } = render(
        <CardStat label="Total Users" value="1,234" severity="neutral" />
      );
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('border-l-4', 'border-l-info-content');
    });
  });

  describe('size variants', () => {
    it('should apply small size classes', () => {
      const { container } = render(
        <CardStat label="Eliminations" value="32" size="small" />
      );
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('p-3', 'border-l-1');
      
      const label = screen.getByText('Eliminations');
      expect(label).toHaveClass('text-xs');
      
      const value = screen.getByText('32');
      expect(value).toHaveClass('text-lg', 'font-semibold');
    });

    it('should apply large size classes', () => {
      const { container } = render(
        <CardStat label="Eliminations" value="32" size="large" />
      );
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('p-4', 'border-l-4');
      
      const label = screen.getByText('Eliminations');
      expect(label).toHaveClass('text-sm');
      
      const value = screen.getByText('32');
      expect(value).toHaveClass('text-2xl', 'font-semibold');
    });

    it('should apply small size border width for severity', () => {
      const { container } = render(
        <CardStat label="Test" value="123" severity="good" size="small" />
      );
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('border-l-1', 'border-l-success');
    });
  });

  describe('icon rendering', () => {
    it('should render icon when provided', () => {
      const testIcon = (
        <svg data-testid="test-icon" className="w-6 h-6">
          <path d="test-path" />
        </svg>
      );

      render(
        <CardStat 
          label="Active Sessions" 
          value="456" 
          icon={testIcon}
        />
      );
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should not render icon container when no icon provided', () => {
      const { container } = render(
        <CardStat label="Test" value="123" />
      );
      
      const iconContainer = container.querySelector('.ml-3');
      expect(iconContainer).not.toBeInTheDocument();
    });

    it('should apply correct icon styling', () => {
      const testIcon = <div data-testid="test-icon">icon</div>;
      const { container } = render(
        <CardStat label="Test" value="123" icon={testIcon} />
      );
      
      const iconContainer = container.querySelector('.ml-3');
      expect(iconContainer).toHaveClass('text-base-content/50');
    });
  });

  describe('rank display', () => {
    it('should display rank without total count', () => {
      render(
        <CardStat 
          label="Eliminations" 
          value="32" 
          rank={1}
        />
      );
      
      expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('should display rank with total count', () => {
      render(
        <CardStat 
          label="Eliminations" 
          value="32" 
          rank={1}
          totalCount={8}
        />
      );
      
      expect(screen.getByText('Rank 1 of 8')).toBeInTheDocument();
    });

    it('should not display rank when not provided', () => {
      render(
        <CardStat label="Test" value="123" />
      );
      
      expect(screen.queryByText(/rank/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/#\d/)).not.toBeInTheDocument();
    });

    it('should apply correct rank styling', () => {
      render(
        <CardStat 
          label="Eliminations" 
          value="32" 
          rank={1}
          totalCount={8}
        />
      );
      
      const rankElement = screen.getByText('Rank 1 of 8');
      expect(rankElement).toHaveClass('text-xs', 'text-base-content/60', 'mt-1');
    });

    it('should apply small size rank styling', () => {
      render(
        <CardStat 
          label="Eliminations" 
          value="32" 
          rank={1}
          totalCount={8}
          size="small"
        />
      );
      
      const rankElement = screen.getByText('Rank 1 of 8');
      expect(rankElement).toHaveClass('text-xs', 'text-base-content/60', 'mt-1');
    });
  });

  describe('ValueDelta integration', () => {
    it('should render ValueDelta when all required props are provided', () => {
      render(
        <CardStat 
          label="Eliminations"
          numericValue={32}
          averageValue={24}
          metricKey="eliminations"
          rank={1}
          totalCount={8}
        />
      );
      
      const valueDelta = screen.getByTestId('value-delta');
      expect(valueDelta).toBeInTheDocument();
      expect(valueDelta).toHaveAttribute('data-value', '32');
      expect(valueDelta).toHaveAttribute('data-baseline', '24');
      expect(valueDelta).toHaveAttribute('data-higher-is-better', 'true');
      expect(valueDelta).toHaveAttribute('data-precision', '2');
      expect(valueDelta).toHaveAttribute('data-rank', '1');
      expect(valueDelta).toHaveAttribute('data-total-count', '8');
      expect(valueDelta).toHaveAttribute('data-size', 'large');
    });

    it('should render ValueDelta with small size', () => {
      render(
        <CardStat 
          label="Hero Damage"
          numericValue={8945}
          averageValue={7200}
          metricKey="heroDamageDealt"
          rank={2}
          totalCount={8}
          size="small"
        />
      );
      
      const valueDelta = screen.getByTestId('value-delta');
      expect(valueDelta).toHaveAttribute('data-size', 'small');
    });

    it('should pass correct higherIsBetter value for lower-is-better metrics', () => {
      render(
        <CardStat 
          label="Deaths"
          numericValue={8}
          averageValue={10}
          metricKey="deaths"
          rank={3}
          totalCount={8}
        />
      );
      
      const valueDelta = screen.getByTestId('value-delta');
      expect(valueDelta).toHaveAttribute('data-higher-is-better', 'false');
    });

    it('should render regular value when ValueDelta conditions are not met', () => {
      render(
        <CardStat 
          label="Eliminations"
          value="32"
          numericValue={32}
          // Missing averageValue, metricKey, rank, totalCount
        />
      );
      
      expect(screen.getByText('32')).toBeInTheDocument();
      expect(screen.queryByTestId('value-delta')).not.toBeInTheDocument();
    });

    it('should not render separate rank when ValueDelta is shown', () => {
      render(
        <CardStat 
          label="Eliminations"
          numericValue={32}
          averageValue={24}
          metricKey="eliminations"
          rank={1}
          totalCount={8}
        />
      );
      
      expect(screen.getByTestId('value-delta')).toBeInTheDocument();
      expect(screen.queryByText('Rank 1 of 8')).not.toBeInTheDocument();
      expect(screen.queryByText('#1')).not.toBeInTheDocument();
    });

    it('should render separate rank when ValueDelta conditions are partially met', () => {
      render(
        <CardStat 
          label="Eliminations"
          value="32"
          rank={1}
          totalCount={8}
          // Missing numericValue, averageValue, metricKey for ValueDelta
        />
      );
      
      expect(screen.getByText('32')).toBeInTheDocument();
      expect(screen.getByText('Rank 1 of 8')).toBeInTheDocument();
      expect(screen.queryByTestId('value-delta')).not.toBeInTheDocument();
    });
  });

  describe('complex scenarios', () => {
    it('should render card with all features combined', () => {
      const testIcon = <div data-testid="test-icon">icon</div>;
      const { container } = render(
        <CardStat 
          label="Weapon Accuracy"
          value="71.2%"
          severity="good"
          rank={3}
          totalCount={8}
          icon={testIcon}
          tooltip="Player's weapon accuracy percentage"
          size="large"
        />
      );
      
      // Check all elements are present
      expect(screen.getByText('Weapon Accuracy')).toBeInTheDocument();
      expect(screen.getByText('71.2%')).toBeInTheDocument();
      expect(screen.getByText('Rank 3 of 8')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      
      // Check styling
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('border-l-4', 'border-l-success', 'p-4');
      expect(card).toHaveAttribute('title', 'Player\'s weapon accuracy percentage');
    });

    it('should handle edge case with zero values', () => {
      render(
        <CardStat 
          label="Environmental Deaths"
          numericValue={0}
          averageValue={0}
          metricKey="ultimateChargeTime"
          rank={1}
          totalCount={8}
        />
      );
      
      const valueDelta = screen.getByTestId('value-delta');
      expect(valueDelta).toHaveAttribute('data-value', '0');
      expect(valueDelta).toHaveAttribute('data-baseline', '0');
    });

    it('should handle undefined values gracefully', () => {
      render(
        <CardStat 
          label="Test Stat"
          value={undefined}
          numericValue={undefined}
          averageValue={undefined}
          rank={undefined}
          totalCount={undefined}
        />
      );
      
      expect(screen.getByText('Test Stat')).toBeInTheDocument();
      expect(screen.queryByTestId('value-delta')).not.toBeInTheDocument();
      expect(screen.queryByText(/rank/i)).not.toBeInTheDocument();
    });

    it('should handle ReactNode values', () => {
      const complexValue = (
        <div>
          <span>Complex</span>
          <strong>Value</strong>
        </div>
      );

      render(
        <CardStat 
          label="Custom Display"
          value={complexValue}
        />
      );
      
      expect(screen.getByText('Custom Display')).toBeInTheDocument();
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });
  });

  describe('content hierarchy and layout', () => {
    it('should maintain correct flex layout structure', () => {
      const testIcon = <div data-testid="test-icon">icon</div>;
      const { container } = render(
        <CardStat 
          label="Test"
          value="123"
          icon={testIcon}
        />
      );
      
      const mainContainer = container.querySelector('.flex.items-center.justify-between');
      expect(mainContainer).toBeInTheDocument();
      
      const contentContainer = container.querySelector('.flex-1');
      expect(contentContainer).toBeInTheDocument();
      
      const iconContainer = container.querySelector('.ml-3');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply correct text color classes', () => {
      render(
        <CardStat 
          label="Test Label"
          value="Test Value"
          rank={1}
          totalCount={8}
        />
      );
      
      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('text-base-content/70');
      
      const value = screen.getByText('Test Value');
      expect(value).toHaveClass('text-base-content');
      
      const rank = screen.getByText('Rank 1 of 8');
      expect(rank).toHaveClass('text-base-content/60');
    });

    it('should apply rounded corners and background', () => {
      const { container } = render(
        <CardStat label="Test" value="123" />
      );
      
      const card = container.querySelector('.bg-base-200');
      expect(card).toHaveClass('rounded-lg');
    });
  });
});