import {Card, CardContent, CardActions, Button, Typography} from '@mui/material';
import React from 'react';

const WelcomeMessage = () => {
  return (
    <div
      style={{
        padding: '50px',
      }}>
      <Card className="welcome-card">
        <CardContent>
          <Typography variant="h5">Welcome to Scrimsight!</Typography>
          <Typography variant="body1">
            Scrimsight is a tool for competive Overwatch teams to analyze their scrims and improve their play. To get started, you can either explore using example data, or create your own team and start analyzing your own
            scrims.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={() => {}}>
            Exit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default WelcomeMessage;
