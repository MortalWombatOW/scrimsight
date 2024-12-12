import { useMemo } from "react";
import { useWidgetBidders } from "./WidgetProvider";
import { Intent } from "./Widget";
import { Card } from "@mui/material";

interface WidgetCardProps {
  widget: React.ReactNode;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ widget }) => {
  return <Card style={{ margin: 10, height: 'fit-content' }} className="dashboard-item primary">{widget}</Card>;
}

interface WidgetContainerProps {
  intent: Intent;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ intent }) => {
  const widgetRegistry = useWidgetBidders();

  const relevantWidgets = useMemo(() => widgetRegistry.getWidgets(intent), [widgetRegistry, intent]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, position: 'relative' }}>
      {relevantWidgets.map((widget) => <WidgetCard widget={widget} />)}
    </div>
  );
};

export default WidgetContainer;