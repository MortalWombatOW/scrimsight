/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */

export function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function isNumeric(str: string): boolean {
  return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
}

export function mapNameToFileName(name: string, overhead: boolean): string {
  const lower = name.toLowerCase().replaceAll(' ', '').replaceAll("'", '');
  if (overhead) {
    return `/public/assets/topdown/${lower}_anno.png`;
  }
  return `/public/assets/maps/${lower}_overhead.jpg`;
}

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('.', '')
    .toLowerCase();
}

export function heroNameToNormalized(name: string): string {
  if (name === 'McCree') {
    return 'cassidy';
  }
  return normalizeString(name);
}
