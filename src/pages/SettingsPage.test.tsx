import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SettingsPage from "./SettingsPage";
import { useScrimsightData } from "../hooks/useScrimsightData";
import { useAtom } from "jotai";

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
vi.mock("jotai", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAtom: vi.fn(),
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
vi.mock("../components/EmptyState", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="empty-state">Empty State: {title}</div>
  ),
}));
vi.mock("lucide-react", () => ({
  Settings: ({ size }: { size: number }) => <svg data-testid="settings-icon" width={size} height={size} />,
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    (useAtom as vi.Mock).mockReturnValue([true, vi.fn()]);

    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <Routes>
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("scrimsight-page")).toBeInTheDocument();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByText("Enable Sample Data")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});
