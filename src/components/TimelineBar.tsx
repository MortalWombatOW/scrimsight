import { ReactNode } from "react";

export interface Segment {
  id: string;
  start: number;
  end: number;
  color: string;
  icon?: ReactNode;
}

interface TimelineBarProps {
  segments: Segment[];
  total: number;
  onSegmentClick?: (id: string) => void;
}

const TimelineBar = ({ segments, total, onSegmentClick }: TimelineBarProps) => {
  const barHeight = 40;
  const iconSize = 16;

  const getSegmentWidth = (segment: Segment) => {
    return ((segment.end - segment.start) / total) * 100;
  };

  const getSegmentLeft = (segment: Segment) => {
    return (segment.start / total) * 100;
  };

  const handleSegmentClick = (segmentId: string) => {
    if (onSegmentClick) {
      onSegmentClick(segmentId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, segmentId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSegmentClick(segmentId);
    }
  };

  return (
    <div className="w-full">
      <div
        className="relative bg-base-300 rounded-lg overflow-hidden"
        style={{ height: barHeight }}
      >
        <svg
          width="100%"
          height={barHeight}
          className="absolute inset-0"
          role="img"
          aria-label="Timeline bar with interactive segments"
        >
          {segments.map((segment) => {
            const width = getSegmentWidth(segment);
            const left = getSegmentLeft(segment);

            return (
              <g key={segment.id}>
                <rect
                  x={`${left}%`}
                  y="0"
                  width={`${width}%`}
                  height={barHeight}
                  fill={segment.color}
                  className={`transition-opacity duration-200 ${
                    onSegmentClick
                      ? "cursor-pointer hover:opacity-80 focus:opacity-80"
                      : ""
                  }`}
                  onClick={() => handleSegmentClick(segment.id)}
                  onKeyDown={(e) => handleKeyDown(e, segment.id)}
                  tabIndex={onSegmentClick ? 0 : -1}
                  role={onSegmentClick ? "button" : "presentation"}
                  aria-label={`Segment ${segment.id} from ${segment.start} to ${segment.end}`}
                />
                {segment.icon && (
                  <foreignObject
                    x={`calc(${left}% + ${iconSize / 2}px)`}
                    y={(barHeight - iconSize) / 2}
                    width={iconSize}
                    height={iconSize}
                    className="pointer-events-none"
                  >
                    <div
                      className="flex items-center justify-center text-white drop-shadow-sm"
                      style={{ width: iconSize, height: iconSize }}
                    >
                      {segment.icon}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between text-xs text-base-content/70 mt-2">
        <span>0</span>
        <span>{total}</span>
      </div>
    </div>
  );
};

export default TimelineBar;
