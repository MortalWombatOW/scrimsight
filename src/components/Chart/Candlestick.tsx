import React, {useMemo} from 'react';
import Plot from 'react-plotly.js';

interface MetricPeriod {
  category: string;
  subcategory: string;
  startTimestamp: number;
  endTimestamp: number;
  metric: string; //'damage' | 'damage_received' | 'healing' | 'healing_received';
  description: string;
  value: number;
  duration: number;
  base?: number;
}

interface PointData {
  category: string;
  subcategory: string;
  causeCategory: string;
  causeSubcategory: string;
  timestamp: number;
  type: string;
  description: string;
  symbol: string;
  color: string;
  size: number;
}

interface CandlestickProps {
  metricName: string;
  pointData: PointData[];
  barData: MetricPeriod[];
  width: number;
  height: number;
}

export function toPointData(
  events: object[],
  startTimestamp: number,
  windowLength: number,
  categoryKey: string,
) {
  const flatEvents = events.filter((event) => {
    return (
      event['Match Time'] >= startTimestamp &&
      event['Match Time'] <= startTimestamp + windowLength
    );
  });

  const sortedEvents = flatEvents.sort(
    (a, b) => a['Match Time'] - b['Match Time'],
  );

  const pointData = sortedEvents.flatMap((event) => {
    const allowedEventTypes = [
      'death',
      'kill',
      'ability_1_used',
      'ability_2_used',
      'defensive_assist',
      'offensive_assist',
      'hero_swap',
      'hero_spawn',
      'ultimate_start',
      'ultimate_end',
      'ultimate_charged',
    ];

    if (!allowedEventTypes.includes(event['Type'])) {
      return [];
    }

    let subcategory = '';
    let description = '';
    let causeCategory = '';
    let causeSubcategory = '';
    let symbol = '';
    let color = 'black';
    let size = 10;

    subcategory = event['Player Name'];

    if (event['Type'] === 'death') {
      causeCategory = event['Attacker Team'];
      causeSubcategory = event['Attacker Name'];
      description = `${subcategory} killed by ${event['Attacker Name']} at ${event['Match Time']}`;
      symbol = 'x';
      color = 'red';
      size = 20;
    }
    if (event['Type'] === 'kill') {
      causeCategory = event['Victim Team'];
      causeSubcategory = event['Victim Name'];
      description = `${subcategory} killed ${event['Victim Name']} at ${event['Match Time']}`;
      symbol = 'diamond';
      color = 'blue';
      size = 20;
    }
    if (event['Type'] === 'ability_1_used') {
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} used ability 1 at ${event['Match Time']}`;
      symbol = 'circle';
      color = 'grey';
    }
    if (event['Type'] === 'ability_2_used') {
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} used ability 2 at ${event['Match Time']}`;
      symbol = 'circle';
      color = 'grey';
    }
    if (event['Type'] === 'defensive_assist') {
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} got defensive assist at ${event['Match Time']}`;
      symbol = 'triangle-down';
      color = 'green';
    }
    if (event['Type'] === 'offensive_assist') {
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} got offensive assist at ${event['Match Time']}`;
      symbol = 'triangle-up';
      color = 'blue';
    }
    if (event['Type'] === 'hero_swap') {
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} swapped hero to ${event['Player Hero']} at ${event['Match Time']}`;
      symbol = 'square';
    }
    if (event['Type'] === 'hero_spawn') {
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} spawned as ${event['Player Hero']} at ${event['Match Time']}`;
      symbol = 'square';
    }
    if (event['Type'] === 'ultimate_start') {
      subcategory = event['Player Name'];
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} started ultimate at ${event['Match Time']}`;
      symbol = 'star';
      color = 'cyan';
      size = 15;
    }
    if (event['Type'] === 'ultimate_end') {
      subcategory = event['Player Name'];
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} ended ultimate at ${event['Match Time']}`;
      symbol = 'star';
      color = 'cyan';
    }
    if (event['Type'] === 'ultimate_charged') {
      subcategory = event['Player Name'];
      causeCategory = event['Player Team'];
      causeSubcategory = event['Player Name'];
      description = `${subcategory} charged ultimate at ${event['Match Time']}`;
      symbol = 'star';
      color = 'cyan';
    }

    const type = event['Type'];
    const timestamp = event['Match Time'];
    const category = event[categoryKey];

    return [
      {
        type,
        timestamp,
        category,
        subcategory,
        description,
        causeCategory,
        causeSubcategory,
        symbol,
        color,
        size,
      },
    ];
  });

  return pointData;
}

