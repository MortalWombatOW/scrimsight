import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScatterChart, { type ScatterDataPoint } from './ScatterChart';

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  ScatterChart: ({ children, margin }: { children: React.ReactNode; margin: object }) => (
    <div data-testid="recharts-scatter-chart" data-margin={JSON.stringify(margin)}>
      {children}
    </div>
  ),
  Scatter: ({ name, data, fill, stroke, r }: { name: string; data: ScatterDataPoint[]; fill: string; stroke: string; r: number }) => (
    <div 
      data-testid="scatter-series" 
      data-name={name} 
      data-points={data.length} 
      data-fill={fill}
      data-stroke={stroke}
      data-radius={r}
    />
  ),
  XAxis: ({ type, dataKey, name, label, tickFormatter }: { type: string; dataKey: string; name: string; label: { value: string; position: string; offset: number }; tickFormatter: (value: number) => string }) => (
    <div 
      data-testid="x-axis" 
      data-type={type} 
      data-key={dataKey} 
      data-name={name}
      data-label={label.value}
      data-tick-formatter={tickFormatter ? 'present' : 'absent'}
    />
  ),
  YAxis: ({ type, dataKey, name, label, tickFormatter }: { type: string; dataKey: string; name: string; label: { value: string; angle: number; position: string }; tickFormatter: (value: number) => string }) => (
    <div 
      data-testid="y-axis" 
      data-type={type} 
      data-key={dataKey} 
      data-name={name}
      data-label={label.value}
      data-tick-formatter={tickFormatter ? 'present' : 'absent'}
    />
  ),
  CartesianGrid: ({ strokeDasharray }: { strokeDasharray: string }) => (
    <div data-testid="cartesian-grid" data-stroke-dasharray={strokeDasharray} />
  ),
  Tooltip: ({ content }: { content: React.ComponentType }) => (
    <div data-testid="tooltip" data-content={content ? 'custom' : 'default'} />
  ),
  Legend: ({ wrapperStyle }: { wrapperStyle: object }) => (
    <div data-testid="legend" data-wrapper-style={JSON.stringify(wrapperStyle)} />
  ),
}));

// Mock EmptyState component
vi.mock('./EmptyState', () => ({
  default: ({ title, description, size }: { icon: unknown; title: string; description: string; size: string }) => (
    <div data-testid="empty-state" data-title={title} data-description={description} data-size={size} />
  ),
}));

// Mock LoadingSpinner component
vi.mock('./LoadingSpinner', () => ({
  default: () => (
    <div data-testid="loading-spinner" />
  ),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  AlertTriangle: ({ className }: { className?: string }) => (
    <div data-testid="alert-triangle-icon" className={className} />
  ),
}));

// Sample test data
const sampleData: ScatterDataPoint[] = [
  { x: 85, y: 92, playerName: 'Player Alpha', playerTeam: 'Team Red' },
  { x: 78, y: 88, playerName: 'Player Beta', playerTeam: 'Team Red' },
  { x: 90, y: 95, playerName: 'Player Delta', playerTeam: 'Team Blue' },
  { x: 88, y: 91, playerName: 'Player Echo', playerTeam: 'Team Blue' },
  { x: 75, y: 82, playerName: 'Player Golf', playerTeam: 'Team Green' },
];

const singleTeamData: ScatterDataPoint[] = [
  { x: 85, y: 92, playerName: 'Player 1', playerTeam: 'Team Alpha' },
  { x: 78, y: 88, playerName: 'Player 2', playerTeam: 'Team Alpha' },
  { x: 82, y: 85, playerName: 'Player 3', playerTeam: 'Team Alpha' },
];

