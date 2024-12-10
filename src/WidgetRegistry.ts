
import UploaderWidgetBidder from "./bidders/UploaderWidgetBidder";
import MetricCardWidgetBidder from "./bidders/MetricCardWidgetBidder";
import { WidgetBidder, Intent } from "./Widget";

class WidgetRegistry {
  private bidders: WidgetBidder[] = [
    UploaderWidgetBidder,
    MetricCardWidgetBidder,
  ];

  getWidgets(intent: Intent, maxWidgets: number): React.ReactNode[] {
    const widgets: React.ReactNode[] = [];
    for (let i = 0; i < this.bidders.length && widgets.length < maxWidgets; i++) {
      widgets.push(...this.bidders[i](intent));
    }
    return widgets.slice(0, maxWidgets);
  }


}

export default WidgetRegistry;