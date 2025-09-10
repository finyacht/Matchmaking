import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Favorite as MatchesIcon,
  Message as MessageIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/dashboard"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
          }}
        >
          Matchmaking
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button
            component={RouterLink}
            to="/dashboard"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/feed"
            startIcon={<SearchIcon />}
          >
            Feed
          </Button>
          <Button
            component={RouterLink}
            to="/matches"
            startIcon={<MatchesIcon />}
          >
            Matches
          </Button>
          <Button
            component={RouterLink}
            to="/messages"
            startIcon={<MessageIcon />}
          >
            Messages
          </Button>
          <Button
            component={RouterLink}
            to="/profile"
            startIcon={<PersonIcon />}
          >
            Profile
          </Button>
          <Button
            onClick={handleLogout}
            color="inherit"
          >
            Logout
          </Button>
        </Box>

        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              component={RouterLink}
              to="/dashboard"
              onClick={handleClose}
            >
              Dashboard
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/feed"
              onClick={handleClose}
            >
              Feed
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/matches"
              onClick={handleClose}
            >
              Matches
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/messages"
              onClick={handleClose}
            >
              Messages
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/profile"
              onClick={handleClose}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={() => {
              handleClose();
              handleLogout();
            }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
