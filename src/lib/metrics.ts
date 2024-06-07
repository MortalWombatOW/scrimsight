// inspired by https://www.brendankent.com/blog/sports-analytics-101-metric-framework-examples

interface MetricFramework {
  name: string;
  description: string;
  rationale: string;
  abbreviation: string;
  isDirectMeasure: boolean; // if false, the measurement is a proxy for the goal
  isStyleMeasure: boolean; // if true, the measurement is a proxy for the style
  opportunityAdjusted: boolean; // if true, the measurement is scaled by the number of opportunities
  disclaimer?: string;
  higherIsBetter: boolean;
}

const metrics: MetricFramework[] = [
  {
    name: 'Damage',
    description: 'Total damage dealt to enemies',
    rationale: 'total impact of a players attacks',
    abbreviation: 'Dmg',
    isDirectMeasure: true,
    isStyleMeasure: false,
    opportunityAdjusted: false,
    disclaimer: 'Does not consider damage blocked by shields',
    higherIsBetter: true,
  },
  {
    name: 'Healing',
    description: 'Total healing done to allies',
    rationale: "total impact of a player's healing",
    abbreviation: 'Heal',
    isDirectMeasure: true,
    isStyleMeasure: false,
    opportunityAdjusted: false,
    higherIsBetter: true,
  },
  {
    name: 'Maps Played',
    description: 'Total number of maps played',
    rationale: 'experience with the team',
    abbreviation: 'Maps',
    isDirectMeasure: true,
    isStyleMeasure: false,
    opportunityAdjusted: false,
    higherIsBetter: true,
  },
  {
    name: 'Playtime',
    description: 'Total time played',
    rationale: 'experience with the team',
    abbreviation: 'Time',
    isDirectMeasure: true,
    isStyleMeasure: false,
    opportunityAdjusted: false,
    higherIsBetter: true,
  },
  {
    name: 'Damage done / damage taken',
    description: 'Damage done to enemies divided by damage taken from enemies',
    rationale:
      'This metric is used to measure the effectiveness of a player in dealing damage to the enemy team while minimizing the amount of damage they take.',
    abbreviation: 'Dmg done/taken',
    isDirectMeasure: true,
    isStyleMeasure: false,
    opportunityAdjusted: true,
    higherIsBetter: true,
  },
  {
    name: 'Eliminations / deaths',
    description: 'Final blows and assists divided by deaths',
    rationale:
      "This metric is used to measure a player's ability to stay alive in a game while also eliminating as many opponents as possible.",
    abbreviation: 'Elims/deaths',
    isDirectMeasure: true,
    isStyleMeasure: false,
    opportunityAdjusted: true,
    higherIsBetter: true,
  },
  {
    name: 'Final blows / Assists',
    description: 'Final blows divided by assists',
    rationale:
      "This metric is used to measure a player's ability to eliminate opponents without the help of their teammates.",
    abbreviation: 'Final blows/assists',
    isDirectMeasure: true,
    isStyleMeasure: false,
    opportunityAdjusted: true,
    higherIsBetter: true,
  },
];

export const getMetric = (name: string) =>
  metrics.find((metric) => metric.name === name);

export const getTextForMetric = (name: string) => {
  const metric = getMetric(name);
  if (!metric) return '';
  return `${metric.description}. ${metric.rationale}`;
};
