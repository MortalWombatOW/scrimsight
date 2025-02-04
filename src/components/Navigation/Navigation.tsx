import { List, ListItem } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { NavigationItem } from './NavigationItem';
import { NavigationPageItem } from '../../lib/types/navigation';

interface NavigationProps {
  items: NavigationPageItem[];
}

export const Navigation = ({ items }: NavigationProps) => {
  const location = useLocation();

  return (
    <List component="nav" sx={{ width: '100%' }}>
      {items.map((item) => (
        <ListItem key={item.pattern || item.segment} disablePadding>
          <NavigationItem
            item={item}
            selected={location.pathname === (item.pattern || `/${item.segment}`)}
          />
        </ListItem>
      ))}
    </List>
  );
}; 