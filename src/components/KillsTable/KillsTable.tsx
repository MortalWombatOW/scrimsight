import { type ReactNode, Suspense } from "react"; // Added Suspense
import { useAtom } from "jotai";
import { killMatrixAtomFamily } from "@atoms/derived_stats/killMatrixAtom"; // Import the new atom
import HeatmapGrid from "@components/Heatmap/HeatmapGrid";

interface KillsTableProps {
  matchId: string;
}

// Removed local helper functions: transformPlayerInteractions, createKillMatrix, calculatePlayerTotals

const KillsTableContent = ({ matchId }: KillsTableProps): ReactNode => {
  // Use the new derived atom family
  // useAtom handles Suspense automatically for async atoms
  const [killMatrixData] = useAtom(killMatrixAtomFamily(matchId));

  // Handle case where atom returns null (e.g., match not found)
  if (!killMatrixData) {
    return <div className="text-center p-4">Kill data not available for this match.</div>;
  }

  const { killMatrix, team1Name, team2Name, team1Players, team2Players } = killMatrixData;

  // Calculate heatmap data directly here using the killMatrix from the atom
  const team1Kills: number[][] = team1Players.map((player) =>
    team2Players.map((victim) => killMatrix[player]?.[victim] ?? 0) // Added safety check
  );

  const team2Kills: number[][] = team2Players.map((player) =>
    team1Players.map((victim) => killMatrix[player]?.[victim] ?? 0) // Added safety check
  );

  // Removed old data fetching and processing logic

  // Prepare data for HeatmapGrid (already done above)
  /*
  const team1Kills: number[][] = [];
  for (const player of team1Players) {
  */
  return (
    <div className="bg-base rounded-lg border border-gray-700 border-gray-700 p-4 shadow-sm dark:bg-base-800 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-6 justify-around"> {/* Added justify-around */}
        <div className="flex flex-col flex-1 min-w-0"> {/* Added flex-1 and min-w-0 */}
          <h3 className="text-xl font-semibold mb-4 text-base-900 dark:text-white truncate"> {/* Added truncate */}
            Kills by {team1Name}
          </h3>
          {/* Simplified header structure */}
          <div className="flex justify-between mb-8">
            <span className="text-xs text-base-500 dark:text-base-400 self-end pb-1 pr-2"> {/* Adjusted alignment */}
              Attackers
            </span>
            <span className="text-xs text-base-500 dark:text-base-400 text-center flex-1"> {/* Adjusted alignment */}
              Victims
            </span>
          </div>
          {/* Heatmap Grid */}
          <HeatmapGrid
            data={team1Kills}
            xLabels={team2Players}
            yLabels={team1Players}
            cellHeight="30px"
            hoverText={(xLabel, yLabel, value) =>
              `${yLabel} killed ${xLabel} ${value} times`
            }
            cellRender={(_x: number, _y: number, value: number) => (
              <span className="text-sm leading-[30px] text-base-600 dark:text-base-400">
                {value}
              </span>
            )}
            xLabelsStyle={() => ({
              fontSize: ".7rem",
              rotate: "-45deg",
              marginBottom: "0.7rem",
              marginLeft: "6px",
              overflow: "visible",
              whiteSpace: "nowrap", // Prevent wrapping
            })}
            yLabelsStyle={() => ({
              fontSize: ".7rem",
              marginTop: "1px",
              whiteSpace: "nowrap", // Prevent wrapping
              textAlign: "right", // Align right
              paddingRight: "4px", // Add padding
            })}
            cellStyle={(_x: number, _y: number, ratio: number) => ({
              background: `rgb(120, 120, 120, ${ratio})`,
              fontSize: ".8rem",
              border: "none",
              margin: "3px",
              marginLeft: "0px",
            })}
          />
        </div>

        {/* Separator */}
        <div className="border-l border-gray-700 dark:border-gray-700 mx-4 hidden md:block"></div>

        <div className="flex flex-col flex-1 min-w-0 mr-6"> {/* Added flex-1 and min-w-0 */}
          <h3 className="text-xl font-semibold mb-4 text-base-900 dark:text-white truncate"> {/* Added truncate */}
            Kills by {team2Name}
          </h3>
          {/* Simplified header structure */}
          <div className="flex justify-between mb-8">
            <span className="text-xs text-base-500 dark:text-base-400 self-end pb-1 pr-2"> {/* Adjusted alignment */}
              Attackers
            </span>
            <span className="text-xs text-base-500 dark:text-base-400 text-center flex-1"> {/* Adjusted alignment */}
              Victims
            </span>
          </div>
          <HeatmapGrid
            data={team2Kills}
            xLabels={team1Players}
            yLabels={team2Players}
            cellHeight="30px"
            hoverText={(xLabel, yLabel, value) =>
              `${yLabel} killed ${xLabel} ${value} times`
            }
            cellRender={(_x: number, _y: number, value: number) => (
              <span className="text-sm leading-[30px] text-base-600 dark:text-base-400">
                {value}
              </span>
            )}
            xLabelsStyle={() => ({
              fontSize: ".7rem",
              rotate: "-45deg",
              marginBottom: "0.7rem",
              marginLeft: "8px",
              overflow: "visible",
              whiteSpace: "nowrap", // Prevent wrapping
            })}
            yLabelsStyle={() => ({
              fontSize: ".7rem",
              marginTop: "1px",
              whiteSpace: "nowrap", // Prevent wrapping
              textAlign: "right", // Align right
              paddingRight: "4px", // Add padding
            })}
            cellStyle={(_x: number, _y: number, ratio: number) => ({
              background: `rgb(120, 120, 120, ${ratio})`,
              fontSize: ".8rem",
              border: "none",
              margin: "3px",
            })}
          />
        </div>
      </div>
    </div>
  );
};

// Wrap the main component with Suspense for loading state
const KillsTable = ({ matchId }: KillsTableProps): ReactNode => {
  return (
    <Suspense fallback={<div className="h-40 w-full flex justify-center items-center">Loading...</div>}> {/* Adjust height/width as needed */}
      <KillsTableContent matchId={matchId} />
    </Suspense>
  );
};

export default KillsTable; // Added default export
