import { WidgetBidder } from "~/Widget";
import { useWidgetRegistry } from "~/WidgetProvider";

const WelcomeWidgetBidder: WidgetBidder = (intent) => {
  // only bid in the default intent
  if (Object.keys(intent).length > 0) {
    return [];
  }
  return [
    {
      id: 'welcome',
      displayName: 'Welcome Message',
      intent: {},
      description: 'A welcome message',
      gridColumnSpan: 1,
      gridRowSpan: 1,
      widget: WelcomeWidget,
      widgetProps: {},
      scorePrior: 1,
    },
  ];
};

const WelcomeWidget: React.FC = () => {
  const widgetRegistry = useWidgetRegistry();
  return <div style={{ padding: '20px', width: widgetRegistry.widgetGridWidth, height: widgetRegistry.widgetGridHeight }}>Welcome to Scrimsight! Add your <a href="https://workshop.codes/scrimtime" target="_blank" rel="noopener noreferrer">ScrimTime</a> logs to get started.</div>;
};

export default WelcomeWidgetBidder;