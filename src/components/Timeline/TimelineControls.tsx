import React, { useEffect } from "react";
import { formatTime } from "../../lib/format";

interface TimelineControlsProps {
  timeRange: { start: number; end: number };
  currentTimeRange: { start: number; end: number };
  onTimeRangeChange: (start: number, end: number) => void;
}

/**
 * TimelineControls component for navigating the timeline
 * Enhanced with improved UI and minimum range enforcement
 */
export const TimelineControls: React.FC<TimelineControlsProps> = ({
  timeRange,
  currentTimeRange,
  onTimeRangeChange,
}) => {
  // Minimum allowed range between start and end (10 units)
  const MIN_RANGE = 10;

  // Handle time range change with minimum range enforcement
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = parseInt(e.target.value);
    const newEnd = Math.max(currentTimeRange.end, newStart + MIN_RANGE);
    onTimeRangeChange(newStart, newEnd);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = parseInt(e.target.value);
    const newStart = Math.min(currentTimeRange.start, newEnd - MIN_RANGE);
    onTimeRangeChange(newStart, newEnd);
  };

  // Handle direct track click for better UX
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click position relative to the track
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;

    // Calculate the new time value based on click position
    const newValue = Math.round(
      timeRange.start + clickPosition * (timeRange.end - timeRange.start)
    );

    // Determine if the click is closer to start or end handle
    const distanceToStart = Math.abs(newValue - currentTimeRange.start);
    const distanceToEnd = Math.abs(newValue - currentTimeRange.end);

    if (distanceToStart < distanceToEnd) {
      // Click is closer to start handle, move start (respecting min range)
      const newStart = Math.min(newValue, currentTimeRange.end - MIN_RANGE);
      onTimeRangeChange(newStart, currentTimeRange.end);
    } else {
      // Click is closer to end handle, move end (respecting min range)
      const newEnd = Math.max(newValue, currentTimeRange.start + MIN_RANGE);
      onTimeRangeChange(currentTimeRange.start, newEnd);
    }
  };

  // Ensure minimum range on component mount and when props change
  useEffect(() => {
    const currentRange = currentTimeRange.end - currentTimeRange.start;
    if (currentRange < MIN_RANGE) {
      // Adjust the end time to maintain minimum range
      const newEnd = currentTimeRange.start + MIN_RANGE;
      if (newEnd <= timeRange.end) {
        onTimeRangeChange(currentTimeRange.start, newEnd);
      } else {
        // If we can't extend end, adjust start instead
        onTimeRangeChange(timeRange.end - MIN_RANGE, timeRange.end);
      }
    }
  }, [currentTimeRange, timeRange, onTimeRangeChange]);

  // Handle reset
  const handleReset = () => {
    onTimeRangeChange(timeRange.start, timeRange.end);
  };

  // Calculate position percentages for styling
  const startPercent =
    ((currentTimeRange.start - timeRange.start) /
      (timeRange.end - timeRange.start)) *
    100;
  const endPercent =
    ((currentTimeRange.end - timeRange.start) /
      (timeRange.end - timeRange.start)) *
    100;
  const rangeWidth = endPercent - startPercent;

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Time Range</h4>
        <button
          className="px-3 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Time range control */}
      <div className="space-y-6">
        {/* Current selection display */}
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Start</span>
            <span className="text-sm font-medium text-gray-800">
              {formatTime(currentTimeRange.start)}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <span>
              {formatTime(currentTimeRange.end - currentTimeRange.start)} in
              range
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-1">End</span>
            <span className="text-sm font-medium text-gray-800">
              {formatTime(currentTimeRange.end)}
            </span>
          </div>
        </div>

        {/* Slider track with improved interaction */}
        <div className="relative pt-1">
          {/* Track background */}
          <div
            className="h-1 w-full bg-gray-200 rounded-full overflow-hidden cursor-pointer"
            onClick={handleTrackClick}
          >
            {/* Selected range indicator */}
            <div
              className="h-full bg-gray-500"
              style={{
                width: `${rangeWidth}%`,
                marginLeft: `${startPercent}%`,
              }}
            ></div>
          </div>

          {/* Thumb handles */}
          <div className="relative h-5 -mt-3">
            {/* Start thumb - positioned absolutely */}
            <div className="absolute top-0 left-0 w-full">
              <input
                type="range"
                min={timeRange.start}
                max={timeRange.end - MIN_RANGE}
                value={currentTimeRange.start}
                onChange={handleStartChange}
                className="w-full pointer-events-none h-5 absolute appearance-none bg-transparent z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto"
              />
            </div>

            {/* End thumb - positioned absolutely */}
            <div className="absolute top-0 left-0 w-full">
              <input
                type="range"
                min={timeRange.start + MIN_RANGE}
                max={timeRange.end}
                value={currentTimeRange.end}
                onChange={handleEndChange}
                className="w-full pointer-events-none h-5 absolute appearance-none bg-transparent z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto"
              />
            </div>
          </div>
        </div>

        {/* Timeline boundaries */}
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>{formatTime(timeRange.start)}</span>
          <span>{formatTime(timeRange.end)}</span>
        </div>
      </div>
    </div>
  );
};
