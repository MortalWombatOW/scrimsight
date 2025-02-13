import { MatchesList } from '.';
import { Typography } from '@mui/material';
export const MatchesPage = () => {
  return (

    <div>
      <Typography variant="h2" gutterBottom>
        Matches
      </Typography>
      <MatchesList />
    </div>
  );
};

