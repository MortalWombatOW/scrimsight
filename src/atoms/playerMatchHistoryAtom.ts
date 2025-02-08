import { atom } from 'jotai';
import { playerStatExtractorAtom } from './event_extractors/playerStatExtractorAtom';
import { matchStartExtractorAtom } from './event_extractors/matchStartExtractorAtom';
import { matchEndExtractorAtom } from './event_extractors/matchEndExtractorAtom';
import { matchExtractorAtom } from './event_extractors/matchExtractorAtom';

export interface PlayerMatch {
  matchId: string;
  matchTime: number;   // for sorting purposes (from match start event)
  date: string;
  time: string;
  mapName: string;
  mapType: string;
  playerTeam: string;
  won: boolean;
}

// Derived atom that takes a player's name and returns the last 10 matches
export const playerMatchHistoryAtom = (playerName: string) => atom(async (get): Promise<PlayerMatch[]> => {
  // Get the player's stat events to know in which match they participated and on which team
  const playerStats = await get(playerStatExtractorAtom);
  const relevantStats = playerStats.filter(stat => stat.playerName === playerName);

  // Group unique matchIds along with the player's team from their stats
  const matchIdToPlayerTeam: Record<string, string> = {};
  relevantStats.forEach(stat => {
    if (!matchIdToPlayerTeam[stat.matchId]) {
      matchIdToPlayerTeam[stat.matchId] = stat.playerTeam;
    }
  });

  // Get match start (provides map details and matchTime), match end (provides scores), and file info for date/time
  const matchStarts = await get(matchStartExtractorAtom);
  const matchEnds = await get(matchEndExtractorAtom);
  const matchFiles = await get(matchExtractorAtom);

  const playerMatches: PlayerMatch[] = [];

  for (const matchId in matchIdToPlayerTeam) {
    const playerTeam = matchIdToPlayerTeam[matchId];
    const matchStart = matchStarts.find(ms => ms.matchId === matchId);
    const matchEnd = matchEnds.find(me => me.matchId === matchId);
    if (!matchStart || !matchEnd) continue;

    // Determine the winning team based on match scores
    let winningTeam: string | null = null;
    if (matchEnd.team1Score > matchEnd.team2Score) {
      winningTeam = matchStart.team1Name;
    } else if (matchEnd.team2Score > matchEnd.team1Score) {
      winningTeam = matchStart.team2Name;
    }

    const won = winningTeam === playerTeam;

    // Get match file info for date and time display
    const matchFileInfo = matchFiles.find(file => file.matchId === matchId);
    const date = matchFileInfo ? matchFileInfo.dateString : 'Unknown date';
    const time = matchFileInfo ? matchFileInfo.timeString : '';

    playerMatches.push({
      matchId,
      matchTime: matchStart.matchTime,
      date,
      time,
      mapName: matchStart.mapName,
      mapType: matchStart.mapType,
      playerTeam,
      won,
    });
  }

  // Sort matches in descending order (most recent first)
  playerMatches.sort((a, b) => b.matchTime - a.matchTime);

  // Return only the last 10 matches
  return playerMatches.slice(0, 10);
}); 