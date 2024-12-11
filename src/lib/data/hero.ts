import {heroNameToNormalized} from '../string';

export const getHeroImage = (heroName: string, rounded = true): string => `/assets/heroes/${rounded ? 'rounded/' : ''}${heroNameToNormalized(heroName)}.png`;

// Hero lists by role
const TANK_HEROES = [
  'D.Va',
  'Orisa',
  'Reinhardt',
  'Roadhog',
  'Winston',
  'Sigma',
  'Wrecking Ball',
  'Zarya',
  'Rammatra',
  'Mauga',
  'Junker Queen',
  'Hazard'
] as const;

const DAMAGE_HEROES = [
  'Ashe',
  'Bastion',
  'Cassidy',
  'McCree',
  'Doomfist',
  'Echo',
  'Genji',
  'Hanzo',
  'Junkrat',
  'Mei',
  'Pharah',
  'Reaper',
  'Soldier: 76',
  'Sombra',
  'Symmetra',
  'Torbjörn',
  'Tracer',
  'Widowmaker',
  'Sojourn'
] as const;

const SUPPORT_HEROES = [
  'Ana',
  'Baptiste',
  'Brigitte',
  'Lúcio',
  'Mercy',
  'Moira',
  'Zenyatta',
  'Kiriko',
  'Lifeweaver',
  'Illari',
  'Juno'
] as const;

export type OverwatchRole = 'tank' | 'damage' | 'support';
export type OverwatchHero = typeof TANK_HEROES[number] | typeof DAMAGE_HEROES[number] | typeof SUPPORT_HEROES[number];
export type OverwatchMode = 'Control' | 'Escort' | 'Hybrid' | 'Flashpoint' | 'Push' | 'Clash';
export type OverwatchMap = 'Antarctic Peninsula' | 'Busan' | 'Ilios' | 'Lijiang Tower' | 'Nepal' | 'Oasis' | 'Samoa' | 'Circuit Royal' | 'Dorado' | 'Havana' | 'Junkertown' | 'Rialto' | 'Route 66' | 'Shambali Monastary' | 'Watchpoint: Gibraltar' 
| 'New Junk City' | 'Suravasa' 
| 'Blizzard World' | 'Eichenwalde' | 'Hollywood' | 'King\'s Row' | 'Midtown' | 'Numbani' | 'Paraiso' 
| 'Colosseo' | 'Esperanca' | 'New Queen Street' | 'Runasapi' | 'Hanaoka' | 'Throne of Anubis';

export const getRoleFromHero = (hero: OverwatchHero): OverwatchRole => {
  if (TANK_HEROES.includes(hero as typeof TANK_HEROES[number])) return 'tank';
  if (DAMAGE_HEROES.includes(hero as typeof DAMAGE_HEROES[number])) return 'damage';
  if (SUPPORT_HEROES.includes(hero as typeof SUPPORT_HEROES[number])) return 'support';
  throw new Error(`Unknown hero: ${hero}`);
};

export const getRankForRole = (role: OverwatchRole): number => {
  return {tank: 1, damage: 2, support: 3}[role];
};
