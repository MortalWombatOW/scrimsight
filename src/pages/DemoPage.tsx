import { useEffect, useMemo, useState, Suspense } from "react";
import { useAtomValue } from "jotai";
import {
  Container,
  ScrimCard,
  TeamCard,
  PlayerCard,
  MatchCard as MatchSummaryCard,
  Timeline,
} from "@components";
import {
  scrimListSummaryAtom,
  teamListSummaryAtom,
  playerListSummaryAtom,
  scrims,
  matchData,
} from "@library";
import { formatTime, formatPercentage, prettyFormat } from "@library";
import { Link } from "react-router-dom";

type DemoMatchOption = {
  matchId: string;
  label: string;
};

const DemoEmptyState = () => (
  <Container>
    <div className="mx-auto max-w-2xl rounded-box border border-dashed border-base-content/20 bg-base-200 p-8 text-center">
      <h1 className="text-3xl font-bold mb-3">Bring the action back online</h1>
      <p className="text-base-content/80">
        We couldn&apos;t load the bundled scrim sample. Toggle sample data back on from the
        <Link to="/files" className="link link-primary">
          {" "}files page
        </Link>{" "}
        or upload your own log exports to explore Scrimsight.
      </p>
    </div>
  </Container>
);

const useFeaturedScrim = () => {
  const scrimSummaries = useAtomValue(scrimListSummaryAtom);
  const scrimDetails = useAtomValue(scrims.atom);
  const matchDataValue = useAtomValue(matchData.atom);

  const featuredSummary = useMemo(() => {
    if (scrimSummaries.length === 0) {
      return undefined;
    }
    return [...scrimSummaries].sort((a, b) => {
      const aTime = Number.isNaN(Date.parse(a.dateString))
        ? 0
        : Date.parse(a.dateString);
      const bTime = Number.isNaN(Date.parse(b.dateString))
        ? 0
        : Date.parse(b.dateString);
      return bTime - aTime;
    })[0];
  }, [scrimSummaries]);

  const detailedScrim = useMemo(() => {
    if (!featuredSummary) {
      return undefined;
    }
    return scrimDetails.find(
      (scrim) =>
        `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}` ===
        featuredSummary.scrimId,
    );
  }, [featuredSummary, scrimDetails]);

  const matchOptions: DemoMatchOption[] = useMemo(() => {
    if (!detailedScrim) {
      return [];
    }
    return detailedScrim.matchIds
      .map((matchId, index) => {
        const match = matchDataValue.find((m) => m.matchId === matchId);
        if (!match) {
          return undefined;
        }
        const label = `Map ${index + 1}: ${match.map || "Unknown"}`;
        return { matchId, label };
      })
      .filter((entry): entry is DemoMatchOption => Boolean(entry));
  }, [detailedScrim, matchDataValue]);

  return { featuredSummary, matchOptions };
};

