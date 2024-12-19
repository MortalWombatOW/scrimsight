import { useMemo } from "react";
import { useWidgetRegistry } from "./WidgetProvider";
import { WidgetBid } from "./Widget";
import { Card } from "@mui/material";
import { useIntent } from "~/contexts/IntentContext";

interface WidgetCardProps {
  bid: WidgetBid<object>;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ bid }) => {
  return <Card style={{
    height: 'fit-content',
    width: 'fit-content',
    gridColumnEnd: `span ${bid.gridColumnSpan}`,
    gridRowEnd: `span ${bid.gridRowSpan}`,
  }} className="dashboard-item primary">
    <bid.widget {...bid.widgetProps} />
  </Card>;
}

const WidgetContainer: React.FC = () => {

  const { intent } = useIntent();

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