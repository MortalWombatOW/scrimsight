// Removed useState, useStats, RoleIcon, prettyFormat, Link, PlayerStatsNumericalKeys imports as they are no longer needed here
import { PlayerCard } from "~/components/Card/PlayerCard"; // Import PlayerCard
import { PlayerListSummary } from "~/atoms/metrics/listSummaryAtoms"; // Import the summary type
import { prettyFormat } from "~/lib/format"; // Keep prettyFormat for KDA

interface PlayerListProps {
  players: PlayerListSummary[]; // Accept players summary as prop
}

export const PlayerList = ({ players }: PlayerListProps) => {
  // Removed useStats hook and sorting logic as it's handled in parent

  return (
    // Use flex layout for cards instead of table
    <div className="flex flex-col md:flex-row flex-wrap gap-6">
      {players.map((player) => {
        // Calculate KDA string (handle potential division by zero if deaths is 0)
        const kda =
          player.deaths === 0
            ? prettyFormat(player.eliminations + player.assists) // If no deaths, just show K+A
            : prettyFormat(
              (player.eliminations + player.assists) / player.deaths
            );

        return (
          <PlayerCard
            key={player.playerName}
            playerName={player.playerName}
            teamNames={[player.teamName]} // Pass team name as single-item array
            heroes={[player.topHero]} // Pass top hero as single-item array
            primaryStats={[
              { value: kda, label: "KDA" },
              // Add other primary stats if desired, e.g., elims
              { value: prettyFormat(player.eliminations), label: "Elims" },
            ]}
            secondaryStats={[
              { value: player.role, label: "Role" },
              // Add other secondary stats if desired, e.g., deaths, assists
              { value: prettyFormat(player.deaths), label: "Deaths" },
              { value: prettyFormat(player.assists), label: "Assists" },
            ]}
            // PlayerCard doesn't have linkUrl/linkText props by default,
            // but we could add them or wrap the card in a Link component in the parent if needed.
            // For now, relying on parent to handle navigation if required.
          />
        );
      })}
    </div>
  );
};
