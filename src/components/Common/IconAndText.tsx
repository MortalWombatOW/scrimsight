import {Box, Button, Popover, Typography} from '@mui/material';
import React from 'react';
import {getColorgorical} from '../../lib/color';
import {heroNameToNormalized} from '../../lib/string';

const IconAndText = ({
  icon,
  text,
  backgroundColor,
  textBorder,
  padding,
  borderRadius,
  dynamic,
}: {
  icon: React.ReactElement;
  text: string;
  backgroundColor?: string;
  textBorder?: boolean;
  padding?: string;
  borderRadius?: string;
  dynamic?: boolean;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <Button
        variant="contained"
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
        color={'lucio'}
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          borderRadius: borderRadius || '5px',
          // ...(backgroundColor ? {backgroundColor} : {}),
          padding: padding || '0.5em',
          lineHeight: '1.5em',
          // dont be wider than the text
          maxWidth: 'fit-content',
        }}>
        {icon}
        {!dynamic && (
          <Typography sx={{paddingLeft: 2, fontWeight: 'bold'}}>
            {text}
          </Typography>
        )}
      </Button>
      {dynamic && (
        <Popover
          open={anchorEl !== null}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={() => setAnchorEl(null)}
          sx={{
            pointerEvents: 'none',
          }}
          disableRestoreFocus>
          <Typography
            sx={{
              p: 1,
              ...(backgroundColor
                ? {
                    backgroundColor,
                    textShadow: '0 0 5px black',
                  }
                : {}),
            }}>
            {text}
          </Typography>
        </Popover>
      )}
    </>
  );
};

export default IconAndText;
