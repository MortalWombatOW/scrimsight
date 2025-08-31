import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import StatDistributionAndTop from "./StatDistributionAndTop";

// Mock the chart and data table dependencies
vi.mock("./ChartWrapper", () => ({
  default: ({ config, className }: { config: any; className?: string }) => (
    <div data-testid="chart-wrapper" data-config={JSON.stringify(config)} className={className}>
      Chart: {config.type}
    </div>
  ),
}));

vi.mock("./ValueDelta", () => ({
  default: ({ 
    value, 
    baseline, 
    rank, 
    totalCount 
  }: { 
    value: number; 
    baseline: number; 
    higherIsBetter: boolean; 
    precision: number; 
    rank: number; 
    totalCount: number; 
  }) => (
    <div data-testid="value-delta">
      Delta: {value} vs {baseline} (rank {rank}/{totalCount})
    </div>
  ),
}));

vi.mock("./DataTable", () => ({
  default: ({ 
    columns, 
    data, 
    rowKey, 
    disableSorting, 
    hideFooter 
  }: { 
    columns: any[]; 
    data: any[]; 
    rowKey: (row: any) => string; 
    disableSorting: boolean; 
    hideFooter: boolean; 
  }) => (
    <div data-testid="data-table">
      <div data-testid="data-table-rows">{data.length} rows</div>
      <div data-testid="data-table-columns">{columns.length} columns</div>
      <div data-testid="data-table-options">
        Sort: {String(!disableSorting)}, Footer: {String(!hideFooter)}
      </div>
      {data.map((row, index) => (
        <div key={rowKey(row)} data-testid={`table-row-${index}`}>
          {JSON.stringify(row)}
        </div>
      ))}
    </div>
  ),
}));

// Mock format utilities
vi.mock("../lib/format", () => ({
  prettyFormat: vi.fn((value: number, precision: number) => {
    return value.toFixed(precision);
  }),
}));

// Mock distribution utilities
vi.mock("../lib/distribution", () => ({
  computeDeciles: vi.fn((values: number[]) => 
    values.map((value, index) => ({ value, frequency: (index + 1) / values.length }))
  ),
  smoothDistribution: vi.fn((deciles: any[], _smoothing: number) => deciles),
}));

// Mock remeda
vi.mock("remeda", () => ({
  meanBy: vi.fn((array: any[], fn: (item: any) => number) => {
    const values = array.map(fn);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }),
}));

