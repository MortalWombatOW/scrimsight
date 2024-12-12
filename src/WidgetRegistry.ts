
import React from "react";
import UploaderWidgetBidder from "./bidders/UploaderWidgetBidder";
import MetricCardWidgetBidder from "./bidders/MetricCardWidgetBidder";
import { WidgetBidder, Intent, WidgetBid, intentSimilarity } from "./Widget";
import WelcomeWidgetBidder from "~/bidders/WelcomeWidgetBidder";

type ScoredWidgetBid = WidgetBid & {
  score: number;
}

class WidgetRegistry {
  private bidders: WidgetBidder[] = [
    UploaderWidgetBidder,
    MetricCardWidgetBidder,
    WelcomeWidgetBidder,
  ];

  getWidgets(intent: Intent): React.ReactNode[] {
    const bids: WidgetBid[] = this.bidders.flatMap(bidder => bidder(intent));

    const scoredBids: ScoredWidgetBid[] = bids.map(bid => ({
      ...bid,
      score: (bid.scorePrior ?? 0) + intentSimilarity(bid.intent, intent),
    }));

    scoredBids.sort((a, b) => b.score - a.score);

    console.log(scoredBids);

    return scoredBids.map(widget => widget.widget);
  }


}

export default WidgetRegistry;