import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for player stat events
 */
export interface PlayerStatLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: string;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  eliminations: number;
  finalBlows: number;
  deaths: number;
  allDamageDealt: number;
  barrierDamageDealt: number;
  heroDamageDealt: number;
  healingDealt: number;
  healingReceived: number;
  selfHealing: number;
  damageTaken: number;
  damageBlocked: number;
  defensiveAssists: number;
  offensiveAssists: number;
  ultimatesEarned: number;
  ultimatesUsed: number;
  multikillBest: number;
  multikills: number;
  soloKills: number;
  objectiveKills: number;
  environmentalKills: number;
  environmentalDeaths: number;
  criticalHits: number;
  criticalHitAccuracy: number;
  scopedAccuracy: number;
  scopedCriticalHitAccuracy: number;
  scopedCriticalHitKills: number;
  shotsFired: number;
  shotsHit: number;
  shotsMissed: number;
  scopedShotsFired: number;
  scopedShotsHit: number;
  weaponAccuracy: number;
  // heroTimePlayed: number; // This is always 0 in the log files
}

/**
 * Atom that extracts player stat events from the parsed log files
 */
export const playerStatExtractorAtom = createEventExtractorAtom<PlayerStatLogEvent>('player_stat'); 