import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useMemo } from 'react';
import { matchesRepositoryAtom } from '../data/repository';
import { PlayerStatsBase, PlayerStats } from '../data/types';
import { Metric } from '@library';

interface StatsFilters {
  hero?: string;
  role?: string;
  team?: string;
  playerName?: string;
  matchId?: string;
}

// Utility function to add derived metrics to base stats
export function addDerivedMetrics(baseStats: PlayerStatsBase[]): PlayerStats[] {
  return baseStats.map((stat) => {
    const playtime = stat.playtime;
    const per10Min = playtime > 0 ? 600 / playtime : 0; // 600 seconds = 10 minutes

    return {
      ...stat,
      eliminationsPer10Minutes: stat.eliminations * per10Min,
      finalBlowsPer10Minutes: stat.finalBlows * per10Min,
      deathsPer10Minutes: stat.deaths * per10Min,
      allDamageDealtPer10Minutes: stat.allDamageDealt * per10Min,
      barrierDamageDealtPer10Minutes: stat.barrierDamageDealt * per10Min,
      heroDamageDealtPer10Minutes: stat.heroDamageDealt * per10Min,
      healingDealtPer10Minutes: stat.healingDealt * per10Min,
      healingReceivedPer10Minutes: stat.healingReceived * per10Min,
      selfHealingPer10Minutes: stat.selfHealing * per10Min,
      damageTakenPer10Minutes: stat.damageTaken * per10Min,
      damageBlockedPer10Minutes: stat.damageBlocked * per10Min,
      defensiveAssistsPer10Minutes: stat.defensiveAssists * per10Min,
      offensiveAssistsPer10Minutes: stat.offensiveAssists * per10Min,
      ultimatesEarnedPer10Minutes: stat.ultimatesEarned * per10Min,
      ultimatesUsedPer10Minutes: stat.ultimatesUsed * per10Min,
      multikillsPer10Minutes: stat.multikills * per10Min,
      soloKillsPer10Minutes: stat.soloKills * per10Min,
      objectiveKillsPer10Minutes: stat.objectiveKills * per10Min,
      environmentalKillsPer10Minutes: stat.environmentalKills * per10Min,
      environmentalDeathsPer10Minutes: stat.environmentalDeaths * per10Min,
      criticalHitsPer10Minutes: stat.criticalHits * per10Min,
      shotsFiredPer10Minutes: stat.shotsFired * per10Min,
      shotsHitPer10Minutes: stat.shotsHit * per10Min,
      shotsMissedPer10Minutes: stat.shotsMissed * per10Min,
      scopedShotsFiredPer10Minutes: stat.scopedShotsFired * per10Min,
      scopedShotsHitPer10Minutes: stat.scopedShotsHit * per10Min,
      weaponAccuracy: stat.shotsFired > 0 ? stat.shotsHit / stat.shotsFired : 0,
      scopedWeaponAccuracy: stat.scopedShotsFired > 0 ? stat.scopedShotsHit / stat.scopedShotsFired : 0,
      criticalHitRate: stat.shotsFired > 0 ? stat.criticalHits / stat.shotsFired : 0,
    } as PlayerStats;
  });
}

export function useStats(filters?: StatsFilters): PlayerStatsBase[] {
  const statsAtom = useMemo(
    () =>
      selectAtom(matchesRepositoryAtom, (repository) => {
        const allMatches = Object.values(repository);

        const allStats: PlayerStatsBase[] = [];

        for (const match of allMatches) {
          if (filters?.matchId && match.metadata.matchId !== filters.matchId) {
            continue;
          }

          for (const stat of match.playerStats.rows) {
            let include = true;

            if (filters?.hero && stat.playerHero !== filters.hero) {
              include = false;
            }
            if (filters?.role && stat.playerRole !== filters.role) {
              include = false;
            }
            if (filters?.team && stat.playerTeam !== filters.team) {
              include = false;
            }
            if (filters?.playerName && stat.playerName !== filters.playerName) {
              include = false;
            }

            if (include) {
              allStats.push(stat);
            }
          }
        }

        return allStats;
      }),
    [filters?.hero, filters?.role, filters?.team, filters?.playerName, filters?.matchId]
  );

  return useAtomValue(statsAtom);
}

