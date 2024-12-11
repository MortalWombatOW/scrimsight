
import React from "react";
import UploaderWidgetBidder from "./bidders/UploaderWidgetBidder";
import MetricCardWidgetBidder from "./bidders/MetricCardWidgetBidder";
import { WidgetBidder, Intent, WidgetBid, intentSimilarity } from "./Widget";

class WidgetRegistry {
  private bidders: WidgetBidder[] = [
    UploaderWidgetBidder,
    MetricCardWidgetBidder,
  ];

  getWidgets(intent: Intent): React.ReactNode[] {
    const bids: WidgetBid[] = this.bidders.flatMap(bidder => bidder(intent));

    bids.sort((a, b) => intentSimilarity(a.intent, intent) - intentSimilarity(b.intent, intent));

    return bids.map(widget => widget.widget);
  }


}

export default WidgetRegistry;