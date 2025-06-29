import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";
import TeamDetailsPage from "./TeamDetailsPage";
import { useScrimsightData } from "../hooks/useScrimsightData";

// Mock external modules
vi.mock("../hooks/useScrimsightData", () => ({
  useScrimsightData: vi.fn((data) => ({
    scrims: data?.scrims || [],
    matches: data?.matches || [],
    teams: data?.teams || [],
    playerStatBreakdown: data?.playerStatBreakdown || {
      byTeam: [],
      byTeamAndPlayer: [],
      byTeamAndPlayerAndTeam: [],
    },
  })),
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
vi.mock("../components/TeamHeader", () => ({
  default: ({ teamName }: { teamName: string }) => (
    <div data-testid="team-header">Team Header: {teamName}</div>
  ),
}));
vi.mock("../components/EmptyState", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="empty-state">Empty State: {title}</div>
  ),
}));
vi.mock("lucide-react", () => ({
  Users: ({ size }: { size: number }) => <svg data-testid="users-icon" width={size} height={size} />,
  Trophy: ({ size }: { size: number }) => <svg data-testid="trophy-icon" width={size} height={size} />,
  Target: ({ size }: { size: number }) => <svg data-testid="target-icon" width={size} height={size} />,
  TrendingUp: ({ size }: { size: number }) => <svg data-testid="trending-up-icon" width={size} height={size} />,
  ChevronsUpDown: ({ size }: { size: number }) => <svg data-testid="chevrons-up-down-icon" width={size} height={size} />,
  ChevronUp: ({ size }: { size: number }) => <svg data-testid="chevron-up-icon" width={size} height={size} />,
  ChevronDown: ({ size }: { size: number }) => <svg data-testid="chevron-down-icon" width={size} height={size} />,
}));

const mockDataModel = {
  teams: [
    {
      teamName: "TeamA",
      players: ["Player1", "Player2"],
      scrims: ["scrim1"],
    },
  ],
  scrims: [
    {
      scrim: "scrim1",
      date: new Date("2024-01-01"),
      teams: ["TeamA", "TeamB"],
      matches: ["match1"],
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
      date: new Date("2024-01-01"),
    },
  ],
  playerStatBreakdown: {
    byTeam: [
      {
        playerTeam: "TeamA",
        teamfightWinRate: 0.6,
      },
    ],
    byTeamAndPlayer: [
      {
        playerName: "Player1",
        playerTeam: "TeamA",
        eliminations: 10,
        deaths: 5,
        heroDamageDealt: 5000,
        healingDealt: 1000,
        ultimatesUsed: 2,
        playtime: 600,
      },
    ],
    byTeamAndPlayerAndTeam: [],
  },
};

describe("TeamDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EmptyState when teamName is missing", () => {
    (useScrimsightData as vi.Mock).mockReturnValue({
      teams: [],
      playerStatBreakdown: {
        byTeam: [],
        byTeamAndPlayer: [],
        byTeamAndPlayerAndTeam: [],
      },
    });
    useParams.mockReturnValue({});

    render(
      <MemoryRouter initialEntries={["/teams"]}>
        <Routes>
          <Route path="/teams/:teamName" element={<TeamDetailsPage />} />
          <Route path="/teams" element={<TeamDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: Team not found")).toBeInTheDocument();
  });

  it("renders EmptyState when teamDetails are not found", () => {
    (useScrimsightData as vi.Mock).mockReturnValue({
      teams: [],
      matches: [],
      playerStatBreakdown: {
        byTeam: [],
        byTeamAndPlayer: [],
        byTeamAndPlayerAndTeam: [],
      },
    });
    useParams.mockReturnValue({ teamName: "nonexistent-team" });

    render(
      <MemoryRouter initialEntries={["/teams/nonexistent-team"]}>
        <Routes>
          <Route path="/teams/:teamName" element={<TeamDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: Team not found")).toBeInTheDocument();
  });

  it("renders correctly with team data", () => {
    (useScrimsightData as vi.Mock).mockReturnValue(mockDataModel);
    useParams.mockReturnValue({ teamName: "TeamA" });

    render(
      <MemoryRouter initialEntries={["/teams/TeamA"]}>
        <Routes>
          <Route path="/teams/:teamName" element={<TeamDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("scrimsight-page")).toBeInTheDocument();
    expect(within(screen.getByTestId("scrimsight-page")).getByTestId("page-header")).toBeInTheDocument();
    expect(within(screen.getByTestId("page-header")).getByText("TeamA")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("team-header")).toBeInTheDocument();
    expect(screen.getByText("Team Header: TeamA")).toBeInTheDocument();
  });
});
