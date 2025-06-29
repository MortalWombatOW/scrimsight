import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import ScrimHeader from "./ScrimHeader";

// Mock TeamColorDot component
vi.mock("./TeamColorDot", () => ({
  default: ({ teamName, size }: { teamName: string; size: number }) => (
    <div data-testid="team-color-dot" data-team={teamName} data-size={size} />
  ),
}));

// Mock formatDate utility
vi.mock("../lib/format", () => ({
  formatDate: vi.fn((date: Date) => 
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  ),
}));

describe("ScrimHeader", () => {
  const defaultProps = {
    scrimId: "SCRIM_2024_001",
    date: new Date("2024-01-15T19:30:00"),
    team1Name: "Boston Uprising",
    team2Name: "New York Excelsior",
    team1MatchesWon: 3,
    team2MatchesWon: 1,
  };

  it("renders scrim ID", () => {
    render(<ScrimHeader {...defaultProps} />);
    
    expect(screen.getByText("SCRIM_2024_001")).toBeInTheDocument();
  });

  it("renders formatted date and time", () => {
    render(<ScrimHeader {...defaultProps} />);
    
    expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument();
    expect(screen.getByText("7:30 PM")).toBeInTheDocument();
  });

  it("renders both team names with color dots", () => {    
    render(<ScrimHeader {...defaultProps} />);
    
    expect(screen.getByText("Boston Uprising")).toBeInTheDocument();
    expect(screen.getByText("New York Excelsior")).toBeInTheDocument();
    
    const colorDots = screen.getAllByTestId("team-color-dot");
    expect(colorDots).toHaveLength(2);
    expect(colorDots[0]).toHaveAttribute("data-team", "Boston Uprising");
    expect(colorDots[0]).toHaveAttribute("data-size", "20");
    expect(colorDots[1]).toHaveAttribute("data-team", "New York Excelsior");  
    expect(colorDots[1]).toHaveAttribute("data-size", "20");
  });

  it("displays match scores", () => {
    render(<ScrimHeader {...defaultProps} />);
    
    const scores = screen.getAllByText(/^[0-9]+$/);
    expect(scores).toHaveLength(2);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("applies winning styling to team 1 when they win", () => {
    render(<ScrimHeader {...defaultProps} />);
    
    const team1Score = screen.getByText("3");
    const team2Score = screen.getByText("1");
    
    expect(team1Score).toHaveClass("text-success");
    expect(team2Score).toHaveClass("text-error");
  });

  it("applies winning styling to team 2 when they win", () => {
    const props = {
      ...defaultProps,
      team1MatchesWon: 1,
      team2MatchesWon: 3,
    };
    
    render(<ScrimHeader {...props} />);
    
    const team1Score = screen.getByText("1");
    const team2Score = screen.getByText("3");
    
    expect(team1Score).toHaveClass("text-error");
    expect(team2Score).toHaveClass("text-success");
  });

  it("applies draw styling when scores are tied", () => {
    const props = {
      ...defaultProps,
      team1MatchesWon: 2,
      team2MatchesWon: 2,
    };
    
    render(<ScrimHeader {...props} />);
    
    const scores = screen.getAllByText("2");
    scores.forEach(score => {
      expect(score).toHaveClass("text-base-content/70");
    });
  });

  it("shows win message for team 1 victory", () => {
    render(<ScrimHeader {...defaultProps} />);
    
    expect(screen.getByText("Boston Uprising wins the scrim!")).toBeInTheDocument();
    expect(screen.queryByText("Scrim ends in a draw")).not.toBeInTheDocument();
  });

  it("shows win message for team 2 victory", () => {
    const props = {
      ...defaultProps,
      team1MatchesWon: 1,
      team2MatchesWon: 3,
    };
    
    render(<ScrimHeader {...props} />);
    
    expect(screen.getByText("New York Excelsior wins the scrim!")).toBeInTheDocument();
    expect(screen.queryByText("Scrim ends in a draw")).not.toBeInTheDocument();
  });

  it("shows draw message when scores are tied", () => {
    const props = {
      ...defaultProps,
      team1MatchesWon: 2,
      team2MatchesWon: 2,
    };
    
    render(<ScrimHeader {...props} />);
    
    expect(screen.getByText("Scrim ends in a draw")).toBeInTheDocument();
    expect(screen.queryByText(/wins the scrim!/)).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ScrimHeader {...defaultProps} className="custom-class" />
    );
    
    const headerDiv = container.firstChild as HTMLElement;
    expect(headerDiv).toHaveClass("custom-class");
  });

  it("renders children when provided", () => {
    render(
      <ScrimHeader {...defaultProps}>
        <div data-testid="child-content">Additional content</div>
      </ScrimHeader>
    );
    
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Additional content")).toBeInTheDocument();
  });

  it("does not render children section when none provided", () => {
    const { container } = render(<ScrimHeader {...defaultProps} />);
    
    // Look for the mt-4 div that would contain children
    const childrenContainer = container.querySelector(".mt-4");
    expect(childrenContainer).not.toBeInTheDocument();
  });

  it("formats time correctly for AM hours", () => {
    const props = {
      ...defaultProps,
      date: new Date("2024-01-15T09:15:00"),
    };
    
    render(<ScrimHeader {...props} />);
    
    expect(screen.getByText("9:15 AM")).toBeInTheDocument();
  });

  it("formats time correctly for PM hours", () => {
    const props = {
      ...defaultProps,
      date: new Date("2024-01-15T15:45:00"),
    };
    
    render(<ScrimHeader {...props} />);
    
    expect(screen.getByText("3:45 PM")).toBeInTheDocument();
  });

  it("renders proper metadata with separators", () => {
    render(<ScrimHeader {...defaultProps} />);
    
    // Check for bullet separators
    const bullets = screen.getAllByText("•");
    expect(bullets).toHaveLength(2);
  });

  it("applies winner styling to team names", () => {
    render(<ScrimHeader {...defaultProps} />);
    
    const team1Name = screen.getByText("Boston Uprising");
    const team2Name = screen.getByText("New York Excelsior");
    
    expect(team1Name).toHaveClass("text-success");
    expect(team2Name).not.toHaveClass("text-success");
  });

  it("applies winner styling to team 2 name when they win", () => {
    const props = {
      ...defaultProps,
      team1MatchesWon: 1,
      team2MatchesWon: 3,
    };
    
    render(<ScrimHeader {...props} />);
    
    const team1Name = screen.getByText("Boston Uprising");
    const team2Name = screen.getByText("New York Excelsior");
    
    expect(team1Name).not.toHaveClass("text-success");
    expect(team2Name).toHaveClass("text-success");
  });

  it("does not apply winner styling to team names in a draw", () => {
    const props = {
      ...defaultProps,
      team1MatchesWon: 2,
      team2MatchesWon: 2,
    };
    
    render(<ScrimHeader {...props} />);
    
    const team1Name = screen.getByText("Boston Uprising");
    const team2Name = screen.getByText("New York Excelsior");
    
    expect(team1Name).not.toHaveClass("text-success");
    expect(team2Name).not.toHaveClass("text-success");
  });
});