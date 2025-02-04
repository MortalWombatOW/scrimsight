import { Atom, atom } from 'jotai';
import { playerStatExpandedAtom, type PlayerStatExpandedEvent } from './playerStatExpandedAtom';
import { matchDataAtom, type MatchData } from './matchDataAtom';
import { playerEventsAtom, type PlayerEvent } from './playerEventsAtom';

export interface SinglePlayerStats extends Omit<PlayerStatExpandedEvent, 'matchId' | 'matchTime' | 'roundNumber' | 'playerTeam' | 'playerRole' | 'playerHero' | 'playerName' | 'type'> {
  matches: MatchData[];
  events: PlayerEvent[];
  topHeroes: string[];
}

const memoizedSinglePlayerStats = new Map<string, Atom<Promise<SinglePlayerStats>>>();

export const singlePlayerStatsAtom = (playerName: string) => {
  if (memoizedSinglePlayerStats.has(playerName)) {
    return memoizedSinglePlayerStats.get(playerName)!;
  }

  const newAtom = atom(async (get) => {
    console.log('Fetching single player stats for:', playerName);
    const [allStats, playerEvents, matches] = await Promise.all([
      get(playerStatExpandedAtom),
      get(playerEventsAtom),
      get(matchDataAtom)
    ]);

    const playerStats = allStats.filter(stat => stat.playerName === playerName);
    const playerMatches = matches.filter(match =>
      match.team1Players.includes(playerName) || match.team2Players.includes(playerName)
    );
    const playerEvts = playerEvents.filter(event => event.playerName === playerName);
    const topHeroes = playerStats.map(stat => stat.playerHero).filter((hero, index, self) => self.indexOf(hero) === index);



    const singlePlayerStatsData: SinglePlayerStats = {
      matches: playerMatches,
      events: playerEvts,
      topHeroes: topHeroes,
      eliminations: playerStats.reduce((acc, stat) => acc + (stat.eliminations || 0), 0),
      finalBlows: playerStats.reduce((acc, stat) => acc + (stat.finalBlows || 0), 0),
      deaths: playerStats.reduce((acc, stat) => acc + (stat.deaths || 0), 0),
      allDamageDealt: playerStats.reduce((acc, stat) => acc + (stat.allDamageDealt || 0), 0),
      barrierDamageDealt: playerStats.reduce((acc, stat) => acc + (stat.barrierDamageDealt || 0), 0),
      damageBlocked: playerStats.reduce((acc, stat) => acc + (stat.damageBlocked || 0), 0),
      weaponAccuracy: playerStats.reduce((acc, stat) => acc + (stat.shotsHit), 0) / playerStats.reduce((acc, stat) => acc + (stat.shotsFired), 0),
      heroDamageDealt: playerStats.reduce((acc, stat) => acc + (stat.heroDamageDealt || 0), 0),
      healingDealt: playerStats.reduce((acc, stat) => acc + (stat.healingDealt || 0), 0),
      healingReceived: playerStats.reduce((acc, stat) => acc + (stat.healingReceived || 0), 0),
      selfHealing: playerStats.reduce((acc, stat) => acc + (stat.selfHealing || 0), 0),
      damageTaken: playerStats.reduce((acc, stat) => acc + (stat.damageTaken || 0), 0),
      defensiveAssists: playerStats.reduce((acc, stat) => acc + (stat.defensiveAssists || 0), 0),
      offensiveAssists: playerStats.reduce((acc, stat) => acc + (stat.offensiveAssists || 0), 0),
      objectiveKills: playerStats.reduce((acc, stat) => acc + (stat.objectiveKills || 0), 0),
      ultimatesEarned: playerStats.reduce((acc, stat) => acc + (stat.ultimatesEarned || 0), 0),
      ultimatesUsed: playerStats.reduce((acc, stat) => acc + (stat.ultimatesUsed || 0), 0),
      multikillBest: playerStats.reduce((acc, stat) => acc + (stat.multikillBest || 0), 0),
      multikills: playerStats.reduce((acc, stat) => acc + (stat.multikills || 0), 0),
      soloKills: playerStats.reduce((acc, stat) => acc + (stat.soloKills || 0), 0),
      environmentalKills: playerStats.reduce((acc, stat) => acc + (stat.environmentalKills || 0), 0),
      environmentalDeaths: playerStats.reduce((acc, stat) => acc + (stat.environmentalDeaths || 0), 0),
      criticalHits: playerStats.reduce((acc, stat) => acc + (stat.criticalHits || 0), 0),
      criticalHitAccuracy: playerStats.reduce((acc, stat) => acc + (stat.criticalHitAccuracy || 0), 0) / playerStats.length,
      scopedAccuracy: playerStats.reduce((acc, stat) => acc + (stat.scopedShotsHit), 0) / playerStats.reduce((acc, stat) => acc + (stat.scopedShotsFired), 0),
      scopedCriticalHitAccuracy: playerStats.reduce((acc, stat) => acc + (stat.scopedCriticalHitAccuracy || 0), 0) / playerStats.length,
      scopedCriticalHitKills: playerStats.reduce((acc, stat) => acc + (stat.scopedCriticalHitKills || 0), 0),
      shotsFired: playerStats.reduce((acc, stat) => acc + (stat.shotsFired || 0), 0),
      shotsHit: playerStats.reduce((acc, stat) => acc + (stat.shotsHit || 0), 0),
      shotsMissed: playerStats.reduce((acc, stat) => acc + (stat.shotsMissed || 0), 0),
      scopedShotsFired: playerStats.reduce((acc, stat) => acc + (stat.scopedShotsFired || 0), 0),
      scopedShotsHit: playerStats.reduce((acc, stat) => acc + (stat.scopedShotsHit || 0), 0),
      heroTimePlayed: playerStats.reduce((acc, stat) => acc + (stat.heroTimePlayed || 0), 0),
    };

    console.log('Single player stats:', singlePlayerStatsData);

    return singlePlayerStatsData;
  });

  memoizedSinglePlayerStats.set(playerName, newAtom);
  return newAtom;
}; 