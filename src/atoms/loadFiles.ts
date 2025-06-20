// atoms/loadFilesAtom.ts
import { atom } from 'jotai';
import * as Comlink from 'comlink';
import { dataModelAtom } from '@atoms/scrimsight.ts';
import { ScrimsightDataModel } from '@library/ScrimsightDataModel';

type FileAction = File[];

type WorkerAPI = {
  processFiles(files: { fileName: string; fileModified: number; fileContent: string }[]): Promise<ScrimsightDataModel>;
};

export const loadFilesAtom = atom(
  null,                                   // it has no readable value
  async (get, set, files: FileAction) => {
    // lazy-init the worker exactly once
    let worker = get(workerAtom);
    if (!worker) {
      console.log("Creating worker");
      worker = new Worker(new URL('../lib/buildDataModel.worker.ts', import.meta.url), { type: 'module' });
      set(workerAtom, worker);            // cache it
    }

    const workerAPI = Comlink.wrap<WorkerAPI>(worker);

    const fileData = await Promise.all(
      files.map(async (file) => ({
        fileName: file.name,
        fileModified: file.lastModified,
        fileContent: await file.text()
      }))
    );

    console.log("Processing files", fileData);

    const model = await workerAPI.processFiles(fileData);
    console.log("Processed files", model);
    set(dataModelAtom, model);
  }
);

const workerAtom = atom<Worker | null>(null);
