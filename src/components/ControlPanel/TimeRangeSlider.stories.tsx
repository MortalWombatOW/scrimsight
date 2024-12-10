import type { Meta, StoryObj } from "@storybook/react";
import TimeRangeSlider from "./TimeRangeSlider";
import React from "react";

const meta: Meta<typeof TimeRangeSlider> = {
  component: TimeRangeSlider,
  argTypes: {
    value: {
      control: 'object',
      description: 'Current range values [start, end]',
    },
    min: {
      control: 'number',
      description: 'Minimum value of the range',
    },
    max: {
      control: 'number',
      description: 'Maximum value of the range',
    },
    minDistance: {
      control: 'number',
      description: 'Minimum distance between handles',
    },
    onChange: {
      action: 'range changed',
      description: 'Callback when range values change',
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimeRangeSlider>;

// Helper function to format time (assumes value is in minutes since midnight)
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Helper function to format date (assumes value is days since epoch)
const formatDate = (days: number) => {
  const date = new Date(days * 24 * 60 * 60 * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Time range example (24-hour format)
export const TimeRange: Story = {
  args: {
    value: [540, 1020], // 9:00 to 17:00
    min: 0, // 00:00
    max: 1440, // 24:00
    minDistance: 60, // 1 hour minimum
    renderLabel: (value: number) => formatTime(value),
  },
};

// Date range example
export const DateRange: Story = {
  args: {
    value: [19723, 19753], // Example date range
    min: 19692, // Start of month
    max: 19784, // End of month
    minDistance: 1, // Minimum 1 day
    renderLabel: (value: number) => formatDate(value),
  },
};

// Interactive time range demo
export const InteractiveTimeRange: Story = {
  render: () => {
    const [value, setValue] = React.useState<[number, number]>([540, 1020]);
    
    return (
      <div>
        <h3>Time Range Selection</h3>
        <TimeRangeSlider 
          value={value}
          onChange={setValue}
          min={0}
          max={1440}
          minDistance={60}
          renderLabel={(value) => formatTime(value)}
        />
        <div style={{ marginTop: '1rem', fontFamily: 'monospace' }}>
          Selected Time Range: {formatTime(value[0])} - {formatTime(value[1])}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive time range selector with 24-hour format. Minimum interval is 1 hour.',
      },
    },
  },
};

// Interactive date range demo
export const InteractiveDateRange: Story = {
  render: () => {
    const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    const [value, setValue] = React.useState<[number, number]>([today - 7, today]);
    
    return (
      <div>
        <h3>Date Range Selection</h3>
        <TimeRangeSlider 
          value={value}
          onChange={setValue}
          min={today - 30}
          max={today}
          minDistance={1}
          renderLabel={(value) => formatDate(value)}
        />
        <div style={{ marginTop: '1rem', fontFamily: 'monospace' }}>
          Selected Date Range: {formatDate(value[0])} - {formatDate(value[1])}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive date range selector showing the last 30 days. Minimum interval is 1 day.',
      },
    },
  },
};

// Custom range with minutes
export const MinuteRange: Story = {
  args: {
    value: [15, 45],
    min: 0,
    max: 60,
    minDistance: 5,
    renderLabel: (value: number) => `${value}m`,
  },
};

// Combined interactive demo
export const InteractiveCombined: Story = {
  render: () => {
    const [mode, setMode] = React.useState<'time' | 'date'>('time');
    const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    
    const [timeValue, setTimeValue] = React.useState<[number, number]>([540, 1020]);
    const [dateValue, setDateValue] = React.useState<[number, number]>([today - 7, today]);
    
    const config = mode === 'time' 
      ? {
          value: timeValue,
          onChange: setTimeValue,
          min: 0,
          max: 1440,
          minDistance: 60,
          renderLabel: formatTime,
        }
      : {
          value: dateValue,
          onChange: setDateValue,
          min: today - 30,
          max: today,
          minDistance: 1,
          renderLabel: formatDate,
        };
    
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Mode: 
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as 'time' | 'date')}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="time">Time Range</option>
              <option value="date">Date Range</option>
            </select>
          </label>
        </div>
        <TimeRangeSlider {...config} />
        <div style={{ marginTop: '1rem', fontFamily: 'monospace' }}>
          {mode === 'time' 
            ? `Selected Time: ${formatTime(timeValue[0])} - ${formatTime(timeValue[1])}`
            : `Selected Dates: ${formatDate(dateValue[0])} - ${formatDate(dateValue[1])}`
          }
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Combined demo showing both time and date range functionality with toggle.',
      },
    },
  },
}; 