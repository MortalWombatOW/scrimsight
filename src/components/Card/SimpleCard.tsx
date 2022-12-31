import {Box, Card, Typography} from '@mui/material';
import React from 'react';

const SimpleCard = ({title, content}: {title: string; content: string}) => {
  return (
    <Box component="div" sx={{minWidth: 275}}>
      <Card variant="outlined">
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">{content}</Typography>
      </Card>
    </Box>
  );
};

export default SimpleCard;
