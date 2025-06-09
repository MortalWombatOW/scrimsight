import { useAtomValue } from "jotai";
// Removed unused import: import { matchDataAtom } from "../../atoms";
// Import the new summary atom and type
import {
  scrimListSummaryAtom,
  ScrimListSummary,
} from "@library";
// Removed unused: import { useNavigate } from "react-router-dom";
import { formatTime } from "@library"; // Removed unused mapNameToFileName
import { ScrimCard, Container } from "@components"; // Combined imports

export const ScrimsPage = () => {
  // Removed unused navigate
  // Use the new summary atom
  const scrimSummaries = useAtomValue(scrimListSummaryAtom);

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
    <Container>
      {" "}
      {/* Added Container */}
      <h1 className="text-3xl font-bold mb-6">Scrims</h1>
      {/* Use flex layout for cards */}
      <div className="flex flex-col md:flex-row flex-wrap gap-6">
        {scrimSummaries.map((scrim: ScrimListSummary) => (
          <ScrimCard
            key={scrim.scrimId}
            title={`${scrim.teamNames[0]} vs ${scrim.teamNames[1]}`}
            teamNames={scrim.teamNames}
            date={scrim.dateString}
            // Display map count instead of list
            mapsPlayed={[`${scrim.mapCount} Maps`]} // Pass count as single-item array
            primaryStats={[{ value: scrim.score, label: "Score (W-L-D)" }]}
            secondaryStats={[
              { value: formatTime(scrim.duration), label: "Total Duration" },
              { value: scrim.mapCount.toString(), label: "Maps Played" },
            ]}
            // Construct link URL using the scrimId from summary
            linkUrl={`/scrims/${scrim.scrimId}`}
            // linkText uses default "View Details"
          />
        ))}
      </div>
    </Container> // Added closing Container
  );
};

export default ScrimsPage;
