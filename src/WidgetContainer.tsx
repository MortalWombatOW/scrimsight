import { useMemo } from "react";
import { useWidgetBidders } from "./WidgetProvider";

import { Intent } from "./Widget";

interface WidgetContainerProps {
  intent: Intent;
  maxWidgets?: number;
}

// WidgetContainer Component
const WidgetContainer: React.FC<WidgetContainerProps> = ({ intent, maxWidgets = 3 }) => {
  const widgetRegistry = useWidgetBidders();

  const relevantWidgets = useMemo(() => widgetRegistry.getWidgets(intent, maxWidgets), [widgetRegistry, intent, maxWidgets]);

  return (
    <div>
      {relevantWidgets}
    </div>
  );
};

export default WidgetContainer;