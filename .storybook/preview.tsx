import type { Preview } from "@storybook/react-vite";

import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider as JotaiProvider, createStore } from "jotai";
import { ReactFlowProvider } from "reactflow";
import "../src/index.css";

// Mock AuthProvider for Storybook
import { AuthContext } from "react-oidc-context";

const mockAuth = {
  activeNavigator: undefined,
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null,
  signinRedirect: () => Promise.resolve(),
  signoutRedirect: () => Promise.resolve(),
  signinSilent: () => Promise.resolve(),
  removeUser: () => Promise.resolve(),
  clearStaleState: () => Promise.resolve(),
  querySessionStatus: () => Promise.resolve(),
  revokeTokens: () => Promise.resolve(),
  startSilentRenew: () => {},
  stopSilentRenew: () => {},
  settings: {},
  events: {
    addUserLoaded: () => {},
    removeUserLoaded: () => {},
    addSilentRenewError: () => {},
    removeSilentRenewError: () => {},
    addUserUnloaded: () => {},
    removeUserUnloaded: () => {},
    addUserSignedIn: () => {},
    removeUserSignedIn: () => {},
    addUserSignedOut: () => {},
    removeUserSignedOut: () => {},
    addUserSessionChanged: () => {},
    removeUserSessionChanged: () => {},
  },
};

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>
  );
};

// Error boundary for handling async atom errors
class AsyncAtomErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Check if this is the async/await React error
    if (error.message.includes("async/await is not yet supported")) {
      return { hasError: true };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message.includes("async/await is not yet supported")) {
      console.warn("Async atom error caught in Storybook:", error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Loading async data...</div>;
    }

    return this.props.children;
  }
}

// Create a Jotai store for Storybook
const storybookStore = createStore();

const preview: Preview = {
  tags: ["autodocs"],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story) => (
      <JotaiProvider store={storybookStore}>
        <MockAuthProvider>
          <BrowserRouter>
            <ReactFlowProvider>
              <AsyncAtomErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                  <div style={{ padding: "16px" }}>
                    <Story />
                  </div>
                </Suspense>
              </AsyncAtomErrorBoundary>
            </ReactFlowProvider>
          </BrowserRouter>
        </MockAuthProvider>
      </JotaiProvider>
    ),
  ],
};

export default preview;