export function toMetricPeriod(
  events: object[],
  period_seconds: number,
  topMetric: string,
  bottomMetric: string,
  categoryKey: string,
  subcategoryKey: string,
  startTimestamp: number,
  windowLength: number,
) {
  const flatEvents = events.filter((event) => {
    return (
      event['Match Time'] >= startTimestamp &&
      event['Match Time'] <= startTimestamp + windowLength
    );
  });

  const sortedEvents = flatEvents.sort(
    (a, b) => a['Match Time'] - b['Match Time'],
  );

  const currentPeriods: MetricPeriod[] = [];

  const getPeriod = (
    type: string,
    category: string,
    subcategory: string,
    periodStartTimestamp: number,
    period_seconds: number,
  ) => {
    const p = currentPeriods.filter(
      (period) =>
        period.category === category &&
        period.subcategory === subcategory &&
        period.startTimestamp === periodStartTimestamp,
    );
    if (p.length === 0) {
      const newPeriod: MetricPeriod = {
        category,
        subcategory,
        startTimestamp: periodStartTimestamp,
        endTimestamp: periodStartTimestamp + period_seconds,
        duration: period_seconds,
        metric: type,
        description: '',
        value: 0,
      };
      currentPeriods.push(newPeriod);
      return newPeriod;
    }
    return p[0];
  };

  sortedEvents.forEach((event) => {
    const allowedEventTypes = [topMetric, bottomMetric];

    if (!allowedEventTypes.includes(event['Type'])) {
      return;
    }

    let sign = 0;
    if (event['Type'] === topMetric) {
      sign = 1;
    }
    if (event['Type'] === bottomMetric) {
      sign = -1;
    }

    const timestamp = event['Match Time'];
    const category = event['Player Team'] + event[categoryKey];
    const subcategory = event[subcategoryKey];
    const periodStartTimestamp =
      Math.floor(timestamp / period_seconds) * period_seconds;

    const period = getPeriod(
      event['Type'],
      category,
      subcategory,
      periodStartTimestamp,
      period_seconds,
    );
    let value = 0;

    if (event['Type'] === 'damage_received') {
      value = event['Event Damage'];
    }
    if (event['Type'] === 'healing_received') {
      value = event['Event Healing'];
    }
    if (event['Type'] === 'damage') {
      value = event['Event Damage'];
    }
    if (event['Type'] === 'healing') {
      value = event['Event Healing'];
    }
    period.value += value * sign;
  });

  currentPeriods.sort((a, b) => {
    if (a.startTimestamp !== b.startTimestamp) {
      return a.startTimestamp - b.startTimestamp;
    }
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    if (a.metric !== b.metric) {
      return a.metric.localeCompare(b.metric);
    }
    return Math.abs(b.value - a.value);
  });

  for (let i = 0; i < currentPeriods.length; i++) {
    const period = currentPeriods[i];
    period.description = `(${period.category}, ${period.subcategory}) ${period.value} ${period.metric} at ${period.startTimestamp}`;
    period.base = 0;
    const periodSign = period.value > 0 ? 1 : -1;
    const prevPeriodWithSameCategoryList = currentPeriods
      .slice(0, i)
      .filter(
        (p) =>
          p.category === period.category &&
          p.startTimestamp == period.startTimestamp &&
          periodSign * p.value > 0,
      );
    if (prevPeriodWithSameCategoryList.length > 0) {
      const prevPeriodWithSameCategory =
        prevPeriodWithSameCategoryList[
          prevPeriodWithSameCategoryList.length - 1
        ];

      period.base =
        prevPeriodWithSameCategory.value +
        (prevPeriodWithSameCategory.base || 0);
    }
  }

  const metricPeriods = Object.values(currentPeriods).flat();

  return metricPeriods;
}

