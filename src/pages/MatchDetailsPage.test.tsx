import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";
import MatchDetailsPage from "./MatchDetailsPage";
import { useScrimsightData } from "../hooks/useScrimsightData";

// Mock external modules
vi.mock("../hooks/useScrimsightData", () => ({
  useScrimsightData: vi.fn(),
}));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useParams: vi.fn(), // Ensure useParams is a mock function
  };
});

// Mock child components
vi.mock("../components/MatchHeader", () => ({
  default: ({ matchId, mapName }: { matchId: string; mapName: string }) => (
    <div data-testid="match-header">Match Header: {matchId} - {mapName}</div>
  ),
}));
vi.mock("../components/DataTable", () => ({
  default: ({ data }: { data: any[] }) => (
    <div data-testid="data-table">DataTable: {data.length} rows</div>
  ),
}));
vi.mock("../components/TeamfightCard", () => ({
  default: ({ teamfight }: { teamfight: any }) => (
    <div data-testid="teamfight-card">Teamfight: {teamfight.id}</div>
  ),
}));
vi.mock("../components/EmptyState", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="empty-state">Empty State: {title}</div>
  ),
}));
vi.mock("../components/TimelineBar", () => ({
  default: ({ segments }: { segments: any[] }) => (
    <div data-testid="timeline-bar">Timeline: {segments.length} segments</div>
  ),
}));
vi.mock("../icons/HeroIcon", () => ({
  default: ({ hero }: { hero: string }) => (
    <span data-testid="hero-icon">{hero}</span>
  ),
}));
vi.mock("../icons/RoleIcon", () => ({
  default: ({ role }: { role: string }) => (
    <span data-testid="role-icon">{role}</span>
  ),
}));
vi.mock("../components/BreadCrumbs", () => ({
  default: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));
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
vi.mock("../components/PageSection", () => {
  const MockPageSection = ({ children }: { children: React.ReactNode }) => (
    <section data-testid="page-section">{children}</section>
  );
  MockPageSection.Title = ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="page-section-title">{children}</h2>
  );
  MockPageSection.Description = ({ children }: { children: React.ReactNode }) => (
    <p data-testid="page-section-description">{children}</p>
  );
  MockPageSection.Content = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-section-content">{children}</div>
  );
  return { default: MockPageSection };
});

