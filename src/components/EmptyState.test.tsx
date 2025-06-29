import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileX, Search, Users, Upload } from 'lucide-react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  describe('basic rendering', () => {
    it('should render with required title prop', () => {
      render(<EmptyState title="No data available" />);
      
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should render with title and description', () => {
      render(
        <EmptyState 
          title="No files found" 
          description="There are no files to display"
        />
      );
      
      expect(screen.getByText('No files found')).toBeInTheDocument();
      expect(screen.getByText('There are no files to display')).toBeInTheDocument();
    });

    it('should render without description when not provided', () => {
      render(<EmptyState title="Just a title" />);
      
      expect(screen.getByText('Just a title')).toBeInTheDocument();
      // No description paragraph should be rendered
      const paragraphs = screen.getAllByText(/./);
      expect(paragraphs).toHaveLength(1); // Only the title
    });

    it('should apply correct base container classes', () => {
      const { container } = render(<EmptyState title="Test" />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should apply custom className when provided', () => {
      const { container } = render(
        <EmptyState 
          title="Test" 
          className="custom-border bg-custom"
        />
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('custom-border', 'bg-custom');
    });
  });

  describe('icon rendering', () => {
    it('should render icon when provided', () => {
      render(
        <EmptyState 
          icon={FileX}
          title="No files"
        />
      );
      
      const iconContainer = screen.getByText('No files').closest('div')?.parentElement?.querySelector('div > svg');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should not render icon when not provided', () => {
      const { container } = render(<EmptyState title="No icon" />);
      
      const svgElements = container.querySelectorAll('svg');
      expect(svgElements).toHaveLength(0);
    });

    it('should apply correct icon styling classes', () => {
      render(
        <EmptyState 
          icon={Search}
          title="No results"
        />
      );
      
      const iconElement = screen.getByText('No results').closest('div')?.parentElement?.querySelector('svg');
      expect(iconElement).toHaveClass('text-base-content/50');
    });
  });

  describe('size variants', () => {
    it('should apply small size classes correctly', () => {
      const { container } = render(
        <EmptyState 
          title="Small state"
          size="sm"
        />
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      const contentContainer = mainContainer.querySelector('div');
      const titleElement = screen.getByText('Small state');
      
      expect(mainContainer).toHaveClass('h-32');
      expect(contentContainer).toHaveClass('space-y-2');
      expect(titleElement).toHaveClass('text-base', 'font-medium');
    });

    it('should apply medium size classes correctly (default)', () => {
      const { container } = render(
        <EmptyState title="Medium state" />
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      const contentContainer = mainContainer.querySelector('div');
      const titleElement = screen.getByText('Medium state');
      
      expect(mainContainer).toHaveClass('h-64');
      expect(contentContainer).toHaveClass('space-y-4');
      expect(titleElement).toHaveClass('text-lg', 'font-medium');
    });

    it('should apply large size classes correctly', () => {
      const { container } = render(
        <EmptyState 
          title="Large state"
          size="lg"
        />
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      const contentContainer = mainContainer.querySelector('div');
      const titleElement = screen.getByText('Large state');
      
      expect(mainContainer).toHaveClass('h-96');
      expect(contentContainer).toHaveClass('space-y-6');
      expect(titleElement).toHaveClass('text-2xl', 'font-semibold');
    });

    it('should apply correct icon sizes for each variant', () => {
      const { rerender } = render(
        <EmptyState 
          icon={Users}
          title="Test"
          size="sm"
        />
      );
      
      let iconElement = document.querySelector('svg');
      expect(iconElement).toHaveAttribute('width', '32');
      expect(iconElement).toHaveAttribute('height', '32');

      rerender(
        <EmptyState 
          icon={Users}
          title="Test"
          size="md"
        />
      );
      
      iconElement = document.querySelector('svg');
      expect(iconElement).toHaveAttribute('width', '48');
      expect(iconElement).toHaveAttribute('height', '48');

      rerender(
        <EmptyState 
          icon={Users}
          title="Test"
          size="lg"
        />
      );
      
      iconElement = document.querySelector('svg');
      expect(iconElement).toHaveAttribute('width', '64');
      expect(iconElement).toHaveAttribute('height', '64');
    });

    it('should apply description text size classes correctly', () => {
      const { rerender } = render(
        <EmptyState 
          title="Test"
          description="Test description"
          size="sm"
        />
      );
      
      let descriptionElement = screen.getByText('Test description');
      expect(descriptionElement).toHaveClass('text-xs');

      rerender(
        <EmptyState 
          title="Test"
          description="Test description"
          size="md"
        />
      );
      
      descriptionElement = screen.getByText('Test description');
      expect(descriptionElement).toHaveClass('text-sm');

      rerender(
        <EmptyState 
          title="Test"
          description="Test description"
          size="lg"
        />
      );
      
      descriptionElement = screen.getByText('Test description');
      expect(descriptionElement).toHaveClass('text-base');
    });
  });

  describe('action rendering', () => {
    it('should render action element when provided', () => {
      const actionElement = <button data-testid="test-action">Click me</button>;
      
      render(
        <EmptyState 
          title="With action"
          action={actionElement}
        />
      );
      
      expect(screen.getByTestId('test-action')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should not render action container when action is not provided', () => {
      const { container } = render(<EmptyState title="No action" />);
      
      // Look for the action container div with mt-4 class
      const actionContainer = container.querySelector('.mt-4');
      expect(actionContainer).not.toBeInTheDocument();
    });

    it('should render complex action elements', () => {
      const complexAction = (
        <div className="flex gap-2">
          <button data-testid="primary-btn">Primary</button>
          <button data-testid="secondary-btn">Secondary</button>
        </div>
      );
      
      render(
        <EmptyState 
          title="Complex actions"
          action={complexAction}
        />
      );
      
      expect(screen.getByTestId('primary-btn')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-btn')).toBeInTheDocument();
    });

    it('should apply correct action container styling', () => {
      const { container } = render(
        <EmptyState 
          title="Test"
          action={<button>Test</button>}
        />
      );
      
      const actionContainer = container.querySelector('.mt-4');
      expect(actionContainer).toBeInTheDocument();
      expect(actionContainer).toHaveClass('mt-4');
    });
  });

  describe('text content and styling', () => {
    it('should apply correct title styling classes', () => {
      render(<EmptyState title="Styled title" />);
      
      const titleElement = screen.getByText('Styled title');
      expect(titleElement).toHaveClass('text-base-content', 'mb-2');
    });

    it('should apply correct description styling classes', () => {
      render(
        <EmptyState 
          title="Title"
          description="Styled description"
        />
      );
      
      const descriptionElement = screen.getByText('Styled description');
      expect(descriptionElement).toHaveClass('text-base-content/60');
    });

    it('should apply correct content container styling', () => {
      const { container } = render(
        <EmptyState title="Test" />
      );
      
      const contentContainer = container.querySelector('.text-base-content\\/70');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('text-center');
    });
  });

  describe('component structure and layout', () => {
    it('should maintain proper DOM structure with all elements', () => {
      render(
        <EmptyState 
          icon={Upload}
          title="Complete example"
          description="With all props"
          action={<button>Action</button>}
        />
      );
      
      // Check that all elements are present in the expected order
      expect(screen.getByText('Complete example')).toBeInTheDocument();
      expect(screen.getByText('With all props')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      
      // Icon should be present
      const iconElement = document.querySelector('svg');
      expect(iconElement).toBeInTheDocument();
    });

    it('should render minimal structure with title only', () => {
      const { container } = render(<EmptyState title="Minimal" />);
      
      // Should have main container, content container, and title
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toBeInTheDocument();
      
      const contentContainer = mainContainer.querySelector('div');
      expect(contentContainer).toBeInTheDocument();
      
      expect(screen.getByText('Minimal')).toBeInTheDocument();
    });

    it('should handle icon container layout correctly', () => {
      render(
        <EmptyState 
          icon={FileX}
          title="With icon"
        />
      );
      
      const titleElement = screen.getByText('With icon');
      const contentContainer = titleElement.closest('div')?.parentElement;
      const iconContainer = contentContainer?.querySelector('div:first-child');
      
      expect(iconContainer).toHaveClass('flex', 'justify-center', 'mb-4');
    });
  });

  describe('accessibility', () => {
    it('should render proper text hierarchy', () => {
      render(
        <EmptyState 
          title="Main title"
          description="Supporting description"
        />
      );
      
      // Title should be in a paragraph with appropriate styling
      const titleElement = screen.getByText('Main title');
      expect(titleElement.tagName).toBe('P');
      
      // Description should be in a separate paragraph
      const descriptionElement = screen.getByText('Supporting description');
      expect(descriptionElement.tagName).toBe('P');
    });

    it('should maintain readable text contrast classes', () => {
      render(
        <EmptyState 
          title="Title"
          description="Description"
        />
      );
      
      const titleElement = screen.getByText('Title');
      const descriptionElement = screen.getByText('Description');
      
      // Title should have full contrast
      expect(titleElement).toHaveClass('text-base-content');
      
      // Description should have reduced contrast but still readable
      expect(descriptionElement).toHaveClass('text-base-content/60');
    });

    it('should be properly focusable when containing interactive elements', () => {
      render(
        <EmptyState 
          title="Interactive"
          action={<button>Focusable button</button>}
        />
      );
      
      const button = screen.getByText('Focusable button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty title gracefully', () => {
      render(<EmptyState title="" />);
      
      // Should still render the title element even if empty
      const titleElement = document.querySelector('p');
      expect(titleElement).toBeInTheDocument();
    });

    it('should handle empty description gracefully', () => {
      render(
        <EmptyState 
          title="Title"
          description=""
        />
      );
      
      // Should not render description element when empty string is provided
      expect(screen.getByText('Title')).toBeInTheDocument();
      // Empty description should not create a paragraph element
      const paragraphs = document.querySelectorAll('p');
      expect(paragraphs).toHaveLength(1); // Only the title paragraph
    });

    it('should handle undefined optional props gracefully', () => {
      render(
        <EmptyState 
          title="Test"
          icon={undefined}
          description={undefined}
          action={undefined}
          className={undefined}
        />
      );
      
      expect(screen.getByText('Test')).toBeInTheDocument();
      // Should not crash and should render basic state
    });

    it('should handle complex nested action content', () => {
      const nestedAction = (
        <div>
          <div>
            <button>
              <span>Nested</span>
              <span>Button</span>
            </button>
          </div>
        </div>
      );
      
      render(
        <EmptyState 
          title="Nested action"
          action={nestedAction}
        />
      );
      
      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('should handle very long text content', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines and we want to make sure it renders correctly';
      const longDescription = 'This is an extremely long description that contains multiple sentences and should test how the component handles overflow and wrapping of text content to ensure proper display.';
      
      render(
        <EmptyState 
          title={longTitle}
          description={longDescription}
        />
      );
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('should handle special characters in text content', () => {
      const specialTitle = 'Title with "quotes" & <brackets> and émojis 🎉';
      const specialDescription = 'Description with special chars: @#$%^&*()';
      
      render(
        <EmptyState 
          title={specialTitle}
          description={specialDescription}
        />
      );
      
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
      expect(screen.getByText(specialDescription)).toBeInTheDocument();
    });
  });

  describe('custom styling integration', () => {
    it('should combine custom className with base classes', () => {
      const { container } = render(
        <EmptyState 
          title="Custom styled"
          className="border-dashed border-2 bg-red-100"
        />
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center');
      expect(mainContainer).toHaveClass('border-dashed', 'border-2', 'bg-red-100');
    });

    it('should not interfere with internal element styling when custom className is applied', () => {
      render(
        <EmptyState 
          title="Styled container"
          description="Normal text"
          className="custom-background"
        />
      );
      
      const titleElement = screen.getByText('Styled container');
      const descriptionElement = screen.getByText('Normal text');
      
      // Internal styling should be preserved
      expect(titleElement).toHaveClass('text-base-content', 'mb-2');
      expect(descriptionElement).toHaveClass('text-base-content/60');
    });
  });
});