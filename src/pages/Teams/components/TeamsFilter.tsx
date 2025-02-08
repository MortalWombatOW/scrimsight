import { Grid, Paper, TextField, MenuItem } from '@mui/material';

export type SortOption = 'name' | 'wins' | 'recent' | 'players';

interface TeamsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export const TeamsFilter = ({ searchQuery, onSearchChange, sortBy, onSortChange }: TeamsFilterProps) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Teams"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Sort By"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            variant="outlined"
            size="small"
          >
            <MenuItem value="name">Team Name</MenuItem>
            <MenuItem value="wins">Most Wins</MenuItem>
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="players">Most Players</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
}; 