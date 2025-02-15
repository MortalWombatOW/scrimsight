import { Box, Tooltip, Paper, TextField, MenuItem, InputAdornment } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar
} from '@mui/x-data-grid';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { playerStatsByPlayerAtom } from '../../../atoms/metrics/playerMetricsAtoms';
import { Search as SearchIcon } from '@mui/icons-material';

interface PlayerRow {
  id: number;
  playerName: string;
  eliminations: number;
  deaths: number;
  heroDamageDealt: number;
  healingDealt: number;
  ultimatesEarned: number;
  weaponAccuracy: number;
}

export const PlayerStatsGrid = () => {
  const playerStats = useAtomValue(playerStatsByPlayerAtom);
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const columns: GridColDef<PlayerRow>[] = [
    {
      field: 'playerName',
      headerName: 'Player',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PlayerRow>) => (
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
    { field: 'playerRole', headerName: 'Role', width: 120 },
    {
      field: 'eliminations',
      headerName: 'Eliminations',
      type: 'number',
      width: 130,
      valueFormatter: (value: number) => value?.toLocaleString() ?? '0',
    },
    {
      field: 'deaths',
      headerName: 'Deaths',
      type: 'number',
      width: 130,
      valueFormatter: (value: number) => value?.toLocaleString() ?? '0',
    },
    {
      field: 'kdr',
      headerName: 'K/D Ratio',
      type: 'number',
      width: 130,
      valueGetter: (_, row: PlayerRow) => {
        const deaths = row.deaths || 1; // Avoid division by zero
        return row.eliminations / deaths;
      },
      valueFormatter: (value: number) => value?.toFixed(2) ?? '0.00',
    },
    {
      field: 'heroDamageDealt',
      headerName: 'Hero Damage',
      type: 'number',
      width: 130,
      valueFormatter: (value: number) => value?.toLocaleString() ?? '0',
    },
    {
      field: 'healingDealt',
      headerName: 'Healing',
      type: 'number',
      width: 130,
      valueFormatter: (value: number) => value?.toLocaleString() ?? '0',
    },
    {
      field: 'ultimatesEarned',
      headerName: 'Ultimates Earned',
      type: 'number',
      width: 150,
      valueFormatter: (value: number) => value?.toLocaleString() ?? '0',
    },
    {
      field: 'weaponAccuracy',
      headerName: 'Accuracy',
      type: 'number',
      width: 130,
      valueFormatter: (value: number) =>
        value != null ? `${(value * 100).toFixed(1)}%` : '0%',
    },
  ];

  const rows: PlayerRow[] = playerStats?.rows
    .filter((player) => {
      const matchesSearch = player.playerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .map((player, index: number) => ({
      id: index,
      playerName: player.playerName,
      eliminations: player.eliminations,
      deaths: player.deaths,
      heroDamageDealt: player.heroDamageDealt,
      healingDealt: player.healingDealt,
      ultimatesEarned: player.ultimatesEarned,
      weaponAccuracy: player.weaponAccuracy,
    })) || [];

  return (
    <Paper elevation={2} sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="all">All Roles</MenuItem>
          <MenuItem value="tank">Tank</MenuItem>
          <MenuItem value="damage">Damage</MenuItem>
          <MenuItem value="support">Support</MenuItem>
        </TextField>
        <TextField
          label="Search Players"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <DataGrid<PlayerRow>
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            sortModel: [{ field: 'eliminations', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
      />
    </Paper>
  );
}; 
