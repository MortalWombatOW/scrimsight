import { atom, Atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import {
  // Import the actual objects for runtime use
  matchData,
  playerInteractionEvents, // Import the playerInteractionEvents object
  // Import types for type checking
  type MatchData,
  type PlayerInteractionEvent,
  type KillMatrixData, // This type will be from @atoms (index.ts)
  // Import functions for runtime use
  generateKillMatrixData,
} from '@atoms';

// Directly export the result of atomFamily call as the default export.
export default atomFamily<string, Atom<Promise<KillMatrixData | null>>>(
  (matchId: string) =>
    atom(async (get): Promise<KillMatrixData | null> => {
      const allMatchData: MatchData[] = await get(matchData.atom);
      // Correctly use the imported playerInteractionEvents object
      const allPlayerInteractionEvents: PlayerInteractionEvent[] = await get(
        playerInteractionEvents.atom
      );
      return generateKillMatrixData(
        matchId,
        allMatchData,
        allPlayerInteractionEvents
      );
    })
);
