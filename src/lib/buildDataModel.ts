import * as Comlink from 'comlink';
import { buildDataModel } from './dataModel';
import type { ScrimsightDataModel } from './ScrimsightDataModel';


export class ScrimsightDataModelWorker {
  async processFiles(files: { fileName: string; fileModified: number; fileContent: string }[]): Promise<ScrimsightDataModel> {
    return buildDataModel(files);
  }
}

Comlink.expose(new ScrimsightDataModelWorker());