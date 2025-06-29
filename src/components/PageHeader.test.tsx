import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  describe('main component', () => {
    it('should render children inside header container', () => {
      render(
        <PageHeader>
          <div data-testid="child-content">Test Content</div>
        </PageHeader>
      );
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply default classes', () => {
      const { container } = render(
        <PageHeader>
          <span>Content</span>
        </PageHeader>
      );
      
      const headerElement = container.firstChild as HTMLElement;
      expect(headerElement).toHaveClass('flex', 'items-center', 'gap-4', 'mb-6');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <PageHeader className="custom-class">
          <span>Content</span>
        </PageHeader>
      );
      
      const headerElement = container.firstChild as HTMLElement;
      expect(headerElement).toHaveClass('custom-class');
    });

    it('should combine default and custom classes', () => {
      const { container } = render(
        <PageHeader className="bg-primary rounded">
          <span>Content</span>
        </PageHeader>
      );
      
      const headerElement = container.firstChild as HTMLElement;
      expect(headerElement).toHaveClass('flex', 'items-center', 'gap-4', 'mb-6', 'bg-primary', 'rounded');
    });

    it('should render with empty className', () => {
      const { container } = render(
        <PageHeader className="">
          <span>Content</span>
        </PageHeader>
      );
      
      const headerElement = container.firstChild as HTMLElement;
      expect(headerElement).toHaveClass('flex', 'items-center', 'gap-4', 'mb-6');
    });
  });

  describe('PageHeader.Icon subcomponent', () => {
    it('should render icon children', () => {
      render(
        <PageHeader.Icon>
          <div data-testid="icon-content">Icon</div>
        </PageHeader.Icon>
      );
      
      expect(screen.getByTestId('icon-content')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
    });

    it('should apply default icon classes', () => {
      const { container } = render(
        <PageHeader.Icon>
          <span>Icon</span>
        </PageHeader.Icon>
      );
      
      const iconElement = container.firstChild as HTMLElement;
      expect(iconElement).toHaveClass('text-primary');
    });

    it('should apply custom className to icon', () => {
      const { container } = render(
        <PageHeader.Icon className="text-secondary">
          <span>Icon</span>
        </PageHeader.Icon>
      );
      
      const iconElement = container.firstChild as HTMLElement;
      expect(iconElement).toHaveClass('text-primary', 'text-secondary');
    });

    it('should render with empty icon className', () => {
      const { container } = render(
        <PageHeader.Icon className="">
          <span>Icon</span>
        </PageHeader.Icon>
      );
      
      const iconElement = container.firstChild as HTMLElement;
      expect(iconElement).toHaveClass('text-primary');
    });
  });

  describe('PageHeader.Title subcomponent', () => {
    it('should render title children', () => {
      render(
        <PageHeader.Title>Page Title</PageHeader.Title>
      );
      
      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });

    it('should render as h1 by default', () => {
      render(
        <PageHeader.Title>Default Title</PageHeader.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Default Title');
    });

    it('should render as h2 when specified', () => {
      render(
        <PageHeader.Title as="h2">H2 Title</PageHeader.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 2 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('H2 Title');
    });

    it('should render as h3 when specified', () => {
      render(
        <PageHeader.Title as="h3">H3 Title</PageHeader.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 3 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('H3 Title');
    });

    it('should apply default title classes', () => {
      render(
        <PageHeader.Title>Title</PageHeader.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toHaveClass('text-3xl', 'font-bold', 'text-base-content');
    });

    it('should apply custom className to title', () => {
      render(
        <PageHeader.Title className="text-primary">Custom Title</PageHeader.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toHaveClass('text-3xl', 'font-bold', 'text-base-content', 'text-primary');
    });

    it('should render with empty title className', () => {
      render(
        <PageHeader.Title className="">Title</PageHeader.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toHaveClass('text-3xl', 'font-bold', 'text-base-content');
    });
  });

  describe('component composition', () => {
    it('should render complete header with icon and title', () => {
      render(
        <PageHeader>
          <PageHeader.Icon>
            <div data-testid="test-icon">📊</div>
          </PageHeader.Icon>
          <PageHeader.Title>Analytics Dashboard</PageHeader.Title>
        </PageHeader>
      );
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Analytics Dashboard');
    });

    it('should render title only header', () => {
      render(
        <PageHeader>
          <PageHeader.Title>Simple Title</PageHeader.Title>
        </PageHeader>
      );
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Simple Title');
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });

    it('should render icon only header', () => {
      render(
        <PageHeader>
          <PageHeader.Icon>
            <div data-testid="lone-icon">⚙️</div>
          </PageHeader.Icon>
        </PageHeader>
      );
      
      expect(screen.getByTestId('lone-icon')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should render multiple children in correct order', () => {
      const { container } = render(
        <PageHeader>
          <PageHeader.Icon>
            <span data-testid="icon">Icon</span>
          </PageHeader.Icon>
          <PageHeader.Title>Title</PageHeader.Title>
          <div data-testid="extra">Extra Content</div>
        </PageHeader>
      );
      
      const children = Array.from(container.firstChild?.childNodes || []);
      expect(children).toHaveLength(3);
      
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByTestId('extra')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should maintain proper heading hierarchy', () => {
      render(
        <div>
          <PageHeader>
            <PageHeader.Title as="h1">Main Title</PageHeader.Title>
          </PageHeader>
          <PageHeader>
            <PageHeader.Title as="h2">Section Title</PageHeader.Title>
          </PageHeader>
          <PageHeader>
            <PageHeader.Title as="h3">Subsection Title</PageHeader.Title>
          </PageHeader>
        </div>
      );
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Title');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Subsection Title');
    });

    it('should be accessible to screen readers', () => {
      render(
        <PageHeader>
          <PageHeader.Icon>
            <span aria-label="Analytics icon">📊</span>
          </PageHeader.Icon>
          <PageHeader.Title>Dashboard</PageHeader.Title>
        </PageHeader>
      );
      
      expect(screen.getByLabelText('Analytics icon')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty content gracefully', () => {
      const { container } = render(
        <PageHeader>
        </PageHeader>
      );
      
      const headerElement = container.firstChild as HTMLElement;
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveClass('flex', 'items-center', 'gap-4', 'mb-6');
    });

    it('should handle null children', () => {
      const { container } = render(
        <PageHeader>
          {null}
          <PageHeader.Title>Title</PageHeader.Title>
          {undefined}
        </PageHeader>
      );
      
      expect(screen.getByRole('heading')).toHaveTextContent('Title');
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle complex nested content', () => {
      render(
        <PageHeader>
          <PageHeader.Icon>
            <div>
              <span>Complex</span>
              <span data-testid="nested">Nested</span>
            </div>
          </PageHeader.Icon>
          <PageHeader.Title>
            <span>Complex Title with </span>
            <strong data-testid="emphasis">emphasis</strong>
          </PageHeader.Title>
        </PageHeader>
      );
      
      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByTestId('emphasis')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines and should still maintain proper styling and accessibility';
      
      render(
        <PageHeader>
          <PageHeader.Title>{longTitle}</PageHeader.Title>
        </PageHeader>
      );
      
      const titleElement = screen.getByRole('heading');
      expect(titleElement).toHaveTextContent(longTitle);
      expect(titleElement).toHaveClass('text-3xl', 'font-bold', 'text-base-content');
    });

    it('should handle special characters in titles', () => {
      const specialTitle = 'Title with & special characters: @#$%^&*()';
      
      render(
        <PageHeader>
          <PageHeader.Title>{specialTitle}</PageHeader.Title>
        </PageHeader>
      );
      
      expect(screen.getByRole('heading')).toHaveTextContent(specialTitle);
    });
  });

  describe('subcomponent availability', () => {
    it('should expose Icon as a subcomponent', () => {
      expect(PageHeader.Icon).toBeDefined();
      expect(typeof PageHeader.Icon).toBe('function');
    });

    it('should expose Title as a subcomponent', () => {
      expect(PageHeader.Title).toBeDefined();
      expect(typeof PageHeader.Title).toBe('function');
    });

    it('should allow subcomponents to be used independently', () => {
      const { rerender } = render(
        <PageHeader.Icon>
          <span data-testid="standalone-icon">Icon</span>
        </PageHeader.Icon>
      );
      
      expect(screen.getByTestId('standalone-icon')).toBeInTheDocument();
      
      rerender(
        <PageHeader.Title>Standalone Title</PageHeader.Title>
      );
      
      expect(screen.getByRole('heading')).toHaveTextContent('Standalone Title');
    });
  });

  describe('styling customization', () => {
    it('should support complete style override', () => {
      const { container } = render(
        <PageHeader className="bg-red-500 p-8 rounded-full border-4">
          <PageHeader.Icon className="text-white bg-black p-2">
            <span>Icon</span>
          </PageHeader.Icon>
          <PageHeader.Title className="text-white underline italic">
            Styled Title
          </PageHeader.Title>
        </PageHeader>
      );
      
      const headerElement = container.firstChild as HTMLElement;
      expect(headerElement).toHaveClass('bg-red-500', 'p-8', 'rounded-full', 'border-4');
      
      const iconElement = container.querySelector('.text-primary');
      expect(iconElement).toHaveClass('text-white', 'bg-black', 'p-2');
      
      const titleElement = screen.getByRole('heading');
      expect(titleElement).toHaveClass('text-white', 'underline', 'italic');
    });
  });
});