import KillsTable from "~/components/KillsTable/KillsTable";
import { WidgetBidder } from "../Widget";

const KillsTableWidgetBidder: WidgetBidder = (intent) => {
  if (!intent.matchId) {
    return [];
  }
  return intent.matchId.map((matchId) => ({
    id: `kills-table-${matchId}`,
    intent: {
      matchId: [matchId],
    },
    displayName: `Kills Table for ${matchId}`,
    description: `A table showing the kills in ${matchId}`,
    gridColumnSpan: 4,
    gridRowSpan: 4,
    widget: KillsTable,
    widgetProps: { matchId: matchId },
  }));
};

export default KillsTableWidgetBidder;