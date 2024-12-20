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
import { useWombatData } from 'wombat-data-framework';
import { getColorgorical } from '../../lib/color';
import { MatchData } from '../../WombatDataFrameworkSchema';
import { PlayerInteractionEvent } from '../MapTimeline/types/timeline.types';
import {
  transformPlayerInteractions,
  createKillMatrix,
  calculatePlayerTotals
} from '../../utils/playerInteractionUtils';

interface KillsTableProps {
  matchId: string;
}

const KillsTable: React.FC<KillsTableProps> = ({ matchId }) => {
  const matchData = useWombatData<MatchData>('match_data', {
    initialFilter: { matchId }
  }).data[0];

  const playerInteractionEventsData = useWombatData<PlayerInteractionEvent>(
    'player_interaction_events',
    { initialFilter: { matchId } }
  ).data;

  console.log('playerInteractionEventsData', playerInteractionEventsData);

  if (!matchData) return null;

  const { team1Name, team2Name, team1Players, team2Players } = matchData;
  const players = [...team1Players, ...team2Players];

  const interactions = transformPlayerInteractions(playerInteractionEventsData);
  const killMatrix = createKillMatrix(interactions, players);
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