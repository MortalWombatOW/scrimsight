import { NavLink, Outlet } from "react-router-dom";
import { useStats } from "../../atoms/metrics/playerMetricsAtoms";
import { ErrorMessage } from "../../components/Common/ErrorMessage";

export const PlayersPage = () => {
  const playerStats = useStats(["playerName"]);

  if (!playerStats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (playerStats.rows.length === 0) {
    return <ErrorMessage message="No data available for players" />;
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 bg-base-200 p-6 rounded-box">
          <h1 className="text-3xl font-bold text-base-content">
            Player Statistics
          </h1>
          <p className="mt-2 text-base-content/70">
            Comprehensive analysis of player performance across all matches
          </p>
        </header>

        {/* Navigation */}
        <div className="tabs tabs-boxed bg-base-200 p-1 mb-8">
          <NavLink
            to="/players"
            end // Important: use 'end' for the index route NavLink
            className={({ isActive }) =>
              `tab ${
                isActive
                  ? "tab-active bg-base-300"
                  : "text-base-content/70 hover:text-base-content"
              } capitalize`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/players/performance"
            className={({ isActive }) =>
              `tab ${
                isActive
                  ? "tab-active bg-base-300"
                  : "text-base-content/70 hover:text-base-content"
              } capitalize`
            }
          >
            Performance
          </NavLink>
          <NavLink
            to="/players/heroes"
            className={({ isActive }) =>
              `tab ${
                isActive
                  ? "tab-active bg-base-300"
                  : "text-base-content/70 hover:text-base-content"
              } capitalize`
            }
          >
            Heroes
          </NavLink>
        </div>

        {/* Content */}
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
