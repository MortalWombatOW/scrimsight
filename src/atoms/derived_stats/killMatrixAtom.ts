import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import {
  matchDataAtom,
  playerInteractionEventsAtom,
} from "~/atoms";
import {
  generateKillMatrixData,
  type KillMatrixData
} from "./killMatrix";

// --- Derived Atom Definition ---
export const killMatrixAtomFamily = atomFamily((matchId: string) =>
  atom(async (get): Promise<KillMatrixData | null> => {
    // Await the resolution of the async base atoms
    const allMatchData = await get(matchDataAtom);
    const allPlayerInteractionEvents = await get(playerInteractionEventsAtom);

    // Use the pure business logic function
    return generateKillMatrixData(
      matchId,
      allMatchData,
      allPlayerInteractionEvents
    );
  })
);