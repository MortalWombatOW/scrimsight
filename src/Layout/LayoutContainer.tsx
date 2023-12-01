import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardMedia,
  CardHeader,
  CardActionArea,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';

interface LayoutElement {
  title?: React.ReactNode;
  imageSrc?: string;
  clickHandler?: () => void;
  content: React.ReactNode;
  footer?: string;
}

interface LayoutContainerProps {
  elements: LayoutElement[];
}

const LayoutElementComponent = ({
  title,
  imageSrc,
  clickHandler,
  content,
  footer,
}: LayoutElement) => {
  const innerContent = (
    <>
      {title && <CardContent>{title}</CardContent>}
      {imageSrc && <CardMedia component="img" height="140" image={imageSrc} />}
      <CardContent>{content}</CardContent>
      {footer && (
        <CardContent>
          <Typography variant="h6">{footer}</Typography>
        </CardContent>
      )}
    </>
  );

  const clickable = clickHandler !== undefined;

  const cardContent = clickable ? (
    <CardActionArea onClick={clickHandler}>{innerContent}</CardActionArea>
  ) : (
    innerContent
  );

  return <Card variant="elevation">{cardContent}</Card>;
};

const LayoutContainer = ({elements}: LayoutContainerProps) => {
  return (
    <Masonry>
      {elements.map((element, i) => (
        <LayoutElementComponent key={i} {...element} />
      ))}
    </Masonry>
  );
};

export default LayoutContainer;
