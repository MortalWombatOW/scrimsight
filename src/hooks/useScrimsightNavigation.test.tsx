// eslint-disable-next-line project-structure/folder-structure
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useScrimsightNavigation } from './useScrimsightNavigation';
import { getRoute } from '../lib/route';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock getRoute function
vi.mock('../lib/route', () => ({
  getRoute: vi.fn((path: string) => `/demo${path}`),
}));

describe('useScrimsightNavigation', () => {
  const mockGetRoute = vi.mocked(getRoute);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (initialEntries = ['/demo']) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    );
    return renderHook(() => useScrimsightNavigation(), { wrapper });
  };

  describe('absolute path navigation', () => {
    it('should navigate to root path without using getRoute', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/');
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockGetRoute).not.toHaveBeenCalled();
    });

    it('should navigate to callback page without using getRoute', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/callback');
      
      expect(mockNavigate).toHaveBeenCalledWith('/callback');
      expect(mockGetRoute).not.toHaveBeenCalled();
    });

    it('should navigate to demo base path without using getRoute', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/demo');
      
      expect(mockNavigate).toHaveBeenCalledWith('/demo');
      expect(mockGetRoute).not.toHaveBeenCalled();
    });

    it('should navigate to app base path without using getRoute', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/app');
      
      expect(mockNavigate).toHaveBeenCalledWith('/app');
      expect(mockGetRoute).not.toHaveBeenCalled();
    });
  });

  describe('app sub-path navigation', () => {
    it('should use getRoute for scrims page', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/scrims');
      
      expect(mockGetRoute).toHaveBeenCalledWith('/scrims');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/scrims');
    });

    it('should use getRoute for matches page', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/matches');
      
      expect(mockGetRoute).toHaveBeenCalledWith('/matches');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/matches');
    });

    it('should use getRoute for players page', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/players');
      
      expect(mockGetRoute).toHaveBeenCalledWith('/players');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/players');
    });

    it('should use getRoute for teams page', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/teams');
      
      expect(mockGetRoute).toHaveBeenCalledWith('/teams');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/teams');
    });

    it('should use getRoute for settings page', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/settings');
      
      expect(mockGetRoute).toHaveBeenCalledWith('/settings');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/settings');
    });
  });

  describe('parameterized route navigation', () => {
    it('should navigate to player details with parameters', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/player/:playerName', { playerName: 'testPlayer' });
      
      expect(mockGetRoute).toHaveBeenCalledWith('/player/testPlayer');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/player/testPlayer');
    });

    it('should navigate to scrim details with parameters', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/scrim/:scrimId', { scrimId: 'scrim-123' });
      
      expect(mockGetRoute).toHaveBeenCalledWith('/scrim/scrim-123');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/scrim/scrim-123');
    });

    it('should navigate to match details with parameters', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/match/:matchId', { matchId: 'match-456' });
      
      expect(mockGetRoute).toHaveBeenCalledWith('/match/match-456');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/match/match-456');
    });

    it('should navigate to team details with parameters', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/team/:teamName', { teamName: 'Team Alpha' });
      
      expect(mockGetRoute).toHaveBeenCalledWith('/team/Team Alpha');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/team/Team Alpha');
    });

    it('should handle URL encoding for team names with special characters', () => {
      const { result } = renderWithRouter();
      
      result.current.navigate('/team/:teamName', { teamName: 'Team Alpha & Beta' });
      
      expect(mockGetRoute).toHaveBeenCalledWith('/team/Team Alpha & Beta');
      expect(mockNavigate).toHaveBeenCalledWith('/demo/team/Team Alpha & Beta');
    });
  });

  describe('error handling', () => {
    it('should throw error for missing required parameters', () => {
      const { result } = renderWithRouter();
      
      expect(() => {
        // @ts-expect-error - Testing runtime error for missing parameters
        result.current.navigate('/player/:playerName');
      }).toThrow('Missing parameter: playerName');
    });

    it('should throw error for missing multiple parameters', () => {
      const { result } = renderWithRouter();
      
      expect(() => {
        // @ts-expect-error - Testing runtime error for missing parameters
        result.current.navigate('/player/:playerName', { wrongParam: 'value' });
      }).toThrow('Missing parameter: playerName');
    });

    it('should throw error for extra parameters on static routes', () => {
      const { result } = renderWithRouter();
      
      expect(() => {
        // @ts-expect-error - Testing runtime error for extra parameters
        result.current.navigate('/scrims', { unexpectedParam: 'value' });
      }).toThrow('Unexpected parameters provided for route: /scrims');
    });

    it('should throw error for extra parameters on parameterized routes', () => {
      const { result } = renderWithRouter();
      
      expect(() => {
        result.current.navigate('/player/:playerName', { 
          playerName: 'test', 
          extraParam: 'value' 
        } as { playerName: string });
      }).toThrow('Unexpected parameters provided for route: /player/:playerName');
    });

    it('should throw error for invalid route', () => {
      const { result } = renderWithRouter();
      
      expect(() => {
        // @ts-expect-error - Testing runtime error for invalid route
        result.current.navigate('/invalid-route');
      }).toThrow('Invalid route: /invalid-route');
    });

    it('should throw error for parameters on absolute routes', () => {
      const { result } = renderWithRouter();
      
      expect(() => {
        // @ts-expect-error - Testing runtime error for parameters on absolute routes
        result.current.navigate('/', { unexpectedParam: 'value' });
      }).toThrow('Unexpected parameters provided for route: /');
    });
  });
});