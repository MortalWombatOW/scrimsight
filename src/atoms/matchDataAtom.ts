import { atom } from 'jotai';
import { matchExtractor } from '@atoms';
import { matchStart } from '@atoms';
import { matchEnd } from '@atoms';
import { playerStat } from '@atoms';
import { mapTimes } from '@atoms';
import { roundEnd } from '@atoms';
import { MatchStartLogEvent, MatchEndLogEvent, PlayerStatLogEvent, RoundEndLogEvent } from '@atoms';

export const matchDataFn = (
  matchInfo: MatchFileInfo[],
  matchStarts: MatchStartLogEvent[],
  matchEnds: MatchEndLogEvent[],
  playerStats: PlayerStatLogEvent[],
  allMapTimes: MapTimes[],
  roundEnds: RoundEndLogEvent[]
): MatchData[] => {
  return matchInfo.map(info => {
    const start = matchStarts.find(s => s.matchId === info.matchId);
    const end = matchEnds.find(e => e.matchId === info.matchId);
    const stats = playerStats.filter(s => s.matchId === info.matchId);
    const mapTime = allMapTimes.find(m => m.matchId === info.matchId);

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

    // Determine overall winner
    const team1Score = end?.team1Score ?? 0;
    const team2Score = end?.team2Score ?? 0;
    const team1Name = start?.team1Name ?? '';
    const team2Name = start?.team2Name ?? '';
    let winner: string | null = null;
    if (team1Score > team2Score) {
      winner = team1Name;
    } else if (team2Score > team1Score) {
      winner = team2Name;
    }

    return {
      matchId: info.matchId,
      fileName: info.name,
      fileModified: info.fileModified,
      dateString: info.dateString,
      map: start?.mapName ?? '',
      mode: start?.mapType ?? '',
      team1Name: start?.team1Name ?? '',
      team2Name: start?.team2Name ?? '',
      team1Score: team1Score, // Use calculated score
      team2Score: team2Score, // Use calculated score
      team1Players,
      team2Players,
      duration: mapTime?.duration ?? 0,
      roundWinners,
      winner, // Added winner
    };
  });
};

export interface MapTimes {
  matchId: string;
  duration: number;
  startTime: number;
  endTime: number;
}

/**
 * Interface for combined match data
 */
export interface MatchFileInfo {
  matchId: string;
  name: string;
  fileModified: number;
  dateString: string;
}

/**
 * Pure function that combines match information from various sources
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
  winner: string | null; // Added: team1Name, team2Name, or null for draw
}

/**
 * Atom that combines match information from various sources
 */
export default atom(async (get): Promise<MatchData[]> => {
  const matchInfo = await get(matchExtractor.atom);
  const matchStarts = await get(matchStart.atom);
  const matchEnds = await get(matchEnd.atom);
  const playerStats = await get(playerStat.atom);
  const mapTimesData = await get(mapTimes.atom);
  const roundEndsData = await get(roundEnd.atom);

  return matchDataFn(matchInfo, matchStarts, matchEnds, playerStats, mapTimesData, roundEndsData);
});
