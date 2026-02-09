import { type ReactNode } from "react";
import { GiBattleAxe, GiPodiumWinner, GiCheckeredFlag } from "react-icons/gi"; // Example icons
import { type TimelineSegmentButtonData } from "../../domain/timeline";

interface TimelineButtonProps {
  segment: TimelineSegmentButtonData;
  isSelected: boolean;
  onClick: (start: number, end: number) => void;
  team1Name?: string; // Passed down for color mapping
  team2Name?: string; // Passed down for color mapping
}

export const TimelineButton = ({
  segment,
  isSelected,
  onClick,
  team1Name,
  team2Name,
}: TimelineButtonProps): ReactNode => {
  const handleClick = () => {
    onClick(segment.startTime, segment.endTime);
  };

  // Determine border color based on winner
  let borderColorClass = "border-base-content/10"; // Default border
  if (segment.winner) {
    if (segment.winner === team1Name) {
      borderColorClass = "border-info"; // Team 1 win
    } else if (segment.winner === team2Name) {
      borderColorClass = "border-error"; // Team 2 win
    }
  }

  const selectedClass = isSelected
    ? "ring-2 ring-offset-2 ring-offset-base-100 ring-primary" // Highlight if selected
    : "";

  // Choose icon based on type
  let IconComponent;
  let iconLabel = "";
  switch (segment.type) {
    case "teamfight":
      IconComponent = GiBattleAxe;
      iconLabel = `Fight ${segment.id.split('-').pop()}`; // Simple fight number
      break;
    case "round":
      IconComponent = GiPodiumWinner;
      iconLabel = `R${segment.roundNumber}`;
      break;
    case "map":
      IconComponent = GiCheckeredFlag;
      iconLabel = "Match";
      break;
    default:
      IconComponent = null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn btn-xs btn-outline ${borderColorClass} ${selectedClass} flex items-center gap-1 normal-case font-normal`}
      title={segment.title} // Tooltip for full title
    >
      {IconComponent && <IconComponent className="w-3 h-3" />}
      <span className="truncate max-w-[80px]">{iconLabel}</span>
    </button>
  );
};
