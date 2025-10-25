import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
// eslint-disable-next-line project-structure/independent-modules
import CallbackPage from "./CallbackPage";
import { useAuth } from "react-oidc-context";
import { useSetAtom } from "jotai";

// Mock external modules
vi.mock("react-oidc-context", () => ({
  useAuth: vi.fn(),
}));
vi.mock("jotai", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useSetAtom: vi.fn(),
    atom: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CallbackPage", () => {
  const mockSetAuthAtom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSetAtom as Mock).mockReturnValue(mockSetAuthAtom);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it("should navigate to /app and set auth atom on successful authentication", async () => {
    // Mock a successful authentication and user info fetch
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        token_type: "Bearer",
        access_token: "mock_access_token",
      },
    });

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "123",
          global_name: "TestUser",
          avatar: "mock_avatar",
        }),
    } as Response);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/callback"]}>
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(mockSetAuthAtom).toHaveBeenCalledWith({
        authenticatedUser: {
          username: "TestUser",
          avatar: "https://cdn.discordapp.com/avatars/123/mock_avatar.png?size=64",
          plan: "pro",
        },
      });
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/app");
    }, { timeout: 5000 });
  });

  it("should display error message on authentication error", async () => {
    (useAuth as Mock).mockReturnValue({
      error: new Error("Authentication failed"),
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/callback"]}>
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Authentication Error: Authentication failed/)).toBeInTheDocument();
    // No navigation expected here, as the component returns early
  });

  it("should navigate to / on no user in auth response", async () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: null,
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/callback"]}>
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // No navigation expected here, as the component returns early
  });

  it("should navigate to / on unauthenticated user", async () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/callback"]}>
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // No navigation expected here, as the component returns early
  });

  it("should navigate to / on failed user info fetch", async () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        token_type: "Bearer",
        access_token: "mock_access_token",
      },
    });

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    } as Response);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/callback"]}>
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // No navigation expected here, as the component returns early
  });

  it("should navigate to / on fetch error", async () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        token_type: "Bearer",
        access_token: "mock_access_token",
      },
    });

    vi.spyOn(global, "fetch").mockImplementationOnce(() => {
      throw new Error("Network error");
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/callback"]}>
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    }, { timeout: 5000 });
  });
});