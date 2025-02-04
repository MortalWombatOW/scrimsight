import { Card, CardContent, Typography, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SinglePlayerStats } from '../../atoms/singlePlayerStatsAtom';
import { useNavigate } from 'react-router-dom';

interface PlayerMatchHistoryProps {
  stats: SinglePlayerStats;
}

type MatchRow = {
  id: number;
  date: string;
  map: string;
  mode: string;
  team: string;
  result: 'win' | 'loss' | 'draw';
  matchId: string;
  formattedDate: string;
};

export const PlayerMatchHistory = ({ stats }: PlayerMatchHistoryProps) => {
  const navigate = useNavigate();

  const columns: GridColDef<MatchRow>[] = [
    {
      field: 'formattedDate',
      headerName: 'Date',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'map',
      headerName: 'Map',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'mode',
      headerName: 'Mode',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'result',
      headerName: 'Result',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.value === 'win' ? 'success.main' :
                  params.value === 'loss' ? 'error.main' :
                  'text.secondary',
            fontWeight: 'medium',
          }}
        >
          {params.value.toUpperCase()}
        </Typography>
      ),
    },
  ];

  const rows: MatchRow[] = stats.matches.map((match, index) => ({
    id: index,
    ...match,
    date: match.dateString,
    team: match.team1Players.includes(stats.playerName) ? match.team1Name : match.team2Name,
    result: match.team1Players.includes(stats.playerName) ? (match.team1Score > match.team2Score ? 'win' : 'loss') : (match.team1Score < match.team2Score ? 'win' : 'loss'),
    formattedDate: new Date(match.dateString).toLocaleDateString(),
  }));

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Match History
        </Typography>
        <Box sx={{ 
          height: 400, 
          width: '100%',
          '& .MuiDataGrid-main': {
            overflow: 'visible'
          }
        }}>
          <DataGrid<MatchRow>
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
              sorting: {
                sortModel: [{ field: 'date', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            onRowClick={(params) => {
              navigate(`/matches/${params.row.matchId}`);
            }}
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
              height: '100%',
              width: '100%'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}; 