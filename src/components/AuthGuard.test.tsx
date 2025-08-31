import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { AuthGuard } from './AuthGuard';

// Mock react-oidc-context
const mockAuth = {
  isAuthenticated: false,
  isLoading: false,
  user: null as unknown,
  signinRedirect: vi.fn(),
  signoutRedirect: vi.fn(),
};

vi.mock('react-oidc-context', () => ({
  useAuth: () => mockAuth,
}));

// Mock useScrimsightNavigation 
const mockNavigate = vi.fn();

vi.mock('../hooks/useScrimsightNavigation', () => ({
  useScrimsightNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock console methods to capture logs during tests
let consoleSpy: {
  log: ReturnType<typeof vi.spyOn>;
  warn: ReturnType<typeof vi.spyOn>;
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

// Test content component
const TestContent = () => (
  <div data-testid="protected-content">This is protected content</div>
);

describe('AuthGuard', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    mockAuth.isAuthenticated = false;
    mockAuth.isLoading = false;
    mockAuth.user = null;
    
    // Set up console spies
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;
      mockAuth.user = { sub: '123', name: 'Test User' };
    });

    it('should render children when user is authenticated', () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('This is protected content')).toBeInTheDocument();
    });

    it('should not redirect when user is authenticated', () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should log authentication status', () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard mounted, checking authentication status');
      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard authentication status is', true);
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should render complex nested children content', () => {
      const ComplexContent = () => (
        <div data-testid="complex-content">
          <h1>Dashboard</h1>
          <div>
            <button>Action Button</button>
            <p>Complex nested content</p>
          </div>
        </div>
      );

      render(
        <TestWrapper>
          <AuthGuard>
            <ComplexContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(screen.getByTestId('complex-content')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
      expect(screen.getByText('Complex nested content')).toBeInTheDocument();
    });
  });

  describe('when authentication is loading', () => {
    beforeEach(() => {
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = true;
      mockAuth.user = null;
    });

    it('should show loading spinner when authentication is loading', () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      const loadingSpinner = document.querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
      expect(loadingSpinner).toHaveClass(
        'animate-spin',
        'rounded-full',
        'h-10',
        'w-10',
        'border-t-2',
        'border-b-2',
        'border-primary-500'
      );
    });

    it('should center loading spinner on screen', () => {
      const { container } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      const loadingContainer = container.querySelector('.flex.items-center.justify-center.h-screen');
      expect(loadingContainer).toBeInTheDocument();
      expect(loadingContainer).toHaveClass('flex', 'items-center', 'justify-center', 'h-screen');
    });

    it('should not render children when loading', () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should not redirect when loading', () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should log authentication status when loading', () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard mounted, checking authentication status');
      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard authentication status is', false);
      expect(consoleSpy.warn).not.toHaveBeenCalled(); // Should not warn during loading
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = false;
      mockAuth.user = null;
    });

    it('should render nothing when user is not authenticated', () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      // The AuthGuard returns null when not authenticated, so the body should be empty
      expect(document.body.textContent).toBe('');
    });

    it('should redirect to login when user is not authenticated', async () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should log warning when redirecting unauthenticated user', async () => {
      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard mounted, checking authentication status');
        expect(consoleSpy.warn).toHaveBeenCalledWith('User is not authenticated, redirecting to login');
        expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard authentication status is', false);
      });
    });

    it('should redirect only once even with multiple re-renders', async () => {
      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      // Trigger re-render
      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      // Should still be called only once despite re-render
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('authentication state transitions', () => {
    it('should transition from loading to authenticated', async () => {
      // Start with loading state
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = true;

      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

      // Transition to authenticated
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;
      mockAuth.user = { sub: '123', name: 'Test User' };

      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should transition from loading to unauthenticated', async () => {
      // Start with loading state
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = true;

      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();

      // Transition to unauthenticated
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = false;

      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should transition from authenticated to unauthenticated', async () => {
      // Start with authenticated state
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;
      mockAuth.user = { sub: '123', name: 'Test User' };

      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();

      // Transition to unauthenticated (e.g., session expired)
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = false;
      mockAuth.user = null;

      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('useEffect dependencies', () => {
    it('should re-run effect when authentication status changes', async () => {
      // Start unauthenticated
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = false;

      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      // Clear the mock to test the next call
      mockNavigate.mockClear();
      consoleSpy.log.mockClear();
      consoleSpy.warn.mockClear();

      // Change to authenticated
      mockAuth.isAuthenticated = true;

      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      // Effect should run again due to dependency change
      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard mounted, checking authentication status');
      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard authentication status is', true);
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled(); // Should not redirect when authenticated
    });

    it('should re-run effect when loading status changes', () => {
      // Start loading
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = true;

      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard mounted, checking authentication status');
      expect(mockNavigate).not.toHaveBeenCalled();

      // Clear the mock to test the next call
      consoleSpy.log.mockClear();

      // Stop loading
      mockAuth.isLoading = false;

      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      // Effect should run again due to dependency change
      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard mounted, checking authentication status');
    });
  });

  describe('edge cases', () => {
    it('should handle null children gracefully', () => {
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;

      render(
        <TestWrapper>
          <AuthGuard>{null}</AuthGuard>
        </TestWrapper>
      );

      // Should not crash and not render anything
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should handle undefined children gracefully', () => {
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;

      render(
        <TestWrapper>
          <AuthGuard>{undefined}</AuthGuard>
        </TestWrapper>
      );

      // Should not crash and not render anything
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should handle empty fragment children', () => {
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;

      render(
        <TestWrapper>
          <AuthGuard>
            <></>
          </AuthGuard>
        </TestWrapper>
      );

      // Should not crash
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should handle multiple children elements', () => {
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;

      render(
        <TestWrapper>
          <AuthGuard>
            <div data-testid="child-1">First child</div>
            <div data-testid="child-2">Second child</div>
          </AuthGuard>
        </TestWrapper>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should handle string children', () => {
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;

      render(
        <TestWrapper>
          <AuthGuard>Plain text content</AuthGuard>
        </TestWrapper>
      );

      expect(screen.getByText('Plain text content')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should provide appropriate loading indicator', () => {
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = true;

      render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      const loadingIndicator = document.querySelector('.animate-spin');
      expect(loadingIndicator).toBeInTheDocument();
      expect(loadingIndicator).toHaveAttribute('class', expect.stringContaining('animate-spin'));
    });

    it('should not interfere with child component accessibility', () => {
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;

      const AccessibleContent = () => (
        <main>
          <h1>Dashboard</h1>
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="/home">Home</a></li>
            </ul>
          </nav>
          <button aria-describedby="help-text">Action</button>
          <div id="help-text">This button performs an action</div>
        </main>
      );

      render(
        <TestWrapper>
          <AuthGuard>
            <AccessibleContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
      expect(screen.getByText('This button performs an action')).toBeInTheDocument();
    });
  });

  describe('console logging behavior', () => {
    it('should log consistently across different authentication states', () => {
      // Test authenticated state
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;

      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard mounted, checking authentication status');
      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard authentication status is', true);

      consoleSpy.log.mockClear();

      // Test unauthenticated state
      mockAuth.isAuthenticated = false;

      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard mounted, checking authentication status');
      expect(consoleSpy.log).toHaveBeenCalledWith('AuthGuard authentication status is', false);
    });

    it('should warn only when redirecting unauthenticated users', () => {
      // Loading state should not warn
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = true;

      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(consoleSpy.warn).not.toHaveBeenCalled();

      // Authenticated state should not warn
      mockAuth.isAuthenticated = true;
      mockAuth.isLoading = false;

      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(consoleSpy.warn).not.toHaveBeenCalled();

      // Only unauthenticated + not loading should warn
      mockAuth.isAuthenticated = false;
      mockAuth.isLoading = false;

      rerender(
        <TestWrapper>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </TestWrapper>
      );

      expect(consoleSpy.warn).toHaveBeenCalledWith('User is not authenticated, redirecting to login');
    });
  });
});