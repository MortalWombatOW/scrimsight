import { useMemo } from "react";
import { useWidgetBidders } from "./WidgetProvider";
import { Intent, WidgetBid } from "./Widget";
import { Card } from "@mui/material";

interface WidgetCardProps {
  bid: WidgetBid;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ bid }) => {
  return <Card style={{ height: 'fit-content', width: 'fit-content', gridColumnEnd: `span ${bid.gridColumnSpan}`, gridRowEnd: `span ${bid.gridRowSpan}` }} className="dashboard-item primary">{bid.widget}</Card>;
}

interface WidgetContainerProps {
  intent: Intent;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ intent }) => {
  const widgetRegistry = useWidgetBidders();

  const relevantWidgets = useMemo(() => widgetRegistry.getScoredBids(intent), [widgetRegistry, intent]);

  return (
    <div style={{ display: 'grid', gridAutoFlow: 'row dense', gap: 10, justifyContent: 'start', width: '100%', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
      {relevantWidgets.map((bid) => <WidgetCard bid={bid} />)}
    </div>
  );
};

export default WidgetContainer;