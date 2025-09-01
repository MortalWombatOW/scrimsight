import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
// eslint-disable-next-line project-structure/independent-modules
import TeamsPage from "./TeamsPage";
import { useScrimsightData } from "../hooks/useScrimsightData";

// Mock external modules
vi.mock("../hooks/useScrimsightData", () => ({
  useScrimsightData: vi.fn(() => ({
    teams: [],
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
vi.mock("../components/TeamList", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ teams }: { teams: any[] }) => (
    <div data-testid="team-list">Team List: {teams.length} teams</div>
  ),
}));
vi.mock("../components/EmptyState", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="empty-state">Empty State: {title}</div>
  ),
}));
vi.mock("lucide-react", () => ({
  Users: ({ size }: { size: number }) => <svg data-testid="users-icon" width={size} height={size} />,
}));

const mockDataModel = {
  teams: [
    {
      teamName: "TeamA",
      players: ["Player1", "Player2"],
    },
  ],
};

describe("TeamsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with teams data", () => {
    (useScrimsightData as Mock).mockReturnValue(mockDataModel);

    render(
      <MemoryRouter initialEntries={["/teams"]}>
        <Routes>
          <Route path="/teams" element={<TeamsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("scrimsight-page")).toBeInTheDocument();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByText("Teams")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("team-list")).toBeInTheDocument();
    expect(screen.getByText("Team List: 1 teams")).toBeInTheDocument();
  });

  it("renders EmptyState when no teams are available", () => {
    (useScrimsightData as Mock).mockReturnValue({
      teams: [],
    });

    render(
      <MemoryRouter initialEntries={["/teams"]}>
        <Routes>
          <Route path="/teams" element={<TeamsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("Empty State: No teams found")).toBeInTheDocument();
  });
});
