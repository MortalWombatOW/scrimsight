import { PlayerStatTotalScatterChart } from "~/components/Card/PlayerStatTotalScatterChart";
import { WidgetBid, WidgetBidder } from "~/Widget";



const ScatterChartBidder: WidgetBidder = (intent) => {
  const bids: WidgetBid<any>[] = [];
  if (intent.metric === undefined) {
    return bids;
  }
  if (intent.matchId === undefined && intent.metric.length === 2) {
    const [metricName, metricName2] = intent.metric;
    bids.push(
      {
        id: `player_stat_total_scatter_chart_${metricName}_${metricName2}`,
        displayName: `Player Stat Total Scatter Chart - ${metricName} vs ${metricName2}`,
        description: `A scatter chart of player stat totals for ${metricName} vs ${metricName2}`,
        intent: {
          metric: [metricName, metricName2],
        },
        gridColumnSpan: 2,
        gridRowSpan: 2,
        widget: PlayerStatTotalScatterChart,
        widgetProps: { metricName: metricName, metricName2: metricName2 },
      }
    );
  }
  return bids;
};

export default ScatterChartBidder;
