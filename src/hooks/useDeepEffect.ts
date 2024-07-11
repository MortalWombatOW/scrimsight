import {useEffect, useRef} from 'react';

function arrayDeepEquals<T extends unknown[]>(a: T, b: T): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!deepEquals(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

function objectDeepEquals<T extends object>(a: T, b: T): boolean {
  if (a === null || b === null) {
    return a === b;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (!deepEquals(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

function deepEquals<T>(a: T, b: T): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return arrayDeepEquals(a as T[], b as T[]);
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return objectDeepEquals(a as object, b as object);
  }

  return a === b;
}

export function useDeepEffect(setup: () => void, deps: unknown[]): void {
  const prevDeps = useRef<unknown[]>();

  useEffect(() => {
    if (!deepEquals(prevDeps.current, deps)) {
      console.log('useDeepEffect', deps);
      setup();
      prevDeps.current = deps;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
}

export function useDeepMemo<T>(factory: () => T, deps: unknown[]): T {
  const prevDeps = useRef<unknown[]>([]);
  const prevValue = useRef<T>();

  if (prevValue.current === undefined || !deepEquals(prevDeps.current, deps)) {
    prevValue.current = factory();
    prevDeps.current = deps;
  }

  return prevValue.current;
}
