import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartWrapper from './ChartWrapper';
import { ChartConfig, ChartDataPoint } from './ChartWrapper';

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children, width, height }: { children: React.ReactNode; width: string; height: number }) => (
    <div data-testid="responsive-container" data-width={width} data-height={height}>
      {children}
    </div>
  ),
  LineChart: ({ data, margin, children }: { data: ChartDataPoint[]; margin: object; children: React.ReactNode }) => (
    <div data-testid="line-chart" data-data={JSON.stringify(data)} data-margin={JSON.stringify(margin)}>
      {children}
    </div>
  ),
  BarChart: ({ data, margin, children }: { data: ChartDataPoint[]; margin: object; children: React.ReactNode }) => (
    <div data-testid="bar-chart" data-data={JSON.stringify(data)} data-margin={JSON.stringify(margin)}>
      {children}
    </div>
  ),
  AreaChart: ({ data, margin, children }: { data: ChartDataPoint[]; margin: object; children: React.ReactNode }) => (
    <div data-testid="area-chart" data-data={JSON.stringify(data)} data-margin={JSON.stringify(margin)}>
      {children}
    </div>
  ),
  PieChart: ({ data, margin, children }: { data: ChartDataPoint[]; margin: object; children: React.ReactNode }) => (
    <div data-testid="pie-chart" data-data={JSON.stringify(data)} data-margin={JSON.stringify(margin)}>
      {children}
    </div>
  ),
  XAxis: ({ dataKey, domain, tick, tickFormatter, className }: { dataKey?: string; domain?: [number | string, number | string]; tick?: boolean; tickFormatter?: (value: string | number | undefined) => string; className?: string }) => (
    <div 
      data-testid="x-axis" 
      data-datakey={dataKey} 
      data-domain={JSON.stringify(domain)} 
      data-tick={tick} 
      data-tick-formatter={tickFormatter ? 'custom' : 'default'}
      className={className}
    />
  ),
  YAxis: ({ domain, tick, tickFormatter, className }: { domain?: [number | string, number | string]; tick?: boolean; tickFormatter?: (value: string | number | undefined) => string; className?: string }) => (
    <div 
      data-testid="y-axis" 
      data-domain={JSON.stringify(domain)} 
      data-tick={tick} 
      data-tick-formatter={tickFormatter ? 'custom' : 'default'}
      className={className}
    />
  ),
  CartesianGrid: ({ strokeDasharray, className }: { strokeDasharray?: string; className?: string }) => (
    <div data-testid="cartesian-grid" data-stroke-dasharray={strokeDasharray} className={className} />
  ),
  Tooltip: ({ content }: { content?: React.ComponentType<unknown> }) => (
    <div data-testid="tooltip" data-has-custom-content={content ? 'true' : 'false'} />
  ),
  Legend: ({ className }: { className?: string }) => (
    <div data-testid="legend" className={className} />
  ),
  Line: ({ type, dataKey, name, stroke, strokeWidth, dot }: { type?: string; dataKey: string; name?: string; stroke?: string; strokeWidth?: number; dot?: object }) => (
    <div 
      data-testid="line-series" 
      data-type={type} 
      data-datakey={dataKey} 
      data-name={name} 
      data-stroke={stroke}
      data-stroke-width={strokeWidth}
      data-dot={JSON.stringify(dot)}
    />
  ),
  Bar: ({ dataKey, name, fill }: { dataKey: string; name?: string; fill?: string }) => (
    <div data-testid="bar-series" data-datakey={dataKey} data-name={name} data-fill={fill} />
  ),
  Area: ({ type, dataKey, name, stroke, fill, fillOpacity }: { type?: string; dataKey: string; name?: string; stroke?: string; fill?: string; fillOpacity?: number }) => (
    <div 
      data-testid="area-series" 
      data-type={type} 
      data-datakey={dataKey} 
      data-name={name} 
      data-stroke={stroke}
      data-fill={fill}
      data-fill-opacity={fillOpacity}
    />
  ),
  Pie: ({ data, dataKey, nameKey, cx, cy, outerRadius, label, children }: { data: ChartDataPoint[]; dataKey: string; nameKey: string; cx: string; cy: string; outerRadius: number; label: boolean; children: React.ReactNode }) => (
    <div 
      data-testid="pie-series" 
      data-data={JSON.stringify(data)}
      data-datakey={dataKey} 
      data-namekey={nameKey} 
      data-cx={cx}
      data-cy={cy}
      data-outer-radius={outerRadius}
      data-label={label}
    >
      {children}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="pie-cell" data-fill={fill} />
  ),
}));

