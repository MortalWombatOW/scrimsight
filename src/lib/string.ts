export function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}



export function mapNameToFileName(name: string, overhead: boolean): string {
  const lower = name.toLowerCase().replaceAll(' ', '').replaceAll("'", '');
  if (overhead) {
    return `/assets/topdown/${lower}_anno.png`;
  }
  return `/assets/maps/${lower}.jpg`;
}


