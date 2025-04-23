'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/userAuth';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const theme = useTheme();

  // Mobile menu state
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  const isUserMenuOpen = Boolean(userMenuAnchor);

  const handleAuthNavigation = (mode: 'login' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
    handleMobileMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
      // The user will be redirected to login page by the auth effect in AuthProvider
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
    handleMobileMenuClose();
    handleUserMenuClose();
  };

  // Mobile menu handlers
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  // User menu handlers
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Only show authentication UI once the initial loading is complete
  const showAuthUI = !isLoading;

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo/Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => navigateTo('/')}
          >
            MealMate
          </Typography>

          {/* Desktop Navigation - Hidden on xs and sm, visible on md and up */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, mr: 2 }}>
            <Button color="inherit" onClick={() => navigateTo('/recipes')}>
              Recipes
            </Button>
            <Button color="inherit" onClick={() => navigateTo('/grocery')}>
              Grocery Lists
            </Button>
            <Button color="inherit" onClick={() => navigateTo('/meal-plans')}>
              Meal Plans
            </Button>
          </Box>

          {/* Authentication Buttons - Desktop */}
          {showAuthUI && (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    onClick={handleUserMenuOpen}
                    color="inherit"
                    startIcon={<AccountCircleIcon />}
                  >
                    {user.name || user.email.split('@')[0]}
                  </Button>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={isUserMenuOpen}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem onClick={() => navigateTo('/profile')}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => navigateTo('/settings')}>
                      Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout} disabled={isLoading}>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    color="inherit"
                    onClick={() => handleAuthNavigation('login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAuthNavigation('signup')}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Mobile Menu Button - Visible on xs and sm, hidden on md and up */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={() => navigateTo('/recipes')}>Recipes</MenuItem>
        <MenuItem onClick={() => navigateTo('/grocery')}>
          Grocery Lists
        </MenuItem>
        <MenuItem onClick={() => navigateTo('/meal-plans')}>
          Meal Plans
        </MenuItem>
        <MenuItem divider />

        {showAuthUI && user ? (
          <>
            <MenuItem onClick={() => navigateTo('/profile')}>Profile</MenuItem>
            <MenuItem onClick={() => navigateTo('/settings')}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} disabled={isLoading}>
              Logout
            </MenuItem>
          </>
        ) : (
          showAuthUI && (
            <>
              <MenuItem onClick={() => handleAuthNavigation('login')}>
                Login
              </MenuItem>
              <MenuItem onClick={() => handleAuthNavigation('signup')}>
                Sign Up
              </MenuItem>
            </>
          )
        )}
      </Menu>
    </AppBar>
  );
}