// Mock utility functions
vi.mock("../lib/format", () => ({
  prettyFormat: vi.fn((value) => value.toFixed(1)),
}));
vi.mock("../lib/hero", () => ({
  getRoleFromHero: vi.fn((hero) => {
    if (hero === "Reinhardt") return "Tank";
    if (hero === "Soldier: 76") return "Damage";
    if (hero === "Mercy") return "Support";
    return "Unknown";
  }),
}));
vi.mock("../lib/route", () => ({
  getRoute: vi.fn((path) => path),
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
  playerStatBreakdown: {
    byTeamAndPlayerAndMatch: [
      {
        playerName: "Player1",
        playerTeam: "TeamA",
        matchId: "match1",
        playerHero: "Reinhardt",
        eliminations: 10,
        finalBlows: 5,
        deaths: 3,
        heroDamageDealt: 10000,
        healingDealt: 0,
        ultimatesUsed: 5,
        eliminationsPer10Minutes: 5,
        deathsPer10Minutes: 1.5,
        heroDamageDealtPer10Minutes: 5000,
        healingDealtPer10Minutes: 0,
        ultimateChargeTime: 60,
        teamfightWinRate: 0.6,
      },
      {
        playerName: "Player2",
        playerTeam: "TeamB",
        matchId: "match1",
        playerHero: "Soldier: 76",
        eliminations: 8,
        finalBlows: 4,
        deaths: 4,
        heroDamageDealt: 8000,
        healingDealt: 0,
        ultimatesUsed: 4,
        eliminationsPer10Minutes: 4,
        deathsPer10Minutes: 2,
        heroDamageDealtPer10Minutes: 4000,
        healingDealtPer10Minutes: 0,
        ultimateChargeTime: 70,
        teamfightWinRate: 0.4,
      },
    ],
  },
  teamfights: [
    {
      id: "tf1",
      matchId: "match1",
      startTime: 100,
      endTime: 150,
      winner: "TeamA",
    },
    {
      id: "tf2",
      matchId: "match1",
      startTime: 300,
      endTime: 350,
      winner: "TeamB",
    },
  ],
  playerStat: [
    {
      playerName: "Player1",
      playerTeam: "TeamA",
      matchId: "match1",
      playerHero: "Reinhardt",
      eliminations: 1,
      deaths: 0,
    },
    {
      playerName: "Player2",
      playerTeam: "TeamB",
      matchId: "match1",
      playerHero: "Soldier: 76",
      eliminations: 1,
      deaths: 0,
    },
  ],
};

describe("MatchDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EmptyState when matchId is missing", () => {
    (useScrimsightData as Mock).mockReturnValue({
      matches: [],
      playerStatBreakdown: { byTeamAndPlayerAndMatch: [] },
      teamfights: [],
      playerStat: [],
    });
    (useParams as Mock).mockReturnValue({});

    render(
      <MemoryRouter initialEntries={["/matches"]}>
        <Routes>
          <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
          <Route path="/matches" element={<MatchDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: Match not found")).toBeInTheDocument();
  });

  it("renders EmptyState when matchDetails are not found", () => {
    (useScrimsightData as Mock).mockReturnValue({
      matches: [],
      playerStatBreakdown: { byTeamAndPlayerAndMatch: [] },
      teamfights: [],
      playerStat: [],
    });
    (useParams as Mock).mockReturnValue({ matchId: "nonexistent-match" });

    render(
      <MemoryRouter initialEntries={["/matches/nonexistent-match"]}>
        <Routes>
          <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: Match not found")).toBeInTheDocument();
  });

  describe("when match data is available", () => {
    beforeEach(() => {
      (useScrimsightData as Mock).mockReturnValue(mockDataModel);
      (useParams as Mock).mockReturnValue({ matchId: "match1" });
    });

    it("renders MatchHeader with correct props", () => {
      render(
        <MemoryRouter initialEntries={["/matches/match1"]}>
          <Routes>
            <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId("match-header")).toBeInTheDocument();
      expect(screen.getByText("Match Header: match1 - King's Row")).toBeInTheDocument();
    });

    it("renders scoreboard DataTables with player data", () => {
      render(
        <MemoryRouter initialEntries={["/matches/match1"]}>
          <Routes>
            <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      const scoreboardSection = screen.getByRole("heading", { name: /scoreboard/i }).closest('section');
      const dataTables = within(scoreboardSection!).getAllByTestId("data-table");
      expect(dataTables.length).toBe(2); // One for each team
      expect(within(scoreboardSection!).getAllByText("DataTable: 1 rows").length).toBe(2); // Each team has 1 player in mock
    });

    it("renders TimelineBar with correct segments", () => {
      render(
        <MemoryRouter initialEntries={["/matches/match1"]}>
          <Routes>
            <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId("timeline-bar")).toBeInTheDocument();
      expect(screen.getByText("Timeline: 4 segments")).toBeInTheDocument(); // 2 teamfights + 2 round markers
    });

    it("renders TeamfightCards for each teamfight", () => {
      render(
        <MemoryRouter initialEntries={["/matches/match1"]}>
          <Routes>
            <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Teamfight: tf1")).toBeInTheDocument();
      expect(screen.getByText("Teamfight: tf2")).toBeInTheDocument();
    });

    it("renders Team Compositions section", () => {
      render(
        <MemoryRouter initialEntries={["/matches/match1"]}>
          <Routes>
            <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Team Compositions")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /TeamA/i, level: 3 })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /TeamB/i, level: 3 })).toBeInTheDocument();
      const teamASection = screen.getByRole("heading", { name: /TeamA/i, level: 3 }).closest('.card');
      const teamBSection = screen.getByRole("heading", { name: /TeamB/i, level: 3 }).closest('.card');

      expect(within(teamASection! as HTMLElement).getByText(/Tank: \d+/)).toBeInTheDocument();
      expect(within(teamASection! as HTMLElement).getByText(/Damage: \d+/)).toBeInTheDocument();
      expect(within(teamASection! as HTMLElement).getByText(/Support: \d+/)).toBeInTheDocument();

      expect(within(teamBSection! as HTMLElement).getByText(/Tank: \d+/)).toBeInTheDocument();
      expect(within(teamBSection! as HTMLElement).getByText(/Damage: \d+/)).toBeInTheDocument();
      expect(within(teamBSection! as HTMLElement).getByText(/Support: \d+/)).toBeInTheDocument();
      const heroIcons = screen.getAllByTestId("hero-icon");
      screen.debug(heroIcons);
      expect(heroIcons.some(icon => icon.textContent === "Reinhardt")).toBe(true);
      expect(heroIcons.some(icon => icon.textContent === "Soldier: 76")).toBe(true);
    });
  });
});