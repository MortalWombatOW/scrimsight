import { IntentProvider } from "~/contexts/IntentContext";
import MatchesList from "~/pages/ReviewMatches/MatchesList";
import WidgetProvider from "~/WidgetProvider";


const ReviewMatches = () => {

  return <WidgetProvider widgetGridWidth={700} widgetGridHeight={300}>
    <IntentProvider>
      <div>
        <MatchesList />
      </div>
    </IntentProvider>
  </WidgetProvider>;
};

export default ReviewMatches;
