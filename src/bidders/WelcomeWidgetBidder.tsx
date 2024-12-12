import { WidgetBidder } from "~/Widget";

const WelcomeWidgetBidder: WidgetBidder = (intent) => {
  // only bid in the default intent
  if (Object.keys(intent).length > 0) {
    return [];
  }
  return [
    { id: 'welcome', displayName: 'Welcome Message', intent: {}, widget: <WelcomeWidget />, scorePrior: 1 },
  ];
};

const WelcomeWidget: React.FC = () => {
  return <div style={{ padding: '20px' }}>Welcome to Scrimsight! Add your <a href="https://workshop.codes/scrimtime" target="_blank" rel="noopener noreferrer">ScrimTime</a> logs to get started.</div>;
};

export default WelcomeWidgetBidder;