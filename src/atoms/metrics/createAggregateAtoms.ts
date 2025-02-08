import { atom, Atom } from "jotai";


export type Metric<T extends object, C extends keyof T, N extends keyof T> = {
  categoryKeys: C[];
  numericalKeys: N[];
  rows: T[];
}

export type MetricAtom<T extends object, C extends keyof T, N extends keyof T> = Atom<Promise<Metric<T, C, N>>>;

export type Grouped<T extends object, G extends keyof T, N extends keyof T> = Pick<T,G> & Pick<T,N>;

export function groupByAtom<T extends object, C extends keyof T, N extends keyof T, G extends C>(metricAtom: MetricAtom<T, C, N>, groupByCategoryKeys: G[]): MetricAtom<Grouped<T,G,N>, G, N> {
  const newAtom: MetricAtom<Grouped<T,G,N>, G, N> = atom(async (get) => {
    const {numericalKeys, rows } = await get(metricAtom);

    const newMetric: Metric<Grouped<T,G,N>, G, N> = {
      categoryKeys: groupByCategoryKeys,
      numericalKeys,
      rows: [],
    }

    if (rows.length === 0) {
      return newMetric;
    }

    const groupKeyMap = new Map<string, T[]>();

    for (const metricRow of rows) {
      const groupKey = groupByCategoryKeys.map((key) => metricRow[key]).join("-");
      if (!groupKeyMap.has(groupKey)) {
        groupKeyMap.set(groupKey, []);
      }
      groupKeyMap.get(groupKey)?.push(metricRow);
    }

    for (const [, groupMetrics] of groupKeyMap) {
      const aggregatedMetric = {} as Partial<Grouped<T,G,N>>;

      for (const categoryKey of groupByCategoryKeys) {
        aggregatedMetric[categoryKey] = groupMetrics[0][categoryKey];
      }

      for (const numericalKey of numericalKeys) {
        for (const metric of groupMetrics) {
          if (aggregatedMetric[numericalKey] === undefined) {
            aggregatedMetric[numericalKey] = 0 as T[typeof numericalKey];
          }
          aggregatedMetric[numericalKey] = ((aggregatedMetric[numericalKey] as number) + (metric[numericalKey] as number) ) as T[typeof numericalKey];
        }
      }

      newMetric.rows.push(aggregatedMetric as Grouped<T,G,N>);
    }
    return newMetric;
  });

  return newAtom;
}


// function getCombinations(valuesArray: string[])
// {
// var combi = [];
// var temp = [];
// var slent = Math.pow(2, valuesArray.length);

// for (var i = 0; i < slent; i++)
// {
//     temp = [];
//     for (var j = 0; j < valuesArray.length; j++)
//     {
//         if ((i & Math.pow(2, j)))
//         {
//             temp.push(valuesArray[j]);
//         }
//     }
//     if (temp.length > 0)
//     {
//         combi.push(temp);
//     }
// }

// combi.sort((a, b) => a.length - b.length);
// console.log(combi.join("\n"));
// return combi;
// }

// export function buildAllAggregateAtoms<T extends object>(metricAtom: MetricAtom<T>)
// }
