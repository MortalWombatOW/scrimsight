/* eslint-disable @typescript-eslint/no-explicit-any */

import UploaderWidgetBidder from "./bidders/UploaderWidgetBidder";
import MetricCardWidgetBidder from "./bidders/MetricCardWidgetBidder";
import { WidgetBidder, Intent, WidgetBid, intentSimilarity } from "./Widget";
import WelcomeWidgetBidder from "~/bidders/WelcomeWidgetBidder";
import MatchListBidder from "~/bidders/MatchListBidder";
import ChordDiagramWidgetBidder from "~/bidders/ChordDiagramWidgetBidder";
import BarChartBidder from "~/bidders/BarChartBidder";
import KillsTableWidgetBidder from "~/bidders/KillsTableBidder";
import ScatterChartBidder from "~/bidders/ScatterChartBidder";

type ScoredWidgetBid<T> = WidgetBid<T> & {
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
    ScatterChartBidder,
    KillsTableWidgetBidder,
  ];

  constructor(widgetGridWidth: number, widgetGridHeight: number) {
    this.widgetGridWidth = widgetGridWidth;
    this.widgetGridHeight = widgetGridHeight;
  }

  getBids(intent: Intent): WidgetBid<any>[] {
    return this.bidders.flatMap(bidder => bidder(intent));
  }

  getScore(bid: WidgetBid<any>, intent: Intent): number {
    return (bid.scorePrior ?? 0) + intentSimilarity(bid.intent, intent);
  }

  getScoredBids(intent: Intent): ScoredWidgetBid<any>[] {
    const bids: WidgetBid<any>[] = this.getBids(intent);
    const scoredBids: ScoredWidgetBid<any>[] = bids.map(bid => ({
      ...bid,
      score: this.getScore(bid, intent),
    }));

    scoredBids.sort((a, b) => b.score - a.score);

    return scoredBids;
  }

}

export default WidgetRegistry;