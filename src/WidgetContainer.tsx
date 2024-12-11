import { useMemo } from "react";
import { useWidgetBidders } from "./WidgetProvider";

import { Intent } from "./Widget";

interface WidgetContainerProps {
  intent: Intent;
}

// WidgetContainer Component
const WidgetContainer: React.FC<WidgetContainerProps> = ({ intent }) => {
  const widgetRegistry = useWidgetBidders();

  const relevantWidgets = useMemo(() => widgetRegistry.getWidgets(intent), [widgetRegistry, intent]);

  return (
    <div>
      {relevantWidgets}
    </div>
  );
};

export default WidgetContainer;