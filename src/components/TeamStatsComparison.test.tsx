import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TeamStatsComparison } from "./TeamStatsComparison";
import * as jotai from "jotai";
import * as library from "@library";

// Mock jotai
vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtomValue: vi.fn(),
  };
});

// Mock library
vi.mock("@library", async () => {
  const actual = await vi.importActual("@library");
  return {
    ...actual,
    useStats: vi.fn(),
    camelCaseToWords: (str: string) => str,
    prettyFormat: (num: number) => String(num),
  };
});

describe("TeamStatsComparison", () => {
  const mockMatchId = "123";
  const mockMatchData = [
    {
      matchId: mockMatchId,
      team1Name: "Team A",
      team2Name: "Team B",
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    (jotai.useAtomValue as any).mockReturnValue(mockMatchData);
  });

  it("renders correctly when data is consistent", () => {
    (library.useStats as any).mockReturnValue({
      rows: [
        { playerTeam: "Team A", finalBlows: 10, allDamageDealt: 1000, healingDealt: 500, ultimatesUsed: 2 },
        { playerTeam: "Team B", finalBlows: 8, allDamageDealt: 800, healingDealt: 600, ultimatesUsed: 3 },
      ],
    });

    render(<TeamStatsComparison matchId={mockMatchId} />);
    expect(screen.getByText("Team A")).toBeDefined();
    expect(screen.getByText("Team B")).toBeDefined();
  });

  it("ignores stats for unknown teams", () => {
    (library.useStats as any).mockReturnValue({
      rows: [
        { playerTeam: "Team C", finalBlows: 10 }, // Team C is not in matchData
      ],
    });

    render(<TeamStatsComparison matchId={mockMatchId} />);
    // Should not throw
    expect(screen.getByText("Team A")).toBeDefined();
  });
});
