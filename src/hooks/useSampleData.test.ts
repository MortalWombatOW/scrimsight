import { renderHook, act } from '@testing-library/react';
import { useSampleData } from './useSampleData';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useSampleData', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should be disabled by default', () => {
    const { result } = renderHook(() => useSampleData());
    expect(result.current.enabled).toBe(false);
  });

  it('should not persist enabled state', () => {
    const { result } = renderHook(() => useSampleData());
    
    // Enable it
    act(() => {
      result.current.enable();
    });
    expect(result.current.enabled).toBe(true);
    
    // Check localStorage (should NOT be set if we disable persistence)
    // Note: In the current implementation it IS set, so this test will fail until we fix it.
    // We expect this to be null after the fix.
    // For reproduction, we can assert that it IS set currently, or just assert the desired behavior and let it fail.
    // I'll assert the desired behavior (that it shouldn't persist).
    expect(localStorage.getItem('sampleDataEnabled')).toBeNull();
  });
});
