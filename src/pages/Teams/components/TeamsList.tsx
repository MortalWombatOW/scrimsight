import { Grid } from '@mui/material';
import TeamCard from '../../../components/TeamCard';
import { TeamStats } from '../../../atoms/teamStatsAtom';

interface TeamsListProps {
  teams: TeamStats[];
}

export const TeamsList = ({ teams }: TeamsListProps) => {
  return (
    <Grid container spacing={3}>
      {teams.map(team => (
        <Grid item xs={12} sm={6} lg={4} key={team.teamName}>
          <TeamCard teamName={team.teamName} />
        </Grid>
      ))}
    </Grid>
  );
}; 