const Candlestick = (props: CandlestickProps) => {
  const uniqueCategories = useMemo(() => {
    return Array.from(
      new Set(props.barData.map((item) => item.category)),
    ).sort();
  }, [props.barData.length]);

  const traces = useMemo(() => {
    return uniqueCategories.flatMap((category, i) => {
      const categoryData = props.barData.filter(
        (item) => item.category === category,
      );
      const pointData = props.pointData.filter(
        (item) => item.category === category,
      );
      return [
        {
          name: 'Data for ' + category,
          x: categoryData.map((item) => item.startTimestamp),
          base: categoryData.map((item) => item.base),
          y: categoryData.map((item) => item.value),
          width: categoryData.map((item) => item.duration),
          customdata: categoryData.map((item) => [item.description]),
          hovertemplate: '%{customdata[0]}',
          marker: {
            color: categoryData.map((item) => {
              if (item.value > 0) {
                return 'green';
              }
              if (item.value < 0) {
                return 'red';
              }
              return 'black';
            }),
            opacity: 0.7,
            line: {
              color: 'black',
              width: 1,
            },
          },
          type: 'bar',
          xaxis: 'x',
          yaxis: 'y' + (i + 1),
          offsetgroup: 1,
        },
        {
          x: pointData.map((item) => item.timestamp),
          y: pointData.map((item) => 0),
          mode: 'markers',
          marker: {
            color: pointData.map((item) => item.color),
            size: pointData.map((item) => item.size),
            symbol: pointData.map((item) => item.symbol),
            opacity: 0.7,
          },
          text: pointData.map((item) => item.description),
          type: 'scatter',
          xaxis: 'x',
          yaxis: 'y' + (i + 1),
          name: 'Events',
          offsetgroup: 1,
        },
      ];
    });
  }, [props.barData.length]);

  const layout = useMemo(() => {
    const layout = {
      dragmode: 'zoom',
      showlegend: false,
      // margin: {
      // l: 200,
      // r: 500,
      // b: 50,
      // t: 500,
      // pad: 40,
      // },
      barmode: 'stack',
      xaxis: {
        rangeslider: {
          visible: false,
        },
        // fixedrange: true,
        title: 'Time (s)',
        anchor: 'y' + (uniqueCategories.length + 1),
      },
      grid: {
        rows: uniqueCategories.length,
        columns: 1,
        subplots: uniqueCategories.map((_, i) => 'xy' + (i + 1)),
        roworder: 'bottom to top',
        automargin: true,
      },
      // yaxis: {
      //   fixedrange: true,
      //   title: props.metricName,
      //   automargin: true,
      //   sidzsze: 'left',
      // },

      width: props.width,
      height: props.height,
    };
    // const spacing = 0.5;
    // const N = uniqueCategories.length;
    uniqueCategories.forEach((category, i) => {
      layout['yaxis' + (i + 1)] = {
        fixedrange: true,
        title: category,
        automargin: 'left',
        side: 'left',
        // domain: [
        //   (1 / N) * i + (i === 0 ? 0 : spacing / 2),
        //   (1 / N) * (i + 1) - (i === N - 1 ? 0 : spacing / 2),
        // ],
        // range: [
        //   Math.min(
        //     ...(props.barData.map((item) => item.base ?? 0 + item.value) || 0),
        //   ),
        //   Math.max(...props.barData.map((item) => item.base ?? 0 + item.value)),
        // ],
      };
    });
    return layout;
  }, [props.barData.length]);

  return <Plot data={traces} layout={layout} />;
};

export default Candlestick;
