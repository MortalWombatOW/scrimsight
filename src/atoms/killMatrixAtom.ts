import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import matchDataAtom, { MatchData } from "@atoms/matchDataAtom"; // Default import for atom, named for type
import { playerInteractionEventsAtom, PlayerInteractionEvent } from "@atoms/playerInteractionEventsAtom"; // Named import for atom
import {
  generateKillMatrixData,
  type KillMatrixData
} from "@atoms/killMatrix";

// --- Derived Atom Definition ---
export const killMatrixAtomFamily = atomFamily((matchId: string) =>
  atom(async (get): Promise<KillMatrixData | null> => {
    // Await the resolution of the async base atoms
    const allMatchData: MatchData[] = await get(matchDataAtom);
    const allPlayerInteractionEvents: PlayerInteractionEvent[] = await get(playerInteractionEventsAtom);

    // Use the pure business logic function
    return generateKillMatrixData(
      matchId,
      allMatchData,
      allPlayerInteractionEvents
    );
  })
);
