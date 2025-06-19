
import * as ScrimsightDataModel from "@library/ScrimsightDataModel";

export const getHeroImage = (heroName: ScrimsightDataModel.Hero, rounded = true): string => `/assets/heroes/${rounded ? 'rounded/' : ''}${heroNameToNormalized(heroName)}.png`;

export const getRoleFromHero = (hero: string): ScrimsightDataModel.Role => {
  if (ScrimsightDataModel.TANK_HEROES.includes(hero as typeof ScrimsightDataModel.TANK_HEROES[number])) return 'tank';
  if (ScrimsightDataModel.DAMAGE_HEROES.includes(hero as typeof ScrimsightDataModel.DAMAGE_HEROES[number])) return 'damage';
  if (ScrimsightDataModel.SUPPORT_HEROES.includes(hero as typeof ScrimsightDataModel.SUPPORT_HEROES[number])) return 'support';
  
  // Log warning but default to damage for unknown heroes to prevent crashes
  console.warn(`Unknown hero detected: ${hero} (${hero.length} characters). Defaulting to damage role.`);
  return 'damage';
};

export const getRankForRole = (role: ScrimsightDataModel.Role): number => {
  return {tank: 1, damage: 2, support: 3}[role];
};

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('.', '')
    .replaceAll(' ', '')
    .replaceAll(':', '')
    .toLowerCase();
}

export function heroNameToNormalized(name: string | undefined): string {
  if (name === undefined) {
    return '';
  }
  if (name === 'McCree') {
    return 'cassidy';
  }
  return normalizeString(name);
}