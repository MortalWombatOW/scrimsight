import { atom } from 'jotai';
import type { ScrimsightDataModel } from '@library/ScrimsightDataModel';

export const dataModelAtom = atom<ScrimsightDataModel | null>(null);