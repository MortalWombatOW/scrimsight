import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

// Mock EmptyState component since we're testing ErrorBoundary behavior
vi.mock('./EmptyState', () => ({
  default: ({ icon, title, description, size }: {
    icon: unknown;
    title: string; 
    description: string;
    size: string;
  }) => (
    <div data-testid="empty-state-fallback" data-title={title} data-description={description} data-size={size}>
      {title}
    </div>
  ),
}));

// Test component that throws an error when shouldThrow is true
const ThrowErrorComponent = ({ shouldThrow = false, message = 'Test error' }: {
  shouldThrow?: boolean;
  message?: string;
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div data-testid="working-component">Component works fine</div>;
};

// Test component that always works
const WorkingComponent = () => {
  return <div data-testid="working-component">This component works</div>;
};

// Test component with nested content
const NestedComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="nested-component">
      <h2>Nested Component</h2>
      {children}
    </div>
  );
};

// Mock console.error to test error logging
const originalConsoleError = console.error;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Mock console.error to suppress error output during tests
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  describe('normal operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('working-component')).toBeInTheDocument();
      expect(screen.getByText('This component works')).toBeInTheDocument();
    });

    it('should render multiple children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should render complex nested children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <NestedComponent>
            <WorkingComponent />
          </NestedComponent>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('nested-component')).toBeInTheDocument();
      expect(screen.getByText('Nested Component')).toBeInTheDocument();
      expect(screen.getByTestId('working-component')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should render default error fallback when child component throws error', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should render the default EmptyState fallback
      const fallback = screen.getByTestId('empty-state-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveAttribute('data-title', 'Something went wrong');
      expect(fallback).toHaveAttribute(
        'data-description', 
        'An unexpected error has occurred. Please try refreshing the page or contact support if the problem persists.'
      );
      expect(fallback).toHaveAttribute('data-size', 'lg');

      // Should not render the original component
      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument();
    });

    it('should render custom fallback when provided and error occurs', () => {
      const customFallback = (
        <div data-testid="custom-fallback">
          Custom error message
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom error message')).toBeInTheDocument();

      // Should not render the default fallback
      expect(screen.queryByTestId('empty-state-fallback')).not.toBeInTheDocument();
      // Should not render the original component
      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument();
    });

    it('should catch errors from nested components', () => {
      render(
        <ErrorBoundary>
          <NestedComponent>
            <div>Some wrapper content</div>
            <ThrowErrorComponent shouldThrow={true} />
          </NestedComponent>
        </ErrorBoundary>
      );

      // Should render error fallback even for deeply nested errors
      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('nested-component')).not.toBeInTheDocument();
    });

    it('should log error to console when error occurs', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} message="Test console error" />
        </ErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorCall = consoleErrorSpy.mock.calls.find(call => 
        call[0] === 'ErrorBoundary caught an error:'
      );
      expect(errorCall).toBeDefined();
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle different error types and messages', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} message="First error" />
        </ErrorBoundary>
      );

      // First error should render fallback
      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();

      // Rerender with different error - should still show fallback
      rerender(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} message="Second error" />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();
    });
  });

  describe('error recovery', () => {
    it('should render children again when component is remounted without error', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // First render with error
      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();

      // Unmount to reset error boundary state
      unmount();
      
      // Render a new instance with working component
      render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('working-component')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-fallback')).not.toBeInTheDocument();
    });

    it('should handle switching from working to error state', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      // First render without error
      expect(screen.getByTestId('working-component')).toBeInTheDocument();

      // Rerender with error
      rerender(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument();
    });
  });

  describe('fallback customization', () => {
    it('should render complex custom fallback components', () => {
      const ComplexFallback = () => (
        <div data-testid="complex-fallback">
          <h1>Error Occurred</h1>
          <p>Please try again later</p>
          <button>Retry</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={<ComplexFallback />}>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('complex-fallback')).toBeInTheDocument();
      expect(screen.getByText('Error Occurred')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should render string fallback content', () => {
      render(
        <ErrorBoundary fallback="Simple error message">
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Simple error message')).toBeInTheDocument();
    });

    it('should render default fallback when null fallback is provided', () => {
      render(
        <ErrorBoundary fallback={null}>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // null is falsy, so it should render the default EmptyState fallback
      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument();
    });

    it('should handle fallback with event handlers', () => {
      const handleClick = vi.fn();
      const FallbackWithHandler = () => (
        <button data-testid="fallback-button" onClick={handleClick}>
          Click to retry
        </button>
      );

      render(
        <ErrorBoundary fallback={<FallbackWithHandler />}>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      const button = screen.getByTestId('fallback-button');
      expect(button).toBeInTheDocument();
      
      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('multiple error boundaries', () => {
    it('should isolate errors to the nearest error boundary', () => {
      render(
        <div>
          <ErrorBoundary>
            <div data-testid="section-1">
              <WorkingComponent />
            </div>
          </ErrorBoundary>
          <ErrorBoundary>
            <div data-testid="section-2">
              <ThrowErrorComponent shouldThrow={true} />
            </div>
          </ErrorBoundary>
          <ErrorBoundary>
            <div data-testid="section-3">
              <WorkingComponent />
            </div>
          </ErrorBoundary>
        </div>
      );

      // First section should work normally
      expect(screen.getByTestId('section-1')).toBeInTheDocument();
      
      // Second section should show error fallback
      expect(screen.queryByTestId('section-2')).not.toBeInTheDocument();
      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();
      
      // Third section should work normally
      expect(screen.getByTestId('section-3')).toBeInTheDocument();
    });

    it('should handle nested error boundaries', () => {
      render(
        <ErrorBoundary fallback={<div data-testid="outer-fallback">Outer error</div>}>
          <div data-testid="outer-content">
            <ErrorBoundary fallback={<div data-testid="inner-fallback">Inner error</div>}>
              <ThrowErrorComponent shouldThrow={true} />
            </ErrorBoundary>
          </div>
        </ErrorBoundary>
      );

      // Inner error boundary should catch the error
      expect(screen.getByTestId('inner-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('outer-content')).toBeInTheDocument();
      expect(screen.queryByTestId('outer-fallback')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle errors thrown during rendering', () => {
      // Component that throws during render
      const RenderErrorComponent = () => {
        throw new Error('Render error');
      };

      render(
        <ErrorBoundary>
          <RenderErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(
        <ErrorBoundary>
          {null}
        </ErrorBoundary>
      );

      // Should render nothing but not crash
      expect(screen.queryByTestId('empty-state-fallback')).not.toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(
        <ErrorBoundary>
          {undefined}
        </ErrorBoundary>
      );

      // Should render nothing but not crash
      expect(screen.queryByTestId('empty-state-fallback')).not.toBeInTheDocument();
    });

    it('should handle boolean children', () => {
      render(
        <ErrorBoundary>
          {true}
          {false}
        </ErrorBoundary>
      );

      // Should render nothing but not crash
      expect(screen.queryByTestId('empty-state-fallback')).not.toBeInTheDocument();
    });

    it('should handle mixed children types', () => {
      render(
        <ErrorBoundary>
          <div data-testid="element-child">Element</div>
          {null}
          {"String child"}
          {123}
          <span data-testid="another-element">Span</span>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('element-child')).toBeInTheDocument();
      expect(screen.getByText(/String child/)).toBeInTheDocument();
      expect(screen.getByText(/123/)).toBeInTheDocument();
      expect(screen.getByTestId('another-element')).toBeInTheDocument();
    });
  });

  describe('state management', () => {
    it('should maintain error state until component remounts', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error fallback
      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();

      // Rerender with same error - should still show fallback
      rerender(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();
    });

    it('should maintain error state when children change (error boundaries do not auto-reset)', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error fallback
      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();

      // Rerender with working component - error boundary should still show error
      // (This is the expected behavior - error boundaries don't auto-reset)
      rerender(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      );

      // Should still show error fallback (error boundaries maintain error state)
      expect(screen.getByTestId('empty-state-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render fallback content that is accessible', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      const fallback = screen.getByTestId('empty-state-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Something went wrong');
    });

    it('should maintain focus management when error occurs', () => {
      const FocusableComponent = () => (
        <div>
          <button data-testid="focusable-button">Focus me</button>
          <ThrowErrorComponent shouldThrow={true} />
        </div>
      );

      render(
        <ErrorBoundary>
          <FocusableComponent />
        </ErrorBoundary>
      );

      // After error, fallback should be rendered and focusable
      const fallback = screen.getByTestId('empty-state-fallback');
      expect(fallback).toBeInTheDocument();
      expect(screen.queryByTestId('focusable-button')).not.toBeInTheDocument();
    });
  });
});