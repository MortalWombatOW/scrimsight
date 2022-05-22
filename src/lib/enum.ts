export function enumKeys<T extends {[key: number]: string | number}>(
  e: T,
): T[keyof T][] {
  return Object.values(e).filter(
    (v) => typeof v === 'number' && !Number.isNaN(v),
  ) as T[keyof T][];
}
