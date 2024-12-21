import { WombatDataOptions } from "wombat-data-framework";
import { PlayerStatTotalBarChart } from "~/components/Card/PlayerStatTotalBarChart";
import { WidgetBid, WidgetBidder } from "~/Widget";
import { PlayerStatTotalsNodeData } from "~/WombatDataFrameworkSchema";



const BarChartBidder: WidgetBidder = (intent) => {
  const bids: WidgetBid<any>[] = [];
  if (intent.metric === undefined) {
    return bids;
  }
  if (intent.matchId === undefined || intent.matchId.length === 1) {
    // const dataOptions: WombatDataOptions<PlayerStatTotalsNodeData> | undefined = intent.matchId?.length === 1 ? { initialFilter: { matchId: intent.matchId?.[0] } } : undefined;
    // console.log(dataOptions);
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
          widget: PlayerStatTotalBarChart,
          widgetProps: { metricName: metricName },
        }
      );
    }
  }
  return bids;
};

export default BarChartBidder;
