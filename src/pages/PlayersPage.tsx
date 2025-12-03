import { Outlet } from "react-router-dom";
import { ErrorMessage, Page } from "@components";
import { useStats } from "../hooks/useStats";

export const PlayersPage = () => {
  const playerStats = useStats();

  if (!playerStats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (playerStats.length === 0) {
    return <ErrorMessage message="No data available for players" />;
  }

  const playerNavItems = [
    { path: "/players", label: "Overview", end: true },
    { path: "/players/performance", label: "Performance" },
    { path: "/players/heroes", label: "Heroes" },
  ];

  return (
    <Page>
      <Page.Header
        title="Player Statistics"
        subtitle="Comprehensive analysis of player performance across all matches"
      />

      <Page.Navigation navItems={playerNavItems} />

      <Page.Content>
        <Outlet />
      </Page.Content>
    </Page>
  );
};

export default PlayersPage;
