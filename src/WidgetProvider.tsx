import React, { createContext, useContext, useMemo } from "react";
import WidgetRegistry from "./WidgetRegistry";
// Widget Context
const WidgetContext = createContext<WidgetRegistry | null>(null);

export const useWidgetRegistry = () => {
  const registry = useContext(WidgetContext);
  if (!registry) {
    throw new Error('useWidgetRegistry must be used within a WidgetProvider');
  }
  return registry;
};

const WidgetProvider: React.FC<{ children: React.ReactNode | React.ReactNode[], widgetGridWidth: number, widgetGridHeight: number }> = ({ children, widgetGridWidth, widgetGridHeight }) => {
  const registry = useMemo(() => new WidgetRegistry(widgetGridWidth, widgetGridHeight), [widgetGridWidth, widgetGridHeight]); // Create once

  return (
    <WidgetContext.Provider value={registry}>
      {children}
    </WidgetContext.Provider>
  );
};

export default WidgetProvider;