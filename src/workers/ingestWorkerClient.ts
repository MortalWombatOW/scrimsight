import type { IngestFileParams } from '../data/ingestor';
import type { ProcessedMatch } from '../types';
import type { IngestWorkerResponse } from './ingest.worker';

let worker: Worker | null = null;
let nextId = 0;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./ingest.worker.ts', import.meta.url), {
      type: 'module',
    });
  }
  return worker;
}

/**
 * Sends file params to the ingest worker and resolves with the ProcessedMatch.
 * Structured clone handles the Map/Set types in ProcessedMatch natively.
 */
export function ingestFileInWorker(params: IngestFileParams): Promise<ProcessedMatch> {
  const id = nextId++;
  const w = getWorker();

  return new Promise<ProcessedMatch>((resolve, reject) => {
    function handler(event: MessageEvent<IngestWorkerResponse>) {
      if (event.data.id !== id) return;
      w.removeEventListener('message', handler);

      if (event.data.type === 'result') {
        resolve(event.data.data);
      } else {
        reject(new Error(event.data.message));
      }
    }

    w.addEventListener('message', handler);
    w.postMessage({ type: 'ingest', id, params });
  });
}

export function terminateWorker(): void {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}
