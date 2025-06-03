import { Getter } from 'jotai'; // atom will be used in index.ts
import { matchStart, type MatchStartType } from '@atoms'; // Assuming MatchStartType is from @atoms

// This is the core logic function for the atom.
const teamNamesLogic = async (get: Getter): Promise<string[]> => {
  // Ensure that matchStart.atom is the correct way to get the atom's value.
  // If matchStart is already the atom itself, it would just be get(matchStart).
  // Based on previous patterns, matchStart is a ScrimsightAtom wrapper.
  const matchStarts: MatchStartType = await get(matchStart.atom); // Corrected type: MatchStartType is MatchStartLogEvent[]
  
  // Get all team names (both team1 and team2)
  return Array.from(new Set([
    ...matchStarts.map(match => match.team1Name),
    ...matchStarts.map(match => match.team2Name)
  ]));
};

export default teamNamesLogic;
