import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComputedText from './ComputedText';

describe('ComputedText', () => {
  describe('rendering behavior', () => {
    it('should render children as text content', () => {
      render(<ComputedText>Test Content</ComputedText>);
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render numeric content', () => {
      render(<ComputedText>42</ComputedText>);
      
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render percentage values', () => {
      render(<ComputedText>85.7%</ComputedText>);
      
      expect(screen.getByText('85.7%')).toBeInTheDocument();
    });

    it('should render calculation expressions', () => {
      render(<ComputedText>avg: 156.2</ComputedText>);
      
      expect(screen.getByText('avg: 156.2')).toBeInTheDocument();
    });

    it('should render complex formatted content', () => {
      render(<ComputedText>Total: 1,234</ComputedText>);
      
      expect(screen.getByText('Total: 1,234')).toBeInTheDocument();
    });
  });

  describe('semantic structure', () => {
    it('should render as a span element', () => {
      const { container } = render(<ComputedText>Test</ComputedText>);
      
      const spanElement = container.querySelector('span');
      expect(spanElement).toBeInTheDocument();
      expect(spanElement).toHaveTextContent('Test');
    });

    it('should have appropriate role for computed values', () => {
      render(<ComputedText>42</ComputedText>);
      
      const element = screen.getByText('42');
      expect(element.tagName.toLowerCase()).toBe('span');
    });
  });

  describe('styling and visual appearance', () => {
    it('should apply correct CSS classes for info theme', () => {
      const { container } = render(<ComputedText>Styled Content</ComputedText>);
      
      const spanElement = container.querySelector('span');
      expect(spanElement).toHaveClass(
        'rounded',
        'p-1',
        'm-1',
        'border-1',
        'border-info',
        'bg-info/20',
        'text-info-content'
      );
    });

    it('should maintain consistent styling across different content types', () => {
      const { container } = render(
        <div>
          <ComputedText>Text</ComputedText>
          <ComputedText>123</ComputedText>
          <ComputedText>45.6%</ComputedText>
        </div>
      );
      
      const spans = container.querySelectorAll('span');
      expect(spans).toHaveLength(3);
      
      spans.forEach(span => {
        expect(span).toHaveClass(
          'rounded',
          'p-1',
          'm-1',
          'border-1',
          'border-info',
          'bg-info/20',
          'text-info-content'
        );
      });
    });
  });

  describe('content flexibility', () => {
    it('should handle empty string content', () => {
      const { container } = render(<ComputedText>{''}</ComputedText>);
      
      const spanElement = container.querySelector('span');
      expect(spanElement).toBeInTheDocument();
      expect(spanElement).toHaveTextContent('');
    });

    it('should handle whitespace-only content', () => {
      const { container } = render(<ComputedText>   </ComputedText>);
      
      const spanElement = container.querySelector('span');
      expect(spanElement).toBeInTheDocument();
      expect(spanElement?.textContent).toBe('   ');
    });

    it('should handle special characters and symbols', () => {
      render(<ComputedText>$1,234.56 + 15% tax = $1,419.74</ComputedText>);
      
      expect(screen.getByText('$1,234.56 + 15% tax = $1,419.74')).toBeInTheDocument();
    });

    it('should handle unicode characters', () => {
      render(<ComputedText>±123.45 ≈ 123</ComputedText>);
      
      expect(screen.getByText('±123.45 ≈ 123')).toBeInTheDocument();
    });

    it('should handle very long content without breaking layout', () => {
      const longContent = 'This is a very long computed text value that might span multiple lines and should still render correctly with all the proper styling applied';
      render(<ComputedText>{longContent}</ComputedText>);
      
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });

  describe('multiple instances usage', () => {
    it('should render multiple ComputedText components independently', () => {
      render(
        <div>
          <ComputedText>First Value</ComputedText>
          <ComputedText>Second Value</ComputedText>
          <ComputedText>Third Value</ComputedText>
        </div>
      );
      
      expect(screen.getByText('First Value')).toBeInTheDocument();
      expect(screen.getByText('Second Value')).toBeInTheDocument();
      expect(screen.getByText('Third Value')).toBeInTheDocument();
    });

    it('should maintain independent styling for each instance', () => {
      const { container } = render(
        <div>
          <ComputedText>Value 1</ComputedText>
          <ComputedText>Value 2</ComputedText>
        </div>
      );
      
      const spans = container.querySelectorAll('span');
      expect(spans).toHaveLength(2);
      
      spans.forEach(span => {
        expect(span).toHaveClass('border-info', 'bg-info/20', 'text-info-content');
      });
    });
  });

  describe('inline text integration', () => {
    it('should integrate seamlessly within paragraph text', () => {
      render(
        <p>
          The player's KDA ratio is <ComputedText>2.5</ComputedText> with an average damage of{' '}
          <ComputedText>15,420</ComputedText> per match.
        </p>
      );
      
      expect(screen.getByText('2.5')).toBeInTheDocument();
      expect(screen.getByText('15,420')).toBeInTheDocument();
      expect(screen.getByText(/The player's KDA ratio is/)).toBeInTheDocument();
      expect(screen.getByText(/per match/)).toBeInTheDocument();
    });

    it('should work within complex layouts', () => {
      render(
        <div className="card">
          <div className="card-body">
            <h2>Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span>Wins: </span>
                <ComputedText>127</ComputedText>
              </div>
              <div>
                <span>Win Rate: </span>
                <ComputedText>73.4%</ComputedText>
              </div>
            </div>
          </div>
        </div>
      );
      
      expect(screen.getByText('127')).toBeInTheDocument();
      expect(screen.getByText('73.4%')).toBeInTheDocument();
      expect(screen.getByText('Wins:')).toBeInTheDocument();
      expect(screen.getByText('Win Rate:')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should be accessible as generic content', () => {
      render(<ComputedText>Accessible Value</ComputedText>);
      
      const element = screen.getByText('Accessible Value');
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('class');
    });

    it('should preserve text content for screen readers', () => {
      render(<ComputedText>Screen Reader Content</ComputedText>);
      
      const element = screen.getByText('Screen Reader Content');
      expect(element).toHaveTextContent('Screen Reader Content');
    });
  });

  describe('edge cases', () => {
    it('should handle zero values', () => {
      render(<ComputedText>0</ComputedText>);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle negative values', () => {
      render(<ComputedText>-42.5</ComputedText>);
      
      expect(screen.getByText('-42.5')).toBeInTheDocument();
    });

    it('should handle scientific notation', () => {
      render(<ComputedText>1.23e+10</ComputedText>);
      
      expect(screen.getByText('1.23e+10')).toBeInTheDocument();
    });

    it('should handle mixed content with numbers and text', () => {
      render(<ComputedText>Score: 1,234 (Rank #5)</ComputedText>);
      
      expect(screen.getByText('Score: 1,234 (Rank #5)')).toBeInTheDocument();
    });
  });
});