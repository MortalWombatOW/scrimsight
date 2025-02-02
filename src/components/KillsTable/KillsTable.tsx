import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import { useAtom } from 'jotai';
import { getColorgorical } from '../../lib/color';
import { matchDataAtom, playerInteractionEventsAtom } from '~/atoms';
import {
  transformPlayerInteractions,
  createKillMatrix,
  calculatePlayerTotals
} from '../../utils/playerInteractionUtils';

interface KillsTableProps {
  matchId: string;
}

const KillsTable: React.FC<KillsTableProps> = ({ matchId }) => {
  const [matchData] = useAtom(matchDataAtom);
  const [playerInteractionEvents] = useAtom(playerInteractionEventsAtom);

  const match = matchData?.find(m => m.matchId === matchId);
  const interactions = playerInteractionEvents?.filter(e => e.matchId === matchId) ?? [];

  if (!match) return null;

  const { team1Name, team2Name, team1Players, team2Players } = match;
  const players = [...team1Players, ...team2Players];

  const processedInteractions = transformPlayerInteractions(interactions);
  const killMatrix = createKillMatrix(processedInteractions, players);
  const playerTotals = calculatePlayerTotals(killMatrix);

  const getPlayerTeam = (player: string) =>
    team1Players.includes(player) ? team1Name : team2Name;

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Kills \ Deaths</TableCell>
            {players.map(player => (
              <TableCell
                key={player}
                style={{
                  color: getColorgorical(getPlayerTeam(player)),
                  fontWeight: 'bold'
                }}
              >
                {player}
              </TableCell>
            ))}
            <TableCell>Total Kills</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map(killer => (
            <TableRow key={killer}>
              <TableCell
                style={{
                  color: getColorgorical(getPlayerTeam(killer)),
                  fontWeight: 'bold'
                }}
              >
                {killer}
              </TableCell>
              {players.map(victim => (
                <TableCell key={`${killer}-${victim}`}>
                  <Tooltip
                    title={`${killer} killed ${victim} ${killMatrix[killer][victim]} times`}
                    arrow
                  >
                    <span>{killMatrix[killer][victim]}</span>
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell>{playerTotals[killer].kills}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>Total Deaths</TableCell>
            {players.map(player => (
              <TableCell key={`total-deaths-${player}`}>
                {playerTotals[player].deaths}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KillsTable; 