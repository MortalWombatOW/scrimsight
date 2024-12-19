import { useMemo } from "react";
import { useWidgetRegistry } from "./WidgetProvider";
import { Intent, WidgetBid } from "./Widget";
import { Card } from "@mui/material";

interface WidgetCardProps {
  bid: WidgetBid<object>;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ bid }) => {
  return <Card style={{
    height: 'fit-content',
    width: 'fit-content',
    gridColumnEnd: `span ${bid.gridColumnSpan}`,
    gridRowEnd: `span ${bid.gridRowSpan}`,
    border: '1px solid #e0e0e0',
    borderRadius: 10,
  }} className="dashboard-item primary">
    <bid.widget {...bid.widgetProps} />
  </Card>;
}

interface WidgetContainerProps {
  intent: Intent;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ intent }) => {

  const widgetRegistry = useWidgetRegistry();

  const relevantWidgets = useMemo(() => widgetRegistry.getScoredBids(intent), [widgetRegistry, intent]);

  return (
    <div style={{
      display: 'grid',
      gridAutoFlow: 'row dense',
      gap: 10,
      justifyContent: 'start',
      width: '100%',
      gridTemplateColumns: `repeat(auto-fill, ${widgetRegistry.widgetGridWidth}px)`,
      gridTemplateRows: `repeat(auto-fill, ${widgetRegistry.widgetGridHeight}px)`
    }}>
      {relevantWidgets.map((bid) => <WidgetCard bid={bid} />)}
    </div>
  );
};

export default WidgetContainer;