export const cartesian = (sets: string[][]): string[][] =>
  sets.reduce<string[][]>(
    (results, ids) =>
      results
        .map((result) => ids.map((id) => [...result, id]))
        .reduce((nested, result) => [...nested, ...result]),
    [[]],
  );
