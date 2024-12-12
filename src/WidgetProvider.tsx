import React, { createContext, useContext, useMemo } from "react";
import WidgetRegistry from "./WidgetRegistry";
// Widget Context
const WidgetContext = createContext<WidgetRegistry | null>(null);

export const useWidgetBidders = () => {
  const bidders = useContext(WidgetContext);
  if (!bidders) {
    throw new Error('useWidgetBidders must be used within a WidgetProvider');
  }
  return bidders;
};

const WidgetProvider: React.FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const registry = useMemo(() => new WidgetRegistry(), []); // Create once

    // Example Widget Registration (move these inside the provider)
    // const MyWidget: WidgetComponent<{ score: number }> = ({ data, columns }) => {
    //   // ... render widget using data
    // };

    // registry.registerWidget('my-widget', {
    //   component: MyWidget,
    //   intent: { matchId: '*', hero: 'Reaper' },
    //   dataNode: 'player_scores', // Example DataNode
    // });
    // // ... register other widgets

  return (
    <WidgetContext.Provider value={registry}>
      {children}
    </WidgetContext.Provider>
  );
};

export default WidgetProvider;