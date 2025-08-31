import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";
import { useAuth } from "react-oidc-context";

// Mock external modules
vi.mock("react-oidc-context", () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      signinRedirect: vi.fn(),
    });

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders key static content", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText("SCRIMSIGHT").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Get serious about your scrims")).toBeInTheDocument();
    expect(screen.getByText("Why Choose Scrimsight?")).toBeInTheDocument();
    expect(screen.getByText("Powerful Analytics Features")).toBeInTheDocument();
    expect(screen.getByText("Simple, Transparent Pricing")).toBeInTheDocument();
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("Ready to Level Up Your Team?")).toBeInTheDocument();
  });

  it("calls signinRedirect when Login button is clicked", () => {
    const mockSigninRedirect = vi.fn();
    (useAuth as Mock).mockReturnValue({
      signinRedirect: mockSigninRedirect,
    });

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(mockSigninRedirect).toHaveBeenCalledTimes(1);
  });

  it("calls signinRedirect when Get Started with Discord button is clicked", () => {
    const mockSigninRedirect = vi.fn();
    (useAuth as Mock).mockReturnValue({
      signinRedirect: mockSigninRedirect,
    });

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Get Started with Discord/i }));
    expect(mockSigninRedirect).toHaveBeenCalledTimes(1);
  });

  it("calls navigate to /demo when View Demo button is clicked", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Explore Demo/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/demo");
  });

  it("calls scrollToSection with correct id when Features button is clicked", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Features' }));
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("calls scrollToSection with correct id when Pricing button is clicked", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pricing' }));
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("calls scrollToSection with correct id when FAQ button is clicked", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'FAQ' }));
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });
});
