import React, { Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { ZeroState, Page } from "@components";
import { ScrimCard, TeamCard, PlayerCard, TrendSection } from "@components";
import { formatTime, formatPercentage, prettyFormat } from "@library";
import { useMatches } from "../hooks/useRepository";
import { useScrims } from "../hooks/useScrims";

const NUM_ITEMS_TO_SHOW = 3;

const RecentScrimsSection = () => {
  const scrims = useScrims();
  const matches = useMatches();

  const scrimSummaries = useMemo(() => {
    return scrims.map((scrim) => {
      const scrimMatches = matches.filter((m) => scrim.matchIds.includes(m.metadata.matchId));
      return {
        scrimId: `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}`,
        teamNames: [scrim.team1Name, scrim.team2Name],
        dateString: scrim.dateString,
        maps: scrimMatches.map((m) => m.metadata.map),
        score: `${scrim.team1Wins}-${scrim.team2Wins}-${scrim.draws}`,
        duration: scrim.duration,
        mapCount: scrim.matchIds.length,
      };
    }).sort((a, b) => new Date(b.dateString).getTime() - new Date(a.dateString).getTime());
  }, [scrims, matches]);

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
            mapsPlayed={scrim.maps}
            primaryStats={[{ value: scrim.score, label: "Score (W-L-D)" }]}
            secondaryStats={[
              { value: formatTime(scrim.duration), label: "Duration" },
              { value: scrim.mapCount.toString(), label: "Maps" },
            ]}
            linkUrl={`/scrims/${encodeURIComponent(scrim.scrimId)}`}
          />
        ))}
      </div>
    </div>
  );
};

const TopTeamsSection = () => {
  const matches = useMatches();

  const teamSummaries = useMemo(() => {
    const teamMap = new Map<string, { wins: number; losses: number; draws: number; playerCount: number; firstKillWinRate: number }>();

    for (const match of matches) {
      const { team1Name, team2Name, winner, team1Players, team2Players } = match.metadata;

      if (!teamMap.has(team1Name)) {
        teamMap.set(team1Name, { wins: 0, losses: 0, draws: 0, playerCount: team1Players.length, firstKillWinRate: 0 });
      }
      if (!teamMap.has(team2Name)) {
        teamMap.set(team2Name, { wins: 0, losses: 0, draws: 0, playerCount: team2Players.length, firstKillWinRate: 0 });
      }

      const team1Data = teamMap.get(team1Name)!;
      const team2Data = teamMap.get(team2Name)!;

      if (winner === team1Name) {
        team1Data.wins++;
        team2Data.losses++;
      } else if (winner === team2Name) {
        team2Data.wins++;
        team1Data.losses++;
      } else {
        team1Data.draws++;
        team2Data.draws++;
      }
    }

    return Array.from(teamMap.entries()).map(([teamName, data]) => ({
      teamName,
      playerCount: data.playerCount,
      winRate: data.wins / (data.wins + data.losses + data.draws),
      gamesPlayed: data.wins + data.losses + data.draws,
      firstKillWinRate: data.firstKillWinRate,
    }));
  }, [matches]);

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

const TopPlayersSection = () => {
  const matches = useMatches();

  const playerSummaries = useMemo(() => {
    const playerMap = new Map<string, {
      eliminations: number;
      deaths: number;
      assists: number;
      teamName: string;
      topHero: string;
      heroPlaytime: Map<string, number>;
      role: string;
    }>();

    for (const match of matches) {
      for (const stat of match.playerStats.rows) {
        if (!playerMap.has(stat.playerName)) {
          playerMap.set(stat.playerName, {
            eliminations: 0,
            deaths: 0,
            assists: 0,
            teamName: stat.playerTeam,
            topHero: stat.playerHero,
            heroPlaytime: new Map(),
            role: stat.playerRole,
          });
        }

        const playerData = playerMap.get(stat.playerName)!;
        playerData.eliminations += stat.eliminations;
        playerData.deaths += stat.deaths;
        playerData.assists += stat.defensiveAssists + stat.offensiveAssists;

        const currentPlaytime = playerData.heroPlaytime.get(stat.playerHero) || 0;
        playerData.heroPlaytime.set(stat.playerHero, currentPlaytime + stat.playtime);
      }
    }

    return Array.from(playerMap.entries()).map(([playerName, data]) => {
      let topHero = '';
      let maxPlaytime = 0;
      data.heroPlaytime.forEach((playtime, hero) => {
        if (playtime > maxPlaytime) {
          maxPlaytime = playtime;
          topHero = hero;
        }
      });

      return {
        playerName,
        teamName: data.teamName,
        topHero: topHero || data.topHero,
        eliminations: data.eliminations,
        deaths: data.deaths,
        assists: data.assists,
        role: data.role,
        kda: data.deaths === 0 ? data.eliminations + data.assists : (data.eliminations + data.assists) / data.deaths,
      };
    });
  }, [matches]);

  const topPlayers = playerSummaries
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
  const matches = useMatches();
  const hasData = matches.length > 0;

  // If no data, show ZeroState immediately
  if (!hasData) {
    return <ZeroState />;
  }

  // If data exists, show the main page content
  return (
    <Page>
      <Page.Content>
        <Suspense
          fallback={
            <div className="text-center p-4">Loading dashboard sections...</div>
          }
        >
          <TrendSection />
          <RecentScrimsSection />
          <TopTeamsSection />
          <TopPlayersSection />
        </Suspense>
      </Page.Content>
    </Page>
  );
};

export default HomePage;
