import Uploader from "../components/Uploader/Uploader";
import { WidgetBidder } from "../Widget";

const UploaderWidgetBidder: WidgetBidder = () => {
  // Want to show the uploader no matter what the intent is.
  return [
    {id: 'uploader', intent: {}, widget: <UploaderWidget />}
  ];
};

const UploaderWidget: React.FC = () => {
  return <Uploader />;
};

export default UploaderWidgetBidder;