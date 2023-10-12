import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React, {MouseEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import routes from '../../lib/routes';
import './Header.scss';

const settings = ['Settings', 'Logout'];

const Header = ({
  refreshCallback,
  filters,
  setFilters,
}: {
  refreshCallback: (() => void) | undefined;
  filters: {[key: string]: string[]};
  setFilters: (filters: {[key: string]: string[]}) => void;
}) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickForPage = (page: string) => {
    handleCloseNavMenu();
    navigate(page);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h3"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'none', lg: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            scrimsight
          </Typography>

          <Box component="div" sx={{display: {xs: 'flex', lg: 'none'}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {xs: 'block', lg: 'none'},
              }}>
              <MenuItem>foo</MenuItem>
              {routes
                .filter((route) => route.name)
                .map((route) => (
                  <MenuItem
                    onClick={() => handleClickForPage(route.path[0])}
                    key={route.path[0]}>
                    <Typography textAlign="center">{route.name}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>

          <Typography
            variant="h3"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: {xs: 'flex', lg: 'none'},
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              marginLeft: '50px',
            }}>
            scrimsight
          </Typography>
          <Box
            component="div"
            sx={{flexGrow: 1, display: {xs: 'none', lg: 'flex'}}}>
            <Box component="div" sx={{display: 'flex', marginLeft: '100px'}}>
              {routes
                .filter((route) => route.name)
                .map((route) => (
                  <Button
                    key={route.path[0]}
                    onClick={() => handleClickForPage(route.path[0])}
                    sx={{my: 2, color: 'white', display: 'block'}}>
                    {route.name}
                  </Button>
                ))}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
