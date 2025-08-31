import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import MatchesPage from "./MatchesPage";
import { useScrimsightData } from "../hooks/useScrimsightData";

// Mock external modules
vi.mock("../hooks/useScrimsightData", () => ({
  useScrimsightData: vi.fn(),
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
vi.mock("../components/MatchList", () => ({
  default: ({ matches }: { matches: any[] }) => (
    <div data-testid="match-list">Match List: {matches.length} matches</div>
  ),
}));
vi.mock("../components/EmptyState", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="empty-state">Empty State: {title}</div>
  ),
}));
vi.mock("lucide-react", () => ({
  Trophy: ({ size }: { size: number }) => <svg data-testid="trophy-icon" width={size} height={size} />,
}));

const mockDataModel = {
  matches: [
    {
      match: "match1",
      map: "King's Row",
      gameMode: "Escort",
      teams: ["TeamA", "TeamB"],
      winningTeam: "TeamA",
      team1Score: 3,
      team2Score: 2,
      duration: 1200,
      rounds: [1, 2, 3],
    },
  ],
};

describe("MatchesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with matches data", () => {
    (useScrimsightData as Mock).mockReturnValue(mockDataModel);

    render(
      <MemoryRouter initialEntries={["/matches"]}>
        <Routes>
          <Route path="/matches" element={<MatchesPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("scrimsight-page")).toBeInTheDocument();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByText("Matches")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("match-list")).toBeInTheDocument();
    expect(screen.getByText("Match List: 1 matches")).toBeInTheDocument();
  });

  it("renders EmptyState when no matches are available", () => {
    (useScrimsightData as Mock).mockReturnValue({
      matches: [],
    });

    render(
      <MemoryRouter initialEntries={["/matches"]}>
        <Routes>
          <Route path="/matches" element={<MatchesPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: No matches found")).toBeInTheDocument();
  });
});
