import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageSection from './PageSection';

describe('PageSection', () => {
  describe('main component', () => {
    it('should render children inside section container', () => {
      render(
        <PageSection>
          <div data-testid="child-content">Test Content</div>
        </PageSection>
      );
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply default variant classes', () => {
      const { container } = render(
        <PageSection>
          <span>Content</span>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toHaveClass('space-y-4');
    });

    it('should apply card variant classes', () => {
      const { container } = render(
        <PageSection variant="card">
          <span>Content</span>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toHaveClass('bg-base-100', 'rounded-lg', 'p-6', 'space-y-4', 'shadow-lg');
    });

    it('should apply bordered variant classes', () => {
      const { container } = render(
        <PageSection variant="bordered">
          <span>Content</span>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toHaveClass('border', 'border-base-300', 'rounded-lg', 'p-6', 'space-y-4');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <PageSection className="custom-class">
          <span>Content</span>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toHaveClass('custom-class');
    });

    it('should combine variant and custom classes', () => {
      const { container } = render(
        <PageSection variant="card" className="bg-primary rounded-xl">
          <span>Content</span>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toHaveClass('bg-base-100', 'rounded-lg', 'p-6', 'space-y-4', 'shadow-lg', 'bg-primary', 'rounded-xl');
    });

    it('should render with empty className', () => {
      const { container } = render(
        <PageSection className="">
          <span>Content</span>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toHaveClass('space-y-4');
    });
  });

  describe('PageSection.Title subcomponent', () => {
    it('should render title children', () => {
      render(
        <PageSection.Title>Section Title</PageSection.Title>
      );
      
      expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    it('should render as h2 by default', () => {
      render(
        <PageSection.Title>Default Title</PageSection.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 2 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Default Title');
    });

    it('should render as h1 when specified', () => {
      render(
        <PageSection.Title as="h1">H1 Title</PageSection.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('H1 Title');
    });

    it('should render as h3 when specified', () => {
      render(
        <PageSection.Title as="h3">H3 Title</PageSection.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 3 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('H3 Title');
    });

    it('should render as h4 when specified', () => {
      render(
        <PageSection.Title as="h4">H4 Title</PageSection.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 4 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('H4 Title');
    });

    it('should apply default title classes', () => {
      render(
        <PageSection.Title>Title</PageSection.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 2 });
      expect(titleElement).toHaveClass('text-2xl', 'font-bold', 'text-base-content', 'flex', 'items-center', 'gap-3');
    });

    it('should apply custom className to title', () => {
      render(
        <PageSection.Title className="text-primary">Custom Title</PageSection.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 2 });
      expect(titleElement).toHaveClass('text-2xl', 'font-bold', 'text-base-content', 'flex', 'items-center', 'gap-3', 'text-primary');
    });

    it('should render with empty title className', () => {
      render(
        <PageSection.Title className="">Title</PageSection.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 2 });
      expect(titleElement).toHaveClass('text-2xl', 'font-bold', 'text-base-content', 'flex', 'items-center', 'gap-3');
    });

    it('should support complex content with icons', () => {
      render(
        <PageSection.Title>
          <span data-testid="icon">🔧</span>
          Settings Panel
        </PageSection.Title>
      );
      
      const titleElement = screen.getByRole('heading', { level: 2 });
      expect(titleElement).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('🔧Settings Panel');
    });
  });

  describe('PageSection.Description subcomponent', () => {
    it('should render description children', () => {
      render(
        <PageSection.Description>This is a description</PageSection.Description>
      );
      
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('should apply default description classes', () => {
      render(
        <PageSection.Description>Description text</PageSection.Description>
      );
      
      const descElement = screen.getByText('Description text');
      expect(descElement).toHaveClass('text-sm', 'text-base-content/70');
      expect(descElement.tagName).toBe('P');
    });

    it('should apply custom className to description', () => {
      render(
        <PageSection.Description className="text-primary">Custom Description</PageSection.Description>
      );
      
      const descElement = screen.getByText('Custom Description');
      expect(descElement).toHaveClass('text-sm', 'text-base-content/70', 'text-primary');
    });

    it('should render with empty description className', () => {
      render(
        <PageSection.Description className="">Description</PageSection.Description>
      );
      
      const descElement = screen.getByText('Description');
      expect(descElement).toHaveClass('text-sm', 'text-base-content/70');
    });

    it('should support long description text', () => {
      const longDescription = 'This is a very long description that might wrap to multiple lines and should maintain proper styling and readability across different screen sizes.';
      
      render(
        <PageSection.Description>{longDescription}</PageSection.Description>
      );
      
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });

  describe('PageSection.Content subcomponent', () => {
    it('should render content children', () => {
      render(
        <PageSection.Content>
          <div data-testid="content-item">Content Item</div>
        </PageSection.Content>
      );
      
      expect(screen.getByTestId('content-item')).toBeInTheDocument();
      expect(screen.getByText('Content Item')).toBeInTheDocument();
    });

    it('should apply default flex layout classes', () => {
      const { container } = render(
        <PageSection.Content>
          <span>Content</span>
        </PageSection.Content>
      );
      
      const contentElement = container.firstChild as HTMLElement;
      expect(contentElement).toHaveClass('flex', 'flex-wrap', 'gap-4');
    });

    it('should apply grid layout classes', () => {
      const { container } = render(
        <PageSection.Content layout="grid">
          <span>Content</span>
        </PageSection.Content>
      );
      
      const contentElement = container.firstChild as HTMLElement;
      expect(contentElement).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
    });

    it('should apply stack layout classes', () => {
      const { container } = render(
        <PageSection.Content layout="stack">
          <span>Content</span>
        </PageSection.Content>
      );
      
      const contentElement = container.firstChild as HTMLElement;
      expect(contentElement).toHaveClass('space-y-4');
    });

    it('should apply custom className to content', () => {
      const { container } = render(
        <PageSection.Content className="custom-content">
          <span>Content</span>
        </PageSection.Content>
      );
      
      const contentElement = container.firstChild as HTMLElement;
      expect(contentElement).toHaveClass('flex', 'flex-wrap', 'gap-4', 'custom-content');
    });

    it('should combine layout and custom classes', () => {
      const { container } = render(
        <PageSection.Content layout="grid" className="bg-base-200 p-4">
          <span>Content</span>
        </PageSection.Content>
      );
      
      const contentElement = container.firstChild as HTMLElement;
      expect(contentElement).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4', 'bg-base-200', 'p-4');
    });

    it('should render with empty content className', () => {
      const { container } = render(
        <PageSection.Content className="">
          <span>Content</span>
        </PageSection.Content>
      );
      
      const contentElement = container.firstChild as HTMLElement;
      expect(contentElement).toHaveClass('flex', 'flex-wrap', 'gap-4');
    });
  });

  describe('component composition', () => {
    it('should render complete section with all subcomponents', () => {
      render(
        <PageSection>
          <PageSection.Title>Complete Section</PageSection.Title>
          <PageSection.Description>This section has all components</PageSection.Description>
          <PageSection.Content>
            <div data-testid="content">Section content</div>
          </PageSection.Content>
        </PageSection>
      );
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Complete Section');
      expect(screen.getByText('This section has all components')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should render title only section', () => {
      render(
        <PageSection>
          <PageSection.Title>Title Only</PageSection.Title>
        </PageSection>
      );
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Title Only');
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
    });

    it('should render content only section', () => {
      render(
        <PageSection>
          <PageSection.Content>
            <div data-testid="standalone-content">Standalone content</div>
          </PageSection.Content>
        </PageSection>
      );
      
      expect(screen.getByTestId('standalone-content')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should render title and description without content', () => {
      render(
        <PageSection>
          <PageSection.Title>Title and Description</PageSection.Title>
          <PageSection.Description>Just these two components</PageSection.Description>
        </PageSection>
      );
      
      expect(screen.getByRole('heading')).toHaveTextContent('Title and Description');
      expect(screen.getByText('Just these two components')).toBeInTheDocument();
    });

    it('should render multiple content blocks', () => {
      render(
        <PageSection>
          <PageSection.Title>Multiple Content</PageSection.Title>
          <PageSection.Content layout="stack">
            <div data-testid="content-1">Content Block 1</div>
            <div data-testid="content-2">Content Block 2</div>
            <div data-testid="content-3">Content Block 3</div>
          </PageSection.Content>
        </PageSection>
      );
      
      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      expect(screen.getByTestId('content-2')).toBeInTheDocument();
      expect(screen.getByTestId('content-3')).toBeInTheDocument();
    });

    it('should maintain proper spacing between subcomponents', () => {
      const { container } = render(
        <PageSection>
          <PageSection.Title>Spaced Section</PageSection.Title>
          <PageSection.Description>Check spacing</PageSection.Description>
          <PageSection.Content>Content here</PageSection.Content>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toHaveClass('space-y-4');
    });
  });

  describe('accessibility', () => {
    it('should maintain proper heading hierarchy', () => {
      render(
        <div>
          <PageSection>
            <PageSection.Title as="h1">Main Section</PageSection.Title>
          </PageSection>
          <PageSection>
            <PageSection.Title as="h2">Subsection</PageSection.Title>
          </PageSection>
          <PageSection>
            <PageSection.Title as="h3">Sub-subsection</PageSection.Title>
          </PageSection>
          <PageSection>
            <PageSection.Title as="h4">Detail Section</PageSection.Title>
          </PageSection>
        </div>
      );
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Section');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Subsection');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Sub-subsection');
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Detail Section');
    });

    it('should be accessible to screen readers', () => {
      render(
        <PageSection>
          <PageSection.Title>Accessible Section</PageSection.Title>
          <PageSection.Description>This section is accessible</PageSection.Description>
          <PageSection.Content>
            <button aria-label="Action button">Click me</button>
          </PageSection.Content>
        </PageSection>
      );
      
      expect(screen.getByRole('heading', { name: 'Accessible Section' })).toBeInTheDocument();
      expect(screen.getByLabelText('Action button')).toBeInTheDocument();
    });

    it('should support semantic structure for accessibility', () => {
      render(
        <PageSection>
          <PageSection.Title>Section with Proper Structure</PageSection.Title>
          <PageSection.Description>This describes the section</PageSection.Description>
          <PageSection.Content>
            <button>Accessible action</button>
          </PageSection.Content>
        </PageSection>
      );
      
      // Verify proper semantic structure
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('Section with Proper Structure');
      
      const description = screen.getByText('This describes the section');
      expect(description.tagName).toBe('P');
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty content gracefully', () => {
      const { container } = render(
        <PageSection>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toBeInTheDocument();
      expect(sectionElement).toHaveClass('space-y-4');
    });

    it('should handle null children', () => {
      const { container } = render(
        <PageSection>
          {null}
          <PageSection.Title>Valid Title</PageSection.Title>
          {undefined}
        </PageSection>
      );
      
      expect(screen.getByRole('heading')).toHaveTextContent('Valid Title');
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle complex nested content', () => {
      render(
        <PageSection variant="card">
          <PageSection.Title>
            <span>Complex</span>
            <span data-testid="nested">Nested</span>
            <span>Title</span>
          </PageSection.Title>
          <PageSection.Description>
            Description with <strong data-testid="emphasis">emphasis</strong>
          </PageSection.Description>
          <PageSection.Content layout="grid">
            <div>
              <h4>Nested content</h4>
              <p data-testid="nested-para">Paragraph in content</p>
            </div>
          </PageSection.Content>
        </PageSection>
      );
      
      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByTestId('emphasis')).toBeInTheDocument();
      expect(screen.getByTestId('nested-para')).toBeInTheDocument();
    });

    it('should handle special characters in content', () => {
      const specialTitle = 'Title with & special characters: @#$%^&*()';
      const specialDescription = 'Description with <tags> and "quotes" & symbols';
      
      render(
        <PageSection>
          <PageSection.Title>{specialTitle}</PageSection.Title>
          <PageSection.Description>{specialDescription}</PageSection.Description>
        </PageSection>
      );
      
      expect(screen.getByRole('heading')).toHaveTextContent(specialTitle);
      expect(screen.getByText(specialDescription)).toBeInTheDocument();
    });
  });

  describe('subcomponent availability', () => {
    it('should expose Title as a subcomponent', () => {
      expect(PageSection.Title).toBeDefined();
      expect(typeof PageSection.Title).toBe('function');
    });

    it('should expose Description as a subcomponent', () => {
      expect(PageSection.Description).toBeDefined();
      expect(typeof PageSection.Description).toBe('function');
    });

    it('should expose Content as a subcomponent', () => {
      expect(PageSection.Content).toBeDefined();
      expect(typeof PageSection.Content).toBe('function');
    });

    it('should allow subcomponents to be used independently', () => {
      const { rerender } = render(
        <PageSection.Title>Standalone Title</PageSection.Title>
      );
      
      expect(screen.getByRole('heading')).toHaveTextContent('Standalone Title');
      
      rerender(
        <PageSection.Description>Standalone Description</PageSection.Description>
      );
      
      expect(screen.getByText('Standalone Description')).toBeInTheDocument();
      
      rerender(
        <PageSection.Content>
          <div data-testid="standalone">Standalone Content</div>
        </PageSection.Content>
      );
      
      expect(screen.getByTestId('standalone')).toBeInTheDocument();
    });
  });

  describe('variant and layout combinations', () => {
    it('should support all variant and layout combinations', () => {
      const variants: Array<'default' | 'card' | 'bordered'> = ['default', 'card', 'bordered'];
      const layouts: Array<'grid' | 'flex' | 'stack'> = ['grid', 'flex', 'stack'];
      
      variants.forEach(variant => {
        layouts.forEach(layout => {
          const { container, unmount } = render(
            <PageSection variant={variant} data-testid={`${variant}-section`}>
              <PageSection.Title>Test Section</PageSection.Title>
              <PageSection.Content layout={layout} data-testid={`${layout}-content`}>
                <div>Test content</div>
              </PageSection.Content>
            </PageSection>
          );
          
          expect(container.firstChild).toBeInTheDocument();
          
          unmount();
        });
      });
    });
  });

  describe('styling customization', () => {
    it('should support complete style override', () => {
      const { container } = render(
        <PageSection variant="card" className="bg-red-500 p-8 rounded-full border-4">
          <PageSection.Title className="text-white underline italic text-4xl">
            Styled Title
          </PageSection.Title>
          <PageSection.Description className="text-yellow-300 text-lg">
            Styled Description
          </PageSection.Description>
          <PageSection.Content layout="grid" className="bg-blue-200 p-4">
            <div>Styled Content</div>
          </PageSection.Content>
        </PageSection>
      );
      
      const sectionElement = container.firstChild as HTMLElement;
      expect(sectionElement).toHaveClass('bg-red-500', 'p-8', 'rounded-full', 'border-4');
      
      const titleElement = screen.getByRole('heading');
      expect(titleElement).toHaveClass('text-white', 'underline', 'italic', 'text-4xl');
      
      const descriptionElement = screen.getByText('Styled Description');
      expect(descriptionElement).toHaveClass('text-yellow-300', 'text-lg');
      
      const contentElement = container.querySelector('.bg-blue-200');
      expect(contentElement).toHaveClass('bg-blue-200', 'p-4');
    });
  });
});