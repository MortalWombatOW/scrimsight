import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VisualCard } from "./VisualCard";
import { BrowserRouter } from "react-router-dom";

describe("VisualCard", () => {
  it("renders title and children", () => {
    render(
      <VisualCard title="Test Card">
        <p>Card Content</p>
      </VisualCard>
    );

    expect(screen.getByText("Test Card")).toBeDefined();
    expect(screen.getByText("Card Content")).toBeDefined();
  });

  it("renders as a link when linkUrl is provided", () => {
    render(
      <BrowserRouter>
        <VisualCard title="Link Card" linkUrl="/test">
          <p>Link Content</p>
        </VisualCard>
      </BrowserRouter>
    );

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/test");
  });

  it("renders footer when provided", () => {
    render(
      <VisualCard title="Footer Card" footer={<span>Footer Content</span>}>
        <p>Content</p>
      </VisualCard>
    );

    expect(screen.getByText("Footer Content")).toBeDefined();
  });
});
