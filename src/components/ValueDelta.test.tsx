import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValueDelta from './ValueDelta';

// Mock the format utility functions
vi.mock('../lib/format', () => ({
  prettyFormat: vi.fn((val: number, decimals: number) => val.toFixed(decimals)),
  formatPercentage: vi.fn((val: number, decimals: number) => `${(val * 100).toFixed(decimals)}%`),
}));

describe('ValueDelta', () => {
  const defaultProps = {
    value: 100,
    baseline: 80,
    higherIsBetter: true,
    rank: 2,
    totalCount: 8,
  };

  describe('basic rendering', () => {
    it('should render the main value', () => {
      render(<ValueDelta {...defaultProps} />);
      
      expect(screen.getByText('100.0')).toBeInTheDocument();
    });

    it('should render the baseline comparison', () => {
      render(<ValueDelta {...defaultProps} />);
      
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      // Baseline comparison includes the value - just check it exists in DOM
      expect(screen.getByText(/80\.0/)).toBeInTheDocument();
    });

    it('should render rank information', () => {
      render(<ValueDelta {...defaultProps} />);
      
      expect(screen.getByText(/2 of 8/)).toBeInTheDocument();
    });

    it('should apply correct container structure', () => {
      const { container } = render(<ValueDelta {...defaultProps} />);
      
      const mainContainer = container.querySelector('.flex.flex-col');
      expect(mainContainer).toBeInTheDocument();
      
      const valueContainer = container.querySelector('.flex.items-center.gap-1');
      expect(valueContainer).toBeInTheDocument();
    });
  });

  describe('delta calculation and display', () => {
    it('should show positive delta with up arrow when value is higher', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={100} baseline={80} />);
      
      expect(screen.getByText('+20.0')).toBeInTheDocument();
      
      const upArrow = container.querySelector('.lucide-chevron-up');
      expect(upArrow).toBeInTheDocument();
    });

    it('should show negative delta with down arrow when value is lower', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={60} baseline={80} />);
      
      expect(screen.getByText('-20.0')).toBeInTheDocument();
      
      const downArrow = container.querySelector('.lucide-chevron-down');
      expect(downArrow).toBeInTheDocument();
    });

    it('should not show delta or arrows when value equals baseline', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={80} baseline={80} />);
      
      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
      expect(screen.queryByText(/^-/)).not.toBeInTheDocument();
      expect(container.querySelector('.lucide-chevron-up')).not.toBeInTheDocument();
      expect(container.querySelector('.lucide-chevron-down')).not.toBeInTheDocument();
    });

    it('should display percentage change when baseline is not zero', () => {
      render(<ValueDelta {...defaultProps} value={100} baseline={80} />);
      
      expect(screen.getByText('(+25.0%)')).toBeInTheDocument();
    });

    it('should not display percentage when baseline is zero', () => {
      render(<ValueDelta {...defaultProps} value={50} baseline={0} />);
      
      expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
    });

    it('should handle negative percentage changes', () => {
      render(<ValueDelta {...defaultProps} value={60} baseline={80} />);
      
      expect(screen.getByText('(-25.0%)')).toBeInTheDocument();
    });
  });

  describe('color coding based on higherIsBetter', () => {
    it('should use success color for positive delta when higher is better', () => {
      const { container } = render(
        <ValueDelta {...defaultProps} value={100} baseline={80} higherIsBetter={true} />
      );
      
      const deltaContainer = container.querySelector('.text-success');
      expect(deltaContainer).toBeInTheDocument();
    });

    it('should use error color for negative delta when higher is better', () => {
      const { container } = render(
        <ValueDelta {...defaultProps} value={60} baseline={80} higherIsBetter={true} />
      );
      
      const deltaContainer = container.querySelector('.text-error');
      expect(deltaContainer).toBeInTheDocument();
    });

    it('should use error color for positive delta when lower is better', () => {
      const { container } = render(
        <ValueDelta {...defaultProps} value={100} baseline={80} higherIsBetter={false} />
      );
      
      const deltaContainer = container.querySelector('.text-error');
      expect(deltaContainer).toBeInTheDocument();
    });

    it('should use success color for negative delta when lower is better', () => {
      const { container } = render(
        <ValueDelta {...defaultProps} value={60} baseline={80} higherIsBetter={false} />
      );
      
      const deltaContainer = container.querySelector('.text-success');
      expect(deltaContainer).toBeInTheDocument();
    });

    
  });

  describe('precision handling', () => {
    it('should use default precision of 1 when not specified', () => {
      render(<ValueDelta {...defaultProps} value={100.567} baseline={80.234} />);
      
      expect(screen.getByText('100.6')).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      expect(screen.getByText(/80\.2/)).toBeInTheDocument();
    });

    it('should use custom precision when specified', () => {
      render(<ValueDelta {...defaultProps} value={100.567} baseline={80.234} precision={2} />);
      
      expect(screen.getByText('100.57')).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      expect(screen.getByText(/80\.23/)).toBeInTheDocument();
    });

    it('should apply precision to delta values', () => {
      render(<ValueDelta {...defaultProps} value={100.567} baseline={80.234} precision={2} />);
      
      expect(screen.getByText('+20.33')).toBeInTheDocument();
    });

    it('should handle zero precision', () => {
      render(<ValueDelta {...defaultProps} value={100.9} baseline={80.7} precision={0} />);
      
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      expect(screen.getByText(/81/)).toBeInTheDocument();
    });
  });

  describe('size variants', () => {
    it('should apply large size classes by default', () => {
      const { container } = render(<ValueDelta {...defaultProps} />);
      
      const mainValue = container.querySelector('.font-medium');
      expect(mainValue).toBeInTheDocument();
      expect(mainValue).not.toHaveClass('text-sm');
    });

    it('should apply small size classes when size is small', () => {
      const { container } = render(<ValueDelta {...defaultProps} size="small" />);
      
      const mainValue = container.querySelector('.text-sm.font-medium');
      expect(mainValue).toBeInTheDocument();
    });

    it('should adjust icon size based on component size', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={100} baseline={80} size="small" />);
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('width', '12');
      expect(icon).toHaveAttribute('height', '12');
    });

    it('should use larger icons for large size', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={100} baseline={80} size="large" />);
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('width', '14');
      expect(icon).toHaveAttribute('height', '14');
    });
  });

  describe('rank display', () => {
    it('should display rank and total count', () => {
      render(<ValueDelta {...defaultProps} rank={3} totalCount={10} />);
      
      expect(screen.getByText(/3 of 10/)).toBeInTheDocument();
    });

    it('should handle rank 1', () => {
      render(<ValueDelta {...defaultProps} rank={1} totalCount={8} />);
      
      expect(screen.getByText(/1 of 8/)).toBeInTheDocument();
    });

    it('should handle last rank', () => {
      render(<ValueDelta {...defaultProps} rank={8} totalCount={8} />);
      
      expect(screen.getByText(/8 of 8/)).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle zero values', () => {
      render(<ValueDelta {...defaultProps} value={0} baseline={0} />);
      
      expect(screen.getByText('0.0')).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
      expect(screen.queryByText(/^-/)).not.toBeInTheDocument();
    });

    it('should handle very large numbers', () => {
      render(<ValueDelta {...defaultProps} value={1000000} baseline={800000} />);
      
      expect(screen.getByText('1000000.0')).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      expect(screen.getByText(/800000\.0/)).toBeInTheDocument();
    });

    it('should handle very small decimal numbers', () => {
      render(<ValueDelta {...defaultProps} value={0.001} baseline={0.0008} precision={4} />);
      
      expect(screen.getByText('0.0010')).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      expect(screen.getByText(/0\.0008/)).toBeInTheDocument();
    });

    it('should handle negative values', () => {
      render(<ValueDelta {...defaultProps} value={-50} baseline={-30} />);
      
      expect(screen.getByText(/-50\.0/)).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      expect(screen.getByText(/-30\.0/)).toBeInTheDocument();
      expect(screen.getByText(/-20\.0/)).toBeInTheDocument();
    });

    it('should handle mixed positive and negative values', () => {
      render(<ValueDelta {...defaultProps} value={50} baseline={-30} />);
      
      expect(screen.getByText(/50\.0/)).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      expect(screen.getByText(/-30\.0/)).toBeInTheDocument();
      expect(screen.getByText(/\+80\.0/)).toBeInTheDocument();
    });

    it('should handle baseline of zero with positive value', () => {
      render(<ValueDelta {...defaultProps} value={50} baseline={0} />);
      
      expect(screen.getByText(/50\.0/, { selector: 'span.text-base-content' })).toBeInTheDocument();
      expect(screen.getByText(/vs/)).toBeInTheDocument();
      const vsElement = screen.getByText(/vs/);
      expect(vsElement.textContent).toContain('0.0');
      expect(screen.getByText(/\+50\.0/, { selector: 'span.text-sm.font-medium' })).toBeInTheDocument();
      expect(screen.queryByText(/\(/)).not.toBeInTheDocument(); // No percentage
    });

    it('should handle very high precision', () => {
      render(<ValueDelta {...defaultProps} value={1.123456789} baseline={1.123456788} precision={9} />);
      
      expect(screen.getByText('1.123456789')).toBeInTheDocument();
      expect(screen.getByText('+0.000000001')).toBeInTheDocument();
    });
  });

  describe('styling classes', () => {
    it('should apply correct text classes for main value', () => {
      const { container } = render(<ValueDelta {...defaultProps} />);
      
      const mainValue = container.querySelector('.font-medium.text-base-content');
      expect(mainValue).toBeInTheDocument();
    });

    it('should apply correct classes for delta text', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={100} baseline={80} />);
      
      const deltaText = container.querySelector('.text-sm.font-medium');
      expect(deltaText).toBeInTheDocument();
    });

    it('should apply correct classes for percentage text', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={100} baseline={80} />);
      
      const percentageText = container.querySelector('.text-xs.opacity-75');
      expect(percentageText).toBeInTheDocument();
    });

    it('should apply correct classes for comparison text', () => {
      const { container } = render(<ValueDelta {...defaultProps} />);
      
      const comparisonText = container.querySelector('.text-xs.text-base-content\\/60');
      expect(comparisonText).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<ValueDelta {...defaultProps} />);
      
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });

    it('should have accessible icon for delta direction', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={100} baseline={80} />);
      
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should not have icons when delta is zero', () => {
      const { container } = render(<ValueDelta {...defaultProps} value={80} baseline={80} />);
      
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('mathematical calculations', () => {
    it('should calculate positive delta correctly', () => {
      render(<ValueDelta {...defaultProps} value={120} baseline={100} />);
      
      expect(screen.getByText('+20.0')).toBeInTheDocument();
    });

    it('should calculate negative delta correctly', () => {
      render(<ValueDelta {...defaultProps} value={80} baseline={100} />);
      
      expect(screen.getByText('-20.0')).toBeInTheDocument();
    });

    it('should calculate percentage correctly for positive change', () => {
      render(<ValueDelta {...defaultProps} value={120} baseline={100} />);
      
      expect(screen.getByText('(+20.0%)')).toBeInTheDocument();
    });

    it('should calculate percentage correctly for negative change', () => {
      render(<ValueDelta {...defaultProps} value={80} baseline={100} />);
      
      expect(screen.getByText('(-20.0%)')).toBeInTheDocument();
    });

    it('should handle floating point precision in calculations', () => {
      render(<ValueDelta {...defaultProps} value={1.1} baseline={1.0} precision={1} />);
      
      expect(screen.getByText('+0.1')).toBeInTheDocument();
    });
  });

  describe('integration with format utilities', () => {
    it('should call prettyFormat for value formatting', async () => {
      const formatModule = await import('../lib/format');
      const mockPrettyFormat = vi.mocked(formatModule).prettyFormat;
      
      render(<ValueDelta {...defaultProps} value={123.456} precision={2} />);
      
      expect(mockPrettyFormat).toHaveBeenCalledWith(123.456, 2);
    });

    it('should call formatPercentage for percentage formatting', async () => {
      const formatModule = await import('../lib/format');
      const mockFormatPercentage = vi.mocked(formatModule).formatPercentage;
      
      render(<ValueDelta {...defaultProps} value={110} baseline={100} precision={1} />);
      
      expect(mockFormatPercentage).toHaveBeenCalledWith(0.1, 1);
    });
  });
});