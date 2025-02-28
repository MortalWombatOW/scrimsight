import React from "react";

import { useAtom } from "jotai";
import {
  matchDataAtom,
  PlayerInteractionEvent,
  playerInteractionEventsAtom,
} from "~/atoms";
import { HeatMapGrid } from "react-grid-heatmap";

interface KillsTableProps {
  matchId: string;
}

interface PlayerInteraction {
  sourcePlayerName: string;
  sourceTeamName: string;
  targetPlayerName: string;
  value: number;
}

interface PlayerTotals {
  kills: number;
  deaths: number;
}

const transformPlayerInteractions = (
  data: PlayerInteractionEvent[]
): PlayerInteraction[] => {
  const interactions: {
    [key: string]: PlayerInteraction;
  } = {};

  const kills = data.filter(
    (row) => row.playerInteractionEventType === "Killed player"
  );

  kills.forEach((row) => {
    const sourcePlayer = row.playerName;
    const targetPlayer = row.otherPlayerName;
    const interactionKey = `${sourcePlayer}-${targetPlayer}`;

    if (sourcePlayer === targetPlayer) {
      return;
    }

    if (!interactions[interactionKey]) {
      interactions[interactionKey] = {
        sourcePlayerName: sourcePlayer,
        sourceTeamName: row.playerTeam,
        targetPlayerName: targetPlayer,
        value: 0,
      };
    }
    interactions[interactionKey].value += 1;
  });

  return Object.values(interactions);
};

const createKillMatrix = (
  interactions: PlayerInteraction[],
  players: string[]
): { [killer: string]: { [victim: string]: number } } => {
  const matrix: { [killer: string]: { [victim: string]: number } } = {};

  // Initialize matrix with zeros
  players.forEach((killer) => {
    matrix[killer] = {};
    players.forEach((victim) => {
      matrix[killer][victim] = 0;
    });
  });

  // Fill in kill counts
  interactions.forEach((interaction) => {
    matrix[interaction.sourcePlayerName][interaction.targetPlayerName] =
      interaction.value;
  });

  return matrix;
};

export const calculatePlayerTotals = (killMatrix: {
  [killer: string]: { [victim: string]: number };
}): { [player: string]: PlayerTotals } => {
  const totals: { [player: string]: PlayerTotals } = {};

  Object.keys(killMatrix).forEach((player) => {
    totals[player] = {
      kills: Object.values(killMatrix[player]).reduce(
        (sum, kills) => sum + kills,
        0
      ),
      deaths: Object.keys(killMatrix).reduce(
        (sum, killer) => sum + killMatrix[killer][player],
        0
      ),
    };
  });

  return totals;
};

const KillsTable: React.FC<KillsTableProps> = ({ matchId }) => {
  const [matchData] = useAtom(matchDataAtom);
  const [playerInteractionEvents] = useAtom(playerInteractionEventsAtom);

  const match = matchData?.find((m) => m.matchId === matchId);
  const interactions =
    playerInteractionEvents?.filter((e) => e.matchId === matchId) ?? [];

  if (!match) return null;

  const { team1Name, team2Name, team1Players, team2Players } = match;
  const players = [...team1Players, ...team2Players];

  const processedInteractions = transformPlayerInteractions(interactions);
  const killMatrix = createKillMatrix(processedInteractions, players);

  const team1Kills: number[][] = [];
  for (const player of team1Players) {
    const row: number[] = [];
    for (const victim of team2Players) {
      row.push(killMatrix[player][victim]);
    }
    team1Kills.push(row);
  }

  const team2Kills: number[][] = [];
  for (const player of team2Players) {
    const row: number[] = [];
    for (const victim of team1Players) {
      row.push(killMatrix[player][victim]);
    }
    team2Kills.push(row);
  }
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Kills by {team1Name}
          </h3>
          <div className="grid grid-cols-12 mb-4">
            <div className="col-span-4">
              <div className="flex justify-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Attackers
                </span>
              </div>
            </div>
            <div className="col-span-8">
              <div className="flex justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Victims
                </span>
              </div>
            </div>
          </div>
          <HeatMapGrid
            data={team1Kills}
            xLabels={team2Players}
            yLabels={team1Players}
            cellHeight="30px"
            square
            cellRender={(_x, _y, value) => (
              <span className="text-sm leading-[30px] text-gray-600 dark:text-gray-400">
                {value}
              </span>
            )}
            xLabelsStyle={() => ({
              fontSize: ".7rem",
              rotate: "-45deg",
              marginBottom: "0.7rem",
              marginLeft: "6px",
              overflow: "visible",
            })}
            yLabelsStyle={() => ({
              fontSize: ".7rem",
              marginTop: "6px",
            })}
            cellStyle={(_x, _y, ratio) => ({
              background: `rgb(200, 106, 0, ${ratio})`,
              fontSize: ".8rem",
              color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
              border: "none",
              margin: "3px",
            })}
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Kills by {team2Name}
          </h3>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <div className="flex justify-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Attackers
                </span>
              </div>
            </div>
            <div className="col-span-8">
              <div className="flex justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Victims
                </span>
              </div>
            </div>
          </div>
          <HeatMapGrid
            data={team2Kills}
            xLabels={team1Players}
            yLabels={team2Players}
            cellHeight="30px"
            square
            cellRender={(_x, _y, value) => (
              <span className="text-sm leading-[30px] text-gray-600 dark:text-gray-400">
                {value}
              </span>
            )}
            xLabelsStyle={() => ({
              fontSize: ".7rem",
              rotate: "-45deg",
              marginBottom: "0.7rem",
              marginLeft: "6px",
              overflow: "visible",
            })}
            yLabelsStyle={() => ({
              fontSize: ".7rem",
              marginTop: "6px",
            })}
            cellStyle={(_x, _y, ratio) => ({
              background: `rgb(200, 106, 0, ${ratio})`,
              fontSize: ".8rem",
              color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
              border: "none",
              margin: "3px",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default KillsTable;
