import ChordDiagram from "~/components/ChordDiagram/ChordDiagram";
import { WidgetBidder } from "../Widget";

const ChordDiagramWidgetBidder: WidgetBidder = (intent) => {
  if (!intent.matchId) {
    return [];
  }
  return intent.matchId.map((matchId) => ({
    id: `chord-diagram-${matchId}`,
    intent: {
      matchId: [matchId],
    },
    displayName: `Kills Chord Diagram for ${matchId}`,
    description: `A diagram showing the flow of kills in ${matchId}`,
    gridColumnSpan: 2,
    gridRowSpan: 2,
    widget: <ChordDiagram matchId={matchId} />,
  }));
};

export default ChordDiagramWidgetBidder;
