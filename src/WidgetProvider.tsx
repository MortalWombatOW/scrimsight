import React, { useContext, useMemo } from "react";
import WidgetRegistry from "./WidgetRegistry";
import { WidgetContext } from "~/WidgetContext";


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