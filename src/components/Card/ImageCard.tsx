import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import React from 'react';
import {Button, Typography} from '../Common/Mui';

const ImageCard = ({
  width,
  src,
  titleText,
  contentText,
  buttons,
  style,
}: {
  width: number | string;
  src: string;
  titleText: string;
  contentText: string;
  buttons: {
    text: string;
    onClick: () => void;
  }[];
  style?: React.CSSProperties;
}) => {
  return (
    <Box my={4} style={style}>
      <Card
        style={{
          maxWidth: width,
          position: 'relative',
        }}>
        <CardMedia
          component="img"
          image={src}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: '100%',
            // maskImage:
            //   'linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%)',
          }}
        />
        <CardContent
          style={{
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.33)',
            position: 'relative',
          }}>
          <Typography
            gutterBottom
            variant="h2"
            style={{
              textShadow: '0 0 10px rgba(0, 0, 0, 1)',
            }}
            header>
            {titleText}
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: 'white',
              textShadow: '0 0 10px rgba(0, 0, 0, 1)',
            }}>
            {contentText}
          </Typography>
        </CardContent>
        <CardActions
          style={{
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.33)',
            position: 'relative',
          }}>
          {buttons.map((button) => (
            <Button
              key={button.text}
              size="small"
              color="inherit"
              variant="outlined"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
              }}
              onClick={button.onClick}>
              {button.text}
            </Button>
          ))}
        </CardActions>
      </Card>
    </Box>
  );
};

export default ImageCard;
