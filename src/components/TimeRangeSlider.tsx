import type { ReactNode } from "react";

// TimeRangeSlider component
interface TimeRangeSliderProps {
  value: [number, number];
  min: number;
  max: number;
  minDistance: number;
  renderLabel: (value: number, index: number) => React.ReactNode;
  onChange: (value: [number, number]) => void;
}

const TimeRangeSlider = ({
  value,
  min,
  max,
  minDistance,
  renderLabel,
  onChange,
}: TimeRangeSliderProps): ReactNode => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: 0 | 1
  ) => {
    const newValue = parseInt(event.target.value, 10);
    const newValues = [...value] as [number, number];

    if (index === 0) {
      // Left thumb
      newValues[0] = Math.min(newValue, value[1] - minDistance);
    } else {
      // Right thumb
      newValues[1] = Math.max(newValue, value[0] + minDistance);
    }

    onChange(newValues);
  };

  const getTrackStyle = () => {
    const range = max - min;
    const leftPercent = ((value[0] - min) / range) * 100;
    const rightPercent = ((value[1] - min) / range) * 100;

    return {
      background: `linear-gradient(to right, 
        #e5e7eb 0%, #e5e7eb ${leftPercent}%, 
        #3b82f6 ${leftPercent}%, #3b82f6 ${rightPercent}%, 
        #e5e7eb ${rightPercent}%, #e5e7eb 100%)`,
    };
  };

  return (
    <div className="w-full min-w-[300px] max-w-[500px] px-2 py-4 relative">
      <div
        className="h-1 w-full rounded-md bg-base-200 mb-4"
        style={getTrackStyle()}
      ></div>

      {/* Left thumb */}
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={(e) => handleChange(e, 0)}
        className="absolute top-3 w-full appearance-none bg-transparent pointer-events-none"
        style={{
          // Hide default track
          WebkitAppearance: "none",
          appearance: "none",
          // Style the thumb
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {/* Right thumb */}
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        onChange={(e) => handleChange(e, 1)}
        className="absolute top-3 w-full appearance-none bg-transparent pointer-events-none"
        style={{
          // Hide default track
          WebkitAppearance: "none",
          appearance: "none",
          // Style the thumb
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {/* Labels */}
      <div className="flex justify-between mt-2">
        <div>{renderLabel(value[0], 0)}</div>
        <div>{renderLabel(value[1], 1)}</div>
      </div>
    </div>
  );
};

export default TimeRangeSlider;
