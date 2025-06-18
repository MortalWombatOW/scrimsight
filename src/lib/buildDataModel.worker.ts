import * as Comlink from 'comlink';
import { buildDataModel } from './buildDataModel';
import type { ScrimsightDataModel } from './ScrimsightDataModel';

export async function processFiles(
  files: { fileName: string; fileModified: number; fileContent: string }[]
): Promise<ScrimsightDataModel> {
  return buildDataModel(files);
}

Comlink.expose(processFiles);