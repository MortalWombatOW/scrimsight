import { useMemo } from "react";
import { formatTime } from "@library";
import { ScrimCard, Page } from "@components";
import { useScrims } from "../hooks/useScrims";
import { useMatches } from "../hooks/useRepository";

export const ScrimsPage = () => {
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

  // Optional: Add loading state handling if atom is async
  // if (scrimSummaries === undefined) {
  //   return <div>Loading scrims...</div>;
  // }

  if (scrimSummaries.length === 0) {
    // Keep redirection logic or show a "No scrims found" message
    // navigate("/"); // Or display message
    return (
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Scrims</h1>
        <p>No scrims found.</p>
      </div>
    );
  }

  return (
    <Page>
      <Page.Header title="Scrims" />
      <Page.Content>
        {/* Use flex layout for cards */}
        <div className="flex flex-col md:flex-row flex-wrap gap-6">
          {scrimSummaries.map((scrim) => (
            <ScrimCard
              key={scrim.scrimId}
              title={`${scrim.teamNames[0]} vs ${scrim.teamNames[1]}`}
              teamNames={scrim.teamNames}
              date={scrim.dateString}
              // Display map count instead of list
              mapsPlayed={scrim.maps}
              primaryStats={[{ value: scrim.score, label: "Score (W-L-D)" }]}
              secondaryStats={[
                { value: formatTime(scrim.duration), label: "Total Duration" },
                { value: scrim.mapCount.toString(), label: "Maps Played" },
              ]}
              // Construct link URL using the scrimId from summary
              linkUrl={`/scrims/${encodeURIComponent(scrim.scrimId)}`}
              // linkText uses default "View Details"
            />
          ))}
        </div>
      </Page.Content>
    </Page>
  );
};

export default ScrimsPage;
