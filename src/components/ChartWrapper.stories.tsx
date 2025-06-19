import type { Meta, StoryObj } from '@storybook/react';
import ChartWrapper from './ChartWrapper';

const meta: Meta<typeof ChartWrapper> = {
  title: 'Components/ChartWrapper',
  component: ChartWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible chart wrapper component built on top of Recharts with DaisyUI theming support. Supports line, bar, area, and pie charts with configurable styling and interaction.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    config: {
      description: 'Chart configuration object',
    },
    title: {
      control: 'text',
      description: 'Chart title',
    },
    subtitle: {
      control: 'text',
      description: 'Chart subtitle',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for different chart types
const lineChartData = [
  { month: 'Jan', sales: 4000, profit: 2400, expenses: 1600 },
  { month: 'Feb', sales: 3000, profit: 1398, expenses: 1602 },
  { month: 'Mar', sales: 2000, profit: 9800, expenses: -1200 },
  { month: 'Apr', sales: 2780, profit: 3908, expenses: -1128 },
  { month: 'May', sales: 1890, profit: 4800, expenses: -1090 },
  { month: 'Jun', sales: 2390, profit: 3800, expenses: -1410 },
];

const barChartData = [
  { category: 'Desktop', users: 1200, sessions: 2400 },
  { category: 'Mobile', users: 1800, sessions: 1398 },
  { category: 'Tablet', users: 600, sessions: 800 },
  { category: 'Smart TV', users: 200, sessions: 300 },
];

const areaChartData = [
  { time: '00:00', active: 20, inactive: 80 },
  { time: '04:00', active: 15, inactive: 85 },
  { time: '08:00', active: 45, inactive: 55 },
  { time: '12:00', active: 65, inactive: 35 },
  { time: '16:00', active: 70, inactive: 30 },
  { time: '20:00', active: 40, inactive: 60 },
];

const pieChartData = [
  { name: 'Chrome', value: 45.2 },
  { name: 'Safari', value: 28.1 },
  { name: 'Firefox', value: 15.3 },
  { name: 'Edge', value: 8.7 },
  { name: 'Other', value: 2.7 },
];

const performanceData = [
  { date: '2024-01-01', responseTime: 120, throughput: 850, errorRate: 0.2 },
  { date: '2024-01-02', responseTime: 115, throughput: 920, errorRate: 0.1 },
  { date: '2024-01-03', responseTime: 130, throughput: 780, errorRate: 0.3 },
  { date: '2024-01-04', responseTime: 108, throughput: 980, errorRate: 0.05 },
  { date: '2024-01-05', responseTime: 125, throughput: 870, errorRate: 0.15 },
  { date: '2024-01-06', responseTime: 95, throughput: 1100, errorRate: 0.02 },
  { date: '2024-01-07', responseTime: 102, throughput: 1050, errorRate: 0.08 },
];

// Line Chart Stories
export const LineChart: Story = {
  args: {
    config: {
      type: 'line',
      data: lineChartData,
      series: [
        { dataKey: 'sales', name: 'Sales', stroke: '#84d84b' },
        { dataKey: 'profit', name: 'Profit', stroke: '#a855f7' },
        { dataKey: 'expenses', name: 'Expenses', stroke: '#ef4444' },
      ],
      xAxis: { dataKey: 'month' },
      yAxis: {},
      showGrid: true,
      showTooltip: true,
      showLegend: true,
    },
    title: 'Monthly Financial Performance',
    subtitle: 'Sales, profit, and expenses over time',
  },
};

export const BarChart: Story = {
  args: {
    config: {
      type: 'bar',
      data: barChartData,
      series: [
        { dataKey: 'users', name: 'Users', fill: '#84d84b' },
        { dataKey: 'sessions', name: 'Sessions', fill: '#a855f7' },
      ],
      xAxis: { dataKey: 'category' },
      yAxis: {},
      showGrid: true,
      showTooltip: true,
      showLegend: true,
    },
    title: 'User Analytics by Device',
    subtitle: 'Users and sessions across different device types',
  },
};

export const AreaChart: Story = {
  args: {
    config: {
      type: 'area',
      data: areaChartData,
      series: [
        { dataKey: 'active', name: 'Active Users', fill: '#10b981' },
        { dataKey: 'inactive', name: 'Inactive Users', fill: '#f59e0b' },
      ],
      xAxis: { dataKey: 'time' },
      yAxis: {},
      showGrid: true,
      showTooltip: true,
      showLegend: true,
    },
    title: 'Daily User Activity',
    subtitle: 'Active vs inactive users throughout the day',
  },
};

export const PieChart: Story = {
  args: {
    config: {
      type: 'pie',
      data: pieChartData,
      series: [{ dataKey: 'value', name: 'Usage' }],
      xAxis: { dataKey: 'name' },
      showTooltip: true,
      showLegend: true,
      height: 400,
    },
    title: 'Browser Usage Distribution',
    subtitle: 'Market share by browser type',
  },
};

// Advanced Line Chart with Custom Formatting
export const AdvancedLineChart: Story = {
  args: {
    config: {
      type: 'line',
      data: performanceData,
      series: [
        { 
          dataKey: 'responseTime', 
          name: 'Response Time (ms)', 
          stroke: '#3b82f6',
          strokeWidth: 3,
        },
        { 
          dataKey: 'throughput', 
          name: 'Throughput (req/s)', 
          stroke: '#10b981',
          strokeWidth: 2,
        },
      ],
      xAxis: { 
        dataKey: 'date',
        tickFormatter: (value: string | number | undefined) => {
          if (typeof value === 'string') {
            return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          return String(value || '');
        },
      },
      yAxis: {},
      showGrid: true,
      showTooltip: true,
      showLegend: true,
      height: 350,
    },
    title: 'System Performance Metrics',
    subtitle: 'Response time and throughput over the past week',
  },
};

// Loading State
export const LoadingState: Story = {
  args: {
    config: {
      type: 'line',
      data: [],
      series: [],
    },
    loading: true,
    title: 'Loading Chart',
    subtitle: 'Please wait while data is being fetched',
  },
};

// Error State
export const ErrorState: Story = {
  args: {
    config: {
      type: 'line',
      data: [],
      series: [],
    },
    error: 'Failed to load chart data. Please try again.',
    title: 'Error Chart',
    subtitle: 'Something went wrong',
  },
};

// Empty Data State
export const EmptyDataState: Story = {
  args: {
    config: {
      type: 'line',
      data: [],
      series: [{ dataKey: 'value', name: 'Value' }],
      xAxis: { dataKey: 'x' },
      yAxis: {},
    },
    title: 'Empty Chart',
    subtitle: 'No data available to display',
  },
};

// Custom Styling
export const CustomStyling: Story = {
  args: {
    config: {
      type: 'bar',
      data: barChartData,
      series: [
        { dataKey: 'users', name: 'Users', fill: '#8B5CF6' },
        { dataKey: 'sessions', name: 'Sessions', fill: '#06B6D4' },
      ],
      xAxis: { dataKey: 'category' },
      yAxis: {},
      showGrid: false,
      showTooltip: true,
      showLegend: true,
      height: 300,
      colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
    },
    title: 'Custom Styled Chart',
    subtitle: 'Custom colors and reduced height',
    className: 'border-2 border-primary',
  },
};


// Multiple Charts Layout
export const MultipleChartsLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartWrapper
        config={{
          type: 'line',
          data: lineChartData.slice(0, 4),
          series: [{ dataKey: 'sales', name: 'Sales', stroke: '#84d84b' }],
          xAxis: { dataKey: 'month' },
          yAxis: {},
          height: 250,
        }}
        title="Q1 Sales"
        subtitle="First quarter performance"
      />
      <ChartWrapper
        config={{
          type: 'bar',
          data: barChartData.slice(0, 3),
          series: [{ dataKey: 'users', name: 'Users', fill: '#a855f7' }],
          xAxis: { dataKey: 'category' },
          yAxis: {},
          height: 250,
        }}
        title="Top Devices"
        subtitle="Most popular user devices"
      />
      <ChartWrapper
        config={{
          type: 'area',
          data: areaChartData.slice(0, 4),
          series: [{ dataKey: 'active', name: 'Active', fill: '#10b981' }],
          xAxis: { dataKey: 'time' },
          yAxis: {},
          height: 250,
        }}
        title="User Activity"
        subtitle="Peak activity hours"
      />
      <ChartWrapper
        config={{
          type: 'pie',
          data: pieChartData.slice(0, 3),
          series: [{ dataKey: 'value', name: 'Share' }],
          xAxis: { dataKey: 'name' },
          height: 250,
        }}
        title="Browser Share"
        subtitle="Top 3 browsers"
      />
    </div>
  ),
};

// Responsive Design
export const ResponsiveDesign: Story = {
  args: {
    config: {
      type: 'line',
      data: performanceData,
      series: [
        { dataKey: 'responseTime', name: 'Response Time', stroke: '#3b82f6' },
        { dataKey: 'throughput', name: 'Throughput', stroke: '#10b981' },
      ],
      xAxis: { dataKey: 'date' },
      yAxis: {},
      showGrid: true,
      showTooltip: true,
      showLegend: true,
      height: 400,
    },
    title: 'Responsive Chart',
    subtitle: 'Resize the viewport to see responsive behavior',
    className: 'w-full',
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};