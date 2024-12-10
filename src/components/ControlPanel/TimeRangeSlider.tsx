import { Slider } from "@mui/material";

interface TimeRangeSliderProps {
  value: [number, number];
  min: number;
  max: number;
  minDistance: number;
  renderLabel: (value: number, index: number) => React.ReactNode;
  onChange: (value: [number, number]) => void;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({ value, min, max, minDistance, renderLabel, onChange }) => {

  const handleChange = (value: [number, number], activeThumb: number) => {
    if (activeThumb === 0) {
      onChange([Math.min(value[0], value[1] - minDistance), value[1]]);
    } else {
      onChange([value[0], Math.max(value[0] + minDistance, value[1])]);
    }
  };

  return <div style={{ width: '100%', minWidth: 300, maxWidth: 500 }}><Slider value={value} onChange={(_, value, activeThumb) => handleChange(value as [number, number], activeThumb)} min={min} max={max} valueLabelFormat={renderLabel} /></div>;
};

export default TimeRangeSlider;