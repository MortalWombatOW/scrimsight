import { atom } from 'jotai';
import type { ScrimsightDataModel } from '../lib/ScrimsightDataModel';

export const dataModelAtom = atom<ScrimsightDataModel | null>(null);