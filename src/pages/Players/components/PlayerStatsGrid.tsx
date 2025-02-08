import { Box, Tooltip, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { playerStatsBaseAtom } from '../../../atoms/metrics/playerMetricsAtoms';
import { PlayerStats } from '../../../atoms/playerStatExpandedAtom';

export const PlayerStatsGrid = () => {
  const playerStats = useAtomValue(playerStatsBaseAtom);
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { 
      field: 'playerName', 
      headerName: 'Player', 
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title="Click to view player details">
          <Box
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              }
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              navigate(`/players/${encodeURIComponent(params.row.playerName)}`);
            }}
          >
            {params.row.playerName || 'Unknown'}
          </Box>
        </Tooltip>
      ),
    },
    { field: 'eliminations', headerName: 'Eliminations', type: 'number', width: 130 },
    { field: 'deaths', headerName: 'Deaths', type: 'number', width: 130 },
    { field: 'heroDamageDealt', headerName: 'Hero Damage', type: 'number', width: 130 },
    { field: 'healingDealt', headerName: 'Healing', type: 'number', width: 130 },
  ];

  const rows = playerStats?.rows.map((player: PlayerStats, index: number) => ({
    id: index,
    playerName: player.playerName,
    eliminations: player.eliminations,
    deaths: player.deaths,
    heroDamageDealt: player.heroDamageDealt,
    healingDealt: player.healingDealt,
  })) || [];

  return (
    <Paper elevation={2} sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        autoHeight
      />
    </Paper>
  );
}; 
