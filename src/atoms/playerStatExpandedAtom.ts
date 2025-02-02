import { atom } from 'jotai';
import { playerStatExtractorAtom, PlayerStatLogEvent } from './playerStatExtractorAtom';

/**
 * Interface for expanded player stat events that includes role information
 */
export interface PlayerStatExpandedEvent extends PlayerStatLogEvent {
  playerRole: string;
}

/**
 * Helper function to determine hero role
 */
function getHeroRole(hero: string): string {
  const tankHeroes = [
    'Mauga', 'D.Va', 'Orisa', 'Reinhardt', 'Roadhog', 'Sigma',
    'Winston', 'Wrecking Ball', 'Zarya', 'Doomfist', 'Junker Queen', 'Rammatra'
  ];
  const damageHeroes = [
    'Ashe', 'Bastion', 'Cassidy', 'Echo', 'Genji', 'Hanzo', 'Junkrat',
    'Mei', 'Pharah', 'Reaper', 'Soldier: 76', 'Sojourn', 'Sombra',
    'Symmetra', 'Torbjörn', 'Tracer', 'Widowmaker'
  ];
  const supportHeroes = [
    'Ana', 'Baptiste', 'Brigitte', 'Lúcio', 'Mercy', 'Moira',
    'Zenyatta', 'Lifeweaver', 'Illari', 'Kiriko'
  ];

  if (tankHeroes.includes(hero)) return 'tank';
  if (damageHeroes.includes(hero)) return 'damage';
  if (supportHeroes.includes(hero)) return 'support';
  return 'unknown';
}

/**
 * Atom that adds role information to player stat events
 */
export const playerStatExpandedAtom = atom(async (get): Promise<PlayerStatExpandedEvent[]> => {
  const playerStats = await get(playerStatExtractorAtom);
  
  return playerStats.map(stat => ({
    ...stat,
    playerRole: getHeroRole(stat.playerHero)
  }));
}); 