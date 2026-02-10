import { Link } from "react-router-dom";
import { Navigation } from "../navigation/Navigation";
import { Suspense, useState } from "react";
import { PrivacyFooter } from "./PrivacyFooter";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="h-[68px]">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="mr-2 rounded p-1 text-base-content/40 hover:bg-base-100 focus:outline-none sm:hidden"
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
                  fontFamily: "'Plus Jakarta Sans'",
                }}
              >
                SCRIMSIGHT
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`p-4 transition-all sm:relative sm:block sm:w-[300px] ${
            isMobileMenuOpen ? "w-full" : "hidden sm:block"
          }`}
        >
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
              </div>
            }
          >
            <Navigation closeMobileMenu={() => setIsMobileMenuOpen(false)} />
          </Suspense>
        </aside>

        <main
          className={`flex-1 overflow-auto p-4${
            isMobileMenuOpen ? "hidden" : ""
          }`}
        >
          {children}
        </main>
      </div>

      <PrivacyFooter />
    </div>
  );
};
