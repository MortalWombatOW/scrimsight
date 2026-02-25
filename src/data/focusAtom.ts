import { atomWithStorage } from 'jotai/utils';

export type FocusMode = 'team' | 'player';

export interface FocusState {
  mode: FocusMode;
  teamName: string | null;
  playerName: string | null;
}

/**
 * Persisted focus state — controls which team/player the
 * journey pages (Pulse, Debrief, etc.) are scoped to.
 * null values mean "auto-detect" (most-played team).
 */
export const focusAtom = atomWithStorage<FocusState>('scrimsight-focus', {
  mode: 'team',
  teamName: null,
  playerName: null,
});