// Mock EmptyState component
vi.mock('./EmptyState', () => ({
  default: ({ icon, title, description, size }: { icon: unknown; title: string; description: string; size: string }) => (
    <div data-testid="empty-state" data-title={title} data-description={description} data-size={size} />
  ),
}));

// Mock prettyFormat utility
vi.mock('../lib/format', () => ({
  prettyFormat: vi.fn((val: number | string | undefined) => {
    if (val === undefined) return 'undefined';
    if (typeof val === 'string') return val;
    if (val === Infinity) return '∞';
    if (val > 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  }),
}));

// Mock remeda
vi.mock('remeda', () => ({
  isNumber: vi.fn((val: unknown): val is number => typeof val === 'number'),
}));

const mockLineChartData: ChartDataPoint[] = [
  { month: 'Jan', sales: 4000, profit: 2400 },
  { month: 'Feb', sales: 3000, profit: 1398 },
  { month: 'Mar', sales: 2000, profit: 9800 },
];

const mockBarChartData: ChartDataPoint[] = [
  { category: 'Desktop', users: 1200, sessions: 2400 },
  { category: 'Mobile', users: 1800, sessions: 1398 },
];

const mockPieChartData: ChartDataPoint[] = [
  { name: 'Chrome', value: 45.2 },
  { name: 'Safari', value: 28.1 },
  { name: 'Firefox', value: 15.3 },
];

describe('ChartWrapper', () => {
  describe('when in loading state', () => {
    it('should display loading spinner', () => {
      const config: ChartConfig = {
        type: 'line',
        data: [],
        series: [],
      };

      const { container } = render(<ChartWrapper config={config} loading={true} />);
      
      const loadingSpinner = container.querySelector('.loading-spinner');
      expect(loadingSpinner).toBeInTheDocument();
      expect(loadingSpinner).toHaveClass('loading', 'loading-spinner', 'loading-lg', 'text-primary');
    });

    it('should not render chart content when loading', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} loading={true} />);
      
      expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('when in error state', () => {
    it('should display error message', () => {
      const config: ChartConfig = {
        type: 'line',
        data: [],
        series: [],
      };

      render(<ChartWrapper config={config} error="Failed to load data" />);
      
      const errorDisplay = screen.getByText('Failed to load data').closest('.alert');
      expect(errorDisplay).toBeInTheDocument();
      expect(errorDisplay).toHaveClass('alert', 'alert-error');
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    it('should include error icon in error display', () => {
      const config: ChartConfig = {
        type: 'line',
        data: [],
        series: [],
      };

      render(<ChartWrapper config={config} error="Test error" />);
      
      const errorDisplay = screen.getByText('Test error').closest('.alert');
      const errorIcon = errorDisplay?.querySelector('svg');
      expect(errorIcon).toBeInTheDocument();
      expect(errorIcon).toHaveClass('stroke-current', 'shrink-0', 'h-6', 'w-6');
    });

    it('should not render chart content when in error state', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} error="Test error" />);
      
      expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('when data is empty', () => {
    it('should display empty state with default message when data array is empty', () => {
      const config: ChartConfig = {
        type: 'line',
        data: [],
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} />);
      
      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveAttribute('data-title', 'No data available');
      expect(emptyState).toHaveAttribute('data-description', 'Please provide data to display the chart');
      expect(emptyState).toHaveAttribute('data-size', 'md');
    });

    it('should display empty state when data is null', () => {
      const config: ChartConfig = {
        type: 'line',
        data: null as unknown as ChartDataPoint[],
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('should not render chart content when data is empty', () => {
      const config: ChartConfig = {
        type: 'line',
        data: [],
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('chart title and subtitle', () => {
    it('should render title when provided', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} title="Sales Performance" />);
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Sales Performance');
      expect(title).toHaveClass('text-xl', 'font-semibold', 'text-base-content', 'mb-1');
    });

    it('should render subtitle when provided', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} subtitle="Monthly breakdown" />);
      
      const subtitle = screen.getByText('Monthly breakdown');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass('text-sm', 'text-base-content/70');
    });

    it('should render both title and subtitle when provided', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} title="Sales Chart" subtitle="Q1 Data" />);
      
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Sales Chart');
      expect(screen.getByText('Q1 Data')).toBeInTheDocument();
    });

    it('should not render header section when neither title nor subtitle provided', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });
  });

  describe('line chart rendering', () => {
    it('should render line chart with correct data and configuration', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales', stroke: '#84d84b' },
          { dataKey: 'profit', name: 'Profit', stroke: '#a855f7' },
        ],
        xAxis: { dataKey: 'month' },
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toHaveAttribute('data-data', JSON.stringify(mockLineChartData));
    });

    it('should render line series for each configured series', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales', stroke: '#84d84b' },
          { dataKey: 'profit', name: 'Profit', stroke: '#a855f7' },
        ],
        xAxis: { dataKey: 'month' },
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      const lineSeries = screen.getAllByTestId('line-series');
      expect(lineSeries).toHaveLength(2);
      
      expect(lineSeries[0]).toHaveAttribute('data-datakey', 'sales');
      expect(lineSeries[0]).toHaveAttribute('data-name', 'Sales');
      expect(lineSeries[0]).toHaveAttribute('data-stroke', '#84d84b');
      
      expect(lineSeries[1]).toHaveAttribute('data-datakey', 'profit');
      expect(lineSeries[1]).toHaveAttribute('data-name', 'Profit');
      expect(lineSeries[1]).toHaveAttribute('data-stroke', '#a855f7');
    });

    it('should render X and Y axes when configured', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        xAxis: { dataKey: 'month' },
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toHaveAttribute('data-datakey', 'month');
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('should render grid when showGrid is true', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        showGrid: true,
      };

      render(<ChartWrapper config={config} />);
      
      const grid = screen.getByTestId('cartesian-grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveAttribute('data-stroke-dasharray', '3 3');
      expect(grid).toHaveClass('stroke-base-300');
    });

    it('should not render grid when showGrid is false', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        showGrid: false,
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.queryByTestId('cartesian-grid')).not.toBeInTheDocument();
    });

    it('should render tooltip when showTooltip is true', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        showTooltip: true,
      };

      render(<ChartWrapper config={config} />);
      
      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('data-has-custom-content', 'true');
    });

    it('should render legend when showLegend is true', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        showLegend: true,
      };

      render(<ChartWrapper config={config} />);
      
      const legend = screen.getByTestId('legend');
      expect(legend).toBeInTheDocument();
      expect(legend).toHaveClass('text-base-content');
    });
  });

  describe('bar chart rendering', () => {
    it('should render bar chart with correct data and configuration', () => {
      const config: ChartConfig = {
        type: 'bar',
        data: mockBarChartData,
        series: [
          { dataKey: 'users', name: 'Users', fill: '#84d84b' },
          { dataKey: 'sessions', name: 'Sessions', fill: '#a855f7' },
        ],
        xAxis: { dataKey: 'category' },
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-data', JSON.stringify(mockBarChartData));
    });

    it('should render bar series for each configured series', () => {
      const config: ChartConfig = {
        type: 'bar',
        data: mockBarChartData,
        series: [
          { dataKey: 'users', name: 'Users', fill: '#84d84b' },
          { dataKey: 'sessions', name: 'Sessions', fill: '#a855f7' },
        ],
        xAxis: { dataKey: 'category' },
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      const barSeries = screen.getAllByTestId('bar-series');
      expect(barSeries).toHaveLength(2);
      
      expect(barSeries[0]).toHaveAttribute('data-datakey', 'users');
      expect(barSeries[0]).toHaveAttribute('data-name', 'Users');
      expect(barSeries[0]).toHaveAttribute('data-fill', '#84d84b');
    });
  });

  describe('area chart rendering', () => {
    it('should render area chart with correct data and configuration', () => {
      const config: ChartConfig = {
        type: 'area',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales', fill: '#84d84b' },
        ],
        xAxis: { dataKey: 'month' },
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('area-chart')).toHaveAttribute('data-data', JSON.stringify(mockLineChartData));
    });

    it('should render area series with fill opacity', () => {
      const config: ChartConfig = {
        type: 'area',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales', fill: '#84d84b' }],
        xAxis: { dataKey: 'month' },
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      const areaSeries = screen.getByTestId('area-series');
      expect(areaSeries).toHaveAttribute('data-fill-opacity', '0.6');
      expect(areaSeries).toHaveAttribute('data-fill', '#84d84b');
    });
  });

  describe('pie chart rendering', () => {
    it('should render pie chart with correct data and configuration', () => {
      const config: ChartConfig = {
        type: 'pie',
        data: mockPieChartData,
        series: [{ dataKey: 'value', name: 'Usage' }],
        xAxis: { dataKey: 'name' },
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toHaveAttribute('data-data', JSON.stringify(mockPieChartData));
    });

    it('should render pie series with correct configuration', () => {
      const config: ChartConfig = {
        type: 'pie',
        data: mockPieChartData,
        series: [{ dataKey: 'value', name: 'Usage' }],
        xAxis: { dataKey: 'name' },
        height: 400,
      };

      render(<ChartWrapper config={config} />);
      
      const pieSeries = screen.getByTestId('pie-series');
      expect(pieSeries).toHaveAttribute('data-datakey', 'value');
      expect(pieSeries).toHaveAttribute('data-namekey', 'name');
      expect(pieSeries).toHaveAttribute('data-cx', '50%');
      expect(pieSeries).toHaveAttribute('data-cy', '50%');
      expect(pieSeries).toHaveAttribute('data-outer-radius', '120');
      expect(pieSeries).toHaveAttribute('data-label', 'true');
    });

    it('should render pie cells for each data point', () => {
      const config: ChartConfig = {
        type: 'pie',
        data: mockPieChartData,
        series: [{ dataKey: 'value', name: 'Usage' }],
        xAxis: { dataKey: 'name' },
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      };

      render(<ChartWrapper config={config} />);
      
      const pieCells = screen.getAllByTestId('pie-cell');
      expect(pieCells).toHaveLength(3);
      expect(pieCells[0]).toHaveAttribute('data-fill', '#ff0000');
      expect(pieCells[1]).toHaveAttribute('data-fill', '#00ff00');
      expect(pieCells[2]).toHaveAttribute('data-fill', '#0000ff');
    });
  });

  describe('unsupported chart type', () => {
    it('should display error message for unsupported chart type', () => {
      const config: ChartConfig = {
        type: 'scatter' as ChartConfig['type'],
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByText('Unsupported chart type: scatter')).toBeInTheDocument();
      expect(screen.getByText('Unsupported chart type: scatter')).toHaveClass('text-error');
    });
  });

  describe('responsive container', () => {
    it('should render responsive container with correct dimensions', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        height: 500,
      };

      render(<ChartWrapper config={config} />);
      
      const container = screen.getByTestId('responsive-container');
      expect(container).toHaveAttribute('data-width', '100%');
      expect(container).toHaveAttribute('data-height', '500');
    });

    it('should use default height when not specified', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} />);
      
      const container = screen.getByTestId('responsive-container');
      expect(container).toHaveAttribute('data-height', '400');
    });
  });

  describe('color configuration', () => {
    it('should use default colors when not specified', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales' },
          { dataKey: 'profit', name: 'Profit' },
        ],
      };

      render(<ChartWrapper config={config} />);
      
      const lineSeries = screen.getAllByTestId('line-series');
      expect(lineSeries[0]).toHaveAttribute('data-stroke', '#ff8f00'); // First default color
      expect(lineSeries[1]).toHaveAttribute('data-stroke', '#a855f7'); // Second default color
    });

    it('should use custom colors when specified', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales' },
          { dataKey: 'profit', name: 'Profit' },
        ],
        colors: ['#custom1', '#custom2'],
      };

      render(<ChartWrapper config={config} />);
      
      const lineSeries = screen.getAllByTestId('line-series');
      expect(lineSeries[0]).toHaveAttribute('data-stroke', '#custom1');
      expect(lineSeries[1]).toHaveAttribute('data-stroke', '#custom2');
    });

    it('should cycle through colors when more series than colors', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales' },
          { dataKey: 'profit', name: 'Profit' },
          { dataKey: 'extra', name: 'Extra' },
        ],
        colors: ['#color1', '#color2'],
      };

      render(<ChartWrapper config={config} />);
      
      const lineSeries = screen.getAllByTestId('line-series');
      expect(lineSeries[0]).toHaveAttribute('data-stroke', '#color1');
      expect(lineSeries[1]).toHaveAttribute('data-stroke', '#color2');
      expect(lineSeries[2]).toHaveAttribute('data-stroke', '#color1'); // Cycles back
    });
  });

  describe('margin configuration', () => {
    it('should use default margin when not specified', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} />);
      
      const chart = screen.getByTestId('line-chart');
      expect(chart).toHaveAttribute('data-margin', JSON.stringify({ top: 20, right: 30, left: 20, bottom: 5 }));
    });

    it('should use custom margin when specified', () => {
      const customMargin = { top: 10, right: 20, left: 15, bottom: 10 };
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        margin: customMargin,
      };

      render(<ChartWrapper config={config} />);
      
      const chart = screen.getByTestId('line-chart');
      expect(chart).toHaveAttribute('data-margin', JSON.stringify(customMargin));
    });
  });

  describe('axis configuration', () => {
    it('should handle axis with custom tick formatter', () => {
      const tickFormatter = (value: string | number | undefined) => `${value}%`;
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        xAxis: { dataKey: 'month', tickFormatter },
        yAxis: { tickFormatter },
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('x-axis')).toHaveAttribute('data-tick-formatter', 'custom');
      expect(screen.getByTestId('y-axis')).toHaveAttribute('data-tick-formatter', 'custom');
    });

    it('should handle axis with domain configuration', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        xAxis: { dataKey: 'month', domain: ['dataMin', 'dataMax'] },
        yAxis: { domain: [0, 'dataMax'] },
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('x-axis')).toHaveAttribute('data-domain', JSON.stringify(['dataMin', 'dataMax']));
      expect(screen.getByTestId('y-axis')).toHaveAttribute('data-domain', JSON.stringify([0, 'dataMax']));
    });

    it('should not render X axis when dataKey is not provided', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        xAxis: {}, // No dataKey
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.queryByTestId('x-axis')).not.toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });
  });

  describe('series configuration', () => {
    it('should handle series with custom stroke width for line charts', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales', strokeWidth: 3 },
        ],
      };

      render(<ChartWrapper config={config} />);
      
      const lineSeries = screen.getByTestId('line-series');
      expect(lineSeries).toHaveAttribute('data-stroke-width', '3');
    });

    it('should use default stroke width when not specified', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales' },
        ],
      };

      render(<ChartWrapper config={config} />);
      
      const lineSeries = screen.getByTestId('line-series');
      expect(lineSeries).toHaveAttribute('data-stroke-width', '2');
    });

    it('should handle series with custom type for line charts', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales', type: 'step' },
        ],
      };

      render(<ChartWrapper config={config} />);
      
      const lineSeries = screen.getByTestId('line-series');
      expect(lineSeries).toHaveAttribute('data-type', 'step');
    });

    it('should use default type when not specified', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [
          { dataKey: 'sales', name: 'Sales' },
        ],
      };

      render(<ChartWrapper config={config} />);
      
      const lineSeries = screen.getByTestId('line-series');
      expect(lineSeries).toHaveAttribute('data-type', 'monotone');
    });
  });

  describe('styling and className', () => {
    it('should apply default classes to wrapper', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      const { container } = render(<ChartWrapper config={config} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-base-100', 'rounded-lg', 'p-2');
    });

    it('should apply custom className to wrapper', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      const { container } = render(<ChartWrapper config={config} className="custom-chart-class" />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-base-100', 'rounded-lg', 'p-2', 'custom-chart-class');
    });

    it('should apply correct classes to axis elements', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
        xAxis: { dataKey: 'month' },
        yAxis: {},
      };

      render(<ChartWrapper config={config} />);
      
      expect(screen.getByTestId('x-axis')).toHaveClass('text-base-content/70');
      expect(screen.getByTestId('y-axis')).toHaveClass('text-base-content/70');
    });
  });

  describe('state precedence', () => {
    it('should prioritize loading state over error state', () => {
      const config: ChartConfig = {
        type: 'line',
        data: mockLineChartData,
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      const { container } = render(<ChartWrapper config={config} loading={true} error="Test error" />);
      
      expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
      expect(screen.queryByText('Test error')).not.toBeInTheDocument();
    });

    it('should prioritize error state over empty data state', () => {
      const config: ChartConfig = {
        type: 'line',
        data: [],
        series: [{ dataKey: 'sales', name: 'Sales' }],
      };

      render(<ChartWrapper config={config} error="Test error" />);
      
      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });
  });
});