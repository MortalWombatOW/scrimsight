import { atom } from 'jotai';
import { matchExtractorAtom } from './event_extractors/matchExtractorAtom';
import { matchStartExtractorAtom } from './event_extractors/matchStartExtractorAtom';
import { matchEndExtractorAtom } from './event_extractors/matchEndExtractorAtom';
import { playerStatExtractorAtom } from './event_extractors/playerStatExtractorAtom';
import { mapTimesAtom } from './mapTimesAtom';
import { roundEndExtractorAtom } from './event_extractors/roundEndExtractorAtom';
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
  duration: number;
  roundWinners: ('team1' | 'team2' | 'draw')[];
}

/**
 * Atom that combines match information from various sources
 */
export const matchDataAtom = atom(async (get): Promise<MatchData[]> => {
  const matchInfo = await get(matchExtractorAtom);
  const matchStarts = await get(matchStartExtractorAtom);
  const matchEnds = await get(matchEndExtractorAtom);
  const playerStats = await get(playerStatExtractorAtom);
  const mapTimes = await get(mapTimesAtom);
  const roundEnds = await get(roundEndExtractorAtom);

  return matchInfo.map(info => {
    const start = matchStarts.find(s => s.matchId === info.matchId);
    const end = matchEnds.find(e => e.matchId === info.matchId);
    const stats = playerStats.filter(s => s.matchId === info.matchId);
    const mapTime = mapTimes.find(m => m.matchId === info.matchId);

    // Get unique players for each team
    const team1Players = Array.from(new Set(
      stats.filter(s => s.playerTeam === start?.team1Name)
        .map(s => s.playerName)
    ))
    const team2Players = Array.from(new Set(
      stats.filter(s => s.playerTeam === start?.team2Name)
        .map(s => s.playerName)
    ));

    const roundWinners = roundEnds.filter(r => r.matchId === info.matchId).sort((a, b) => a.roundNumber - b.roundNumber).map(r => r.team1Score > r.team2Score ? 'team1' : r.team1Score < r.team2Score ? 'team2' : 'draw');

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
      duration: mapTime?.duration ?? 0,
      roundWinners,
    };
  });
}); 