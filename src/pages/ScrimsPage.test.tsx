import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ScrimsPage from "./ScrimsPage";
import { useScrimsightData } from "../hooks/useScrimsightData";
import ScrimsightPage from "../components/ScrimsightPage";

// Mock external modules
vi.mock("../hooks/useScrimsightData", () => ({
  useScrimsightData: vi.fn(() => ({
    scrims: [],
    matches: [],
    teams: [],
    playerStatBreakdown: {
      byTeam: [],
      byTeamAndScrim: [],
    },
  })),
}));

// Mock child components
vi.mock("../components/ScrimsightPage", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scrimsight-page">{children}</div>
  ),
}));
vi.mock("../components/PageHeader", () => {
  const MockPageHeader = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-header">{children}</div>
  );
  MockPageHeader.Icon = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-header-icon">{children}</div>
  );
  MockPageHeader.Title = ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="page-header-title">{children}</h1>
  );
  return { default: MockPageHeader };
});
vi.mock("../components/BreadCrumbs", () => ({
  default: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));
vi.mock("../components/ScrimCard", () => ({
  default: ({ scrimId }: { scrimId: string }) => (
    <div data-testid="scrim-card">Scrim Card: {scrimId}</div>
  ),
}));
vi.mock("../components/EmptyState", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="empty-state">Empty State: {title}</div>
  ),
}));
vi.mock("lucide-react", () => ({
  Swords: ({ size }: { size: number }) => <svg data-testid="swords-icon" width={size} height={size} />,
  Trophy: ({ size }: { size: number }) => <svg data-testid="trophy-icon" width={size} height={size} />,
  Target: ({ size }: { size: number }) => <svg data-testid="target-icon" width={size} height={size} />,
  Users: ({ size }: { size: number }) => <svg data-testid="users-icon" width={size} height={size} />,
  Calendar: ({ size }: { size: number }) => <svg data-testid="calendar-icon" width={size} height={size} />,
  Search: ({ size }: { size: number }) => <svg data-testid="search-icon" width={size} height={size} />,
  ChevronsUpDown: ({ size }: { size: number }) => <svg data-testid="chevrons-up-down-icon" width={size} height={size} />,
  ChevronUp: ({ size }: { size: number }) => <svg data-testid="chevron-up-icon" width={size} height={size} />,
  ChevronDown: ({ size }: { size: number }) => <svg data-testid="chevron-down-icon" width={size} height={size} />,
}));

const mockDataModel = {
  scrims: [
    {
      scrimId: "scrim1",
      date: new Date("2024-01-01"),
      teams: ["TeamA", "TeamB"],
      matches: ["match1", "match2"],
      team1MatchesWon: 1,
      team2MatchesWon: 0,
    },
  ],
  matches: [],
  teams: [],
  playerStatBreakdown: {
    byTeam: [],
    byTeamAndScrim: [],
  },
};

describe("ScrimsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with scrims data", () => {
    (useScrimsightData as vi.Mock).mockReturnValue(mockDataModel);

    render(
      <MemoryRouter initialEntries={["/scrims"]}>
        <Routes>
          <Route path="/scrims" element={<ScrimsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("scrimsight-page")).toBeInTheDocument();
    
    
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getAllByTestId("scrim-card").length).toBe(1);
    expect(screen.getByText(/TeamA/)).toBeInTheDocument();
    expect(screen.getByText(/TeamB/)).toBeInTheDocument();
    expect(screen.getByText(/1 - 0/)).toBeInTheDocument();
  });;

  it("renders EmptyState when no scrims are available", () => {
    (useScrimsightData as vi.Mock).mockReturnValue({
      scrims: [],
      matches: [],
      teams: [],
      playerStatBreakdown: {
        byTeam: [],
        byTeamAndScrim: [],
      },
    });

    render(
      <MemoryRouter initialEntries={["/scrims"]}>
        <Routes>
          <Route path="/scrims" element={<ScrimsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: No Scrims Found")).toBeInTheDocument();
  });
});
