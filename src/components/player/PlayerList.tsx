// Removed useState, useStats, RoleIcon, prettyFormat, Link, PlayerStatsNumericalKeys imports as they are no longer needed here
import { PlayerCard } from "./PlayerCard";
import { PlayerListSummary, formatStat } from "@library";

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
            ? formatStat('eliminations', player.eliminations + player.assists) // If no deaths, just show K+A
            : formatStat('eliminations',
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
              { value: formatStat('eliminations', player.eliminations), label: "Elims" },
            ]}
            secondaryStats={[
              { value: player.role, label: "Role" },
              // Add other secondary stats if desired, e.g., deaths, assists
              { value: formatStat('deaths', player.deaths), label: "Deaths" },
              { value: formatStat('offensiveAssists', player.assists), label: "Assists" },
            ]}
            // Add link to player details page
            linkUrl={`/player/${player.playerName}`}
            linkText="View Details"
          />
        );
      })}
    </div>
  );
};
