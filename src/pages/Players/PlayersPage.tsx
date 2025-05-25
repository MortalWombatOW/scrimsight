import { Outlet } from "react-router-dom";
import { useStats } from "@atoms/metrics/playerMetricsAtoms";
import { ErrorMessage } from "@components/Common/ErrorMessage";
import { SubPageNavigation } from "@components/Layout/SubPageNavigation";
import Container from "@components/Container/Container"; // Added import

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

  const playerNavItems = [
    { path: "/players", label: "Overview", end: true },
    { path: "/players/performance", label: "Performance" },
    { path: "/players/heroes", label: "Heroes" },
  ];

  return (
    <Container>
      {" "}
      {/* Added Container */}
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
        <SubPageNavigation navItems={playerNavItems} />

        {/* Content */}
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </Container> // Added closing Container
  );
};
