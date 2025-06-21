import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useAtom, useAtomValue } from "jotai";
import { authAtom } from "@atoms/auth";
import {
  Menu,
  X,
  Home,
  Swords,
  Headset,
  Users,
  Upload,
  LogIn,
  User,
  Crown,
  Settings,
} from "lucide-react";
import UploadModal from "./UploadModal";
import LoadingSpinner from "./LoadingSpinner";
import { sampleDataEnabledAtom } from "../atoms/sampleDataEnabled";
import { statusAtom } from "../atoms/loadFiles";

export interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const auth = useAuth();
  const [authState] = useAtom(authAtom);
  const sampleDataEnabled = useAtomValue(sampleDataEnabledAtom);
  const loadingStatus = useAtomValue(statusAtom);
  const location = useLocation();

  // Determine base route (/app or /demo) from current location
  const baseRoute = location.pathname.startsWith("/demo") ? "/demo" : "/app";

  const navigationItems = [
    { to: baseRoute, icon: Home, label: "Home" },
    { to: baseRoute + "/scrims", icon: Swords, label: "Scrims" },
    { to: baseRoute + "/players", icon: Headset, label: "Players" },
    { to: baseRoute + "/teams", icon: Users, label: "Teams" },
    { to: baseRoute + "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={isDrawerOpen}
        onChange={toggleDrawer}
      />

      {/* Drawer content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar for mobile */}
        <div className="navbar bg-base-100 lg:hidden">
          <div className="flex-none">
            <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
              <Menu className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1">
            <span
              className="text-2xl font-black"
              style={{
                fontFamily: "Goldman",
              }}
            >
              SCRIMSIGHT
            </span>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 relative">
          {/* Loading spinner overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-base-200 z-10 transition-opacity duration-500 ${
              loadingStatus === "loading"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <LoadingSpinner />
          </div>

          {/* Main content */}
          <div
            className={`transition-opacity duration-500 bg-base-200 ${
              loadingStatus === "done" ? "opacity-100" : "opacity-0"
            }`}
          >
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Drawer sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="drawer-toggle"
          className="drawer-overlay"
          onClick={closeDrawer}
        ></label>

        <aside className=" w-80 bg-base-100 text-base-content flex flex-col rounded-xl m-4 shadow-lg mt-34">
          {/* Header */}
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <span
                className="text-2xl font-black"
                style={{
                  fontFamily: "Goldman",
                }}
              >
                SCRIMSIGHT
              </span>
              <button
                className="btn btn-ghost btn-sm lg:hidden"
                onClick={closeDrawer}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="menu menu-lg w-full">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="flex items-center gap-3 rounded-lg"
                      onClick={closeDrawer}
                    >
                      <IconComponent className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}

              {/* Load Files Button */}
              {!sampleDataEnabled && (
                <li className="mt-4">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn btn-primary btn-block justify-start gap-3"
                  >
                    <Upload className="w-5 h-5" />
                    Load Files
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* User section */}
          {!sampleDataEnabled && (
            <div className="p-4 border-t border-base-300">
              {auth.isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : authState.authenticatedUser ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-base-100">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10">
                      {authState.authenticatedUser.avatar ? (
                        <img
                          src={authState.authenticatedUser.avatar}
                          alt="User avatar"
                          className="rounded-full"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {authState.authenticatedUser.username}
                      </p>
                      {authState.authenticatedUser.plan === "pro" && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-base-content/60 capitalize">
                      {authState.authenticatedUser.plan} plan
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-base-content/70 hover:text-base-content transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="btn btn-primary btn-block gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};
