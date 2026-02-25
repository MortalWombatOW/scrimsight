import { useMemo } from 'react';
import { useMatches } from './useRepository';
import { calculateUltMetrics, computeRoleDistributions, PlayerUltMetrics, RoleUltSummary } from '../domain/economy';

export interface UltCyclesResult {
  playerMetrics: PlayerUltMetrics[];
  roleDistributions: RoleUltSummary[];
  totalCycles: number;
  hasData: boolean;
}

const EMPTY_RESULT: UltCyclesResult = {
  playerMetrics: [],
  roleDistributions: [],
  totalCycles: 0,
  hasData: false,
};

export function useUltCycles(): UltCyclesResult {
  const matches = useMatches();

  return useMemo(() => {
    if (matches.length === 0) return EMPTY_RESULT;

    const allCycles = matches.flatMap(match => match.ultCycles);
    const playerMetrics = calculateUltMetrics(allCycles);
    const roleDistributions = computeRoleDistributions(allCycles);

    return {
      playerMetrics,
      roleDistributions,
      totalCycles: allCycles.length,
      hasData: allCycles.length > 0,
    };
  }, [matches]);
}