describe("StatDistributionAndTop", () => {
  const defaultProps = {
    statName: "Average Hero Rating",
    statDescription: "Average performance rating across all hero roles",
    categoryKeys: ["playerName"],
    rows: [
      { playerName: "Tank", value: 85 },
      { playerName: "DPS", value: 120 },
      { playerName: "Support", value: 95 },
      { playerName: "Flex", value: 75 },
    ],
  };

  it("renders stat name and description", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    expect(screen.getByText("Average Hero Rating")).toBeInTheDocument();
    expect(screen.getByText("Average performance rating across all hero roles")).toBeInTheDocument();
  });

  it("displays calculated average value", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    // Average of 85, 120, 95, 75 = 93.75, formatted to 1 decimal place = 93.8
    expect(screen.getByText("93.8")).toBeInTheDocument();
  });

  it("renders chart wrapper with correct configuration", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    const chartWrapper = screen.getByTestId("chart-wrapper");
    expect(chartWrapper).toBeInTheDocument();
    expect(chartWrapper).toHaveTextContent("Chart: area");
  });

  it("applies chart wrapper className", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    const chartWrapper = screen.getByTestId("chart-wrapper");
    expect(chartWrapper).toHaveClass("mr-12");
  });

  it("renders data table with top 3 rows", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    const dataTable = screen.getByTestId("data-table");
    expect(dataTable).toBeInTheDocument();
    
    expect(screen.getByTestId("data-table-rows")).toHaveTextContent("3 rows");
  });

  it("sorts rows by value in descending order", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    // Should show top 3: DPS (120), Support (95), Tank (85)
    const tableRows = screen.getAllByTestId(/^table-row-/);
    expect(tableRows).toHaveLength(3);
    
    expect(tableRows[0]).toHaveTextContent('"playerName":"DPS"');
    expect(tableRows[0]).toHaveTextContent('"value":120');
    expect(tableRows[1]).toHaveTextContent('"playerName":"Support"');
    expect(tableRows[1]).toHaveTextContent('"value":95');
    expect(tableRows[2]).toHaveTextContent('"playerName":"Tank"');
    expect(tableRows[2]).toHaveTextContent('"value":85');
  });

  it("limits to top 3 rows even with more data", () => {
    const propsWithMoreRows = {
      ...defaultProps,
      rows: [
        { playerName: "Tank", value: 85 },
        { playerName: "DPS", value: 120 },
        { playerName: "Support", value: 95 },
        { playerName: "Flex", value: 75 },
        { playerName: "Assassin", value: 110 },
        { playerName: "Sniper", value: 90 },
      ],
    };
    
    render(<StatDistributionAndTop {...propsWithMoreRows} />);
    
    expect(screen.getByTestId("data-table-rows")).toHaveTextContent("3 rows");
    const tableRows = screen.getAllByTestId(/^table-row-/);
    expect(tableRows).toHaveLength(3);
  });

  it("configures data table with correct options", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    const tableOptions = screen.getByTestId("data-table-options");
    expect(tableOptions).toHaveTextContent("Sort: false, Footer: false");
  });

  it("uses custom precision when provided", () => {
    const props = {
      ...defaultProps,
      precision: 2,
    };
    
    render(<StatDistributionAndTop {...props} />);
    
    // Average should be formatted to 2 decimal places
    expect(screen.getByText("93.75")).toBeInTheDocument();
  });

  it("handles higherIsBetter=false", () => {
    const props = {
      ...defaultProps,
      higherIsBetter: false,
    };
    
    render(<StatDistributionAndTop {...props} />);
    
    // Component should render successfully
    expect(screen.getByText("Average Hero Rating")).toBeInTheDocument();
  });

  it("handles different category keys", () => {
    const props = {
      ...defaultProps,
      categoryKeys: ["teamName", "mapName"],
      rows: [
        { teamName: "Red Team", mapName: "King's Row", value: 85 },
        { teamName: "Blue Team", mapName: "Dorado", value: 120 },
        { teamName: "Green Team", mapName: "Hanamura", value: 95 },
      ],
    };
    
    render(<StatDistributionAndTop {...props} />);
    
    expect(screen.getByTestId("data-table-columns")).toHaveTextContent("4 columns"); // rank + 2 categories + delta
  });

  it("handles single row data", () => {
    const props = {
      ...defaultProps,
      rows: [{ playerName: "Solo", value: 100 }],
    };
    
    render(<StatDistributionAndTop {...props} />);
    
    expect(screen.getByText("100.0")).toBeInTheDocument(); // Average = 100
    expect(screen.getByTestId("data-table-rows")).toHaveTextContent("1 rows");
  });

  it("handles empty rows gracefully", () => {
    const props = {
      ...defaultProps,
      rows: [],
    };
    
    render(<StatDistributionAndTop {...props} />);
    
    expect(screen.getByTestId("data-table-rows")).toHaveTextContent("0 rows");
  });

  it("applies container styling classes", () => {
    const { container } = render(<StatDistributionAndTop {...defaultProps} />);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("bg-base-100");
    expect(mainContainer).toHaveClass("rounded-lg");
    expect(mainContainer).toHaveClass("p-6");
    expect(mainContainer).toHaveClass("min-w-fit");
  });

  it("renders with proper semantic structure", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    // Check header structure
    const header = screen.getByText("Average Hero Rating");
    expect(header.tagName).toBe("H3");
    expect(header).toHaveClass("text-xl", "font-semibold", "text-base-content");
    
    // Check description
    const description = screen.getByText("Average performance rating across all hero roles");
    expect(description.tagName).toBe("P");
    expect(description).toHaveClass("text-sm", "text-base-content/70");
  });

  it("formats average value with correct styling", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    const averageValue = screen.getByText("93.8");
    expect(averageValue).toHaveClass("text-3xl", "font-bold", "text-base-content");
  });

  it("handles multiple category keys in row key generation", () => {
    const props = {
      ...defaultProps,
      categoryKeys: ["teamName", "mapName"],
      rows: [
        { teamName: "Red", mapName: "King's Row", value: 85 },
        { teamName: "Blue", mapName: "Dorado", value: 120 },
      ],
    };
    
    render(<StatDistributionAndTop {...props} />);
    
    // Should render without errors and show the data
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("creates correct number of table columns", () => {
    render(<StatDistributionAndTop {...defaultProps} />);
    
    // Should have: rank (1) + category columns (1) + delta (1) = 3 columns
    expect(screen.getByTestId("data-table-columns")).toHaveTextContent("3 columns");
  });
});