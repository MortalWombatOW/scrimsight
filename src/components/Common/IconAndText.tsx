import { Button, Popover, Typography } from '@mui/material';
import { ColorKey } from '../../theme';
import { useState } from 'react';

const IconAndTextButton = ({
  variant,
  icon,
  text,
  padding,
  borderRadius,
  dynamic,
  colorKey,
  onClick,
  fontSize,
}: {
  variant?: 'contained' | 'outlined' | 'text';
  icon: React.ReactElement;
  text: string;
  padding?: string;
  borderRadius?: string;
  dynamic?: boolean;
  colorKey?: ColorKey;
  onClick?: () => void;
  fontSize?: string;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button
        variant={variant || 'contained'}
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
        onClick={onClick}
        color={colorKey}
        startIcon={dynamic ? undefined : icon}
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          borderRadius: borderRadius || '5px',
          padding: padding || '0.5em',
          lineHeight: '1.5em',
          maxWidth: 'fit-content',
        }}>
        {dynamic && icon}
        {!dynamic && <Typography sx={{ paddingLeft: 2, fontWeight: 'bold', fontSize: fontSize || '1rem' }}>{text}</Typography>}
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
              backgroundColor: colorKey + '.main',
              color: colorKey + '.contrastText',
            }}>
            {text}
          </Typography>
        </Popover>
      )}
    </>
  );
};

export default IconAndTextButton;
