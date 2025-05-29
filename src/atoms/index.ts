import { Atom } from 'jotai';
import teamPlayersAtom from './teamPlayers';

type ScrimsightAtom<T> = {
  name: string;
  description: string;
  atom: Atom<Promise<T>>;
};

interface TeamPlayersType {
  teamName: string;
  players: string[];
}
const teamPlayers: ScrimsightAtom<TeamPlayersType[]> = {
  name: 'teamPlayers',
  description: 'All players for each team',
  atom: teamPlayersAtom,
};

const atoms: ScrimsightAtom<any>[] = [
  teamPlayers
];

export default atoms;