import FileLoader from "~/components/FileLoader/FileLoader";
import { WidgetBidder } from "../Widget";
import { useWombatDataManager } from "wombat-data-framework";

const UploaderWidgetBidder: WidgetBidder = () => {
  // Want to show the uploader no matter what the intent is.
  return [
    { id: 'uploader', intent: {}, displayName: 'Add Matches', description: 'Add logs for analysis', gridColumnSpan: 1, gridRowSpan: 1, widget: UploaderWidget, widgetProps: {} },
  ];
};

const UploaderWidget: React.FC = () => {
  const dataManager = useWombatDataManager();
  return <FileLoader onSubmit={(files) => {
    dataManager.setInputForInputNode('log_file_input', files);
  }} />;
};

export default UploaderWidgetBidder;