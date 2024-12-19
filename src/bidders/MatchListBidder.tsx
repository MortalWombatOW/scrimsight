import MatchList from "~/components/MapsList/MapsList";
import { Intent, WidgetBidder } from "~/Widget";

const MatchListBidder: WidgetBidder = (intent: Intent) => {
  // if (intent.matchId !== undefined) {
  //   return [];
  // }

  return [{
    id: 'match_list',
    displayName: 'Match List',
    description: 'A list of all matches',
    gridColumnSpan: 2,
    gridRowSpan: 1,
    widget: MatchList,
    widgetProps: {},
    intent: intent,
  }]
};

export default MatchListBidder;