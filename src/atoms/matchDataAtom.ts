import { atom } from 'jotai';
import { matchExtractorAtom } from './matchExtractorAtom';
import { matchStartExtractorAtom } from './matchStartExtractorAtom';
import { matchEndExtractorAtom } from './matchEndExtractorAtom';
import { playerStatExtractorAtom } from './playerStatExtractorAtom';

/**
 * Interface for combined match data
 */
export interface MatchData {
  matchId: string;
  fileName: string;
  fileModified: number;
  dateString: string;
  map: string;
  mode: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  team1Players: string[];
  team2Players: string[];
}

/**
 * Atom that combines match information from various sources
 */
export const matchDataAtom = atom(async (get): Promise<MatchData[]> => {
  const matchInfo = await get(matchExtractorAtom);
  const matchStarts = await get(matchStartExtractorAtom);
  const matchEnds = await get(matchEndExtractorAtom);
  const playerStats = await get(playerStatExtractorAtom);

  return matchInfo.map(info => {
    const start = matchStarts.find(s => s.matchId === info.matchId);
    const end = matchEnds.find(e => e.matchId === info.matchId);
    const stats = playerStats.filter(s => s.matchId === info.matchId);

    // Get unique players for each team
    const team1Players = Array.from(new Set(
      stats.filter(s => s.playerTeam === start?.team1Name)
        .map(s => s.playerName)
    ));
    const team2Players = Array.from(new Set(
      stats.filter(s => s.playerTeam === start?.team2Name)
        .map(s => s.playerName)
    ));

    return {
      matchId: info.matchId,
      fileName: info.name,
      fileModified: info.fileModified,
      dateString: info.dateString,
      map: start?.mapName ?? '',
      mode: start?.mapType ?? '',
      team1Name: start?.team1Name ?? '',
      team2Name: start?.team2Name ?? '',
      team1Score: end?.team1Score ?? 0,
      team2Score: end?.team2Score ?? 0,
      team1Players,
      team2Players,
    };
  });
}); 