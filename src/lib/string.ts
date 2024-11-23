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
    return `/assets/topdown/${lower}_anno.png`;
  }
  return `/assets/maps/${lower}.jpg`;
}

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

export function listToNaturalLanguage(list: string[]): string {
  if (list.length === 0) {
    return '';
  }
  if (list.length === 1) {
    return list[0];
  }
  if (list.length === 2) {
    return `${list[0]} and ${list[1]}`;
  }
  return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
