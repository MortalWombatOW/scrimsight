import { Box, Tooltip, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { playerStatTotalsAtom, PlayerStatTotals } from '../../../atoms';
import { Suspense } from 'react';

export const PlayerStatsGrid = () => {
  const [playerStats] = useAtom(playerStatTotalsAtom);
  const navigate = useNavigate();

  const columns: GridColDef<PlayerStatTotals>[] = [
    { 
      field: 'playerName', 
      headerName: 'Player', 
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PlayerStatTotals>) => (
        <Tooltip title="Click to view player details">
          <Box
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 'medium',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/players/${encodeURIComponent(params.value?.toString() || '')}`);
            }}
          >
            {params.value || 'Unknown'}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'eliminations',
      headerName: 'Eliminations',
      type: 'number',
      width: 130,
    },
    {
      field: 'deaths',
      headerName: 'Deaths',
      type: 'number',
      width: 100,
    },
    {
      field: 'kdr',
      headerName: 'K/D Ratio',
      type: 'number',
      width: 130,
      valueGetter: (x: { row: PlayerStatTotals | undefined } | undefined) => {
        if (!x) return 0;
        if (!x.row) return 0;
        const eliminations = x.row.eliminations ?? 0;
        const deaths = x.row.deaths ?? 0;
        const kdr = deaths > 0 ? eliminations / deaths : eliminations;
        return Number(kdr.toFixed(2));
      },
    },
    {
      field: 'heroDamageDealt',
      headerName: 'Hero Damage',
      type: 'number',
      width: 130,
      valueFormatter: (params: {value: string} | undefined) => {
        if (!params) return '0';
        const value = Number(params.value);
        return isNaN(value) ? '0' : value.toLocaleString();
      },
    },
    {
      field: 'healingDealt',
      headerName: 'Healing',
      type: 'number',
      width: 130,
      valueFormatter: (params: {value: string} | undefined) => {
        if (!params) return '0';
        const value = Number(params.value);
        return isNaN(value) ? '0' : value.toLocaleString();
      },
    },
    {
      field: 'weaponAccuracy',
      headerName: 'Accuracy',
      type: 'number',
      width: 130,
      valueFormatter: (params: {value: string} | undefined) => {
        if (!params) return '0';
        const value = Number(params.value);
        return isNaN(value) ? '0%' : `${(value * 100).toFixed(1)}%`;
      },
    },
    {
      field: 'ultimatesEarned',
      headerName: 'Ultimates',
      type: 'number',
      width: 100,
    },
  ];

  const rows = playerStats?.map((player, index) => ({
    id: index,
    ...player,
  })) || [];

  return (
    <Paper sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ height: 600, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <DataGrid
            rows={rows}
            columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{ field: 'playerName', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          onRowClick={(params) => {
            navigate(`/players/${encodeURIComponent(params.row.playerName || '')}`);
          }}
          density="comfortable"
          sx={{
            '& .MuiDataGrid-cell': {
              fontSize: '0.9rem',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'action.hover',
              color: 'text.primary',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
            flex: 1,
            borderRadius: 1,
          }}
        />
        </Suspense>
      </Box>
    </Paper>
  );
}; 
