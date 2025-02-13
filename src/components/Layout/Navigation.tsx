import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { ElementType } from 'react';

export const Navigation = () => {
  const location = useLocation();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Button
          component={RouterLink as ElementType}
          to={'/'}
          sx={{
            marginRight: 'auto',
          }}
        >
          <Typography variant="h3" noWrap component="div" sx={{ color: 'text.primary' }}>
            SCRIMSIGHT
          </Typography>
        </Button>
        <Button
          component={RouterLink as ElementType}
          to={'/matches'}
          variant="outlined"
          sx={{
            borderColor: location.pathname.startsWith('/matches') ? 'action.primary' : undefined,
            borderWidth: location.pathname.startsWith('/matches') ? 1 : 0,
          }}
        >
          <Typography variant="h4" noWrap component="div">
            MATCHES
          </Typography>
        </Button>
        <Button
          component={RouterLink as ElementType}
          to={'/players'}
          variant="outlined"
          sx={{
            borderColor: location.pathname.startsWith('/players') ? 'action.primary' : undefined,
            borderWidth: location.pathname.startsWith('/players') ? 1 : 0,
          }}
        >
          <Typography variant="h4" noWrap component="div">
            PLAYERS
          </Typography>
        </Button>
        <Button
          component={RouterLink as ElementType}
          to={'/teams'}
          variant="outlined"
          sx={{
            borderColor: location.pathname.startsWith('/teams') ? 'action.primary' : undefined,
            borderWidth: location.pathname.startsWith('/teams') ? 1 : 0,
          }}
        >
          <Typography variant="h4" noWrap component="div">
            TEAMS
          </Typography>
        </Button>

        <Button
          component={RouterLink as ElementType}
          to={'/files'}
          variant="outlined"
          sx={{
            borderColor: location.pathname.startsWith('/files') ? 'action.primary' : undefined,
            borderWidth: location.pathname.startsWith('/files') ? 1 : 0,
            marginLeft: 'auto',
          }}
        >
          <Typography variant="h4" noWrap component="div">
            FILES
          </Typography>
        </Button>


      </Toolbar>
    </AppBar>

  );
}; 