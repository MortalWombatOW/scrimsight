import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComputedData from './ComputedData';
import ComputedText from './ComputedText';

// Mock ComputedText component to focus on testing ComputedData behavior
vi.mock('./ComputedText', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="computed-text">{children}</span>
  ),
}));

describe('ComputedData', () => {
  describe('basic rendering behavior', () => {
    it('should render a container with correct styling classes', () => {
      const { container } = render(
        <ComputedData>Test content</ComputedData>
      );
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveClass(
        'border-1',
        'rounded',
        'border-info',
        'bg-info/5', 
        'p-2'
      );
    });

    it('should render children content inside the container', () => {
      render(
        <ComputedData>This is computed data</ComputedData>
      );
      
      expect(screen.getByText('This is computed data')).toBeInTheDocument();
    });
  });

  describe('content handling', () => {
    it('should render simple text content', () => {
      render(
        <ComputedData>Player statistics have been calculated based on recent matches.</ComputedData>
      );
      
      expect(screen.getByText('Player statistics have been calculated based on recent matches.')).toBeInTheDocument();
    });

    it('should render complex nested content structure', () => {
      render(
        <ComputedData>
          <div className="space-y-2">
            <h3 className="font-semibold">Match Analysis</h3>
            <div className="flex gap-2 flex-wrap">
              <ComputedText>KDA: 2.1</ComputedText>
              <ComputedText>Damage: 18,945</ComputedText>
              <ComputedText>Accuracy: 76%</ComputedText>
            </div>
          </div>
        </ComputedData>
      );
      
      expect(screen.getByText('Match Analysis')).toBeInTheDocument();
      expect(screen.getByText('KDA: 2.1')).toBeInTheDocument();
      expect(screen.getByText('Damage: 18,945')).toBeInTheDocument();
      expect(screen.getByText('Accuracy: 76%')).toBeInTheDocument();
      
      const computedTextElements = screen.getAllByTestId('computed-text');
      expect(computedTextElements).toHaveLength(3);
    });

    it('should render list content', () => {
      render(
        <ComputedData>
          <h4 className="font-medium mb-2">Top Performers</h4>
          <ul className="space-y-1">
            <li>• Player1 - 2,456 damage</li>
            <li>• Player2 - 2,234 damage</li>
            <li>• Player3 - 1,987 damage</li>
          </ul>
        </ComputedData>
      );
      
      expect(screen.getByText('Top Performers')).toBeInTheDocument();
      expect(screen.getByText('• Player1 - 2,456 damage')).toBeInTheDocument();
      expect(screen.getByText('• Player2 - 2,234 damage')).toBeInTheDocument();
      expect(screen.getByText('• Player3 - 1,987 damage')).toBeInTheDocument();
    });

    it('should render complex data with multiple sections', () => {
      render(
        <ComputedData>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">Team Performance Summary</h3>
              <p className="text-sm text-base-content/70">Based on last 10 matches</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Overall Win Rate:</span>
                <ComputedText>68.5%</ComputedText>
              </div>
              <div>
                <span className="text-sm font-medium">Avg Match Duration:</span>
                <ComputedText>24:32</ComputedText>
              </div>
            </div>
            
            <div className="pt-2 border-t border-info/20">
              <p className="text-xs text-base-content/60">
                Data computed automatically after each match
              </p>
            </div>
          </div>
        </ComputedData>
      );
      
      expect(screen.getByText('Team Performance Summary')).toBeInTheDocument();
      expect(screen.getByText('Based on last 10 matches')).toBeInTheDocument();
      expect(screen.getByText('Overall Win Rate:')).toBeInTheDocument();
      expect(screen.getByText('68.5%')).toBeInTheDocument();
      expect(screen.getByText('Avg Match Duration:')).toBeInTheDocument();
      expect(screen.getByText('24:32')).toBeInTheDocument();
      expect(screen.getByText('Data computed automatically after each match')).toBeInTheDocument();
      
      const computedTextElements = screen.getAllByTestId('computed-text');
      expect(computedTextElements).toHaveLength(2);
    });

    it('should render nested weapon performance analysis content', () => {
      render(
        <ComputedData>
          <div className="space-y-4">
            <h3 className="font-semibold">Weapon Performance Analysis</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>AK-47</span>
                <div className="flex gap-2">
                  <ComputedText>Kills: 23</ComputedText>
                  <ComputedText>Accuracy: 68%</ComputedText>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>AWP</span>
                <div className="flex gap-2">
                  <ComputedText>Kills: 15</ComputedText>
                  <ComputedText>Accuracy: 89%</ComputedText>
                </div>
              </div>
            </div>
          </div>
        </ComputedData>
      );
      
      expect(screen.getByText('Weapon Performance Analysis')).toBeInTheDocument();
      expect(screen.getByText('AK-47')).toBeInTheDocument();
      expect(screen.getByText('AWP')).toBeInTheDocument();
      expect(screen.getByText('Kills: 23')).toBeInTheDocument();
      expect(screen.getByText('Accuracy: 68%')).toBeInTheDocument();
      expect(screen.getByText('Kills: 15')).toBeInTheDocument();
      expect(screen.getByText('Accuracy: 89%')).toBeInTheDocument();
      
      const computedTextElements = screen.getAllByTestId('computed-text');
      expect(computedTextElements).toHaveLength(4);
    });
  });

  describe('edge cases and special content', () => {
    it('should render empty content', () => {
      const { container } = render(<ComputedData>{''}</ComputedData>);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveTextContent('');
    });

    it('should render null children gracefully', () => {
      const { container } = render(<ComputedData>{null}</ComputedData>);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveTextContent('');
    });

    it('should render undefined children gracefully', () => {
      const { container } = render(<ComputedData>{undefined}</ComputedData>);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveTextContent('');
    });

    it('should render boolean children (false should not display)', () => {
      const { container } = render(<ComputedData>{false}</ComputedData>);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveTextContent('');
    });

    it('should render number children', () => {
      render(<ComputedData>{42}</ComputedData>);
      
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render string with special characters', () => {
      const specialCharsText = 'Special chars: @#$%^&*()_+{}|:"<>?[]';
      render(
        <ComputedData>
          {specialCharsText}
        </ComputedData>
      );
      
      expect(screen.getByText(specialCharsText)).toBeInTheDocument();
    });

    it('should render very long text content', () => {
      const longText = 'A'.repeat(1000);
      render(<ComputedData>{longText}</ComputedData>);
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should render multiple child elements at once', () => {
      render(
        <ComputedData>
          <span>First element</span>
          <span>Second element</span>
          <div>Third element</div>
        </ComputedData>
      );
      
      expect(screen.getByText('First element')).toBeInTheDocument();
      expect(screen.getByText('Second element')).toBeInTheDocument();
      expect(screen.getByText('Third element')).toBeInTheDocument();
    });
  });

  describe('container element structure', () => {
    it('should render as a div element', () => {
      const { container } = render(
        <ComputedData>Test content</ComputedData>
      );
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.tagName).toBe('DIV');
    });

    it('should be the only child of the rendered container', () => {
      const { container } = render(
        <ComputedData>Test content</ComputedData>
      );
      
      expect(container.children).toHaveLength(1);
    });

    it('should preserve child element structure and attributes', () => {
      render(
        <ComputedData>
          <div id="test-id" className="custom-class" data-testid="nested-element">
            Nested content
          </div>
        </ComputedData>
      );
      
      const nestedElement = screen.getByTestId('nested-element');
      expect(nestedElement).toBeInTheDocument();
      expect(nestedElement).toHaveAttribute('id', 'test-id');
      expect(nestedElement).toHaveClass('custom-class');
      expect(nestedElement).toHaveTextContent('Nested content');
    });
  });

  describe('multiple container scenarios', () => {
    it('should render multiple ComputedData containers independently', () => {
      const { container } = render(
        <div>
          <ComputedData>
            <h4>Individual Stats</h4>
            <div>
              <ComputedText>Kills: 42</ComputedText>
              <ComputedText>Deaths: 18</ComputedText>
            </div>
          </ComputedData>
          
          <ComputedData>
            <h4>Team Stats</h4>
            <div>
              <ComputedText>Rounds Won: 13</ComputedText>
              <ComputedText>Rounds Lost: 3</ComputedText>
            </div>
          </ComputedData>
        </div>
      );
      
      expect(screen.getByText('Individual Stats')).toBeInTheDocument();
      expect(screen.getByText('Team Stats')).toBeInTheDocument();
      expect(screen.getByText('Kills: 42')).toBeInTheDocument();
      expect(screen.getByText('Rounds Won: 13')).toBeInTheDocument();
      
      const computedDataContainers = container.querySelectorAll('.border-info');
      expect(computedDataContainers).toHaveLength(2);
      
      const computedTextElements = screen.getAllByTestId('computed-text');
      expect(computedTextElements).toHaveLength(4);
    });

    it('should maintain independent styling for each container', () => {
      const { container } = render(
        <div>
          <ComputedData>First container</ComputedData>
          <ComputedData>Second container</ComputedData>
        </div>
      );
      
      const containers = container.querySelectorAll('.border-info');
      expect(containers).toHaveLength(2);
      
      containers.forEach(containerDiv => {
        expect(containerDiv).toHaveClass(
          'border-1',
          'rounded',
          'border-info',
          'bg-info/5',
          'p-2'
        );
      });
    });
  });

  describe('accessibility and semantic structure', () => {
    it('should not add any implicit ARIA attributes', () => {
      const { container } = render(
        <ComputedData>Accessible content</ComputedData>
      );
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).not.toHaveAttribute('role');
      expect(containerDiv).not.toHaveAttribute('aria-label');
      expect(containerDiv).not.toHaveAttribute('aria-labelledby');
    });

    it('should preserve accessibility attributes from child elements', () => {
      render(
        <ComputedData>
          <button aria-label="Close dialog">X</button>
          <input aria-describedby="help-text" />
          <div id="help-text">Help information</div>
        </ComputedData>
      );
      
      const button = screen.getByRole('button', { name: 'Close dialog' });
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
      
      expect(screen.getByText('Help information')).toHaveAttribute('id', 'help-text');
    });

    it('should preserve heading structure for screen readers', () => {
      render(
        <ComputedData>
          <h1>Main Title</h1>
          <h2>Subtitle</h2>
          <h3>Section</h3>
        </ComputedData>
      );
      
      expect(screen.getByRole('heading', { level: 1, name: 'Main Title' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Subtitle' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Section' })).toBeInTheDocument();
    });
  });
});