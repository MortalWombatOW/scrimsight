/**
 * Stats Types
 * Types related to player statistics and metrics.
 */

// ============================================================================
// Player Stats Key Types
// ============================================================================

export type PlayerStatsCategoryKeys =
  | 'matchId'
  | 'roundNumber'
  | 'playerTeam'
  | 'playerName'
  | 'playerHero'
  | 'playerRole';

export type PlayerStatsBaseNumericalKeys =
  | 'playtime'
  | 'eliminations'
  | 'finalBlows'
  | 'deaths'
  | 'allDamageDealt'
  | 'barrierDamageDealt'
  | 'heroDamageDealt'
  | 'healingDealt'
  | 'healingReceived'
  | 'selfHealing'
  | 'damageTaken'
  | 'damageBlocked'
  | 'defensiveAssists'
  | 'offensiveAssists'
  | 'ultimatesEarned'
  | 'ultimatesUsed'
  | 'multikills'
  | 'soloKills'
  | 'objectiveKills'
  | 'environmentalKills'
  | 'environmentalDeaths'
  | 'criticalHits'
  | 'shotsFired'
  | 'shotsHit'
  | 'shotsMissed'
  | 'scopedShotsFired'
  | 'scopedShotsHit';

export type PlayerStatsDerivedNumericalKeys =
  | 'eliminationsPer10Minutes'
  | 'finalBlowsPer10Minutes'
  | 'deathsPer10Minutes'
  | 'allDamageDealtPer10Minutes'
  | 'barrierDamageDealtPer10Minutes'
  | 'heroDamageDealtPer10Minutes'
  | 'healingDealtPer10Minutes'
  | 'healingReceivedPer10Minutes'
  | 'selfHealingPer10Minutes'
  | 'damageTakenPer10Minutes'
  | 'damageBlockedPer10Minutes'
  | 'defensiveAssistsPer10Minutes'
  | 'offensiveAssistsPer10Minutes'
  | 'ultimatesEarnedPer10Minutes'
  | 'ultimatesUsedPer10Minutes'
  | 'multikillsPer10Minutes'
  | 'soloKillsPer10Minutes'
  | 'objectiveKillsPer10Minutes'
  | 'environmentalKillsPer10Minutes'
  | 'environmentalDeathsPer10Minutes'
  | 'criticalHitsPer10Minutes'
  | 'shotsFiredPer10Minutes'
  | 'shotsHitPer10Minutes'
  | 'shotsMissedPer10Minutes'
  | 'scopedShotsFiredPer10Minutes'
  | 'scopedShotsHitPer10Minutes'
  | 'weaponAccuracy'
  | 'scopedWeaponAccuracy'
  | 'criticalHitRate';

export type PlayerStatsNumericalKeys = PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys;

// ============================================================================
// Player Stats Types
// ============================================================================

export type PlayerStatsBase = { [k in PlayerStatsCategoryKeys]: string } & {
  [k in PlayerStatsBaseNumericalKeys]: number;
};

export type PlayerStats = PlayerStatsBase & { [k in PlayerStatsDerivedNumericalKeys]: number };

// ============================================================================
// Key Constants (arrays for iteration)
// ============================================================================

export const playerStatsCategoryKeys: PlayerStatsCategoryKeys[] = [
  'matchId',
  'roundNumber',
  'playerTeam',
  'playerName',
  'playerHero',
  'playerRole'
];

export const playerStatsBaseNumericalKeys: PlayerStatsBaseNumericalKeys[] = [
  'playtime',
  'eliminations',
  'finalBlows',
  'deaths',
  'allDamageDealt',
  'barrierDamageDealt',
  'heroDamageDealt',
  'healingDealt',
  'healingReceived',
  'selfHealing',
  'damageTaken',
  'damageBlocked',
  'defensiveAssists',
  'offensiveAssists',
  'ultimatesEarned',
  'ultimatesUsed',
  'multikills',
  'soloKills',
  'objectiveKills',
  'environmentalKills',
  'environmentalDeaths',
  'criticalHits',
  'shotsFired',
  'shotsHit',
  'shotsMissed',
  'scopedShotsFired',
  'scopedShotsHit',
];

export const playerStatsDerivedNumericalKeys: PlayerStatsDerivedNumericalKeys[] = [
  'eliminationsPer10Minutes',
  'finalBlowsPer10Minutes',
  'deathsPer10Minutes',
  'allDamageDealtPer10Minutes',
  'barrierDamageDealtPer10Minutes',
  'heroDamageDealtPer10Minutes',
  'healingDealtPer10Minutes',
  'healingReceivedPer10Minutes',
  'selfHealingPer10Minutes',
  'damageTakenPer10Minutes',
  'damageBlockedPer10Minutes',
  'defensiveAssistsPer10Minutes',
  'offensiveAssistsPer10Minutes',
  'ultimatesEarnedPer10Minutes',
  'ultimatesUsedPer10Minutes',
  'multikillsPer10Minutes',
  'soloKillsPer10Minutes',
  'objectiveKillsPer10Minutes',
  'environmentalKillsPer10Minutes',
  'environmentalDeathsPer10Minutes',
  'criticalHitsPer10Minutes',
  'shotsFiredPer10Minutes',
  'shotsHitPer10Minutes',
  'shotsMissedPer10Minutes',
  'scopedShotsFiredPer10Minutes',
  'scopedShotsHitPer10Minutes',
  'weaponAccuracy',
  'scopedWeaponAccuracy',
  'criticalHitRate'
];

export const playerStatsNumericalKeys: PlayerStatsNumericalKeys[] = [
  ...playerStatsBaseNumericalKeys,
  ...playerStatsDerivedNumericalKeys
];
