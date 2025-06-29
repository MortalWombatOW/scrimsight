import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import BreadCrumbs from './BreadCrumbs';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

// Mock icons for testing
const MockHomeIcon = () => <span data-testid="home-icon">🏠</span>;
const MockSettingsIcon = () => <span data-testid="settings-icon">⚙️</span>;
const MockUserIcon = () => <span data-testid="user-icon">👤</span>;

describe('BreadCrumbs', () => {
  describe('accessibility and structure', () => {
    it('should render with proper semantic navigation structure', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Current Page' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('should apply default and custom CSS classes', () => {
      const items = [{ label: 'Home', path: '/' }, { label: 'Current' }];

      const { container } = renderWithRouter(<BreadCrumbs items={items} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('breadcrumbs');
    });

    it('should apply custom className when provided', () => {
      const items = [{ label: 'Home', path: '/' }, { label: 'Current' }];

      const { container } = renderWithRouter(
        <BreadCrumbs items={items} className="custom-breadcrumb-class" />
      );
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('breadcrumbs', 'custom-breadcrumb-class');
    });

    it('should handle empty className gracefully', () => {
      const items = [{ label: 'Home', path: '/' }, { label: 'Current' }];

      const { container } = renderWithRouter(
        <BreadCrumbs items={items} className="" />
      );
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('breadcrumbs');
    });
  });

  describe('link behavior for navigable items', () => {
    it('should render non-last items with paths as clickable links', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Settings', path: '/settings' },
        { label: 'Current Page' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');

      const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');

      const settingsLink = screen.getByRole('link', { name: 'Settings' });
      expect(settingsLink).toBeInTheDocument();
      expect(settingsLink).toHaveAttribute('href', '/settings');

      // Current page should not be a link
      const currentPage = screen.getByText('Current Page');
      expect(currentPage).toBeInTheDocument();
      expect(currentPage.closest('a')).toBeNull();
    });

    it('should apply correct CSS classes to link elements', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Current Page' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('link', 'link-hover', 'flex', 'items-center', 'gap-1');
    });

    it('should handle complex paths correctly', () => {
      const items = [
        { label: 'Dashboard', path: '/dashboard/analytics' },
        { label: 'Reports', path: '/dashboard/analytics/reports' },
        { label: 'Monthly Report', path: '/dashboard/analytics/reports/monthly' },
        { label: 'Current Report' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
      expect(dashboardLink).toHaveAttribute('href', '/dashboard/analytics');

      const reportsLink = screen.getByRole('link', { name: 'Reports' });
      expect(reportsLink).toHaveAttribute('href', '/dashboard/analytics/reports');

      const monthlyLink = screen.getByRole('link', { name: 'Monthly Report' });
      expect(monthlyLink).toHaveAttribute('href', '/dashboard/analytics/reports/monthly');
    });
  });

  describe('current page display', () => {
    it('should render last item as non-clickable text with proper styling', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Current Page' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const currentPageElement = screen.getByText('Current Page');
      expect(currentPageElement).toBeInTheDocument();
      expect(currentPageElement.closest('a')).toBeNull();
      expect(currentPageElement).toHaveClass('flex', 'items-center', 'gap-1', 'text-base-content/70');
    });

    it('should treat item without path as current page even if not last', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Middle Page' }, // No path
        { label: 'Last Page', path: '/last' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toBeInTheDocument();

      const middlePage = screen.getByText('Middle Page');
      expect(middlePage.closest('a')).toBeNull();

      // Last page should also not be a link because it's the last item
      const lastPage = screen.getByText('Last Page');
      expect(lastPage.closest('a')).toBeNull();
    });

    it('should not render last item as link even if it has a path', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Current Page', path: '/current' }, // Has path but is last
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toBeInTheDocument();

      const currentPage = screen.getByText('Current Page');
      expect(currentPage).toBeInTheDocument();
      expect(currentPage.closest('a')).toBeNull();
    });
  });

  describe('icon rendering', () => {
    it('should render icons when provided for linked items', () => {
      const items = [
        { label: 'Home', path: '/', icon: <MockHomeIcon /> },
        { label: 'Settings', path: '/settings', icon: <MockSettingsIcon /> },
        { label: 'Current Page' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();

      // Icons should be within the link elements
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toContainElement(screen.getByTestId('home-icon'));

      const settingsLink = screen.getByRole('link', { name: /settings/i });
      expect(settingsLink).toContainElement(screen.getByTestId('settings-icon'));
    });

    it('should render icons for current page items', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Profile', icon: <MockUserIcon /> },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      expect(screen.getByTestId('user-icon')).toBeInTheDocument();

      const profileText = screen.getByText('Profile');
      expect(profileText.parentElement).toContainElement(screen.getByTestId('user-icon'));
    });

    it('should apply correct styling to icon containers', () => {
      const items = [
        { label: 'Home', path: '/', icon: <MockHomeIcon /> },
        { label: 'Current', icon: <MockUserIcon /> },
      ];

      const { container } = renderWithRouter(<BreadCrumbs items={items} />);

      const iconContainers = container.querySelectorAll('.text-sm');
      expect(iconContainers).toHaveLength(2);
      iconContainers.forEach(container => {
        expect(container).toHaveClass('text-sm');
      });
    });

    it('should handle items without icons gracefully', () => {
      const items = [
        { label: 'Home', path: '/', icon: <MockHomeIcon /> },
        { label: 'Page Without Icon', path: '/no-icon' },
        { label: 'Current Page' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('Page Without Icon')).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();

      // Only one icon should be present
      expect(screen.getAllByTestId(/.*-icon/)).toHaveLength(1);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle single item breadcrumb', () => {
      const items = [{ label: 'Single Page' }];

      renderWithRouter(<BreadCrumbs items={items} />);

      expect(screen.getByText('Single Page')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
    });

    it('should handle single item breadcrumb with path', () => {
      const items = [{ label: 'Single Page', path: '/single' }];

      renderWithRouter(<BreadCrumbs items={items} />);

      // Should be rendered as text since it's the last (and only) item
      const singlePage = screen.getByText('Single Page');
      expect(singlePage).toBeInTheDocument();
      expect(singlePage.closest('a')).toBeNull();
    });

    it('should handle empty items array gracefully', () => {
      renderWithRouter(<BreadCrumbs items={[]} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list).toBeEmptyDOMElement();
    });

    it('should handle items with empty labels', () => {
      const items = [
        { label: '', path: '/' },
        { label: 'Valid Page', path: '/valid' },
        { label: '' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      expect(screen.getByText('Valid Page')).toBeInTheDocument();
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('should handle special characters in labels and paths', () => {
      const items = [
        { label: 'Home & Garden', path: '/home&garden' },
        { label: 'Products/Categories', path: '/products/categories' },
        { label: 'Current: Special "Page"' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const homeLink = screen.getByRole('link', { name: 'Home & Garden' });
      expect(homeLink).toHaveAttribute('href', '/home&garden');

      const productsLink = screen.getByRole('link', { name: 'Products/Categories' });
      expect(productsLink).toHaveAttribute('href', '/products/categories');

      expect(screen.getByText('Current: Special "Page"')).toBeInTheDocument();
    });

    it('should handle very long breadcrumb trails', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        label: `Level ${i + 1}`,
        path: i < 9 ? `/level${i + 1}` : undefined,
      }));

      renderWithRouter(<BreadCrumbs items={items} />);

      // Should render all 10 items
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(10);

      // First 9 should be links
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(9);

      // Last should be text
      const lastItem = screen.getByText('Level 10');
      expect(lastItem.closest('a')).toBeNull();
    });

    it('should handle undefined or null className', () => {
      const items = [{ label: 'Home', path: '/' }, { label: 'Current' }];

      const { container } = renderWithRouter(
        <BreadCrumbs items={items} className={undefined} />
      );
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('breadcrumbs');
    });
  });

  describe('story scenarios', () => {
    it('should render basic breadcrumb scenario correctly', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Current Page' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
      expect(screen.getByText('Current Page')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Current Page' })).not.toBeInTheDocument();
    });

    it('should render two levels breadcrumb correctly', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Current Page' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('should render game analytics scenario correctly', () => {
      const items = [
        { label: 'Home', path: '/' },
        { label: 'Games', path: '/games' },
        { label: 'Match Analysis', path: '/games/analysis' },
        { label: 'Player Performance' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Games' })).toHaveAttribute('href', '/games');
      expect(screen.getByRole('link', { name: 'Match Analysis' })).toHaveAttribute('href', '/games/analysis');
      expect(screen.getByText('Player Performance')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Player Performance' })).not.toBeInTheDocument();
    });

    it('should render with custom styling from stories', () => {
      const items = [
        { label: 'Home', path: '/', icon: <MockHomeIcon /> },
        { label: 'Settings', path: '/settings', icon: <MockSettingsIcon /> },
        { label: 'Advanced Settings', icon: <MockSettingsIcon /> },
      ];

      const { container } = renderWithRouter(
        <BreadCrumbs items={items} className="text-sm" />
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('breadcrumbs', 'text-sm');
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('settings-icon')).toHaveLength(2);
    });
  });

  describe('component integration', () => {
    it('should work correctly within router context', () => {
      const items = [
        { label: 'Products', path: '/products' },
        { label: 'Electronics', path: '/products/electronics' },
        { label: 'Smartphones' },
      ];

      // Test with different initial route
      render(
        <MemoryRouter initialEntries={['/products/electronics/smartphones']}>
          <BreadCrumbs items={items} />
        </MemoryRouter>
      );

      const productsLink = screen.getByRole('link', { name: 'Products' });
      expect(productsLink).toHaveAttribute('href', '/products');

      const electronicsLink = screen.getByRole('link', { name: 'Electronics' });
      expect(electronicsLink).toHaveAttribute('href', '/products/electronics');

      const smartphonesText = screen.getByText('Smartphones');
      expect(smartphonesText.closest('a')).toBeNull();
    });

    it('should maintain correct aria relationships for screen readers', () => {
      const items = [
        { label: 'Section 1', path: '/section1' },
        { label: 'Section 2', path: '/section2' },
        { label: 'Current Section' },
      ];

      renderWithRouter(<BreadCrumbs items={items} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);

      // Links should be focusable for keyboard navigation
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeVisible();
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });
});