import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import TeamColorDot from "./TeamColorDot";

// Mock the color utility
vi.mock("../lib/color", () => ({
  getColorgorical: vi.fn((teamName: string) => {
    // Return predictable colors based on team name for testing
    const colors: { [key: string]: string } = {
      "Team Alpha": "#ff0000",
      "Team Beta": "#00ff00", 
      "Team Gamma": "#0000ff",
      "Boston Uprising": "#174a84",
      "New York Excelsior": "#0f57ea",
    };
    return colors[teamName] || "#cccccc";
  }),
}));

describe("TeamColorDot", () => {
  it("renders a div with proper styling classes", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveClass("rounded-full");
    expect(dot).toHaveClass("inline-block");
  });

  it("applies default size of 12px when size prop is not provided", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({
      width: "12px",
      height: "12px",
    });
  });

  it("applies custom size when size prop is provided", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" size={24} />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({
      width: "24px",
      height: "24px",
    });
  });

  it("applies background color based on team name", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({
      backgroundColor: "#ff0000",
    });
  });

  it("generates different colors for different team names", () => {
    const { container: container1 } = render(<TeamColorDot teamName="Team Alpha" />);
    const { container: container2 } = render(<TeamColorDot teamName="Team Beta" />);
    
    const dot1 = container1.firstChild as HTMLElement;
    const dot2 = container2.firstChild as HTMLElement;
    
    expect(dot1).toHaveStyle({ backgroundColor: "#ff0000" });
    expect(dot2).toHaveStyle({ backgroundColor: "#00ff00" });
  });

  it("handles small sizes correctly", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" size={8} />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({
      width: "8px",
      height: "8px",
    });
  });

  it("handles large sizes correctly", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" size={48} />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({
      width: "48px",
      height: "48px",
    });
  });

  it("handles zero size", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" size={0} />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({
      width: "0px",
      height: "0px",
    });
  });

  it("maintains consistent color for same team name", () => {
    const { container: container1 } = render(<TeamColorDot teamName="Team Alpha" size={12} />);
    const { container: container2 } = render(<TeamColorDot teamName="Team Alpha" size={24} />);
    
    const dot1 = container1.firstChild as HTMLElement;
    const dot2 = container2.firstChild as HTMLElement;
    
    // Same team name should produce same color regardless of size
    expect(dot1).toHaveStyle({ backgroundColor: "#ff0000" });
    expect(dot2).toHaveStyle({ backgroundColor: "#ff0000" });
  });

  it("handles empty team name", () => {
    const { container } = render(<TeamColorDot teamName="" />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({ backgroundColor: "#cccccc" }); // fallback color
  });

  it("handles special characters in team name", () => {
    const { container } = render(<TeamColorDot teamName="Team @#$%" />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({ backgroundColor: "#cccccc" }); // fallback color
  });

  it("renders with div tag", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot.tagName).toBe("DIV");
  });

  it("has accessible structure", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toBeInTheDocument();
    expect(dot).toBeVisible();
  });

  it("renders with real team names from stories", () => {
    const teamNames = ["Boston Uprising", "New York Excelsior"];
    
    teamNames.forEach(teamName => {
      const { container } = render(<TeamColorDot teamName={teamName} />);
      const dot = container.firstChild as HTMLElement;
      
      expect(dot).toHaveClass("rounded-full", "inline-block");
      expect(dot).toHaveStyle({
        width: "12px",
        height: "12px",
      });
    });
  });

  it("applies inline styles correctly", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" size={16} />);
    
    const dot = container.firstChild as HTMLElement;
    
    expect(dot).toHaveStyle({
      width: "16px",
      height: "16px",
      backgroundColor: "#ff0000",
    });
    expect(dot).toHaveClass("rounded-full");
  });

  it("handles fractional sizes", () => {
    const { container } = render(<TeamColorDot teamName="Team Alpha" size={12.5} />);
    
    const dot = container.firstChild as HTMLElement;
    expect(dot).toHaveStyle({
      width: "12.5px",
      height: "12.5px",
    });
  });

  it("renders multiple dots with different properties independently", () => {
    const { container } = render(
      <div>
        <TeamColorDot teamName="Team Alpha" size={8} />
        <TeamColorDot teamName="Team Beta" size={16} />
        <TeamColorDot teamName="Team Gamma" size={24} />
      </div>
    );
    
    const dots = container.querySelectorAll(".rounded-full");
    expect(dots).toHaveLength(3);
    
    expect(dots[0]).toHaveStyle({ width: "8px", height: "8px", backgroundColor: "#ff0000" });
    expect(dots[1]).toHaveStyle({ width: "16px", height: "16px", backgroundColor: "#00ff00" });
    expect(dots[2]).toHaveStyle({ width: "24px", height: "24px", backgroundColor: "#0000ff" });
  });
});