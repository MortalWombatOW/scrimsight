import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/material';

interface PlayerProps {
  playerName: string;
  playerStats: {
    kdaRatio: number;
    averageDamage: number;
  };
  recentGames: Array<{
    date: string;
    result: string;
    keyPlayer: string;
  }>;
}

const PlayerDetails: React.FC<PlayerProps> = ({
  playerName,
  playerStats,
  recentGames,
}) => {
  return (
    <div>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5">{playerName}</Typography>
          <Typography variant="body2">
            KDA Ratio: {playerStats.kdaRatio}
          </Typography>
          <Typography variant="body2">
            Average Damage: {playerStats.averageDamage}
          </Typography>
        </CardContent>
      </Card>
      <Typography variant="h6" style={{marginTop: '16px'}}>
        Recent Games:
      </Typography>
      <List>
        {recentGames.map((game, index) => (
          <div key={index}>
            <ListItem>
              <Typography>Date: {game.date}</Typography>
              <Typography>Result: {game.result}</Typography>
              <Typography>Key Player: {game.keyPlayer}</Typography>
            </ListItem>
            {index !== recentGames.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </div>
  );
};

export default PlayerDetails;
