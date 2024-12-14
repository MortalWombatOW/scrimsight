import { WidgetBidder } from "../Widget";
import MetricCard from "../components/Card/MetricCard";

const MetricCardWidgetBidder: WidgetBidder = (intent) => {

  const metrics = intent.metric ?? [];

  if (metrics.length === 0) {
    // No metrics to show.
    return [];
  }

  // TODO: Add support for more than playerName.
  const playerName = intent.playerName ?? [];

  if (playerName.length === 0) {
    // No player to show.
    return [];
  }

  return metrics.flatMap((metric) => {
    return playerName.map((player) => {
      return {
        id: `MetricCard-${metric}-${player}`,
        intent: { metric: [metric], playerName: [player] },
        displayName: `Metric Card for ${metric} for ${player}`,
        description: `A card showing the ${metric} for ${player}`,
        gridColumnSpan: 1,
        gridRowSpan: 1,
        widget: <MetricCard columnName={metric} slice={{ playerName: player }} compareToOther={['playerName']} />
      };
    });
  });
};

export default MetricCardWidgetBidder;
