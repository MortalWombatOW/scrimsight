import { Atom } from 'jotai';
import teamPlayers from './teamPlayers';
import sampleDataEnabled from './sampleDataEnabled';
import sampleData from './sampleData';
import { LogFileLoaderOutput } from './logFileLoaderAtom';

export type ScrimsightAtom<T> = {
  name: string;
  description: string;
  atom: Atom<Promise<T>>;
};

export type TeamPlayersType = {
  teamName: string;
  players: string[];
};

export type SampleDataEnabledType = boolean;

export type SampleDataType = LogFileLoaderOutput[];

const atoms: ScrimsightAtom<any>[] = [
  {
    name: 'teamPlayers',
    description: 'All players for each team',
    atom: teamPlayers,
  },
  {
    name: 'sampleDataEnabled',
    description: 'Whether sample data is enabled',
    atom: sampleDataEnabled,
  },
  {
    name: 'sampleData',
    description: 'Sample log file data',
    atom: sampleData,
  },
];

export default atoms;
