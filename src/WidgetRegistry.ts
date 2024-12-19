
import React from "react";
import UploaderWidgetBidder from "./bidders/UploaderWidgetBidder";
import MetricCardWidgetBidder from "./bidders/MetricCardWidgetBidder";
import { WidgetBidder, Intent, WidgetBid, intentSimilarity } from "./Widget";
import WelcomeWidgetBidder from "~/bidders/WelcomeWidgetBidder";
import MatchListBidder from "~/bidders/MatchListBidder";
import ChordDiagramWidgetBidder from "~/bidders/ChordDiagramWidgetBidder";
import BarChartBidder from "~/bidders/BarChartBidder";

type ScoredWidgetBid = WidgetBid & {
  score: number;
}

class WidgetRegistry {
  readonly widgetGridWidth: number;
  readonly widgetGridHeight: number;

  private bidders: WidgetBidder[] = [
    UploaderWidgetBidder,
    MetricCardWidgetBidder,
    WelcomeWidgetBidder,
    MatchListBidder,
    ChordDiagramWidgetBidder,
    BarChartBidder,
  ];

  constructor(widgetGridWidth: number, widgetGridHeight: number) {
    this.widgetGridWidth = widgetGridWidth;
    this.widgetGridHeight = widgetGridHeight;
  }

  getBids(intent: Intent): WidgetBid[] {
    return this.bidders.flatMap(bidder => bidder(intent));
  }

  getScore(bid: WidgetBid, intent: Intent): number {
    return (bid.scorePrior ?? 0) + intentSimilarity(bid.intent, intent);
  }

  getScoredBids(intent: Intent): ScoredWidgetBid[] {
    const bids: WidgetBid[] = this.getBids(intent);
    const scoredBids: ScoredWidgetBid[] = bids.map(bid => ({
      ...bid,
      score: this.getScore(bid, intent),
    }));

    scoredBids.sort((a, b) => b.score - a.score);

    return scoredBids;
  }

  getWidgets(intent: Intent): React.ReactNode[] {
    const scoredBids: ScoredWidgetBid[] = this.getScoredBids(intent);
  
    console.log(scoredBids);

    return scoredBids.map(widget => widget.widget);
  }


}

export default WidgetRegistry;