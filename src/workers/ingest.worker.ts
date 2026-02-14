/// <reference lib="webworker" />

import { ingestFile } from '../data/ingestor';
import type { IngestFileParams } from '../data/ingestor';

export type IngestWorkerRequest = {
  type: 'ingest';
  id: number;
  params: IngestFileParams;
};

export type IngestWorkerResponse =
  | { type: 'result'; id: number; data: ReturnType<typeof ingestFile> extends Promise<infer T> ? T : never }
  | { type: 'error'; id: number; message: string };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.addEventListener('message', async (event: MessageEvent<IngestWorkerRequest>) => {
  const { type, id, params } = event.data;

  if (type !== 'ingest') return;

  try {
    const result = await ingestFile(params);
    ctx.postMessage({ type: 'result', id, data: result } satisfies IngestWorkerResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    ctx.postMessage({ type: 'error', id, message } satisfies IngestWorkerResponse);
  }
});
