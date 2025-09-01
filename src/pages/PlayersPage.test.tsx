import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
// eslint-disable-next-line project-structure/independent-modules
import PlayersPage from "./PlayersPage";
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
vi.mock("../components/PlayerList", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ players }: { players: any[] }) => (
    <div data-testid="player-list">Player List: {players.length} players</div>
  ),
}));
vi.mock("../components/EmptyState", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="empty-state">Empty State: {title}</div>
  ),
}));
vi.mock("lucide-react", () => ({
  Users: ({ size }: { size: number }) => <svg data-testid="users-icon" width={size} height={size} />,
  User: ({ size }: { size: number }) => <svg data-testid="user-icon" width={size} height={size} />,
}));

const mockDataModel = {
  players: [
    {
      name: "Player1",
      team: "TeamA",
      role: "Tank",
    },
  ],
};

describe("PlayersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with players data", () => {
    (useScrimsightData as Mock).mockReturnValue(mockDataModel);

    render(
      <MemoryRouter initialEntries={["/players"]}>
        <Routes>
          <Route path="/players" element={<PlayersPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("scrimsight-page")).toBeInTheDocument();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByText("Players")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("player-list")).toBeInTheDocument();
    expect(screen.getByText("Player List: 1 players")).toBeInTheDocument();
  });

  it("renders EmptyState when no players are available", () => {
    (useScrimsightData as Mock).mockReturnValue({
      players: [],
    });

    render(
      <MemoryRouter initialEntries={["/players"]}>
        <Routes>
          <Route path="/players" element={<PlayersPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: No players found")).toBeInTheDocument();
  });
});
