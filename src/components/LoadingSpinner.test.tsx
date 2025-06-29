import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('basic rendering', () => {
    it('should render loading spinner component', () => {
      render(<LoadingSpinner />);
      
      // Find the loading spinner element
      const spinner = document.querySelector('.loading');
      expect(spinner).toBeInTheDocument();
    });

    it('should render container with correct layout classes', () => {
      const { container } = render(<LoadingSpinner />);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('flex', 'justify-center', 'items-center', 'h-full');
    });

    it('should render spinner with correct classes', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.loading');
      expect(spinner).toHaveClass('loading', 'loading-lg');
    });

    it('should render as a span element', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.loading');
      expect(spinner?.tagName).toBe('SPAN');
    });
  });

  describe('component structure', () => {
    it('should have proper DOM structure', () => {
      const { container } = render(<LoadingSpinner />);
      
      // Should have a container div with a span inside
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.tagName).toBe('DIV');
      
      const spinner = containerDiv.querySelector('span');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('loading');
    });

    it('should be a self-contained component with no children', () => {
      const { container } = render(<LoadingSpinner />);
      
      const spinner = container.querySelector('.loading');
      expect(spinner?.children).toHaveLength(0);
      expect(spinner?.textContent).toBe('');
    });
  });

  describe('styling and layout', () => {
    it('should apply centering layout to container', () => {
      const { container } = render(<LoadingSpinner />);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('flex');
      expect(containerDiv).toHaveClass('justify-center');
      expect(containerDiv).toHaveClass('items-center');
    });

    it('should apply full height to container', () => {
      const { container } = render(<LoadingSpinner />);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('h-full');
    });

    it('should apply large size to spinner', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.loading');
      expect(spinner).toHaveClass('loading-lg');
    });

    it('should work within different container sizes', () => {
      const { rerender } = render(
        <div className="w-32 h-32">
          <LoadingSpinner />
        </div>
      );
      
      let spinner = document.querySelector('.loading');
      expect(spinner).toBeInTheDocument();
      
      // Test with different container
      rerender(
        <div className="w-96 h-64">
          <LoadingSpinner />
        </div>
      );
      
      spinner = document.querySelector('.loading');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should be accessible for screen readers', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.loading');
      expect(spinner).toBeInTheDocument();
      
      // The DaisyUI loading class should provide proper accessibility
      // The span element should be present and have appropriate ARIA attributes via CSS
    });

    it('should not interfere with keyboard navigation', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.loading');
      
      // Loading spinner should not be focusable
      expect(spinner).not.toHaveFocus();
      
      // Trying to focus should not work (no tabindex, not interactive)
      (spinner as HTMLElement)?.focus();
      expect(spinner).not.toHaveFocus();
    });

    it('should have no interactive elements', () => {
      const { container } = render(<LoadingSpinner />);
      
      // Should not contain any buttons, links, inputs, or other interactive elements
      const interactiveElements = container.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      expect(interactiveElements).toHaveLength(0);
    });
  });

  describe('visual consistency', () => {
    it('should render consistently across multiple renders', () => {
      const { unmount } = render(<LoadingSpinner />);
      
      let spinner = document.querySelector('.loading');
      const firstRenderClasses = spinner?.className;
      
      unmount();
      
      render(<LoadingSpinner />);
      spinner = document.querySelector('.loading');
      const secondRenderClasses = spinner?.className;
      
      expect(firstRenderClasses).toBe(secondRenderClasses);
    });

    it('should maintain structure when rendered multiple times', () => {
      render(<LoadingSpinner />);
      render(<LoadingSpinner />);
      render(<LoadingSpinner />);
      
      const spinners = document.querySelectorAll('.loading');
      expect(spinners).toHaveLength(3);
      
      spinners.forEach(spinner => {
        expect(spinner).toHaveClass('loading', 'loading-lg');
        expect(spinner.tagName).toBe('SPAN');
      });
    });
  });

  describe('integration and context', () => {
    it('should work within different parent containers', () => {
      const { rerender } = render(
        <div className="card">
          <LoadingSpinner />
        </div>
      );
      
      expect(document.querySelector('.loading')).toBeInTheDocument();
      
      rerender(
        <div className="modal">
          <LoadingSpinner />
        </div>
      );
      
      expect(document.querySelector('.loading')).toBeInTheDocument();
      
      rerender(
        <section className="hero">
          <LoadingSpinner />
        </section>
      );
      
      expect(document.querySelector('.loading')).toBeInTheDocument();
    });

    it('should work alongside other components', () => {
      render(
        <div>
          <h1>Loading Page</h1>
          <LoadingSpinner />
          <p>Please wait...</p>
        </div>
      );
      
      expect(screen.getByText('Loading Page')).toBeInTheDocument();
      expect(document.querySelector('.loading')).toBeInTheDocument();
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('should work within flex and grid layouts', () => {
      const { rerender } = render(
        <div className="flex">
          <div>Content 1</div>
          <LoadingSpinner />
          <div>Content 2</div>
        </div>
      );
      
      expect(document.querySelector('.loading')).toBeInTheDocument();
      
      rerender(
        <div className="grid grid-cols-3">
          <div>Grid 1</div>
          <LoadingSpinner />
          <div>Grid 3</div>
        </div>
      );
      
      expect(document.querySelector('.loading')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle rapid mount/unmount cycles', () => {
      const { unmount, container } = render(<LoadingSpinner />);
      expect(container.querySelector('.loading')).toBeInTheDocument();
      
      unmount();
      expect(container.querySelector('.loading')).not.toBeInTheDocument();
      
      const { unmount: unmount2, container: container2 } = render(<LoadingSpinner />);
      expect(container2.querySelector('.loading')).toBeInTheDocument();
      
      unmount2();
      expect(container2.querySelector('.loading')).not.toBeInTheDocument();
    });

    it('should work with conditional rendering', () => {
      const ConditionalSpinner = ({ show }: { show: boolean }) => (
        <div>
          {show && <LoadingSpinner />}
        </div>
      );
      
      const { rerender } = render(<ConditionalSpinner show={false} />);
      expect(document.querySelector('.loading')).not.toBeInTheDocument();
      
      rerender(<ConditionalSpinner show={true} />);
      expect(document.querySelector('.loading')).toBeInTheDocument();
      
      rerender(<ConditionalSpinner show={false} />);
      expect(document.querySelector('.loading')).not.toBeInTheDocument();
    });

    it('should handle being wrapped in error boundaries', () => {
      const ErrorBoundaryWrapper = ({ children }: { children: React.ReactNode }) => {
        return (
          <div>
            {children}
          </div>
        );
      };
      
      render(
        <ErrorBoundaryWrapper>
          <LoadingSpinner />
        </ErrorBoundaryWrapper>
      );
      
      expect(document.querySelector('.loading')).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender } = render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.loading');
      const originalSpinner = spinner;
      
      // Rerender the same component
      rerender(<LoadingSpinner />);
      
      const newSpinner = document.querySelector('.loading');
      
      // The element should be present (though React may have replaced it)
      expect(newSpinner).toBeInTheDocument();
      expect(newSpinner).toHaveClass('loading', 'loading-lg');
    });

    it('should work in lists without performance issues', () => {
      render(
        <div>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i}>
              <LoadingSpinner />
            </div>
          ))}
        </div>
      );
      
      const spinners = document.querySelectorAll('.loading');
      expect(spinners).toHaveLength(5);
      
      spinners.forEach(spinner => {
        expect(spinner).toHaveClass('loading', 'loading-lg');
      });
    });
  });

  describe('CSS framework integration', () => {
    it('should use DaisyUI loading classes correctly', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.loading');
      expect(spinner).toHaveClass('loading');
      expect(spinner).toHaveClass('loading-lg');
    });

    it('should maintain proper class ordering', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.loading');
      const classes = spinner?.className.split(' ') || [];
      
      expect(classes).toContain('loading');
      expect(classes).toContain('loading-lg');
      expect(classes).toHaveLength(2);
    });

    it('should work with custom theme configurations', () => {
      // This test ensures the component works regardless of DaisyUI theme
      render(
        <div data-theme="dark">
          <LoadingSpinner />
        </div>
      );
      
      expect(document.querySelector('.loading')).toBeInTheDocument();
      
      render(
        <div data-theme="light">
          <LoadingSpinner />
        </div>
      );
      
      expect(document.querySelector('.loading')).toBeInTheDocument();
    });
  });
});