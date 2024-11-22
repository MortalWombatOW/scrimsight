import {heroNameToNormalized} from 'lib/string';

export const getHeroImage = (heroName: string, rounded = true): string => `/assets/heroes/${rounded ? 'rounded/' : ''}${heroNameToNormalized(heroName)}.png`;

const heroToRole = {
  'D.Va': 'tank',
  Orisa: 'tank',
  Reinhardt: 'tank',
  Roadhog: 'tank',
  Winston: 'tank',
  Sigma: 'tank',
  'Wrecking Ball': 'tank',
  Zarya: 'tank',
  Ashe: 'damage',
  Bastion: 'damage',
  Cassidy: 'damage',
  McCree: 'damage',
  Doomfist: 'damage',
  Echo: 'damage',
  Genji: 'damage',
  Hanzo: 'damage',
  Junkrat: 'damage',
  Mei: 'damage',
  Pharah: 'damage',
  Reaper: 'damage',
  'Soldier: 76': 'damage',
  Sombra: 'damage',
  Symmetra: 'damage',
  Torbjörn: 'damage',
  Tracer: 'damage',
  Widowmaker: 'damage',
  Ana: 'support',
  Baptiste: 'support',
  Brigitte: 'support',
  Lúcio: 'support',
  Mercy: 'support',
  Moira: 'support',
  Zenyatta: 'support',
  Rammatra: 'tank',
  Mauga: 'tank',
  Sojourn: 'damage',
  Kiriko: 'support',
  'Junker Queen': 'tank',
  Lifeweaver: 'support',
  Illari: 'support',
};

export const heroToRoleTable = Object.entries(heroToRole).map(([hero, role]) => ({
  hero,
  role,
}));

export const getRoleFromHero = (hero: string): string => {
  return heroToRole[hero] || 'new hero alert??';
};

export const getRankForRole = (role: string): number => {
  return role === 'tank' ? 1 : role === 'damage' ? 2 : 3;
};
