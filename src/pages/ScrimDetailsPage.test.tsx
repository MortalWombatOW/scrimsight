import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";
import ScrimDetailsPage from "./ScrimDetailsPage";
import { useScrimsightData } from "../hooks/useScrimsightData";

// Mock external modules
vi.mock("../hooks/useScrimsightData", () => ({
  useScrimsightData: vi.fn(),
}));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(), // Ensure useParams is a mock function
  };
});

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
vi.mock("../components/ScrimHeader", () => ({
  default: ({ scrimId }: { scrimId: string }) => (
    <div data-testid="scrim-header">Scrim Header: {scrimId}</div>
  ),
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
vi.mock("../components/MatchCard", () => ({
  MatchCard: ({ matchId }: { matchId: string }) => (
    <div data-testid="match-card">Match Card: {matchId}</div>
  ),
}));
vi.mock("lucide-react", () => ({
  Swords: ({ size }: { size: number }) => <svg data-testid="swords-icon" width={size} height={size} />,
  Target: ({ size }: { size: number }) => <svg data-testid="target-icon" width={size} height={size} />,
  ChevronsUpDown: ({ size }: { size: number }) => <svg data-testid="chevrons-up-down-icon" width={size} height={size} />,
  ChevronUp: ({ size }: { size: number }) => <svg data-testid="chevron-up-icon" width={size} height={size} />,
  ChevronDown: ({ size }: { size: number }) => <svg data-testid="chevron-down-icon" width={size} height={size} />,
}));

const mockDataModel = {
  scrims: [
    {
      scrim: "scrim1",
      date: "2024-01-01",
      teams: ["TeamA", "TeamB"],
      matches: ["match1", "match2"],
      team1MatchesWon: 1,
      team2MatchesWon: 0,
    },
  ],
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
    {
      match: "match2",
      map: "Blizzard World",
      gameMode: "Hybrid",
      teams: ["TeamA", "TeamB"],
      winningTeam: "TeamB",
      team1Score: 1,
      team2Score: 2,
      duration: 1000,
      rounds: [1, 2],
    },
  ],
  playerStatBreakdown: {
    byTeamAndScrim: [
      {
        scrim: "scrim1",
        playerTeam: "TeamA",
        eliminations: 100,
        deaths: 50,
        heroDamageDealt: 50000,
        healingDealt: 10000,
        damageTaken: 20000,
        ultimatesUsed: 20,
      },
      {
        scrim: "scrim1",
        playerTeam: "TeamB",
        eliminations: 80,
        deaths: 60,
        heroDamageDealt: 40000,
        healingDealt: 8000,
        damageTaken: 22000,
        ultimatesUsed: 18,
      },
    ],
    byTeamAndPlayerAndScrim: [
      {
        playerName: "Player1",
        playerTeam: "TeamA",
        scrim: "scrim1",
        eliminations: 10,
        deaths: 5,
        heroDamageDealt: 5000,
        healingDealt: 1000,
        ultimatesUsed: 2,
        playtime: 600,
      },
      {
        playerName: "Player2",
        playerTeam: "TeamB",
        scrim: "scrim1",
        eliminations: 8,
        deaths: 6,
        heroDamageDealt: 4000,
        healingDealt: 800,
        ultimatesUsed: 1,
        playtime: 600,
      },
    ],
  },
};

describe("ScrimDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EmptyState when scrimId is missing", () => {
    (useScrimsightData as vi.Mock).mockReturnValue({
      scrims: [],
      matches: [],
      playerStatBreakdown: {
        byTeamAndScrim: [],
        byTeamAndPlayerAndScrim: [],
      },
    });
    useParams.mockReturnValue({});

    render(
      <MemoryRouter initialEntries={["/scrims"]}>
        <Routes>
          <Route path="/scrims/:scrimId" element={<ScrimDetailsPage />} />
          <Route path="/scrims" element={<ScrimDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: Invalid Scrim")).toBeInTheDocument();
  });

  it("renders EmptyState when scrimDetails are not found", () => {
    (useScrimsightData as vi.Mock).mockReturnValue({
      scrims: [],
      matches: [],
      playerStatBreakdown: {
        byTeamAndScrim: [],
        byTeamAndPlayerAndScrim: [],
      },
    });
    useParams.mockReturnValue({ scrimId: "nonexistent-scrim" });

    render(
      <MemoryRouter initialEntries={["/scrims/nonexistent-scrim"]}>
        <Routes>
          <Route path="/scrims/:scrimId" element={<ScrimDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: Scrim Not Found")).toBeInTheDocument();
  });

  it("renders correctly with scrim data", () => {
    (useScrimsightData as vi.Mock).mockReturnValue(mockDataModel);
    useParams.mockReturnValue({ scrimId: "scrim1" });

    render(
      <MemoryRouter initialEntries={["/scrims/scrim1"]}>
        <Routes>
          <Route path="/scrims/:scrimId" element={<ScrimDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("scrimsight-page")).toBeInTheDocument();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByText("Scrim Details")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("scrim-header")).toBeInTheDocument();
    expect(screen.getByText("Scrim Header: scrim1")).toBeInTheDocument();
    expect(screen.getAllByTestId("match-card").length).toBe(2);
  });
});
