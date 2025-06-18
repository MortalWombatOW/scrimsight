import * as Comlink from 'comlink';
import { buildDataModel } from '@library/buildDataModel';
import type { ScrimsightDataModel } from '@library/ScrimsightDataModel';

export async function processFiles(
  files: { fileName: string; fileModified: number; fileContent: string }[]
): Promise<ScrimsightDataModel> {
  return buildDataModel(files);
}

Comlink.expose(processFiles);