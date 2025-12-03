import { useParams, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { StatCard, ErrorMessage, Page } from "@components";
import { useMatches } from "../hooks/useRepository";

export const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const matches = useMatches();

  const teamRecord = useMemo(() => {
    if (!teamId) return null;

    const stats = {
      teamName: teamId,
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
    };

    for (const match of matches) {
      const { team1Name, team2Name, winner } = match.metadata;

      if (team1Name === teamId) {
        stats.gamesPlayed++;
        if (winner === teamId) {
          stats.wins++;
        } else if (winner === team2Name) {
          stats.losses++;
        } else {
          stats.draws++;
        }
      } else if (team2Name === teamId) {
        stats.gamesPlayed++;
        if (winner === teamId) {
          stats.wins++;
        } else if (winner === team1Name) {
          stats.losses++;
        } else {
          stats.draws++;
        }
      }
    }

    return stats.gamesPlayed > 0 ? stats : null;
  }, [teamId, matches]);

  if (!teamId) {
    return <ErrorMessage message="Team ID not provided" />;
  }

  if (!teamRecord) {
    return <ErrorMessage message="Team not found" />;
  }

  const teamNameDisplay = teamId;
  const winRate = (teamRecord.wins / teamRecord.gamesPlayed) * 100 || 0;

  const teamNavItems = [
    { path: `/teams/${teamId}`, label: "Overview", end: true },
    { path: `/teams/${teamId}/players`, label: "Players" },
    { path: `/teams/${teamId}/matches`, label: "Matches" },
    { path: `/teams/${teamId}/compositions`, label: "Compositions" },
  ];

  return (
    <Page>
      <Page.Header
        title={teamNameDisplay}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Win Rate" value={`${winRate.toFixed(1)}%`} />
          <StatCard title="Wins" value={teamRecord.wins.toString()} />
          <StatCard title="Losses" value={teamRecord.losses.toString()} />
          <StatCard title="Draws" value={teamRecord.draws.toString()} />
        </div>
      </Page.Header>

      <Page.Navigation navItems={teamNavItems} />

      <Page.Content>
        <Outlet />
      </Page.Content>
    </Page>
  );
};

export default TeamPage;
