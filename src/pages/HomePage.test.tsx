import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { MemoryRouter } from "react-router-dom";
// eslint-disable-next-line project-structure/independent-modules
import HomePage from "./HomePage";
import { useAtomValue } from "jotai";
import { formatDuration } from "../lib/format";

// Mock Jotai's useAtomValue hook
vi.mock("jotai", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useAtomValue: vi.fn(),
    atom: vi.fn(),
  };
});

// Mock getRoute from react-router-dom
vi.mock("../lib/route", () => ({
  getRoute: vi.fn((path) => path),
}));

// Mock CardStat component
vi.mock("../components/CardStat", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ label, value }: { label: string; value: any }) => (
    <div data-testid="card-stat">
      <span>{label}</span>
      <span data-testid="card-stat-value">{typeof value === 'object' ? 'complex_value' : value}</span>
    </div>
  ),
}));

// Mock ScrimCard component
vi.mock("../components/ScrimCard", () => ({
  default: ({ scrimId }: { scrimId: string }) => (
    <div data-testid="scrim-card">{scrimId}</div>
  ),
}));

// Mock StatDistributionAndTop component
vi.mock("../components/StatDistributionAndTop", () => ({
  default: ({ statName }: { statName: string }) => (
    <div data-testid="stat-distribution-and-top">{statName}</div>
  ),
}));

// Mock EmptyState component
vi.mock("../components/EmptyState", () => ({
  default: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

// Mock BreadCrumbs component
vi.mock("../components/BreadCrumbs", () => ({
  default: ({ items }: { items: { label: string; path: string }[] }) => (
    <div data-testid="breadcrumbs">
      {items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </div>
  ),
}));

const mockDataModel = {
  scrims: [
    { scrim: "scrim1", date: "2025-06-27T10:00:00Z", matches: [] },
    { scrim: "scrim2", date: "2025-06-26T10:00:00Z", matches: [] },
    { scrim: "scrim3", date: "2025-06-25T10:00:00Z", matches: [] },
    { scrim: "scrim4", date: "2025-06-24T10:00:00Z", matches: [] },
  ],
  matches: [
    { match: "match1", duration: 1200 },
    { match: "match2", duration: 1000 },
  ],
  players: [{ player: "PlayerA" }, { player: "PlayerB" }],
  teams: [{ team: "TeamX" }, { team: "TeamY" }],
  teamfights: [{ id: "tf1" }, { id: "tf2" }, { id: "tf3" }],
  playerStatBreakdown: {
    byPlayer: [
      {
        playerName: "PlayerA",
        eliminations: 100,
        deaths: 50,
        allDamageDealtPer10Minutes: 5000,
        healingDealtPer10Minutes: 1000,
      },
      {
        playerName: "PlayerB",
        eliminations: 80,
        deaths: 40,
        allDamageDealtPer10Minutes: 4000,
        healingDealtPer10Minutes: 800,
      },
    ],
  },
};

describe("HomePage", () => {
  it("renders EmptyState when dataModel is null", () => {
    (useAtomValue as Mock).mockReturnValue(null);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("No Data Available")).toBeInTheDocument();
    expect(screen.getByText("Upload scrim data to see statistics and insights")).toBeInTheDocument();
  });

  describe("when dataModel is available", () => {
    beforeEach(() => {
      (useAtomValue as Mock).mockReturnValue(mockDataModel);
    });

    it("renders CardStats with correct values", () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      const getCardStatValue = (label: string) => {
        const cardStat = screen.getByText(label).closest('[data-testid="card-stat"]');
        return cardStat?.querySelector('[data-testid="card-stat-value"]')?.textContent;
      };

      expect(getCardStatValue("Total Scrims")).toBe(mockDataModel.scrims.length.toString());
      expect(getCardStatValue("Total Matches")).toBe(mockDataModel.matches.length.toString());
      expect(getCardStatValue("Active Players")).toBe(mockDataModel.players.length.toString());
      expect(getCardStatValue("Teams")).toBe(mockDataModel.teams.length.toString());
      expect(getCardStatValue("Teamfights")).toBe(mockDataModel.teamfights.length.toString());

      const expectedPlaytime = mockDataModel.matches.reduce((total, match) => total + match.duration, 0);
      expect(getCardStatValue("Total Playtime")).toBe(formatDuration(expectedPlaytime));
    });

    it("renders recent scrims", () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      expect(screen.getByText("Recent Scrims")).toBeInTheDocument();
      expect(screen.getByText("scrim1")).toBeInTheDocument();
      expect(screen.getByText("scrim2")).toBeInTheDocument();
      expect(screen.getByText("scrim3")).toBeInTheDocument();
      expect(screen.queryByText("scrim4")).not.toBeInTheDocument(); // Only top 3
    });

    it("renders Key Metrics sections with correct data", () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      expect(screen.getByText("Key Metrics")).toBeInTheDocument();
      expect(screen.getByText("Kill/Death Ratio")).toBeInTheDocument();
      expect(screen.getByText("Damage per 10 Minutes")).toBeInTheDocument();
      expect(screen.getByText("Healing per 10 Minutes")).toBeInTheDocument();
    });
  });
});