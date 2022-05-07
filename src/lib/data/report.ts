import {Metric, Report} from './types';

// const damageByPlayer: Metric = {
//   values: [],
// };

export const reportMap: {[key: string]: Report} = {
  totals: {
    name: 'Totals',
    description: 'Totals for top metrics',
    metrics: [
      {
        values: ['final blows', 'elimination', 'deaths'],
        groups: ['player'],
      },
    ],
    id: 'totals',
    tags: [],
  },
};
