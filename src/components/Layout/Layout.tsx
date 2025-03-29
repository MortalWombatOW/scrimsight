import { Link } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Suspense, useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { useAuth } from "react-oidc-context";
import { sampleDataEnabledAtom } from "../../atoms/files/sampleDataAtoms";
import { useAtom } from "jotai";

const DiscordButton = () => {
  // In a real app, this button might have more logic, like linking to a Discord server or community page.
  return (
    <div className="group relative ml-auto">
      <button
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-white hover:bg-[#4752c4]"
        aria-label="Join our Discord Community"
      >
        <FaDiscord />
      </button>
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-base-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        Join our Discord Community
      </div>
    </div>
  );
};

const UserMenu = ({
  auth,
  onLogout,
}: {
  auth: ReturnType<typeof useAuth>;
  onLogout: () => void;
}) => {
  const [discordUsername, setDiscordUsername] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (auth.isAuthenticated && auth.user) {
        try {
          const userInfo = await fetch("https://discord.com/api/users/@me", {
            headers: {
              Authorization: `${auth.user.token_type} ${auth.user.access_token}`,
            },
          });
          if (userInfo.ok) {
            const userInfoJson = await userInfo.json();
            setDiscordUsername(
              userInfoJson.username + "#" + userInfoJson.discriminator
            );
          } else {
            console.error(
              "Failed to fetch Discord user info:",
              userInfo.status,
              userInfo.statusText
            );
            setDiscordUsername("User");
          }
        } catch (error) {
          console.error("Error fetching Discord user info:", error);
          setDiscordUsername("User");
        }
      } else {
        setDiscordUsername(null);
      }
    };

    fetchUserInfo();
  }, [auth.isAuthenticated, auth.user]);

  return (
    <div className="relative mr-3">
      <button
        className="flex h-8 w-8 items-center justify-center rounded-full text-base-700 hover:bg-base-200 dark:text-base-300 dark:hover:bg-base-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <FaRegUser />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-base py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-base-800">
          {discordUsername && (
            <div className="px-4 py-2 text-sm text-base-500 dark:text-base-400">
              {discordUsername}
            </div>
          )}
          <Link
            to="/account/settings"
            className="block px-4 py-2 text-sm text-base-700 hover:bg-base-100 dark:text-base-200 dark:hover:bg-base-700"
          >
            Settings
          </Link>
          <Link
            to="/account/plan"
            className="block px-4 py-2 text-sm text-base-700 hover:bg-base-100 dark:text-base-200 dark:hover:bg-base-700"
          >
            Manage plan
          </Link>
          <button
            onClick={onLogout}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-base-100 dark:text-red-400 dark:hover:bg-base-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const [sampleDataEnabled, setSampleDataEnabled] = useAtom(
    sampleDataEnabledAtom
  );

  // Centralized logout function to pass to UserMenu
  const handleLogout = () => {
    void auth.signoutRedirect();
  };

  // Loading states for OIDC navigators
  if (
    auth.activeNavigator === "signinRedirect" ||
    auth.activeNavigator === "signinSilent"
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (auth.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (auth.error) {
    alert(auth.error.message);
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">
          Authentication Error: {auth.error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="h-[68px]">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="mr-2 rounded p-1 text-base-600 hover:bg-base-100 focus:outline-none sm:hidden dark:text-base-400 dark:hover:bg-base-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="space-y-1.5">
                <div
                  className={`h-0.5 w-6 bg-current transition ${
                    isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                ></div>
                <div
                  className={`h-0.5 w-6 bg-current transition ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></div>
                <div
                  className={`h-0.5 w-6 bg-current transition ${
                    isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                ></div>
              </div>
            </button>

            {/* Logo */}
            <Link to="/" className="focus:outline-none">
              <span
                className="text-2xl font-black"
                style={{
                  fontFamily: "Goldman",
                }}
              >
                SCRIMSIGHT
              </span>
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            <DiscordButton />

            {/* Sample Data Toggle */}
            <label className="inline-flex cursor-pointer items-center">
              <span className="mr-2 text-sm">Sample Data</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={sampleDataEnabled}
                  onChange={(e) => setSampleDataEnabled(e.target.checked)}
                />
                <div className="h-6 w-11 rounded-full bg-base-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-base after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full dark:bg-base-600"></div>
              </div>
            </label>

            {/* Auth Button */}
            {auth.isAuthenticated ? (
              <UserMenu auth={auth} onLogout={handleLogout} />
            ) : (
              <button
                onClick={() => void auth.signinRedirect()}
                className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar/Navigation */}
        <aside
          className={`p-4 transition-all sm:relative sm:block sm:w-[300px] ${
            isMobileMenuOpen ? "w-full" : "hidden sm:block"
          }`}
        >
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
              </div>
            }
          >
            <Navigation closeMobileMenu={() => setIsMobileMenuOpen(false)} />
          </Suspense>
        </aside>

        {/* Main content area */}
        <main
          className={`flex-1 overflow-auto p-4 ${
            isMobileMenuOpen ? "hidden" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
