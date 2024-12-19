import { PlayerStatTotalBarChart } from "~/components/Card/PlayerStatTotalBarChart";
import { WidgetBid, WidgetBidder } from "~/Widget";



const BarChartBidder: WidgetBidder = (intent) => {
  const bids: WidgetBid[] = [];
  if (intent.metric === undefined) {
    return bids;
  }
  if (intent.matchId === undefined) {
    for (const metricName of intent.metric) {
      bids.push(
        {
          id: `player_stat_total_bar_chart_${metricName}`,
          displayName: `Player Stat Total Bar Chart - ${metricName}`,
          description: `A bar chart of player stat totals for ${metricName}`,
          intent: {
            metric: [metricName],
          },
          gridColumnSpan: 2,
          gridRowSpan: 2,
          widget: <PlayerStatTotalBarChart metricName={metricName} />,
        }
      );
    }
  }
  return bids;
};

export default BarChartBidder;
