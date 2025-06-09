import { atom } from 'jotai';
import { matchStart, UniqueGameMode, MatchStartType } from '@atoms';

export const uniqueGameModesAtomFn = (matchStarts: MatchStartType): UniqueGameMode[] => {
  // Get unique map types (game modes)
  const uniqueModes = Array.from(new Set(
    matchStarts.map(match => match.mapType)
  ));

  return uniqueModes.map(mode => ({ mapType: mode }));
};

export default atom(async (get): Promise<UniqueGameMode[]> => {
  const matchStarts = await get(matchStart.atom);
  return uniqueGameModesAtomFn(matchStarts);
}); 