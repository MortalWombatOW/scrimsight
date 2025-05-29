import { atom, WritableAtom } from 'jotai';
import { LogFileInputType } from '@atoms';

export const logFileInputAtomFn = (newFiles: File[]): LogFileInputType => {
  return { files: newFiles };
};

const _logFileInputAtom = atom<LogFileInputType>({ files: [] });

const logFileInputAtom: WritableAtom<LogFileInputType, [File[]], void> = atom(
  (get) => get(_logFileInputAtom),
  (_get, set, newFiles: File[]) => {
    const nextState = logFileInputAtomFn(newFiles);
    set(_logFileInputAtom, nextState);
  }
);

export default logFileInputAtom;
