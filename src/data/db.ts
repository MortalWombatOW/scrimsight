import Dexie, { Table } from 'dexie';
import { StoredMatch } from './serialization';

// ============================================================================
// Database Definition
// ============================================================================

export class ScrimSightDB extends Dexie {
  matches!: Table<StoredMatch, string>;

  constructor() {
    super('scrimsight');
    this.version(1).stores({
      matches: 'metadata.matchId',
    });
  }
}

export const db = new ScrimSightDB();

// ============================================================================
// Thin Wrapper Functions
// ============================================================================

export async function putMatches(matches: StoredMatch[]): Promise<void> {
  await db.matches.bulkPut(matches);
}

export async function getAllMatches(): Promise<StoredMatch[]> {
  return db.matches.toArray();
}

export async function clearMatches(): Promise<void> {
  await db.matches.clear();
}
