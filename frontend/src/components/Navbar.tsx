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
  Divider,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/userAuth';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Navigation links for both desktop and mobile menus
const NAV_LINKS = [
  { label: 'Recipes', path: '/recipes' },
  { label: 'Grocery List', path: '/grocery' },
  { label: 'Store', path: '/store' },
];

// User menu items
const USER_MENU_ITEMS = [{ label: 'Profile', path: '/profile' }];

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const theme = useTheme();

  // Menu state
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // Helper functions
  const navigateTo = (path: string) => {
    router.push(path);
    closeAllMenus();
  };

  const handleAuthNavigation = (mode: 'login' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
    closeAllMenus();
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeAllMenus();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Menu controls
  const closeAllMenus = () => {
    setMobileMenuAnchor(null);
    setUserMenuAnchor(null);
  };

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
          {/* Logo/Title - Left aligned */}
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

          {/* Desktop Navigation - Centered - Only shown when logged in */}
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

          {/* Desktop Authentication - Right aligned */}
          <Box
            sx={{
              flexBasis: '200px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
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

            {/* Mobile Menu Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={() => setMobileMenuAnchor(null)}
        sx={{ mt: 1 }}
      >
        {/* Navigation Links - Only shown when logged in */}
        {user && (
          <>
            {NAV_LINKS.map((link) => (
              <MenuItem key={link.path} onClick={() => navigateTo(link.path)}>
                {link.label}
              </MenuItem>
            ))}
            <Divider />
          </>
        )}

        {/* Authentication Items */}
        {isLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
          </MenuItem>
        ) : user ? (
          <>
            {USER_MENU_ITEMS.map((item) => (
              <MenuItem key={item.path} onClick={() => navigateTo(item.path)}>
                {item.label}
              </MenuItem>
            ))}
            <MenuItem onClick={handleLogout} disabled={isLoading}>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleAuthNavigation('login')}>
              Login
            </MenuItem>
            <MenuItem onClick={() => handleAuthNavigation('signup')}>
              Sign Up
            </MenuItem>
          </>
        )}
      </Menu>
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
