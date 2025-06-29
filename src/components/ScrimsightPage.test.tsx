import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import ScrimsightPage from "./ScrimsightPage";

describe("ScrimsightPage", () => {
  it("renders children in the main content area", () => {
    render(
      <ScrimsightPage>
        <div data-testid="main-content">Main content goes here</div>
      </ScrimsightPage>
    );

    expect(screen.getByTestId("main-content")).toBeInTheDocument();
    expect(screen.getByText("Main content goes here")).toBeInTheDocument();
  });

  it("renders without sidebar when sider prop is not provided", () => {
    const { container } = render(
      <ScrimsightPage>
        <div data-testid="main-content">Main content</div>
      </ScrimsightPage>
    );

    const mainArea = container.querySelector(".flex-1");
    const siderArea = container.querySelector(".w-0.xl\\:w-80");
    
    expect(mainArea).toBeInTheDocument();
    expect(siderArea).toBeInTheDocument(); // Sidebar area exists but is empty
    expect(siderArea).toBeEmptyDOMElement();
  });

  it("renders sidebar content when sider prop is provided", () => {
    render(
      <ScrimsightPage
        sider={<div data-testid="sidebar-content">Sidebar content</div>}
      >
        <div data-testid="main-content">Main content</div>
      </ScrimsightPage>
    );

    expect(screen.getByTestId("main-content")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    expect(screen.getByText("Sidebar content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ScrimsightPage className="custom-class">
        <div>Content</div>
      </ScrimsightPage>
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass("custom-class");
  });

  it("applies default layout classes", () => {
    const { container } = render(
      <ScrimsightPage>
        <div>Content</div>
      </ScrimsightPage>
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass("flex");
    expect(rootElement).toHaveClass("gap-6");
  });

  it("combines custom className with default classes", () => {
    const { container } = render(
      <ScrimsightPage className="extra-spacing">
        <div>Content</div>
      </ScrimsightPage>
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass("flex");
    expect(rootElement).toHaveClass("gap-6");
    expect(rootElement).toHaveClass("extra-spacing");
  });

  it("applies correct responsive classes to main content area", () => {
    const { container } = render(
      <ScrimsightPage>
        <div>Main content</div>
      </ScrimsightPage>
    );

    const mainArea = container.querySelector(".flex-1");
    expect(mainArea).toHaveClass("flex-1");
    expect(mainArea).toHaveClass("space-y-6");
  });

  it("applies correct responsive classes to sidebar area", () => {
    const { container } = render(
      <ScrimsightPage>
        <div>Main content</div>
      </ScrimsightPage>
    );

    const siderArea = container.querySelector(".w-0");
    expect(siderArea).toHaveClass("w-0");
    expect(siderArea).toHaveClass("xl:w-80");
    expect(siderArea).toHaveClass("flex-shrink-0");
  });

  it("renders multiple children in main content area", () => {
    render(
      <ScrimsightPage>
        <div data-testid="child1">First child</div>
        <div data-testid="child2">Second child</div>
        <div data-testid="child3">Third child</div>
      </ScrimsightPage>
    );

    expect(screen.getByTestId("child1")).toBeInTheDocument();
    expect(screen.getByTestId("child2")).toBeInTheDocument();
    expect(screen.getByTestId("child3")).toBeInTheDocument();
  });

  it("renders complex sidebar content", () => {
    const ComplexSidebar = () => (
      <div>
        <h3 data-testid="sidebar-title">Quick Actions</h3>
        <button data-testid="sidebar-button">Export Data</button>
        <div data-testid="sidebar-section">Recent Activity</div>
      </div>
    );

    render(
      <ScrimsightPage sider={<ComplexSidebar />}>
        <div>Main content</div>
      </ScrimsightPage>
    );

    expect(screen.getByTestId("sidebar-title")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-button")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-section")).toBeInTheDocument();
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("Export Data")).toBeInTheDocument();
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
  });

  it("renders complex main content", () => {
    const ComplexMainContent = () => (
      <div>
        <h1 data-testid="main-title">Dashboard</h1>
        <div data-testid="main-section">
          <p>This is the main content area</p>
          <button data-testid="main-button">Action Button</button>
        </div>
      </div>
    );

    render(
      <ScrimsightPage>
        <ComplexMainContent />
      </ScrimsightPage>
    );

    expect(screen.getByTestId("main-title")).toBeInTheDocument();
    expect(screen.getByTestId("main-section")).toBeInTheDocument();
    expect(screen.getByTestId("main-button")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("This is the main content area")).toBeInTheDocument();
    expect(screen.getByText("Action Button")).toBeInTheDocument();
  });

  it("handles empty className prop correctly", () => {
    const { container } = render(
      <ScrimsightPage className="">
        <div>Content</div>
      </ScrimsightPage>
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass("flex");
    expect(rootElement).toHaveClass("gap-6");
    // Should not have any extra meaningful classes (there may be trailing space)
    expect(rootElement.className.trim()).toBe("flex gap-6");
  });

  it("maintains layout structure with both main content and sidebar", () => {
    const { container } = render(
      <ScrimsightPage sider={<div>Sidebar</div>}>
        <div>Main</div>
      </ScrimsightPage>
    );

    const rootElement = container.firstChild as HTMLElement;
    const children = rootElement.children;
    
    expect(children).toHaveLength(2);
    
    // First child should be main content area
    expect(children[0]).toHaveClass("flex-1");
    expect(children[0]).toHaveClass("space-y-6");
    
    // Second child should be sidebar area
    expect(children[1]).toHaveClass("w-0");
    expect(children[1]).toHaveClass("xl:w-80");
    expect(children[1]).toHaveClass("flex-shrink-0");
  });

  it("handles undefined children gracefully", () => {
    const { container } = render(
      <ScrimsightPage>
        {undefined}
      </ScrimsightPage>
    );

    const mainArea = container.querySelector(".flex-1");
    expect(mainArea).toBeInTheDocument();
    expect(mainArea).toBeEmptyDOMElement();
  });

  it("handles null sider prop gracefully", () => {
    const { container } = render(
      <ScrimsightPage sider={null}>
        <div>Main content</div>
      </ScrimsightPage>
    );

    const siderArea = container.querySelector(".w-0.xl\\:w-80");
    expect(siderArea).toBeInTheDocument();
    expect(siderArea).toBeEmptyDOMElement();
  });
});