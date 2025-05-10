'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/userAuth';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MobileNavbar from './MobileNavbar';
import CartButton from './CartButton';

// Navbar for the app

// Navbar links for the app
const NAV_LINKS = [
  { label: 'Recipes', path: '/recipes' },
  { label: 'Grocery List', path: '/grocery' },
  { label: 'Store', path: '/store' },
];

// User menu items for the app
const USER_MENU_ITEMS = [{ label: 'Profile', path: '/profile' }];

// Navbar component
export default function Navbar() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  // User menu anchor for the app
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // Routing for the NAV_LINKS
  const navigateTo = (path: string) => {
    router.push(path);
    closeAllMenus();
  };

  // Handle the auth navigation for the app
  const handleAuthNavigation = (mode: 'login' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
    closeAllMenus();
  };

  // Handle the logout for the app
  const handleLogout = async () => {
    try {
      await logout();
      closeAllMenus();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Close all menus for the app
  const closeAllMenus = () => {
    setUserMenuAnchor(null);
  };

  // Render the navbar for the app
  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo/Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              flexBasis: '200px',
            }}
            onClick={() => navigateTo('/')}
          >
            MealMate
          </Typography>

          {/* Desktop Navigation - Only shown when logged in */}
          {user && (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 3,
                justifyContent: 'center',
                flexGrow: 1,
              }}
            >
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.path}
                  color="inherit"
                  onClick={() => navigateTo(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Desktop Authentication  */}
          <Box
            sx={{
              flexBasis: '200px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {/* Cart Button */}
            {isLoading ? (
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                }}
              >
                <CircularProgress size={24} color="inherit" sx={{ mx: 2 }} />
              </Box>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {user ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CartButton />
                    <Button
                      onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                      color="inherit"
                      startIcon={<AccountCircleIcon />}
                    >
                      {user.name || user.email.split('@')[0]}
                    </Button>
                    <UserMenu
                      anchorEl={userMenuAnchor}
                      isOpen={Boolean(userMenuAnchor)}
                      onClose={() => setUserMenuAnchor(null)}
                      onNavigate={navigateTo}
                      onLogout={handleLogout}
                      isLoading={isLoading}
                    />
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

            {/* Mobile Menu */}
            <MobileNavbar
              user={user}
              isLoading={isLoading}
              navLinks={NAV_LINKS}
              userMenuItems={USER_MENU_ITEMS}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              onAuthNavigation={handleAuthNavigation}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isLoading: boolean;
}

function UserMenu({
  anchorEl,
  isOpen,
  onClose,
  onNavigate,
  onLogout,
  isLoading,
}: UserMenuProps) {
  return (
    <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
      {USER_MENU_ITEMS.map((item) => (
        <MenuItem key={item.path} onClick={() => onNavigate(item.path)}>
          {item.label}
        </MenuItem>
      ))}
      <MenuItem onClick={onLogout} disabled={isLoading}>
        Logout
      </MenuItem>
    </Menu>
  );
}
