import React from "react";

import { useAtom } from "jotai";
import {
  matchDataAtom,
  PlayerInteractionEvent,
  playerInteractionEventsAtom,
} from "~/atoms";
import { HeatMapGrid } from "react-grid-heatmap";
import { Paper, Group, Title, Stack, Text, Grid, Center } from "@mantine/core";

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
    <Paper withBorder p="md">
      <Group>
        <Stack>
          <Title order={3} mb="md">
            Kills by {team1Name}
          </Title>
          <Grid mb="md">
            <Grid.Col span={4}>
              <Group justify="flex-end">
                <Text
                  size="xs"
                  c="var(--chart-text-color, var(--mantine-color-dimmed))"
                >
                  Attackers
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={8}>
              <Center>
                <Text
                  size="xs"
                  c="var(--chart-text-color, var(--mantine-color-dimmed))"
                >
                  Victims
                </Text>
              </Center>
            </Grid.Col>
          </Grid>
          <HeatMapGrid
            data={team1Kills}
            xLabels={team2Players}
            yLabels={team1Players}
            cellHeight="30px"
            square
            cellRender={(_x, _y, value) => (
              <Text size="sm" lh="30px" c="gray">
                {value}
              </Text>
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
        </Stack>
        <Stack>
          <Title order={3} mb="md">
            Kills by {team2Name}
          </Title>
          <Grid>
            <Grid.Col span={4}>
              <Group justify="flex-end">
                <Text
                  size="xs"
                  c="var(--chart-text-color, var(--mantine-color-dimmed))"
                >
                  Attackers
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={8}>
              <Center>
                <Text
                  size="xs"
                  c="var(--chart-text-color, var(--mantine-color-dimmed))"
                >
                  Victims
                </Text>
              </Center>
            </Grid.Col>
          </Grid>
          <HeatMapGrid
            data={team2Kills}
            xLabels={team1Players}
            yLabels={team2Players}
            cellHeight="30px"
            square
            cellRender={(_x, _y, value) => (
              <Text size="sm" lh="30px" c="gray">
                {value}
              </Text>
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
        </Stack>
      </Group>
    </Paper>
    // <TableContainer component={Paper}>
    //   <Table size="small">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Kills \ Deaths</TableCell>
    //         {players.map(player => (
    //           <TableCell
    //             key={player}
    //             style={{
    //               color: getColorgorical(getPlayerTeam(player)),
    //               fontWeight: 'bold'
    //             }}
    //           >
    //             {player}
    //           </TableCell>
    //         ))}
    //         <TableCell>Total Kills</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {players.map(killer => (
    //         <TableRow key={killer}>
    //           <TableCell
    //             style={{
    //               color: getColorgorical(getPlayerTeam(killer)),
    //               fontWeight: 'bold'
    //             }}
    //           >
    //             {killer}
    //           </TableCell>
    //           {players.map(victim => (
    //             <TableCell key={`${killer}-${victim}`}>
    //               <Tooltip
    //                 title={`${killer} killed ${victim} ${killMatrix[killer][victim]} times`}
    //                 arrow
    //               >
    //                 <span>{killMatrix[killer][victim]}</span>
    //               </Tooltip>
    //             </TableCell>
    //           ))}
    //           <TableCell>{playerTotals[killer].kills}</TableCell>
    //         </TableRow>
    //       ))}
    //       <TableRow>
    //         <TableCell>Total Deaths</TableCell>
    //         {players.map(player => (
    //           <TableCell key={`total-deaths-${player}`}>
    //             {playerTotals[player].deaths}
    //           </TableCell>
    //         ))}
    //         <TableCell />
    //       </TableRow>
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
};

export default KillsTable;
