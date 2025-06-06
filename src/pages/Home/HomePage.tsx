import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { matchDataAtom } from "@atoms"; // Keep for hasData check
import { useAtomValue } from "jotai";
import ZeroState from "@pages/Home/ZeroState";
import {
  scrimListSummaryAtom,
  teamListSummaryAtom,
  playerListSummaryAtom,
} from "@atoms/listSummaryAtoms"; // Import summary atoms
import { ScrimCard, TeamCard, PlayerCard, Container } from "@components"; // Added import
import { formatTime, formatPercentage, prettyFormat } from "@lib"; // Import formatters

const NUM_ITEMS_TO_SHOW = 3; // Number of cards to show per section

// Section for Recent Scrims
const RecentScrimsSection = () => {
  const scrimSummaries = useAtomValue(scrimListSummaryAtom);
  // Already sorted by date in the atom definition, take the first few
  const recentScrims = scrimSummaries.slice(0, NUM_ITEMS_TO_SHOW);

  if (recentScrims.length === 0) {
    return null; // Don't show section if no data
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Scrims</h2>
        <Link to="/scrims" className="link link-primary text-sm">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentScrims.map((scrim) => (
          <ScrimCard
            key={scrim.scrimId}
            title={`${scrim.teamNames[0]} vs ${scrim.teamNames[1]}`}
            teamNames={scrim.teamNames}
            date={scrim.dateString}
            mapsPlayed={[`${scrim.mapCount} Maps`]}
            primaryStats={[{ value: scrim.score, label: "Score (W-L-D)" }]}
            secondaryStats={[
              { value: formatTime(scrim.duration), label: "Duration" },
              { value: scrim.mapCount.toString(), label: "Maps" },
            ]}
            linkUrl={`/scrims/${scrim.scrimId}`}
          />
        ))}
      </div>
    </div>
  );
};

// Section for Top Teams
const TopTeamsSection = () => {
  const teamSummaries = useAtomValue(teamListSummaryAtom);
  // Sort by win rate descending, take top N
  const topTeams = [...teamSummaries]
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, NUM_ITEMS_TO_SHOW);

  if (topTeams.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Top Teams</h2>
        <Link to="/teams" className="link link-primary text-sm">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topTeams.map((team) => (
          <TeamCard
            key={team.teamName}
            teamName={team.teamName}
            playerNames={[`${team.playerCount} Players`]}
            primaryStats={[
              { value: formatPercentage(team.winRate), label: "Win Rate" },
            ]}
            secondaryStats={[
              { value: team.gamesPlayed.toString(), label: "Games Played" },
            ]}
            linkUrl={`/teams/${team.teamName}`}
          />
        ))}
      </div>
    </div>
  );
};

// Section for Top Players
const TopPlayersSection = () => {
  const playerSummaries = useAtomValue(playerListSummaryAtom);

  // Calculate KDA for sorting
  const playersWithKda = playerSummaries.map((p) => ({
    ...p,
    kda:
      p.deaths === 0
        ? p.eliminations + p.assists
        : (p.eliminations + p.assists) / p.deaths,
  }));

  // Sort by KDA descending, take top N
  const topPlayers = playersWithKda
    .sort((a, b) => b.kda - a.kda)
    .slice(0, NUM_ITEMS_TO_SHOW);

  if (topPlayers.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Top Players</h2>
        <Link to="/players" className="link link-primary text-sm">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topPlayers.map((player) => (
          <PlayerCard
            key={player.playerName}
            playerName={player.playerName}
            teamNames={[player.teamName]}
            heroes={[player.topHero]}
            primaryStats={[{ value: prettyFormat(player.kda), label: "KDA" }]}
            secondaryStats={[
              { value: player.role, label: "Role" },
              { value: player.teamName, label: "Team" },
            ]}
            // No link prop on PlayerCard, link handled by parent if needed
          />
        ))}
      </div>
    </div>
  );
};

export const HomePage = (): React.ReactNode => {
  const matchData = useAtomValue(matchDataAtom);
  const hasData = matchData.length > 0;

  // If no data, show ZeroState immediately
  if (!hasData) {
    return <ZeroState />;
  }

  // If data exists, show the main page content
  return (
    <Container>
      {" "}
      {/* Replaced div with Container */}
      {/* Sections for Scrims, Teams, Players */}
      <Suspense
        fallback={
          <div className="text-center p-4">Loading dashboard sections...</div>
        }
      >
        <RecentScrimsSection />
        <TopTeamsSection />
        <TopPlayersSection />
      </Suspense>
    </Container> // Closing Container tag
  );
};
