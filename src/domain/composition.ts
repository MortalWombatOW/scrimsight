/**
 * Composition analysis — classify team comps and compute pick/win rates.
 *
 * Ported from analysis/src/preprocessing.py (COMP_SIGNATURES + classify_composition).
 */

import { ProcessedMatch } from '../types/domain';
import { getRoleFromHero, OverwatchRole } from '../lib/hero';

// Signature-based archetype matching: if >= 2 heroes match a signature, tag the comp
const COMP_SIGNATURES: Record<string, { tanks: Set<string>; dps: Set<string>; supports: Set<string> }> = {
  Dive: {
    tanks: new Set(['Winston', 'Wrecking Ball', 'D.Va', 'Doomfist']),
    dps: new Set(['Tracer', 'Genji', 'Sombra', 'Echo']),
    supports: new Set(['Lúcio', 'Kiriko', 'Ana']),
  },
  Brawl: {
    tanks: new Set(['Reinhardt', 'Junker Queen', 'Ramattra', 'Mauga']),
    dps: new Set(['Reaper', 'Mei', 'Symmetra', 'Cassidy']),
    supports: new Set(['Lúcio', 'Brigitte', 'Baptiste', 'Moira']),
  },
  Poke: {
    tanks: new Set(['Sigma', 'Orisa']),
    dps: new Set(['Hanzo', 'Widowmaker', 'Ashe', 'Sojourn', 'Soldier: 76', 'Junkrat']),
    supports: new Set(['Ana', 'Baptiste', 'Zenyatta']),
  },
};

export type CompositionArchetype = 'Dive' | 'Brawl' | 'Poke' | 'Mixed';

export function classifyComposition(heroes: string[]): CompositionArchetype {
  const scores: Record<string, number> = {};
  for (const [archetype, sigs] of Object.entries(COMP_SIGNATURES)) {
    const allSigHeroes = new Set([...sigs.tanks, ...sigs.dps, ...sigs.supports]);
    let score = 0;
    for (const hero of heroes) {
      if (allSigHeroes.has(hero)) score++;
    }
    scores[archetype] = score;
  }

  let best = 'Mixed';
  let bestScore = 0;
  for (const [arch, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = arch;
    }
  }

  return (bestScore >= 2 ? best : 'Mixed') as CompositionArchetype;
}

export interface HeroPickRate {
  hero: string;
  role: OverwatchRole;
  pickCount: number;
  pickRate: number;
  winRate: number;
  wins: number;
  matches: number;
}

export interface ArchetypeStats {
  archetype: CompositionArchetype;
  count: number;
  winRate: number;
  wins: number;
}

export interface CompositionAnalysis {
  heroPickRates: HeroPickRate[];
  archetypeStats: ArchetypeStats[];
  totalCompsAnalyzed: number;
  mostPlayedArchetype: string;
  highestWRArchetype: string;
}

export function computeCompositionAnalysis(matches: ProcessedMatch[]): CompositionAnalysis {
  // Track hero appearances across matches
  const heroMap = new Map<string, { pickCount: number; wins: number; matches: number }>();
  const archetypeMap = new Map<CompositionArchetype, { count: number; wins: number }>();

  let totalComps = 0;

  for (const match of matches) {
    const winner = match.metadata.winner;

    // Group player stats by team for this match
    const teamHeroes = new Map<string, Set<string>>();
    for (const stat of match.playerStats.rows) {
      const heroes = teamHeroes.get(stat.playerTeam) || new Set();
      heroes.add(stat.playerHero);
      teamHeroes.set(stat.playerTeam, heroes);
    }

    // Process each team's composition
    for (const [teamName, heroes] of teamHeroes) {
      totalComps++;
      const heroArr = Array.from(heroes);
      const isWin = winner === teamName;

      // Track hero pick rates
      for (const hero of heroArr) {
        const existing = heroMap.get(hero) || { pickCount: 0, wins: 0, matches: 0 };
        existing.pickCount++;
        existing.matches++;
        if (isWin) existing.wins++;
        heroMap.set(hero, existing);
      }

      // Classify and track archetype
      const archetype = classifyComposition(heroArr);
      const arcEntry = archetypeMap.get(archetype) || { count: 0, wins: 0 };
      arcEntry.count++;
      if (isWin) arcEntry.wins++;
      archetypeMap.set(archetype, arcEntry);
    }
  }

  const heroPickRates: HeroPickRate[] = Array.from(heroMap.entries())
    .map(([hero, data]) => ({
      hero,
      role: getRoleFromHero(hero),
      pickCount: data.pickCount,
      pickRate: totalComps > 0 ? (data.pickCount / totalComps) * 100 : 0,
      winRate: data.matches > 0 ? (data.wins / data.matches) * 100 : 0,
      wins: data.wins,
      matches: data.matches,
    }))
    .sort((a, b) => b.pickRate - a.pickRate);

  const archetypeStats: ArchetypeStats[] = (['Dive', 'Brawl', 'Poke', 'Mixed'] as CompositionArchetype[])
    .map(archetype => {
      const data = archetypeMap.get(archetype) || { count: 0, wins: 0 };
      return {
        archetype,
        count: data.count,
        winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
        wins: data.wins,
      };
    });

  const mostPlayed = [...archetypeStats].sort((a, b) => b.count - a.count)[0];
  const highestWR = [...archetypeStats].filter(a => a.count >= 3).sort((a, b) => b.winRate - a.winRate)[0];

  return {
    heroPickRates,
    archetypeStats,
    totalCompsAnalyzed: totalComps,
    mostPlayedArchetype: mostPlayed?.archetype ?? 'Mixed',
    highestWRArchetype: highestWR?.archetype ?? 'Mixed',
  };
}
