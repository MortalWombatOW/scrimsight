import { ButtonGroup, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, MouseEvent, ElementType } from 'react';
import { NavigationPageItem } from '../../lib/types/navigation';

interface NavigationItemProps {
  item: NavigationPageItem;
  selected?: boolean;
}

export const NavigationItem = ({ item, selected }: NavigationItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonGroup variant="text" fullWidth>
        <Button
          component={RouterLink as ElementType}
          to={item.pattern || `/${item.segment}`}
          startIcon={item.icon}
          sx={{ 
            justifyContent: 'flex-start', 
            textAlign: 'left', 
            flex: 1,
            backgroundColor: selected ? 'action.selected' : undefined
          }}
        >
          {item.title}
        </Button>
        {item.children && item.children.length > 0 && (
          <IconButton
            size="small"
            aria-controls={open ? 'navigation-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </ButtonGroup>
      {item.children && (
        <Menu
          id="navigation-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'navigation-button',
          }}
        >
          {item.children.map((child) => (
            <MenuItem
              key={child.pattern || child.segment}
              component={RouterLink as ElementType}
              to={child.pattern || `/${child.segment}`}
              onClick={handleClose}
            >
              {child.icon && <span style={{ marginRight: 8 }}>{child.icon}</span>}
              {child.title}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}; 
