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

  if (playerName.length === 1 && playerName[0] === "*") {
    // Show all players.
    return metrics.flatMap((metric) => {
      return playerName.map((player) => {
        return <MetricCard columnName={metric} slice={{playerName: player}} compareToOther={['playerName']} />;
      });
    });
  }

  return metrics.flatMap((metric) => {
    return playerName.map((player) => {
      return <MetricCard columnName={metric} slice={{playerName: player}} compareToOther={['playerName']} />;
    });
  });
};

export default MetricCardWidgetBidder;