describe('ScatterChart', () => {
  describe('basic rendering', () => {
    it('should render chart with default props', () => {
      render(<ScatterChart data={sampleData} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('recharts-scatter-chart')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('should apply custom height', () => {
      const { container } = render(<ScatterChart data={sampleData} height={500} />);
      
      const chartContainer = container.firstChild as HTMLElement;
      expect(chartContainer).toHaveStyle({ height: '500px' });
    });

    it('should apply default height when not specified', () => {
      const { container } = render(<ScatterChart data={sampleData} />);
      
      const chartContainer = container.firstChild as HTMLElement;
      expect(chartContainer).toHaveStyle({ height: '400px' });
    });

    it('should apply custom margin to chart', () => {
      const customMargin = { top: 10, right: 20, bottom: 30, left: 40 };
      render(<ScatterChart data={sampleData} margin={customMargin} />);
      
      const chartElement = screen.getByTestId('recharts-scatter-chart');
      expect(chartElement).toHaveAttribute('data-margin', JSON.stringify(customMargin));
    });
  });

  describe('axis configuration', () => {
    it('should render X axis with default label', () => {
      render(<ScatterChart data={sampleData} />);
      
      const xAxis = screen.getByTestId('x-axis');
      expect(xAxis).toHaveAttribute('data-type', 'number');
      expect(xAxis).toHaveAttribute('data-key', 'x');
      expect(xAxis).toHaveAttribute('data-name', 'X Axis');
      expect(xAxis).toHaveAttribute('data-label', 'X Axis');
    });

    it('should render Y axis with default label', () => {
      render(<ScatterChart data={sampleData} />);
      
      const yAxis = screen.getByTestId('y-axis');
      expect(yAxis).toHaveAttribute('data-type', 'number');
      expect(yAxis).toHaveAttribute('data-key', 'y');
      expect(yAxis).toHaveAttribute('data-name', 'Y Axis');
      expect(yAxis).toHaveAttribute('data-label', 'Y Axis');
    });

    it('should render X axis with custom label', () => {
      render(<ScatterChart data={sampleData} xAxisLabel="Custom X Label" />);
      
      const xAxis = screen.getByTestId('x-axis');
      expect(xAxis).toHaveAttribute('data-name', 'Custom X Label');
      expect(xAxis).toHaveAttribute('data-label', 'Custom X Label');
    });

    it('should render Y axis with custom label', () => {
      render(<ScatterChart data={sampleData} yAxisLabel="Custom Y Label" />);
      
      const yAxis = screen.getByTestId('y-axis');
      expect(yAxis).toHaveAttribute('data-name', 'Custom Y Label');
      expect(yAxis).toHaveAttribute('data-label', 'Custom Y Label');
    });

    it('should include tick formatters for both axes', () => {
      render(<ScatterChart data={sampleData} />);
      
      const xAxis = screen.getByTestId('x-axis');
      const yAxis = screen.getByTestId('y-axis');
      expect(xAxis).toHaveAttribute('data-tick-formatter', 'present');
      expect(yAxis).toHaveAttribute('data-tick-formatter', 'present');
    });
  });

  describe('grid configuration', () => {
    it('should show grid by default', () => {
      render(<ScatterChart data={sampleData} />);
      
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    });

    it('should hide grid when showGrid is false', () => {
      render(<ScatterChart data={sampleData} showGrid={false} />);
      
      expect(screen.queryByTestId('cartesian-grid')).not.toBeInTheDocument();
    });

    it('should apply correct grid styling', () => {
      render(<ScatterChart data={sampleData} showGrid={true} />);
      
      const grid = screen.getByTestId('cartesian-grid');
      expect(grid).toHaveAttribute('data-stroke-dasharray', '3 3');
    });
  });

  describe('tooltip configuration', () => {
    it('should show tooltip by default', () => {
      render(<ScatterChart data={sampleData} />);
      
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('should hide tooltip when showTooltip is false', () => {
      render(<ScatterChart data={sampleData} showTooltip={false} />);
      
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });

    it('should use custom tooltip content', () => {
      render(<ScatterChart data={sampleData} showTooltip={true} />);
      
      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toHaveAttribute('data-content', 'custom');
    });
  });

  describe('legend configuration', () => {
    it('should hide legend by default', () => {
      render(<ScatterChart data={sampleData} />);
      
      expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
    });

    it('should show legend when showLegend is true', () => {
      render(<ScatterChart data={sampleData} showLegend={true} />);
      
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('should apply correct legend styling', () => {
      render(<ScatterChart data={sampleData} showLegend={true} />);
      
      const legend = screen.getByTestId('legend');
      const expectedStyle = JSON.stringify({
        paddingTop: "20px",
        color: "hsl(var(--bc))",
      });
      expect(legend).toHaveAttribute('data-wrapper-style', expectedStyle);
    });
  });

  describe('scatter series rendering', () => {
    it('should render scatter series for each team', () => {
      render(<ScatterChart data={sampleData} />);
      
      const scatterSeries = screen.getAllByTestId('scatter-series');
      expect(scatterSeries).toHaveLength(3); // Team Red, Team Blue, Team Green
    });

    it('should group data points by team correctly', () => {
      render(<ScatterChart data={sampleData} />);
      
      const scatterSeries = screen.getAllByTestId('scatter-series');
      
      // Find Team Red series
      const teamRedSeries = scatterSeries.find(series => 
        series.getAttribute('data-name') === 'Team Red'
      );
      expect(teamRedSeries).toHaveAttribute('data-points', '2');
      
      // Find Team Blue series
      const teamBlueSeries = scatterSeries.find(series => 
        series.getAttribute('data-name') === 'Team Blue'
      );
      expect(teamBlueSeries).toHaveAttribute('data-points', '2');
      
      // Find Team Green series
      const teamGreenSeries = scatterSeries.find(series => 
        series.getAttribute('data-name') === 'Team Green'
      );
      expect(teamGreenSeries).toHaveAttribute('data-points', '1');
    });

    it('should apply default colors when no color function provided', () => {
      render(<ScatterChart data={singleTeamData} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-fill', '#8884d8');
      expect(scatterSeries).toHaveAttribute('data-stroke', '#8884d8');
    });

    it('should apply custom colors when color function provided', () => {
      const colorFunction = (teamName: string) => teamName === 'Team Alpha' ? '#ff0000' : '#00ff00';
      render(<ScatterChart data={singleTeamData} colorFunction={colorFunction} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-fill', '#ff0000');
      expect(scatterSeries).toHaveAttribute('data-stroke', '#ff0000');
    });

    it('should apply correct scatter point properties', () => {
      render(<ScatterChart data={singleTeamData} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-radius', '6');
    });
  });

  describe('empty state handling', () => {
    it('should show empty state when no data provided', () => {
      render(<ScatterChart data={[]} />);
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state')).toHaveAttribute('data-title', 'No Data');
      expect(screen.getByTestId('empty-state')).toHaveAttribute('data-description', 'No data available to display');
      expect(screen.getByTestId('empty-state')).toHaveAttribute('data-size', 'sm');
    });

    it('should not render chart components when no data', () => {
      render(<ScatterChart data={[]} />);
      
      expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('recharts-scatter-chart')).not.toBeInTheDocument();
    });

    it('should apply height to empty state container', () => {
      const { container } = render(<ScatterChart data={[]} height={300} />);
      
      expect(container.firstChild).toHaveStyle({ height: '300px' });
    });
  });

  describe('loading state handling', () => {
    it('should show loading spinner when loading is true', () => {
      render(<ScatterChart data={sampleData} loading={true} />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should not render chart components when loading', () => {
      render(<ScatterChart data={sampleData} loading={true} />);
      
      expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('recharts-scatter-chart')).not.toBeInTheDocument();
    });

    it('should apply height to loading state container', () => {
      const { container } = render(<ScatterChart data={sampleData} loading={true} height={250} />);
      
      expect(container.firstChild).toHaveStyle({ height: '250px' });
    });

    it('should center loading spinner', () => {
      const { container } = render(<ScatterChart data={sampleData} loading={true} />);
      
      const loadingContainer = container.firstChild as HTMLElement;
      expect(loadingContainer).toHaveClass('flex', 'justify-center', 'items-center');
    });
  });

  describe('error state handling', () => {
    it('should show error message when error is provided', () => {
      const errorMessage = 'Failed to load data';
      render(<ScatterChart data={sampleData} error={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should show alert triangle icon in error state', () => {
      render(<ScatterChart data={sampleData} error="Error occurred" />);
      
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
    });

    it('should not render chart components when error exists', () => {
      render(<ScatterChart data={sampleData} error="Error occurred" />);
      
      expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('recharts-scatter-chart')).not.toBeInTheDocument();
    });

    it('should apply height to error state container', () => {
      const { container } = render(<ScatterChart data={sampleData} error="Error" height={350} />);
      
      expect(container.firstChild).toHaveStyle({ height: '350px' });
    });

    it('should center error alert', () => {
      const { container } = render(<ScatterChart data={sampleData} error="Error" />);
      
      const errorContainer = container.firstChild as HTMLElement;
      expect(errorContainer).toHaveClass('flex', 'justify-center', 'items-center');
    });

    it('should apply error alert styling', () => {
      render(<ScatterChart data={sampleData} error="Error message" />);
      
      const alert = screen.getByText('Error message').closest('.alert');
      expect(alert).toHaveClass('alert-error', 'max-w-md');
    });
  });

  describe('data processing and team grouping', () => {
    it('should handle single team data', () => {
      render(<ScatterChart data={singleTeamData} />);
      
      const scatterSeries = screen.getAllByTestId('scatter-series');
      expect(scatterSeries).toHaveLength(1);
      expect(scatterSeries[0]).toHaveAttribute('data-name', 'Team Alpha');
      expect(scatterSeries[0]).toHaveAttribute('data-points', '3');
    });

    it('should handle data with additional properties', () => {
      const dataWithExtraProps: ScatterDataPoint[] = [
        { 
          x: 85, 
          y: 92, 
          playerName: 'Player 1', 
          playerTeam: 'Team A',
          extraProperty: 'value1',
          anotherProp: 123
        },
        { 
          x: 78, 
          y: 88, 
          playerName: 'Player 2', 
          playerTeam: 'Team A',
          extraProperty: 'value2',
          anotherProp: 456
        },
      ];

      render(<ScatterChart data={dataWithExtraProps} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-points', '2');
    });

    it('should handle complex team names', () => {
      const complexTeamData: ScatterDataPoint[] = [
        { x: 85, y: 92, playerName: 'Player 1', playerTeam: 'Team with Spaces & Special chars!' },
        { x: 78, y: 88, playerName: 'Player 2', playerTeam: 'Team_With_Underscores-123' },
      ];

      render(<ScatterChart data={complexTeamData} />);
      
      const scatterSeries = screen.getAllByTestId('scatter-series');
      expect(scatterSeries).toHaveLength(2);
    });
  });

  describe('color function behavior', () => {
    it('should call color function for each team', () => {
      const mockColorFunction = vi.fn((teamName: string) => 
        teamName === 'Team Red' ? '#ff0000' : '#0000ff'
      );

      render(<ScatterChart data={sampleData} colorFunction={mockColorFunction} />);
      
      expect(mockColorFunction).toHaveBeenCalledWith('Team Red');
      expect(mockColorFunction).toHaveBeenCalledWith('Team Blue');
      expect(mockColorFunction).toHaveBeenCalledWith('Team Green');
    });

    it('should handle color function returning different colors', () => {
      const colorFunction = (teamName: string) => {
        const colors: Record<string, string> = {
          'Team Red': '#ff0000',
          'Team Blue': '#0000ff',
          'Team Green': '#00ff00',
        };
        return colors[teamName] || '#888888';
      };

      render(<ScatterChart data={sampleData} colorFunction={colorFunction} />);
      
      const scatterSeries = screen.getAllByTestId('scatter-series');
      
      const teamRedSeries = scatterSeries.find(s => s.getAttribute('data-name') === 'Team Red');
      const teamBlueSeries = scatterSeries.find(s => s.getAttribute('data-name') === 'Team Blue');
      const teamGreenSeries = scatterSeries.find(s => s.getAttribute('data-name') === 'Team Green');
      
      expect(teamRedSeries).toHaveAttribute('data-fill', '#ff0000');
      expect(teamBlueSeries).toHaveAttribute('data-fill', '#0000ff');
      expect(teamGreenSeries).toHaveAttribute('data-fill', '#00ff00');
    });
  });

  describe('state priority handling', () => {
    it('should prioritize loading state over error state', () => {
      render(<ScatterChart data={sampleData} loading={true} error="Some error" />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    });

    it('should prioritize error state over empty state', () => {
      render(<ScatterChart data={[]} error="Error occurred" />);
      
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });

    it('should prioritize loading state over empty state', () => {
      render(<ScatterChart data={[]} loading={true} />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });

    it('should show chart when no special states are active', () => {
      render(<ScatterChart data={sampleData} loading={false} error={null} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle data with zero values', () => {
      const zeroData: ScatterDataPoint[] = [
        { x: 0, y: 0, playerName: 'Zero Player', playerTeam: 'Zero Team' },
      ];

      render(<ScatterChart data={zeroData} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-points', '1');
    });

    it('should handle data with negative values', () => {
      const negativeData: ScatterDataPoint[] = [
        { x: -10, y: -20, playerName: 'Negative Player', playerTeam: 'Negative Team' },
      ];

      render(<ScatterChart data={negativeData} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-points', '1');
    });

    it('should handle data with very large values', () => {
      const largeData: ScatterDataPoint[] = [
        { x: 999999, y: 888888, playerName: 'Large Player', playerTeam: 'Large Team' },
      ];

      render(<ScatterChart data={largeData} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-points', '1');
    });

    it('should handle empty team names', () => {
      const emptyTeamData: ScatterDataPoint[] = [
        { x: 50, y: 60, playerName: 'Player 1', playerTeam: '' },
      ];

      render(<ScatterChart data={emptyTeamData} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-name', '');
    });

    it('should handle empty player names', () => {
      const emptyPlayerData: ScatterDataPoint[] = [
        { x: 50, y: 60, playerName: '', playerTeam: 'Team A' },
      ];

      render(<ScatterChart data={emptyPlayerData} />);
      
      const scatterSeries = screen.getByTestId('scatter-series');
      expect(scatterSeries).toHaveAttribute('data-points', '1');
    });
  });
});