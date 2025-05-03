import { atom } from 'jotai';
import { bronzeParsedEventsAtom } from './bronzeAtoms';
import {
  calculateSilverMatches,
  calculateSilverRounds,
  calculateSilverPlaytime,
  calculateSilverPlayerRoundStats,
  calculateUnifiedInteractionEvents,
  calculateSilverTeamfights,
  calculateSilverUltimateCycles,
  calculateSilverPlayerLives
} from '../layers/silverLogic';
import {
  MatchSilver,
  RoundSilver,
  PlayerHeroRoundPlaytimeSilver,
  PlayerRoundStatsSilver,
  UnifiedInteractionEventSilver,
  TeamfightSilver,
  UltimateCycleSilver,
  PlayerLifeSilver
} from '../schemas/silverSchema';

/**
 * Atom for Silver layer match data
 */
export const silverMatchesAtom = atom(async (get): Promise<MatchSilver[]> => {
  const bronzeData = await get(bronzeParsedEventsAtom);
  return calculateSilverMatches(bronzeData);
});

/**
 * Atom for Silver layer round data
 */
export const silverRoundsAtom = atom(async (get): Promise<RoundSilver[]> => {
  const bronzeData = await get(bronzeParsedEventsAtom);
  return calculateSilverRounds(bronzeData);
});

/**
 * Atom for Silver layer playtime data
 */
export const silverPlaytimeAtom = atom(async (get): Promise<PlayerHeroRoundPlaytimeSilver[]> => {
  const bronzeData = await get(bronzeParsedEventsAtom);
  return calculateSilverPlaytime(bronzeData);
});

/**
 * Atom for Silver layer player round stats
 */
export const silverPlayerRoundStatsAtom = atom(async (get): Promise<PlayerRoundStatsSilver[]> => {
  const bronzeData = await get(bronzeParsedEventsAtom);
  const playtimeData = await get(silverPlaytimeAtom);
  return calculateSilverPlayerRoundStats(bronzeData, playtimeData);
});

/**
 * Atom for Silver layer unified interaction events
 */
export const silverUnifiedInteractionEventsAtom = atom(async (get): Promise<UnifiedInteractionEventSilver[]> => {
  const bronzeData = await get(bronzeParsedEventsAtom);
  return calculateUnifiedInteractionEvents(bronzeData);
});

/**
 * Atom for Silver layer teamfights
 */
export const silverTeamfightsAtom = atom(async (get): Promise<TeamfightSilver[]> => {
  const interactionEvents = await get(silverUnifiedInteractionEventsAtom);
  const matches = await get(silverMatchesAtom);
  return calculateSilverTeamfights(interactionEvents, matches);
});

/**
 * Atom for Silver layer ultimate cycles
 */
export const silverUltimateCyclesAtom = atom(async (get): Promise<UltimateCycleSilver[]> => {
  const bronzeData = await get(bronzeParsedEventsAtom);
  return calculateSilverUltimateCycles(bronzeData);
});

/**
 * Atom for Silver layer player lives
 */
export const silverPlayerLivesAtom = atom(async (get): Promise<PlayerLifeSilver[]> => {
  const bronzeData = await get(bronzeParsedEventsAtom);
  return calculateSilverPlayerLives(bronzeData);
});