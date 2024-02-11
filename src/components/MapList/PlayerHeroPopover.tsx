import {Avatar, Popover, Typography} from '@mui/material';
import React from 'react';
import {getColorFor} from '../../lib/color';

const PlayerHeroPopover = ({
  playerName,
  mapId,
  hero,
}: {
  playerName: string;
  mapId: number;
  hero: string;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Avatar
        alt={hero}
        src={`/assets/heroes/${hero
          .toLowerCase()
          .replaceAll('.', '')
          .replaceAll(' ', '')
          .replaceAll(':', '')
          .replaceAll('ú', 'u')
          .replaceAll('ö', 'o')}.png`}
        sx={{
          width: 32,
          height: 32,
          bgcolor: getColorFor(
            hero
              .toLowerCase()
              .replaceAll('.', '')
              .replaceAll(' ', '')
              .replaceAll(':', '')
              .replaceAll('ú', 'u')
              .replaceAll('ö', 'o'),
          ),
          border: 'none',
        }}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        variant="square"
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus>
        <Typography sx={{p: 1}}>I use Popover.</Typography>
      </Popover>
    </div>
  );
};

export default PlayerHeroPopover;
