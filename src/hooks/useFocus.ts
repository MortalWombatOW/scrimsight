import { useAtom } from 'jotai';
import { useMemo, useCallback } from 'react';
import { focusAtom, FocusMode } from '../data/focusAtom';
import { useMatches } from './useRepository';
import { useStats } from './useStats';

export interface AvailablePlayer {
  name: string;
  role: string;
  team: string;
}

export function useFocus() {
  const [focus, setFocus] = useAtom(focusAtom);
  const matches = useMatches();
  const allStats = useStats();

  const availableTeams = useMemo(() => {
    const teamSet = new Set<string>();
    for (const match of matches) {
      teamSet.add(match.metadata.team1Name);
      teamSet.add(match.metadata.team2Name);
    }
    return Array.from(teamSet).sort();
  }, [matches]);

  const availablePlayers = useMemo((): AvailablePlayer[] => {
    const playerMap = new Map<string, { role: string; teams: Set<string> }>();

    for (const stat of allStats) {
      if (!playerMap.has(stat.playerName)) {
        playerMap.set(stat.playerName, {
          role: stat.playerRole,
          teams: new Set([stat.playerTeam]),
        });
      } else {
        playerMap.get(stat.playerName)!.teams.add(stat.playerTeam);
      }
    }

    return Array.from(playerMap.entries())
      .map(([name, data]) => ({
        name,
        role: data.role,
        team: Array.from(data.teams).join(', '),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allStats]);

  // Auto-detect most-played team when no explicit selection
  const autoDetectedTeam = useMemo(() => {
    if (matches.length === 0) return null;
    const counts = new Map<string, number>();
    for (const m of matches) {
      counts.set(m.metadata.team1Name, (counts.get(m.metadata.team1Name) || 0) + 1);
      counts.set(m.metadata.team2Name, (counts.get(m.metadata.team2Name) || 0) + 1);
    }
    let best: string | null = null;
    let max = 0;
    for (const [team, count] of counts) {
      if (count > max) { max = count; best = team; }
    }
    return best;
  }, [matches]);

  // In player mode, resolve team from the selected player
  const playerTeam = useMemo(() => {
    if (focus.mode !== 'player' || !focus.playerName) return null;
    const player = availablePlayers.find(p => p.name === focus.playerName);
    // Take first team if player is on multiple
    return player?.team.split(', ')[0] ?? null;
  }, [focus.mode, focus.playerName, availablePlayers]);

  const effectiveTeamName = focus.mode === 'player'
    ? (playerTeam ?? focus.teamName ?? autoDetectedTeam)
    : (focus.teamName ?? autoDetectedTeam);

  const setMode = useCallback((mode: FocusMode) => {
    setFocus(prev => ({ ...prev, mode }));
  }, [setFocus]);

  const setTeam = useCallback((teamName: string | null) => {
    setFocus(prev => ({ ...prev, teamName }));
  }, [setFocus]);

  const setPlayer = useCallback((playerName: string | null) => {
    setFocus(prev => ({ ...prev, playerName, mode: 'player' as const }));
  }, [setFocus]);

  return {
    mode: focus.mode,
    teamName: focus.teamName,
    playerName: focus.playerName,
    effectiveTeamName,
    availableTeams,
    availablePlayers,
    setMode,
    setTeam,
    setPlayer,
    hasData: matches.length > 0,
  };
}
