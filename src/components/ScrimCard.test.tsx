import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "jotai";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import ScrimCard from "./ScrimCard";
import { dataModelAtom } from "../atoms/scrimsight";
import { ScrimsightDataModel, PlayerStatsNumerical } from "../lib/ScrimsightDataModel";

const mockNavigate = vi.fn();

vi.mock("../hooks/useScrimsightNavigation", () => ({
  useScrimsightNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

vi.mock("../lib/route", () => ({
  getRoute: vi.fn((path: string) => `/app${path}`),
}));

vi.mock("./TeamColorDot", () => ({
  default: ({ teamName, size }: { teamName: string; size: number }) => (
    <div data-testid="team-color-dot" data-team={teamName} data-size={size} />
  ),
}));

vi.mock("./PrimaryButton", () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

const createMockDataModel = (): ScrimsightDataModel => ({
  scrims: [
    {
      scrim: "test-scrim-1",
      teams: ["Team Alpha", "Team Beta"],
      matches: ["match-1", "match-2", "match-3"],
      date: new Date("2024-01-15T19:30:00"),
      team1MatchesWon: 2,
      team2MatchesWon: 1,
    },
    {
      scrim: "test-scrim-2",
      teams: ["Phoenix Gaming", "Thunder Squad"],
      matches: ["match-4", "match-5"],
      date: new Date("2024-01-16T20:15:00"),
      team1MatchesWon: 1,
      team2MatchesWon: 2,
    },
    {
      scrim: "test-scrim-3",
      teams: ["Red Hawks", "Blue Storm"],
      matches: ["match-6", "match-7"],
      date: new Date("2024-01-17T18:45:00"),
      team1MatchesWon: 2,
      team2MatchesWon: 2,
    },
  ],
  ability1Used: [],
  ability2Used: [],
  damage: [],
  defensiveAssist: [],
  dvaDemech: [],
  dvaRemech: [],
  healing: [],
  heroSpawn: [],
  heroSwap: [],
  kill: [],
  matchEnd: [],
  matchStart: [],
  mercyRez: [],
  offensiveAssist: [],
  playerStat: [],
  roundEnd: [],
  roundStart: [],
  setupComplete: [],
  ultimateCharged: [],
  ultimateEnd: [],
  ultimateStart: [],
  matches: [],
  teams: [],
  players: [],
  playerLives: [],
  teamfights: [],
  rounds: [],
  teamCompositions: [],
  playerStatBreakdown: {
    total: {} as PlayerStatsNumerical,
    byPlayer: [],
    byTeam: [],
    byTeamAndPlayer: [],
    byTeamAndPlayerAndMatch: [],
    byTeamAndPlayerAndScrim: [],
    byPlayerAndHero: [],
    byRole: [],
    byHero: [],
    byTeamAndMatch: [],
    byTeamAndScrim: [],
  },
  playerStatBreakdownRanks: {
    total: {} as PlayerStatsNumerical,
    byPlayer: [],
    byTeam: [],
    byTeamAndPlayer: [],
    byTeamAndPlayerAndMatch: [],
    byTeamAndPlayerAndScrim: [],
    byPlayerAndHero: [],
    byRole: [],
    byHero: [],
    byTeamAndMatch: [],
    byTeamAndScrim: [],
  },
  killCounts: {
    byMatch: [],
    byMatchAndRound: [],
  },
});

const TestWrapper = ({ children, dataModel }: { children: React.ReactNode; dataModel: ScrimsightDataModel | null }) => {
  // Following the pattern from MatchCard tests
  const hydratedAtom = dataModelAtom;
  hydratedAtom.init = dataModel;
  
  return (
    <BrowserRouter>
      <Provider>
        {children}
      </Provider>
    </BrowserRouter>
  );
};

describe("ScrimCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders team names with color dots", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Team Beta")).toBeInTheDocument();
  });

  it("displays match scores correctly", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows formatted date and time", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument();
    expect(screen.getByText("7:30 PM")).toBeInTheDocument();
  });

  it("displays View button", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
  });

  it("navigates to scrim details when View button is clicked", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    const viewButton = screen.getByRole("button", { name: "View" });
    fireEvent.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith("/scrim/:scrimId", { scrimId: "test-scrim-1" });
  });

  it("applies win styling to winning team", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    const team1Score = screen.getByText("2");
    const team2Score = screen.getByText("1");

    expect(team1Score).toHaveClass("text-success");
    expect(team2Score).toHaveClass("text-error");
  });

  it("applies loss styling to losing team", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-2" />
      </TestWrapper>
    );

    const team1Score = screen.getByText("1");
    const team2Score = screen.getByText("2");

    expect(team1Score).toHaveClass("text-error");
    expect(team2Score).toHaveClass("text-success");
  });

  it("applies draw styling when teams are tied", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-3" />
      </TestWrapper>
    );

    const scores = screen.getAllByText("2");
    scores.forEach(score => {
      expect(score).toHaveClass("text-base-content/70");
    });
  });

  it("renders error message when scrim is not found", () => {
    const dataModel = createMockDataModel();
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="nonexistent-scrim" />
      </TestWrapper>
    );

    expect(screen.getByText("Scrim not found")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "View" })).not.toBeInTheDocument();
  });

  it("renders error message when data model is null", () => {
    render(
      <TestWrapper dataModel={null}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    expect(screen.getByText("Scrim not found")).toBeInTheDocument();
  });

  it("formats date correctly for different months", () => {
    const dataModel = createMockDataModel();
    dataModel.scrims[0].date = new Date("2024-12-25T14:30:00");
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    expect(screen.getByText("Dec 25, 2024")).toBeInTheDocument();
    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
  });

  it("formats time correctly for AM hours", () => {
    const dataModel = createMockDataModel();
    dataModel.scrims[0].date = new Date("2024-01-15T09:15:00");
    
    render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    expect(screen.getByText("9:15 AM")).toBeInTheDocument();
  });

  it("renders card with proper styling classes", () => {
    const dataModel = createMockDataModel();
    
    const { container } = render(
      <TestWrapper dataModel={dataModel}>
        <ScrimCard scrimId="test-scrim-1" />
      </TestWrapper>
    );

    const card = container.querySelector(".card.bg-base-100.shadow-xl");
    expect(card).toBeInTheDocument();
    
    const cardBody = container.querySelector(".card-body");
    expect(cardBody).toBeInTheDocument();
  });
});