// Hook that returns stats with derived metrics
export function useStatsWithDerived(filters?: StatsFilters): PlayerStats[] {
  const baseStats = useStats(filters);
  return useMemo(() => addDerivedMetrics(baseStats), [baseStats]);
}

export function useAllPlayerStats(): Metric<
  PlayerStatsBase,
  'matchId' | 'roundNumber' | 'playerTeam' | 'playerName' | 'playerHero' | 'playerRole',
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
  | 'scopedShotsHit'
> {
  const allStatsAtom = useMemo(
    () =>
      selectAtom(matchesRepositoryAtom, (repository) => {
        const allMatches = Object.values(repository);

        const allStats: PlayerStatsBase[] = [];

        for (const match of allMatches) {
          allStats.push(...match.playerStats.rows);
        }

        return {
          categoryKeys: [
            'matchId',
            'roundNumber',
            'playerTeam',
            'playerName',
            'playerHero',
            'playerRole',
          ] as ('matchId' | 'roundNumber' | 'playerTeam' | 'playerName' | 'playerHero' | 'playerRole')[],
          numericalKeys: [
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
          ] as ('playtime' | 'eliminations' | 'finalBlows' | 'deaths' | 'allDamageDealt' | 'barrierDamageDealt' | 'heroDamageDealt' | 'healingDealt' | 'healingReceived' | 'selfHealing' | 'damageTaken' | 'damageBlocked' | 'defensiveAssists' | 'offensiveAssists' | 'ultimatesEarned' | 'ultimatesUsed' | 'multikills' | 'soloKills' | 'objectiveKills' | 'environmentalKills' | 'environmentalDeaths' | 'criticalHits' | 'shotsFired' | 'shotsHit' | 'shotsMissed' | 'scopedShotsFired' | 'scopedShotsHit')[],
          rows: allStats,
        };
      }),
    []
  );

  return useAtomValue(allStatsAtom);
}

export interface PlayerRanking {
  rank: number;
  max: number;
  percentage: number;
  value: number;
}

export function usePlayerRankings() {
  const allStatsMetric = useAllPlayerStats();

  return useMemo(() => {
    const playerMap = new Map<string, PlayerStatsBase>();
    const playerPlaytime = new Map<string, number>();

    // Aggregate stats by player
    for (const stat of allStatsMetric.rows) {
      const existing = playerMap.get(stat.playerName);
      
      if (!existing) {
        playerMap.set(stat.playerName, { ...stat });
        playerPlaytime.set(stat.playerName, stat.playtime);
      } else {
        // Sum numerical values
        for (const key of allStatsMetric.numericalKeys) {
          (existing as any)[key] = ((existing as any)[key] || 0) + ((stat as any)[key] || 0);
        }
        
        // Update metadata if this row has more playtime (to represent the "main" hero/role)
        const currentPlaytime = playerPlaytime.get(stat.playerName) || 0;
        if (stat.playtime > currentPlaytime) {
           existing.playerHero = stat.playerHero;
           existing.playerRole = stat.playerRole;
           existing.playerTeam = stat.playerTeam;
           playerPlaytime.set(stat.playerName, stat.playtime);
        }
      }
    }

    const rows = Array.from(playerMap.values());

    const getRanking = (playerName: string, stat: string): PlayerRanking => {
      const playerRow = rows.find((r) => r.playerName === playerName);
      const value = playerRow ? ((playerRow as any)[stat] as number) || 0 : 0;

      // Calculate max for this stat across all players
      const max = Math.max(...rows.map((r) => ((r as any)[stat] as number) || 0));

      // Calculate rank
      const rank = rows.filter((r) => ((r as any)[stat] as number) || 0 > value).length + 1;

      const percentage = max > 0 ? (value / max) * 100 : 0;

      return { rank, max, percentage, value };
    };

    const getPlayerStats = (playerName: string) => {
      return rows.find((r) => r.playerName === playerName);
    };

    return {
      getRanking,
      getPlayerStats,
    };
  }, [allStatsMetric]);
}
