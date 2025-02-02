import { useAtom } from 'jotai';
import { 
  matchesGroupedByDateAtom,
  matchStartExtractorAtom,
  matchEndExtractorAtom
} from '~/atoms';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MapsList = () => {
  const navigate = useNavigate();
  const [matchesGroupedByDate] = useAtom(matchesGroupedByDateAtom);
  const [matchStarts] = useAtom(matchStartExtractorAtom);
  const [matchEnds] = useAtom(matchEndExtractorAtom);

  const handleMapClick = (matchId: string) => {
    navigate(`/match/${matchId}`);
  };

  return (
    <Box sx={{
      overflow: 'auto',
    }}>
      {matchesGroupedByDate?.map(({ dateString, matchIds }) => (
        <Box key={dateString} sx={{ marginBottom: 2 }}>
          <Typography variant="h6">{dateString}</Typography>
          <List>
            {matchIds.map((matchId) => {
              const matchStart = matchStarts?.find((m) => m.matchId === matchId);
              const matchEnd = matchEnds?.find((m) => m.matchId === matchId);

              if (!matchStart || !matchEnd) return null;

              return (
                <ListItem
                  key={matchId}
                  onClick={() => handleMapClick(matchId)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText
                    primary={`${matchStart.mapName} - ${matchStart.mapType}`}
                    secondary={`${matchStart.team1Name} (${matchEnd.team1Score}) vs ${matchStart.team2Name} (${matchEnd.team2Score})`}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default MapsList;
