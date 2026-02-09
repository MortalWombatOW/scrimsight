import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { hydrateFromDbAction, isHydratedAtom } from '../data/repository';

export function useHydration(): boolean {
  const hydrate = useSetAtom(hydrateFromDbAction);
  const isHydrated = useAtomValue(isHydratedAtom);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return isHydrated;
}
