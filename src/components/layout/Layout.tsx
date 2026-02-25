import { Link } from "react-router-dom";
import { JourneyNav } from "../navigation/JourneyNav";
import { PrivacyFooter } from "./PrivacyFooter";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="h-[68px]">
        <div className="flex h-full items-center px-4">
          <Link to="/" className="focus:outline-none">
            <span
              className="text-2xl font-black"
              style={{ fontFamily: "'Plus Jakarta Sans'" }}
            >
              SCRIMSIGHT
            </span>
          </Link>
        </div>
      </header>

      {/* Journey navigation */}
      <JourneyNav />

      {/* Main content — full width */}
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>

      <PrivacyFooter />
    </div>
  );
};