export const DemoPage = () => {
  const { featuredSummary, matchOptions } = useFeaturedScrim();
  const teamSummaries = useAtomValue(teamListSummaryAtom);
  const playerSummaries = useAtomValue(playerListSummaryAtom);
  const matchDataValue = useAtomValue(matchData.atom);

  const [selectedMatchId, setSelectedMatchId] = useState<string | undefined>(
    matchOptions[0]?.matchId,
  );

  useEffect(() => {
    if (!selectedMatchId && matchOptions[0]) {
      setSelectedMatchId(matchOptions[0].matchId);
    }
  }, [matchOptions, selectedMatchId]);

  const topTeams = useMemo(() => {
    return [...teamSummaries]
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 2);
  }, [teamSummaries]);

  const standoutPlayers = useMemo(() => {
    return [...playerSummaries]
      .map((player) => ({
        ...player,
        kda:
          player.deaths === 0
            ? player.eliminations + player.assists
            : (player.eliminations + player.assists) / player.deaths,
      }))
      .sort((a, b) => b.kda - a.kda)
      .slice(0, 3);
  }, [playerSummaries]);

  const mapsAnalysed = matchOptions.length;
  const teamsCovered = new Set(
    playerSummaries.map((player) => player.teamName),
  ).size;
  const standoutHero = standoutPlayers[0]?.topHero ?? "???";
  const effectiveMatchId = selectedMatchId ?? matchOptions[0]?.matchId;
  const featuredMatch = matchDataValue.find(
    (match) => match.matchId === effectiveMatchId,
  );

  if (!featuredSummary || matchOptions.length === 0 || !featuredMatch) {
    return <DemoEmptyState />;
  }

  return (
    <Container>
      <section className="mb-12 rounded-box bg-base-200 p-10 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
          Guided tour
        </p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight">
          See Scrimsight in action with real Overwatch scrim data
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-base-content/80">
          We preloaded five ranked scrim exports so you can evaluate how Scrimsight surfaces
          timelines, win conditions, and hero impact without lifting a finger.
        </p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-box bg-base p-4 shadow">
            <dt className="text-sm text-base-content/70">Maps analysed</dt>
            <dd className="text-3xl font-bold">{mapsAnalysed}</dd>
          </div>
          <div className="rounded-box bg-base p-4 shadow">
            <dt className="text-sm text-base-content/70">Teams covered</dt>
            <dd className="text-3xl font-bold">{teamsCovered}</dd>
          </div>
          <div className="rounded-box bg-base p-4 shadow">
            <dt className="text-sm text-base-content/70">Standout hero</dt>
            <dd className="text-3xl font-bold">{standoutHero}</dd>
          </div>
        </dl>
      </section>

      <section className="mb-12 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-semibold">Featured scrim</h2>
          <ScrimCard
            title={`${featuredSummary.teamNames[0]} vs ${featuredSummary.teamNames[1]}`}
            teamNames={featuredSummary.teamNames}
            date={featuredSummary.dateString}
            mapsPlayed={[`${featuredSummary.mapCount} Maps`]}
            primaryStats={[
              { value: featuredSummary.score, label: "Record (W-L-D)" },
            ]}
            secondaryStats={[
              {
                value: formatTime(featuredSummary.duration),
                label: "Total duration",
              },
            ]}
            linkUrl={`/scrims/${featuredSummary.scrimId}`}
          />
        </div>
        <div className="rounded-box bg-base-200 p-6 shadow-lg">
          <h3 className="mb-3 text-lg font-semibold">What to look for</h3>
          <ul className="space-y-3 text-sm text-base-content/80">
            <li>
              Track how each team adapts across maps with the interactive timeline below.
            </li>
            <li>
              Click into the scrim or team pages to audit compositions, fight outcomes,
              and ultimate usage.
            </li>
            <li>
              Bring your own logs later via the Files page once you&apos;re satisfied with the
              workflow.
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Team performance highlights</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {topTeams.map((team) => (
            <TeamCard
              key={team.teamName}
              teamName={team.teamName}
              playerNames={[`${team.playerCount} players`]}
              primaryStats={[
                {
                  value: formatPercentage(team.winRate),
                  label: "Win rate",
                },
              ]}
              secondaryStats={[
                {
                  value: team.gamesPlayed.toString(),
                  label: "Games played",
                },
                {
                  value: formatPercentage(team.firstKillWinRate ?? 0),
                  label: "First-kill conversion",
                },
              ]}
              linkUrl={`/teams/${encodeURIComponent(team.teamName)}`}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Player spotlights</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {standoutPlayers.map((player) => (
            <PlayerCard
              key={player.playerName}
              playerName={player.playerName}
              teamNames={[player.teamName]}
              heroes={[player.topHero]}
              primaryStats={[
                { value: prettyFormat(player.kda), label: "KDA" },
              ]}
              secondaryStats={[
                { value: player.role, label: "Role" },
                {
                  value: formatPercentage(player.firstKillRate ?? 0),
                  label: "First-kill win rate",
                },
              ]}
            />
          ))}
        </div>
      </section>

      {featuredMatch && (
        <section className="mb-12">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Explore the map timeline</h2>
              <p className="text-base-content/70">
                Choose a map to inspect ultimate rotations, elimination streaks, and tempo shifts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchOptions.map((option) => (
                <button
                  key={option.matchId}
                  type="button"
                  className={`btn btn-sm ${
                    option.matchId === (selectedMatchId ?? matchOptions[0]?.matchId)
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={() => setSelectedMatchId(option.matchId)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <MatchSummaryCard
              title={`${featuredMatch.team1Name} ${featuredMatch.team1Score}–${featuredMatch.team2Score} ${featuredMatch.team2Name}`}
              teamNames={[featuredMatch.team1Name, featuredMatch.team2Name]}
              date={featuredMatch.dateString}
              mapName={featuredMatch.map}
              primaryStats={[
                {
                  value: `${featuredMatch.team1Score}-${featuredMatch.team2Score}`,
                  label: "Final score",
                },
              ]}
              secondaryStats={[
                {
                  value: formatTime(featuredMatch.duration),
                  label: "Map duration",
                },
                {
                  value: featuredMatch.winner ?? "Draw",
                  label: "Winner",
                },
              ]}
              linkUrl={`/matches/${featuredMatch.matchId}`}
            />
          </div>

          <div className="rounded-box border border-base-content/10 bg-base-200 p-4">
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center">
                  <span className="loading loading-spinner loading-lg text-primary" />
                </div>
              }
            >
              <Timeline matchId={featuredMatch.matchId} />
            </Suspense>
          </div>
        </section>
      )}

      <section className="rounded-box bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-10 text-base-content shadow-lg">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Coach feedback fuels our roadmap</h2>
            <p className="mt-3 text-base-content/80">
              Let us know which insights matter most so we can tailor Scrimsight to your playbook.
              Join the Discord or upload your next scrim to keep the conversation going.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              className="btn btn-primary"
              href="https://discord.com/invite/scrimsight"
              target="_blank"
              rel="noreferrer"
            >
              Join the Discord
            </a>
            <Link className="btn btn-outline" to="/files">
              Upload my logs
            </Link>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default DemoPage;
